'use client';

import DetailPage, { cardToDetailProps, publicationToDetailProps } from '@/components/pages/DetailPage';
import { CardItem } from '@/types/page';
import { Publication } from '@/types/publication';
import { useLocaleStore } from '@/lib/stores/localeStore';

export type ItemDetailData =
    | { type: 'card'; item: CardItem; content?: string; backHref: string }
    | { type: 'publication'; publication: Publication; content?: string; backHref: string };

export default function ItemDetailClient({ dataByLocale, defaultLocale }: { dataByLocale: Record<string, ItemDetailData>; defaultLocale: string }) {
    const locale = useLocaleStore((state) => state.locale);
    const data = dataByLocale[locale] || dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];

    if (!data) return null;

    return data.type === 'card'
        ? <DetailPage {...cardToDetailProps(data.item, data.content, data.backHref)} />
        : <DetailPage {...publicationToDetailProps(data.publication, data.content, data.backHref)} />;
}
