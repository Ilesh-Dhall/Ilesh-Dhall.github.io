import { notFound } from 'next/navigation';
import { getConfig } from '@/lib/config';
import { getBibtexContent, getMarkdownContent, getPageConfig } from '@/lib/content';
import { getRuntimeI18nConfig } from '@/lib/i18n/config';
import { parseBibTeX } from '@/lib/bibtexParser';
import { CardPageConfig, PublicationPageConfig } from '@/types/page';
import { generateSlug } from '@/lib/utils';
import ItemDetailClient, { ItemDetailData } from '@/components/pages/ItemDetailClient';

function getPageType(slug: string) {
    return getPageConfig(slug) as CardPageConfig | PublicationPageConfig | null;
}

function loadItem(slug: string, itemSlug: string, locale?: string): ItemDetailData | null {
    const config = getPageConfig(slug, locale) as CardPageConfig | PublicationPageConfig | null;
    if (!config) return null;

    if (config.type === 'card') {
        const item = config.items.find((candidate) => candidate.show_detail_page === true && generateSlug(candidate.slug || candidate.title) === itemSlug);
        if (!item) return null;
        return {
            type: 'card',
            item,
            content: item.details_source ? getMarkdownContent(item.details_source, locale) : undefined,
            backHref: `/${slug}`,
        };
    }

    if (config.type === 'publication') {
        const publication = parseBibTeX(getBibtexContent(config.source, locale), locale)
            .find((candidate) => candidate.id === itemSlug);
        if (!publication) return null;
        return {
            type: 'publication',
            publication,
            content: publication.detailsSource ? getMarkdownContent(publication.detailsSource, locale) : undefined,
            backHref: `/${slug}`,
        };
    }

    return null;
}

export function generateStaticParams() {
    const config = getConfig();
    return config.navigation
        .filter((item) => item.type === 'page')
        .flatMap((item) => {
            const pageConfig = getPageType(item.target);
            if (!pageConfig) return [];
            if (pageConfig.type === 'card') {
                return pageConfig.items
                    .filter((card) => card.show_detail_page === true)
                    .map((card) => ({ slug: item.target, item: generateSlug(card.slug || card.title) }));
            }
            if (pageConfig.type === 'publication') {
                return parseBibTeX(getBibtexContent(pageConfig.source)).map((publication) => ({ slug: item.target, item: publication.id }));
            }
            return [];
        });
}

export default async function ItemDetailPage({ params }: { params: Promise<{ slug: string; item: string }> }) {
    const { slug, item } = await params;
    const baseConfig = getConfig();
    const runtimeI18n = getRuntimeI18nConfig(baseConfig.i18n);
    const locales = runtimeI18n.enabled ? runtimeI18n.locales : [runtimeI18n.defaultLocale];
    const dataByLocale: Record<string, ItemDetailData> = {};

    for (const locale of locales) {
        const data = loadItem(slug, item, locale);
        if (data) dataByLocale[locale] = data;
    }

    const fallback = loadItem(slug, item);
    if (fallback) dataByLocale[runtimeI18n.defaultLocale] = dataByLocale[runtimeI18n.defaultLocale] || fallback;
    if (Object.keys(dataByLocale).length === 0) notFound();

    return <ItemDetailClient dataByLocale={dataByLocale} defaultLocale={runtimeI18n.defaultLocale} />;
}
