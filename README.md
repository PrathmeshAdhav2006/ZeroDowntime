# ZeroDowntime — GitOps zero-downtime deployment demo

## Project overview

This repository demonstrates a zero-downtime deployment workflow using:

- **Argo CD** for GitOps application sync
- **Argo Rollouts** for blue/green deployment
- **AWS ALB Ingress** for production and preview routing
- **Prometheus** for metrics collection
- **Grafana** for dashboard visualization

The demo app is a Next.js release console that exposes a Prometheus-compatible metrics endpoint and simulates deployment/rollback behavior.

---

## Repository structure

- `app/` — Next.js application source
- `k8s/` — Kubernetes manifests for app, ingress, namespace, and monitoring
- `k8s/rollout.yaml` — Argo Rollouts blue/green deployment resource
- `k8s/application.yaml` — Argo CD application manifest
- `k8s/ingress.yaml` — ALB ingress routing to active and preview services
- `k8s/monitoring/` — Prometheus and Grafana manifests

---

## How it works

### GitOps with Argo CD

- `k8s/application.yaml` declares the Argo CD App.
- It tracks the repo path `k8s/` and deploys to namespace `zero-downtime`.
- `automated: true` means Git changes are automatically applied.
- `selfHeal: true` means Argo CD repairs drift automatically.

### Blue/Green deployment with Argo Rollouts

The rollout is configured in `k8s/rollout.yaml`:

- `activeService: zero-active` — production traffic service
- `previewService: zero-preview` — preview traffic service
- `autoPromotionEnabled: true` — automatically switch traffic to healthy new versions

When a change is pushed:

1. Argo CD syncs the new rollout manifest.
2. A new ReplicaSet is created for the next version.
3. New pods are started and tested.
4. If healthy, the rollout switches `zero-active` to the new version.
5. Old pods are scaled down.

### Traffic routing

- `/` is served by `zero-active`
- `/preview` is served by `zero-preview`
- The AWS ALB ingress routes requests to the correct service

### Monitoring

Prometheus scrapes the app metrics endpoint at:

- `http://zero-active.zero-downtime.svc.cluster.local:80/api/metrics`

Grafana is configured to read Prometheus at:

- `http://prometheus.monitoring.svc.cluster.local:9090`

This demo exposes metrics like:

- `release_error_rate_ratio`
- `release_latency_p95_milliseconds`
- `release_traffic_share_ratio`

---

## Local run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

---

## Deploy to Kubernetes

Apply the app manifests manually or through Argo CD:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/rollout.yaml
kubectl apply -f k8s/active-service.yaml
kubectl apply -f k8s/preview-service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/application.yaml
```

Then deploy monitoring:

```bash
kubectl apply -f k8s/monitoring/
```

---

## Grafana access

If the Grafana service does not get a LoadBalancer IP, use port-forwarding:

```bash
kubectl port-forward svc/grafana 3000:80 -n monitoring
```

Then open:

```text
http://localhost:3000
```

Login:

- Username: `admin`
- Password: `admin`

---

## Demo scenario: failure and rollback

1. Push a broken image or bad probe config to `k8s/rollout.yaml`.
2. Argo CD syncs the change.
3. Argo Rollouts creates a preview deployment.
4. The new version fails health checks.
5. Since `autoPromotionEnabled` is enabled, only healthy versions become active.
6. To demonstrate rollback manually:

```bash
kubectl argo rollouts undo zero-app -n zero-downtime
```

---

## Metrics endpoint

The app exposes metrics at:

```text
/api/metrics
```

A Prometheus scrape config example:

```yaml
scrape_configs:
  - job_name: zero-app
    metrics_path: /api/metrics
    static_configs:
      - targets:
          - zero-active.zero-downtime.svc.cluster.local:80
```

---

## Notes

- The current deployment uses blue/green rollout with automatic promotion.
- `zero-active` is production traffic.
- `zero-preview` is preview traffic.
- Grafana and Prometheus are installed in the `monitoring` namespace.
- The app container must expose port `3000` and `/api/metrics`.

---

## Contact

Use this repo as a demonstration of zero-downtime deployment, monitoring, and GitOps-driven releases.

