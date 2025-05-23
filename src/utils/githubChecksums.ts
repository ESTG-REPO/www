/**
 * Fetches the latest release notes from GitHub and parses the SHA-256 checksums.
 * Returns a mapping from filename to checksum.
 */
export async function getChecksums() {
  const res = await fetch('https://api.github.com/repos/zen-browser/desktop/releases/latest', {
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'zen-browser-checksum-fetcher',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch GitHub release: ' + res.statusText);
  const data = await res.json();
  const body = data.body as string;

  // Extract the checksum block
  const match = body.match(/File Checksums \(SHA-256\)[\s\S]*?```([\s\S]*?)```/);
  const checksums: Record<string, string> = {};
  if (match && match[1]) {
    match[1].split('\n').forEach(line => {
      const [hash, filename] = line.trim().split(/\s+/, 2);
      if (hash && filename) checksums[filename] = hash;
    });
  }
  return checksums;
} 