# Relay — zero-downtime release console

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. **Deploy v2.4.0** demonstrates the full flow: canary traffic starts, guardrails breach, rollback becomes available, and traffic returns to v1.8.3.

## Prometheus endpoint

The app exposes a Prometheus-compatible endpoint at `GET /api/metrics`.

```yaml
scrape_configs:
  - job_name: relay-release-console
    metrics_path: /api/metrics
    static_configs:
      - targets: ['relay:3000']
```

The current route returns demo values. Replace its values with live counters or proxy it to your Prometheus query layer when the backend is connected. Keep the metric names stable for the rollback controller.

## Backend integration seam

The simulated actions live in `app/page.tsx`:

- `deploy()` → replace with `POST /api/deployments`
- `rollback()` → replace with `POST /api/deployments/:id/rollback`
- the `useEffect` timers → replace with polling or Server-Sent Events

Docker files can be added at the repository root. The container only needs to expose port `3000` and make `/api/metrics` reachable by Prometheus.
# ZeroDowntime
