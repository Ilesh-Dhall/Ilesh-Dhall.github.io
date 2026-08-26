'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  AcademicCapIcon,
  ArrowTopRightOnSquareIcon,
  BeakerIcon,
  DocumentTextIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { AwardPageConfig } from '@/types/page';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

const awardSymbols = {
  'academic-cap': AcademicCapIcon,
  document: DocumentTextIcon,
  microscope: BeakerIcon,
  trophy: TrophyIcon,
  users: UserGroupIcon,
} as const;

export default function AwardsList({ config }: { config: AwardPageConfig }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="mb-14">
        <h1 className="mb-4 text-4xl font-serif font-bold text-primary">{config.title}</h1>
        {config.description && <p className="max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">{config.description}</p>}
      </div>

      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {config.items.map((award, index) => {
          const Symbol = awardSymbols[award.symbol || 'trophy'];

          return (
            <motion.article
            key={`${award.title}-${award.date || index}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="grid grid-cols-1 gap-x-7 gap-y-4 py-4 sm:grid-cols-[90px_minmax(0,1fr)_auto] sm:items-start"
            >
              <div className="flex h-[85px] w-[85px] items-center justify-center rounded-2xl bg-accent/10 text-accent dark:bg-accent/15">
                <Symbol className="h-10 w-10 stroke-[1.5]" aria-hidden="true" />
              </div>
              <div className="min-w-0 pt-1">
                <h2 className="text-xl font-semibold tracking-tight text-primary">{award.title}</h2>
                {award.organizations && award.organizations.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-neutral-600 dark:text-neutral-300">
                    {award.organizations.map((organization, organizationIndex) => {
                      const organizationContent = (
                        <>
                          {organization.icon ? (
                            <Image src={organization.icon} alt={`${organization.name} logo`} width={20} height={20} className="h-5 w-5 rounded-sm object-contain" />
                          ) : (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-neutral-100 text-[10px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{getInitials(organization.name)}</span>
                          )}
                          <span>{organization.name}</span>
                        </>
                      );

                      return (
                      <div key={`${organization.name}-${organizationIndex}`} className="flex items-center gap-2">
                        {organizationIndex > 0 && <span className="text-neutral-400" aria-hidden="true">·</span>}
                        {organization.link ? (
                          <a href={organization.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-accent">
                            {organizationContent}
                          </a>
                        ) : (
                          <span className="flex items-center gap-2">{organizationContent}</span>
                        )}
                      </div>
                      );
                    })}
                  </div>
                )}
                {award.content && <div className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400"><MarkdownRenderer content={award.content} /></div>}
              </div>
              <div className="flex items-center gap-8 pt-3 sm:justify-end">
                {award.date && <time className="whitespace-nowrap text-base text-neutral-600 dark:text-neutral-300">{award.date}</time>}
                {award.link && (
                  <a href={award.link} target="_blank" rel="noopener noreferrer" aria-label={`Open link for ${award.title}`} className="text-primary transition-colors hover:text-accent">
                    <ArrowTopRightOnSquareIcon className="h-6 w-6 stroke-[1.75]" aria-hidden="true" />
                  </a>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}
