'use client';

import React, { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';

import { generateSlug } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const mermaidSvgCache = new Map<string, string>();

function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '');
  const [svg, setSvg] = useState<string | null>(() => mermaidSvgCache.get(chart) ?? null);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'neutral',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      },
    });

    mermaid
      .render(`mermaid-${id}`, chart)
      .then(({ svg: renderedSvg }) => {
        if (!cancelled) {
          mermaidSvgCache.set(chart, renderedSvg);
          setSvg(renderedSvg);
          setRenderError(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Mermaid render failed:', error);
          setRenderError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (renderError) {
    return (
      <pre className="my-6 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-100 p-4 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
        {chart}
      </pre>
    );
  }

  if (!svg) {
    return <div className="my-6 min-h-24 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900" aria-busy="true" aria-label="Rendering diagram" />;
  }

  return <div className="my-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900" dangerouslySetInnerHTML={{ __html: svg }} />;
}

/**
 * This must remain a module-level component. Defining it inside
 * MarkdownRenderer gives React a new component type after every parent render,
 * which remounts MermaidDiagram and briefly exposes the source block.
 */
function MarkdownCode({ className, children, ...props }: React.ComponentProps<'code'> & { inline?: boolean }) {
  const { resolvedTheme } = useTheme();
  const codeText = String(children).replace(/\n$/, '');
  const isInline = props.inline === true || !className;

  if (className?.includes('language-mermaid')) {
    return <MermaidDiagram chart={codeText} />;
  }

  if (!isInline && className) {
    const match = /language-(\w+)/.exec(className);
    const language = match ? match[1] : 'text';

    return (
      <SyntaxHighlighter
        language={language}
        style={resolvedTheme === 'dark' ? oneDark : oneLight}
        customStyle={{
          margin: '1.5rem 0',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
          fontSize: '0.8rem',
          lineHeight: '1.6',
        }}
        wrapLongLines
        showLineNumbers={false}
      >
        {codeText}
      </SyntaxHighlighter>
    );
  }

  return <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.9em] text-primary dark:bg-neutral-800">{codeText}</code>;
}

// Keep every custom element type stable. ReactMarkdown nests code blocks inside
// <pre>; recreating either component type on a parent update would otherwise
// unmount a rendered Mermaid SVG and trigger another async render.
const markdownComponents = {
  h1: ({ children }: React.ComponentProps<'h1'>) => (
    <h1 id={generateSlug(String(children))} className="mt-10 first:mt-0 mb-4 text-3xl font-serif font-bold text-primary">
      {children}
    </h1>
  ),
  h2: ({ children }: React.ComponentProps<'h2'>) => (
    <h2 id={generateSlug(String(children))} className="mt-10 mb-4 border-b border-neutral-200 pb-2 text-2xl font-serif font-bold text-primary dark:border-neutral-800">
      {children}
    </h2>
  ),
  h3: ({ children }: React.ComponentProps<'h3'>) => (
    <h3 id={generateSlug(String(children))} className="mt-8 mb-3 text-xl font-semibold text-primary">
      {children}
    </h3>
  ),
  p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-5 last:mb-0 text-justify leading-relaxed">{children}</p>,
  ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="mb-5 list-disc space-y-2 pl-6">{children}</ul>,
  ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="mb-5 list-decimal space-y-2 pl-6">{children}</ol>,
  li: ({ children }: React.ComponentProps<'li'>) => <li className="leading-relaxed">{children}</li>,
  a: ({ ...props }: React.ComponentProps<'a'>) => (
    <a {...props} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline-offset-4 hover:underline" />
  ),
  blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
    <blockquote className="my-6 border-l-4 border-accent/60 pl-4 italic text-neutral-600 dark:text-neutral-400">{children}</blockquote>
  ),
  strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
  em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
  table: ({ children }: React.ComponentProps<'table'>) => (
    <div className="my-6 overflow-x-auto border border-neutral-200 dark:border-neutral-800">
      <table className="min-w-full border-collapse border-spacing-0 text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: React.ComponentProps<'thead'>) => <thead className="bg-neutral-100 text-primary dark:bg-neutral-800/80">{children}</thead>,
  th: ({ children }: React.ComponentProps<'th'>) => <th className="border border-neutral-200 px-3 py-2 font-semibold text-left align-top dark:border-neutral-700">{children}</th>,
  td: ({ children }: React.ComponentProps<'td'>) => <td className="border border-neutral-200 px-3 py-2 align-top dark:border-neutral-700">{children}</td>,
  hr: () => <hr className="my-8 border-neutral-200 dark:border-neutral-800" />,
  img: ({ src, alt, ...props }: React.ComponentProps<'img'>) => {
    const imageSrc = typeof src === 'string' ? src : src?.toString() ?? '';
    return <img src={imageSrc} alt={alt || ''} {...props} loading="lazy" className="my-6 w-full rounded-xl border border-neutral-200 object-cover shadow-sm dark:border-neutral-800" />;
  },
  code: MarkdownCode,
  pre: ({ children }: React.ComponentProps<'pre'>) => <>{children}</>,
} as const;

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
