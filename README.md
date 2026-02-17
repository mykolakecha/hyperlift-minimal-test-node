# Hyperlift Minimal Test Node

A lightweight Express app with endpoints to generate CPU, memory, network, and disk load. Designed for testing Kubernetes resource metrics exported to Prometheus.

## Running

```bash
yarn install
node index.js
```

The app listens on port `9191` by default. Override with the `APPLICATION_PORT` environment variable.

## Endpoints

### `GET /cpu`

Burns CPU by running tight math loops.

| Param | Default | Max | Description |
|---|---|---|---|
| `duration` | 5 | 300 | Seconds to burn CPU |
| `threads` | 1 | 8 | Number of concurrent burn loops |

```bash
# Burn 2 threads for 10 seconds
curl "http://localhost:9191/cpu?duration=10&threads=2"
```

---

### `GET /memory`

Allocates a block of memory filled with random data and holds it for a given duration before releasing.

| Param | Default | Max | Description |
|---|---|---|---|
| `size` | 128 | 2048 | Megabytes to allocate |
| `duration` | 30 | 600 | Seconds to hold before releasing |

```bash
# Allocate 256 MB for 60 seconds
curl "http://localhost:9191/memory?size=256&duration=60"
```

---

### `GET /network/outbound`

Makes concurrent HTTP(S) GET requests to an external URL to generate outbound network traffic from the pod.

| Param | Default | Max | Description |
|---|---|---|---|
| `url` | `https://httpbin.org/bytes/102400` | — | Target URL to fetch |
| `requests` | 10 | 500 | Number of concurrent requests |

```bash
# Make 50 requests to a 100 KB endpoint
curl "http://localhost:9191/network/outbound?requests=50"
```

---

### `GET /network/inbound`

Streams random bytes back to the caller to generate inbound traffic (from the client's perspective) / outbound transmit traffic from the pod.

| Param | Default | Max | Description |
|---|---|---|---|
| `size` | 10 | 500 | Megabytes of data to stream |

```bash
# Download 50 MB of random data
curl "http://localhost:9191/network/inbound?size=50" -o /dev/null
```

---

### `GET /disk`

Writes random data to a temporary file, holds it for a given duration, then deletes it.

| Param | Default | Max | Description |
|---|---|---|---|
| `size` | 100 | 2048 | Megabytes to write |
| `duration` | 30 | 600 | Seconds to keep the file before cleanup |

```bash
# Write 200 MB, hold for 2 minutes
curl "http://localhost:9191/disk?size=200&duration=120"
```

---

### `GET /status`

Returns current process resource usage (memory, CPU, uptime). No parameters.

```bash
curl "http://localhost:9191/status"
```
