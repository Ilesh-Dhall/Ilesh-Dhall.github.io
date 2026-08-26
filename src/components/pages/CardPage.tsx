'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CardPageConfig } from '@/types/page';
import { generateSlug } from '@/lib/utils';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import ResourceBadge from '@/components/ui/ResourceBadge';

export default function CardPage({ config, embedded = false, pageSlug }: { config: CardPageConfig; embedded?: boolean; pageSlug?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed`}>
                        <MarkdownRenderer content={config.description} />
                    </div>
                )}
            </div>

            <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                {config.items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                    >
                        {item.image && (
                            <div className="relative mb-5 aspect-[24/6.5] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary`}>
                                {pageSlug && item.show_detail_page === true ? <Link href={`/${pageSlug}/${generateSlug(item.slug || item.title)}`} className="hover:text-accent">{item.title}</Link> : item.title}
                            </h3>
                            {item.date && (
                                <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                    {item.date}
                                </span>
                            )}
                        </div>
                        {item.show_author === true && item.author && (
                            <p className={`${embedded ? "text-sm" : "text-base"} mb-2 text-neutral-600 dark:text-neutral-400`}>{item.author}</p>
                        )}
                        {item.subtitle && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
                        )}
                        {item.content && (
                            <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-400 leading-relaxed`}>
                                <MarkdownRenderer content={item.content} />
                            </div>
                        )}
                        {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags.map(tag => (
                                    <span key={tag} className="rounded border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-600 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        {(item.links || item.link) && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {(item.links || (item.link ? [{ label: 'View project', url: item.link }] : [])).map((link) => (
                                    <ResourceBadge key={`${link.label}-${link.url}`} label={link.label} url={link.url} />
                                ))}
                                {pageSlug && item.show_detail_page === true && (
                                    <ResourceBadge label="Blog" url={`/${pageSlug}/${generateSlug(item.slug || item.title)}`} internal />
                                )}
                            </div>
                        )}
                        {!(item.links || item.link) && pageSlug && item.show_detail_page === true && (
                            <div className="mt-4 flex flex-wrap gap-2"><ResourceBadge label="Blog" url={`/${pageSlug}/${generateSlug(item.slug || item.title)}`} internal /></div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
