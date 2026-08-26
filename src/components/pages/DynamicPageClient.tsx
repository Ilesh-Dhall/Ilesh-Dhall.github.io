'use client';

import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import AwardsList from '@/components/pages/AwardsList';
import { Publication } from '@/types/publication';
import {
  PublicationPageConfig,
  TextPageConfig,
  CardPageConfig,
  AwardPageConfig,
} from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

export type DynamicPageLocaleData =
  | { type: 'publication'; config: PublicationPageConfig; publications: Publication[] }
  | { type: 'text'; config: TextPageConfig; content: string }
  | { type: 'card'; config: CardPageConfig }
  | { type: 'awards'; config: AwardPageConfig };

interface DynamicPageClientProps {
  dataByLocale: Record<string, DynamicPageLocaleData>;
  defaultLocale: string;
  pageSlug: string;
}

export default function DynamicPageClient({ dataByLocale, defaultLocale, pageSlug }: DynamicPageClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const pageData = dataByLocale[locale] || fallback;

  if (!pageData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {pageData.type === 'publication' && (
        <PublicationsList config={pageData.config} publications={pageData.publications} pageSlug={pageSlug} />
      )}
      {pageData.type === 'text' && (
        <TextPage config={pageData.config} content={pageData.content} />
      )}
      {pageData.type === 'card' && (
        <CardPage config={pageData.config} pageSlug={pageSlug} />
      )}
      {pageData.type === 'awards' && <AwardsList config={pageData.config} />}
    </div>
  );
}
