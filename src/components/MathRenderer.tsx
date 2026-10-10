import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

/**
 * Safely renders LaTeX math expressions ($...$ or $$...$$) alongside normal text and markdown.
 * Also cleans up literal "\n" strings into proper linebreaks and catches un-delimited math expressions.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '', inline = false }) => {
  if (!content) return null;

  // 1. Clean up escaped newlines and extra backslashes
  let text = content
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n');

  // Auto-close single dangling $ delimiter (e.g. "$\tan^{-1}\left(\frac{1}{2}\right)" missing trailing $)
  const dollarMatches = text.match(/(?<!\\)\$/g);
  if (dollarMatches && dollarMatches.length % 2 !== 0) {
    text = text + '$';
  }

  // 2. Split content by:
  //    - Markdown images: ![alt](url)
  //    - LaTeX display math: $$...$$
  //    - LaTeX inline math: $...$
  const tokenRegex = /(!\[.*?\]\(.+?\))|(\$\$[\s\S]*?\$\$)|(\$[^\$]+?\$)/g;
  const parts = text.split(tokenRegex).filter(Boolean);

  const renderPart = (part: string, index: number) => {
    if (!part) return null;

    // Markdown Image (![alt](url))
    if (part.startsWith('![') && part.includes('](') && part.endsWith(')')) {
      const alt = part.slice(2, part.indexOf(']('));
      const src = part.slice(part.indexOf('](') + 2, -1).trim();
      return (
        <div key={index} className="my-3 overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 p-2 flex flex-col items-center">
          <img
            src={src}
            alt={alt || "Diagram"}
            className="max-h-72 max-w-full rounded-lg object-contain bg-white/5"
            loading="lazy"
          />
          {alt && alt !== 'Diagram' && alt !== 'image' && (
            <span className="mt-1.5 text-xs text-slate-400 font-medium">{alt}</span>
          )}
        </div>
      );
    }

    // Display Math ($$...$$)
    if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
      const math = part.slice(2, -2).trim();
      try {
        const html = katex.renderToString(math, {
          displayMode: true,
          throwOnError: false,
        });
        return (
          <span
            key={index}
            className="my-2 block overflow-x-auto py-1"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <code key={index} className="text-amber-300">{part}</code>;
      }
    }

    // Inline Math ($...$)
    if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
      const math = part.slice(1, -1).trim();
      try {
        const html = katex.renderToString(math, {
          displayMode: false,
          throwOnError: false,
        });
        return (
          <span
            key={index}
            className="inline-block px-0.5 align-baseline"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <code key={index} className="text-amber-300">{part}</code>;
      }
    }

    // Normal text part: check if there are dimensional formulas like [M...T...] or LaTeX commands
    // that were missed by dollar delimiters
    const lines = part.split('\n');
    return (
      <React.Fragment key={index}>
        {lines.map((line, lIdx) => {
          // Detect dimensional formulas [M...L...T...] or common LaTeX chunks that missed $ delimiters
          const latexRegex = /(\[M[^\]]*[LT][^\]]*\]|\\[a-zA-Z]+(?:\{[^{}]*\})*)/g;
          const subparts = line.split(latexRegex);

          return (
            <React.Fragment key={lIdx}>
              {lIdx > 0 && <br />}
              {subparts.map((sub, sIdx) => {
                if (!sub) return null;
                // Dimensional formulas [M...T...]
                if (sub.startsWith('[M') && sub.endsWith(']')) {
                  try {
                    const html = katex.renderToString(sub, { displayMode: false, throwOnError: false });
                    return <span key={sIdx} className="inline-block px-0.5 align-baseline" dangerouslySetInnerHTML={{ __html: html }} />;
                  } catch {
                    return <span key={sIdx}>{sub}</span>;
                  }
                }
                // Unescaped LaTeX macro like \frac{a}{b}, \times, \implies, etc.
                if (sub.startsWith('\\') && sub.length > 1) {
                  try {
                    const html = katex.renderToString(sub, { displayMode: false, throwOnError: false });
                    return <span key={sIdx} className="inline-block px-0.5 align-baseline" dangerouslySetInnerHTML={{ __html: html }} />;
                  } catch {
                    return <span key={sIdx}>{sub}</span>;
                  }
                }
                return <span key={sIdx}>{sub}</span>;
              })}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  };

  if (inline) {
    return <span className={className}>{parts.map(renderPart)}</span>;
  }

  return <div className={`leading-relaxed ${className}`}>{parts.map(renderPart)}</div>;
};

export default MathRenderer;
