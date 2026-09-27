import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-base-content mb-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-base-content mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base-content mt-8 mb-3">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-base-content/80 mb-4 leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-1 text-base-content/80">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1 text-base-content/80">
        {children}
      </ol>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-primary hover:underline font-medium">
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-base-content/70">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-base-200 text-sm px-1.5 py-0.5 rounded font-mono">
        {children}
      </code>
    ),
    ...components,
  };
}
