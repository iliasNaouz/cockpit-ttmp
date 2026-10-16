import { Children, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SensorText } from '@/components/shared/SensorText'

/** Passe les chaînes de texte par SensorText (codes capteurs en mono). */
function withSensors(children: ReactNode): ReactNode {
  return Children.map(children, (child) => (typeof child === 'string' ? <SensorText text={child} /> : child))
}

const COMPONENTS: Components = {
  p: ({ children }) => <p className="text-sm leading-relaxed text-ink-body">{withSensors(children)}</p>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{withSensors(children)}</strong>,
  ul: ({ children }) => <ul className="list-disc space-y-1 pl-5 text-sm text-ink-body marker:text-ink-mute">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-body">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{withSensors(children)}</li>,
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-line bg-surface px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-sub">{children}</th>,
  td: ({ children }) => <td className="border-b border-line-soft px-3 py-1.5 text-ink-body">{withSensors(children)}</td>,
  code: ({ children }) => <code className="rounded-md bg-surface-muted px-1.5 py-0.5 font-mono text-[12.5px]">{children}</code>,
  pre: ({ children }) => <pre className="overflow-x-auto rounded-lg bg-surface-muted p-3 font-mono text-[12.5px]">{children}</pre>,
}

/** Rendu Markdown (GFM) d'une réponse de l'assistant. */
export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="space-y-3">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
