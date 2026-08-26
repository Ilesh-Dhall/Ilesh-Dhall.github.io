'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { CardItem } from '@/types/page';
import { generateSlug } from '@/lib/utils';
import type { Author } from '@/types/publication';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import ResourceBadge from '@/components/ui/ResourceBadge';

interface DetailPageProps {
    title: string;
    eyebrow?: string;
    description?: string;
    date?: string;
    author?: string;
    authors?: Author[];
    content?: string;
    showContents?: boolean;
    links?: Array<{ label: string; url: string }>;
    backHref: string;
}


function getHeadings(content: string) {
    return Array.from(content.matchAll(/^##\s+(.+)$/gm)).map((match) => ({
        title: match[1].trim(),
        id: generateSlug(match[1]),
    }));
}

export default function DetailPage({
    title,
    eyebrow,
    description,
    date,
    author,
    authors,
    content,
    showContents = false,
    links = [],
    backHref,
}: DetailPageProps) {
    const headings = useMemo(() => (content ? getHeadings(content) : []), [content]);
    const [activeHeading, setActiveHeading] = useState<string | null>(headings[0]?.id ?? null);
    const articleRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!showContents || headings.length === 0) {
            return;
        }

        const updateActiveHeading = () => {
            const scrollPosition = window.scrollY + 180;
            let currentHeadingId = headings[0].id;

            for (const heading of headings) {
                const element = document.getElementById(heading.id);
                if (!element) continue;

                if (element.offsetTop <= scrollPosition) {
                    currentHeadingId = heading.id;
                } else {
                    break;
                }
            }

            setActiveHeading(currentHeadingId);
        };

        updateActiveHeading();
        window.addEventListener('scroll', updateActiveHeading, { passive: true });
        window.addEventListener('resize', updateActiveHeading);

        return () => {
            window.removeEventListener('scroll', updateActiveHeading);
            window.removeEventListener('resize', updateActiveHeading);
        };
    }, [showContents, headings]);

    const authorLine = useMemo(() => {
        if (authors && authors.length > 0) {
            return authors.map((publicationAuthor, index) => (
                <span key={`${publicationAuthor.name}-${index}`}>
                    <span className="font-semibold text-primary dark:text-white">{publicationAuthor.name}</span>
                    {index < authors.length - 1 ? ', ' : ''}
                </span>
            ));
        }

        if (author?.trim()) {
            return <span className="font-semibold text-primary dark:text-white">{author}</span>;
        }

        return null;
    }, [authors, author]);

    return (
        <article ref={articleRef} className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <Link href={backHref} className="mb-12 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-accent">
                <ArrowLeftIcon className="h-4 w-4" />
                Back
            </Link>

            <header className="mx-auto max-w-4xl text-center">
                {eyebrow && (
                    <div className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
                        {eyebrow && <span>{eyebrow}</span>}
                    </div>
                )}
                <h1 className="text-3xl font-serif font-bold leading-tight text-primary sm:text-4xl">{title}</h1>
                {links.length > 0 && (
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                        {links.map((link) => <ResourceBadge key={`${link.label}-${link.url}`} label={link.label} url={link.url} />)}
                    </div>
                )}
                {description && <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>}
                {(authorLine || date) && (
                    <div className="mx-auto mt-6 text-center text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {authorLine && <span>{authorLine}</span>}
                        {authorLine && date && <span aria-hidden="true" className="text-neutral-400"> · </span>}
                        {date && <time className="text-neutral-500">{date}</time>}
                    </div>
                )}
            </header>

            <div className={`mx-auto mt-16 grid max-w-5xl gap-12 ${showContents && headings.length ? 'lg:grid-cols-[180px_minmax(0,1fr)]' : ''}`}>
                {showContents && headings.length > 0 && (
                    <aside className="lg:sticky lg:top-28 lg:self-start">
                        <p className="mb-5 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">Contents</p>
                        <nav className="space-y-3 text-sm">
                            {headings.map((heading) => (
                                <a
                                    key={heading.id}
                                    href={`#${heading.id}`}
                                    className={`block transition-colors ${activeHeading === heading.id ? 'font-medium text-accent' : 'text-neutral-500 hover:text-accent'}`}
                                >
                                    {heading.title}
                                </a>
                            ))}
                        </nav>
                    </aside>
                )}
                <div className="min-w-0 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {content ? <MarkdownRenderer content={content} /> : <p className="text-neutral-500">No additional details are available yet.</p>}
                </div>
            </div>
        </article>
    );
}

export function cardToDetailProps(item: CardItem, content?: string, backHref = '/') {
    return {
        title: item.title,
        eyebrow: item.subtitle,
        author: item.author,
        description: item.content,
        date: item.date,
        content: content || item.details || item.content,
        showContents: item.show_contents,
        links: item.links || (item.link ? [{ label: 'View project', url: item.link }] : []),
        backHref,
    } satisfies DetailPageProps;
}

export function publicationToDetailProps(publication: Publication, detailContent?: string, backHref = '/publications') {
    return {
        title: publication.title,
        eyebrow: publication.journal || publication.conference || publication.type,
        description: publication.description,
        authors: publication.authors,
        date: publication.year ? String(publication.year) : undefined,
        content: detailContent || publication.details || publication.abstract,
        showContents: publication.showContents,
        links: [
            ...(publication.doi ? [{ label: 'DOI', url: `https://doi.org/${publication.doi}` }] : []),
            ...(publication.url ? [{ label: 'Paper', url: publication.url }] : []),
            ...(publication.code ? [{ label: 'Code', url: publication.code }] : []),
            ...(publication.pdfUrl ? [{ label: 'PDF', url: publication.pdfUrl }] : []),
        ],
        backHref,
    } satisfies DetailPageProps;
}
