import Link from 'next/link';
import { BookOpen, FileText, Github, Globe2, Link as LinkIcon } from 'lucide-react';

interface ResourceBadgeProps {
  label: string;
  url: string;
  internal?: boolean;
}

function getResourceIcon(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes('github') || normalized.includes('code')) return Github;
  if (normalized.includes('demo') || normalized.includes('deploy') || normalized.includes('live')) return Globe2;
  if (normalized.includes('blog') || normalized.includes('read')) return BookOpen;
  if (normalized.includes('doi') || normalized.includes('paper') || normalized.includes('pdf') || normalized.includes('document')) return FileText;
  return LinkIcon;
}

const badgeClassName = 'inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:bg-accent hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';

export default function ResourceBadge({ label, url, internal = false }: ResourceBadgeProps) {
  const Icon = getResourceIcon(label);
  const content = <><Icon className="h-3.5 w-3.5" aria-hidden="true" />{label}</>;

  if (internal) {
    return <Link href={url} className={badgeClassName}>{content}</Link>;
  }

  return <a href={url} target="_blank" rel="noopener noreferrer" className={badgeClassName}>{content}</a>;
}
