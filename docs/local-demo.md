# Local workflow guide

The quickstart builds a dedicated React entry with Vite and serves it from the same loopback Express process as the API. It imports neither the legacy orchestration service nor its RabbitMQ client. Fixtures are generated in `demo-state.cjs`; historical sample files are not loaded or modified.

## API and state

| Route | Behavior |
| --- | --- |
| `GET /health` | Explicit synthetic, memory-only status; external actions disabled |
| `GET /care-gaps`, `GET /members` | Six fictional members and their current gap states |
| `GET /member/:id` | Current details and closure receipt |
| `GET /care-management-stats` | Counts computed from current state |
| `POST /member/:id/alert` | Records text/reminder outreach as simulated |
| `POST /member/:id/close-gap` | Requires matching measure, reason, and evidence; repeated closure returns the original receipt |
| `GET /demo/events` | Exports the synthetic event history |
| `POST /demo/reset` | Clears events and restores fixtures |

Action text is limited to 500 characters; JSON bodies to 16 KB; sessions to 100 events. At the limit, export and reset. The process binds to `127.0.0.1`, restricts Host names, and rejects cross-origin mutations. This is a local demo, not production access control or an immutable audit system. Do not expose it through a public tunnel.

Every outreach submission creates a new simulated event. A retry after a lost response may create another event; outreach is not deduplicated. Closure is idempotent and returns its first receipt.

## Troubleshooting

- **Port in use:** stop the earlier demo with Ctrl+C, or set another `PORT`. PowerShell example: `$env:PORT = '4178'` before `npm run demo`.
- **Root route returns 404:** run `npm run build:demo` first.
- **Request fails:** the UI displays an error instead of success. Check the process and use Retry loading.
- **Changes disappeared:** restart/reset clears in-memory state; export beforehand.
- **Historical screens:** `npm --prefix services/dashboard run build` builds the original scenario interface. It expects the legacy service and is separate from the lightweight demo. Its large bundle still produces a size warning.

Vite replaces the inconsistent Create React App lockfile. JSX files now use `.jsx` extensions; most renames preserve their content. Node's `crypto.randomUUID` replaces the unused external UUID requirement without changing UUID format. The Python services and their dependencies are outside the Node tests.

## Recording the demo

Run the supported quickstart and capture the actual UI using Playwright CLI at 1440 Ã— 1100. Save `01-queue.png`, `02-review.png`, `03-decision.png`, and `04-closed.png` under `output/playwright/`. Show the synthetic labels. Export the actual session to `.playwright-cli/synthetic-session.json`.

Run `python scripts/assemble_demo.py` with Pillow installed. It assembles real screenshots without mock UI elements and records source, frame, and download hashes in `docs/demo-recording.json`. Source hashes normalize CRLF to LF so they match Git blobs across platforms; image and download hashes use their exact bytes. A separate 390-pixel browser check verifies no page overflow; the wide review table scrolls within its container.
