'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title }: AboutProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.about;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            <div className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                <MarkdownRenderer content={content} />
            </div>
        </motion.section>
    );
}
