'use client';

import { useLocaleStore } from '@/lib/stores/localeStore';

interface FooterProps {
  lastUpdated?: string;
  lastUpdatedByLocale?: Record<string, string | undefined>;
  defaultLocale?: string;
}

export default function Footer({ lastUpdated, lastUpdatedByLocale, defaultLocale }: FooterProps) {
  const locale = useLocaleStore((state) => state.locale);
  const updatedDate = lastUpdatedByLocale?.[locale] || lastUpdatedByLocale?.[defaultLocale || ''] || lastUpdated || 'August, 2026';

  return (
    <footer className="border-t border-neutral-200/50 bg-neutral-50/50 dark:bg-neutral-900/50 dark:border-neutral-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Ilesh Dhall
          </p>

          <p className="text-xs text-neutral-500">
            Research · Systems · Efficient AI
          </p>

          <p className="text-xs text-neutral-500">
            Updated: {updatedDate}
          </p>
        </div>
      </div>
    </footer>
  );
}
