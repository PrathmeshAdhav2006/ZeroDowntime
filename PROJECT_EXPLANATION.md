# ZeroDowntime Project Explanation

## What this project demonstrates

This project shows a complete GitOps-driven zero-downtime deployment workflow using Kubernetes, Argo CD, Argo Rollouts, Prometheus, and Grafana.

It is designed to show:
- automatic deployment from Git
- blue/green rollout promotion
- production vs preview traffic routing
- monitoring and metrics visualization
- rollback behavior when a new version fails

---

## Architecture overview

### Components

- **Argo CD**: keeps Kubernetes manifests in sync with Git.
- **Argo Rollouts**: performs blue/green deployment and promotion.
- **AWS ALB Ingress**: routes external traffic to production and preview services.
- **Prometheus**: scrapes application metrics.
- **Grafana**: visualizes application metrics.
- **Next.js app**: provides the demo web application and `/api/metrics` endpoint.

### Kubernetes resources

- `k8s/application.yaml` — Argo CD Application definition.
- `k8s/rollout.yaml` — Argo Rollouts configuration for `zero-app`.
- `k8s/active-service.yaml` — production service `zero-active`.
- `k8s/preview-service.yaml` — preview service `zero-preview`.
- `k8s/ingress.yaml` — ALB ingress rules for `/` and `/preview`.
- `k8s/monitoring/` — Prometheus and Grafana deployment and config.

---

## How the flow works

### Step 1: GitOps sync with Argo CD

- The repo is treated as the source of truth.
- `k8s/application.yaml` tells Argo CD to monitor the `k8s/` path.
- When a manifest changes in Git, Argo CD automatically applies it.
- `selfHeal: true` means Argo CD corrects drift automatically.

### Step 2: Blue/green rollout with Argo Rollouts

`k8s/rollout.yaml` is the key file.

It defines:
- `activeService: zero-active`
- `previewService: zero-preview`
- `autoPromotionEnabled: true`

When a new version is deployed:
1. Argo Rollouts creates a new ReplicaSet for the next version.
2. The new pods start and are controlled by `zero-preview`.
3. Readiness and liveness probes validate the new version.
4. If healthy, the rollout automatically switches the production service to the new version.
5. The old version is scaled down.

That is how blue/green rollout achieves zero downtime.

---

## Traffic routing logic

- `/` is routed by the ALB to `zero-active`.
- `/preview` is routed by the ALB to `zero-preview`.
- This allows you to compare the live production version with the preview version.

The ALB ingress is configured in `k8s/ingress.yaml`.

---

## Monitoring and observability

### Prometheus

- Installed in the `monitoring` namespace.
- Scrapes the app at `/api/metrics`.
- Configured to scrape:
  - `zero-active.zero-downtime.svc.cluster.local:80/api/metrics`

### Grafana

- Runs in the `monitoring` namespace.
- Uses Prometheus as the datasource.
- Can query metrics like:
  - `release_latency_p95_milliseconds`
  - `release_error_rate_ratio`
  - `release_traffic_share_ratio`

This lets judges see real-time deployment and release telemetry.

---

## What happens during a demo

### Normal deployment

1. A new version is pushed to Git.
2. Argo CD syncs the updated manifests.
3. Argo Rollouts deploys the new revision.
4. If the new revision passes health checks, it is automatically promoted.
5. Production traffic moves smoothly to the new version.

### Failure and rollback demonstration

To show rollback behavior:
1. Update `k8s/rollout.yaml` with a broken image or probe.
2. Push the change to Git.
3. Argo CD syncs the broken revision.
4. The new version fails checks and does not become active.
5. Use rollback:
   ```bash
   kubectl argo rollouts undo zero-app -n zero-downtime
   ```
6. The stable version returns to active traffic.

This proves that the system can recover from bad releases.

---

## Commands to show

### Check rollout status

```bash
kubectl argo rollouts get rollout zero-app -n zero-downtime
```

### Promote manually (if needed)

```bash
kubectl argo rollouts promote zero-app -n zero-downtime
```

### Roll back to previous stable version

```bash
kubectl argo rollouts undo zero-app -n zero-downtime
```

### View Grafana

```bash
kubectl port-forward svc/grafana 3000:80 -n monitoring
```

Then open:

```text
http://localhost:3000
```

---

## What to tell the judges

- This project uses **GitOps** to deploy infrastructure and app changes.
- It uses **Argo Rollouts** for blue/green delivery.
- It keeps production available while testing a new version.
- It verifies the new version with readiness/liveness checks.
- It uses **Prometheus + Grafana** for observability.
- It can automatically promote healthy releases and recover from failures.

---

## Summary

This demo proves a complete modern deployment workflow:
- Git-driven deployment
- zero-downtime release
- production vs preview traffic split
- automatic promotion
- monitoring and rollback

Use this file to explain the design, the flow, and the judge-ready values of the project.
