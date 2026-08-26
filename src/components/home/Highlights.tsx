'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { HighlightItem } from '@/types/page';

interface HighlightsProps {
    items: HighlightItem[];
    title?: string;
}

function getInitials(organization: string): string {
    const parts = organization.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

export default function Highlights({ items, title = 'Highlights' }: HighlightsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {items.map((item, index) => {
                    const orgContent = item.link ? (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary transition-colors hover:text-accent"
                        >
                            {item.organization}
                        </a>
                    ) : (
                        <span className="font-medium text-primary">{item.organization}</span>
                    );

                    return (
                        <div
                            key={`${item.organization}-${item.role}-${index}`}
                            className="grid grid-cols-1 gap-y-2 py-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_10rem] sm:gap-x-6 sm:items-center"
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                {item.icon ? (
                                    <Image
                                        src={item.icon}
                                        alt={`${item.organization} icon`}
                                        width={20}
                                        height={20}
                                        className="h-[20px] w-[20px] rounded-sm object-contain"
                                    />
                                ) : (
                                    <span className="inline-flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-sm bg-neutral-100 text-[10px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                                        {getInitials(item.organization)}
                                    </span>
                                )}
                                <span className="truncate">{orgContent}</span>
                            </div>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">{item.role}</p>
                            <span className="whitespace-nowrap text-xs text-neutral-500 sm:text-sm sm:text-right">{item.year || 'YYYY'}</span>
                        </div>
                    );
                })}
            </div>
        </motion.section>
    );
}
