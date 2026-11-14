"""Assemble actual browser screenshots into the README GIF; requires Pillow."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    names = ['01-queue.png', '02-review.png', '03-decision.png', '04-closed.png']
    paths = [ROOT / 'output/playwright' / name for name in names]
    frames = [Image.open(path).convert('RGB') for path in paths]
    if any(frame.size != (1440, 1100) for frame in frames):
        raise ValueError('Use matching 1440 x 1100 actual browser captures.')
    download = ROOT / '.playwright-cli/synthetic-session.json'
    result = json.loads(download.read_text(encoding='utf-8'))
    if not result['synthetic'] or [e['type'] for e in result['events']] != ['outreach_simulated', 'gap_closed']:
        raise ValueError('Expected the actual outreach and closure export.')
    target = ROOT / 'docs/workflow-demo.gif'
    durations = [2600, 3200, 3800, 3000]
    frames[0].save(target, save_all=True, append_images=frames[1:], duration=durations, loop=0, optimize=True, disposal=2)
    sources = ['services/care-orchestration/demo-server.cjs', 'services/care-orchestration/demo-state.cjs',
               'services/dashboard/src/demo.jsx', 'services/dashboard/src/components/CareManagementDashboard.jsx']
    metadata = {'recorded_utc': datetime.now(timezone.utc).isoformat(),
                'method': 'Actual local React/Express screenshots captured by Playwright CLI in isolated Microsoft Edge',
                'synthetic_only': True, 'viewport': [1440, 1100], 'durations_ms': durations,
                'frames': [{'file': str(p.relative_to(ROOT).as_posix()), 'sha256': digest(p)} for p in paths],
                'source_hash_format': 'UTF-8 bytes with CRLF normalized to LF, matching Git blobs',
                'source_sha256': {name: hashlib.sha256((ROOT / name).read_bytes().replace(b'\r\n', b'\n')).hexdigest() for name in sources},
                'export': {'event_types': [e['type'] for e in result['events']], 'sha256': digest(download)},
                'gif_sha256': digest(target)}
    (ROOT / 'docs/demo-recording.json').write_text(json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
    print(f'Recorded {target.name}: {target.stat().st_size} bytes, four actual browser frames.')


if __name__ == '__main__':
    main()
