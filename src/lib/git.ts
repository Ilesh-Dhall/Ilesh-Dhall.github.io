import { execFileSync } from 'child_process';

// Date of the latest commit (e.g. "August 26, 2026"), in the committer's own time zone.
// Returns undefined when git or the repository history is unavailable.
export function getLastCommitDate(): string | undefined {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cd', '--date=format:%B %-d, %Y'], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return date || undefined;
  } catch {
    return undefined;
  }
}
