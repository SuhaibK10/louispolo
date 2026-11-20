'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/assistant/AssistantWidget.tsx
// Floating shopping assistant. Sits bottom-left (WhatsApp sits bottom-right),
// opens a chat panel, and streams answers from POST /api/assistant.
//
// Only internal /shop links and the WhatsApp link are ever made clickable, so
// the model cannot send customers to an arbitrary website.
// ─────────────────────────────────────────────────────────────────────────────

import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND } from '@/lib/constants'

type Message = {
  id:      number
  role:    'user' | 'assistant'
  content: string
  error?:  boolean
}

const MAX_CHARS = 800

const GREETING =
  "Hello, I'm LP's AI. Tell me about your trip, and I'll help you find the right bag."

const STARTERS = [
  'Help me pick a cabin trolley',
  'Backpack for a 15 inch laptop',
  'Compare two bags for me',
  'Warranty and returns',
]

// ── Avatar: line-art woman, ink + cream with a gold earring and necklace ──────
// Inline SVG so it needs no image file. To use a photo or your own artwork
// instead, replace this component's body with a next/image of the file.

function LadyAvatar({ className }: { className?: string }) {
  const clip = useId()
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <clipPath id={clip}><circle cx="24" cy="24" r="24" /></clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="48" height="48" fill="#EDE9E1" />
        <path d="M15.2 22C13.8 12.5 17.6 8 24 8s10.2 4.5 8.8 14c-.3 5 1 9 2.6 13H12.6c1.6-4 3-8 2.6-13Z" fill="#171717" />
        <path d="M7 48c1.2-9.5 8-14.5 17-14.5S39.8 38.5 41 48Z" fill="#171717" />
        <path d="M19 35.2c1.4 3.2 3.2 4.6 5 4.6s3.6-1.4 5-4.6" fill="none" stroke="#B99A62" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M21.2 28h5.6v6.2c0 1.6-1.3 2.9-2.8 2.9s-2.8-1.3-2.8-2.9Z" fill="#E4BE9C" />
        <ellipse cx="24" cy="21" rx="7.1" ry="8.3" fill="#EBC9A9" />
        <path d="M16.7 20.4c.1-5.6 3.5-8.7 7.4-8.7 4 0 7 2.8 7.2 8.2-2.9-1.5-5.6-3.3-7.1-5.6-1.6 2.9-4.6 5-7.5 6.1Z" fill="#171717" />
        <circle cx="16.9" cy="25.2" r="1.15" fill="#B99A62" />
        <path d="M21.2 22.1h.01M26.8 22.1h.01" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22.4 26.2c.9.7 2.3.7 3.2 0" fill="none" stroke="#A8574A" strokeWidth="1.1" strokeLinecap="round" />
      </g>
    </svg>
  )
}

// ── Tiny, safe formatter: **bold**, bullet lists, /internal links, wa.me ──────

const TOKEN = /(\[[^\]]+\]\(\/[^)\s]*\)|\*\*[^*]+\*\*|https:\/\/wa\.me\/\d+)/g

function inline(text: string, onNavigate: () => void): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\((\/[^)\s]*)\)$/)
    if (link) {
      return (
        <Link
          key={i}
          href={link[2]}
          onClick={onNavigate}
          className="font-medium underline underline-offset-2 decoration-[var(--color-lp-gold)] hover:decoration-2"
        >
          {link[1]}
        </Link>
      )
    }
    const bold = part.match(/^\*\*([^*]+)\*\*$/)
    if (bold) return <strong key={i} className="font-semibold">{bold[1]}</strong>
    if (/^https:\/\/wa\.me\/\d+$/.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-2 decoration-[var(--color-lp-gold)]"
        >
          Chat on WhatsApp
        </a>
      )
    }
    return part
  })
}

function RichText({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  return (
    <>
      {text.split(/\n{2,}/).map((block, i) => {
        const lines  = block.split('\n')
        const bullet = /^\s*[-*•]\s+/
        if (lines.every((l) => bullet.test(l))) {
          return (
            <ul key={i} className="list-disc pl-4 space-y-1">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(bullet, ''), onNavigate)}</li>)}
            </ul>
          )
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l, onNavigate)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </>
  )
}

// ── Widget ────────────────────────────────────────────────────────────────────

export function AssistantWidget() {
  const pathname = usePathname()
  const [open, setOpen]         = useState(false)
  const [busy, setBusy]         = useState(false)
  const [input, setInput]       = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const nextId   = useRef(1)
  const abortRef = useRef<AbortController | null>(null)
  const listRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Keep the newest text in view while an answer streams in.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, busy, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => () => abortRef.current?.abort(), [])

  if (pathname?.includes('/checkout')) return null

  // On phones the panel covers the page, so close it after following a link.
  const onNavigate = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) setOpen(false)
  }

  const patchLast = (fn: (m: Message) => Message) =>
    setMessages((prev) => prev.length ? [...prev.slice(0, -1), fn(prev[prev.length - 1])] : prev)

  async function send(raw: string) {
    const text = raw.trim().slice(0, MAX_CHARS)
    if (!text || busy) return

    const userMsg: Message = { id: nextId.current++, role: 'user', content: text }
    const history = [...messages, userMsg]
      .filter((m) => !m.error && m.content)
      .map(({ role, content }) => ({ role, content }))

    setMessages([...messages, userMsg, { id: nextId.current++, role: 'assistant', content: '' }])
    setInput('')
    setBusy(true)

    const controller = new AbortController()
    abortRef.current = controller
    const fallback = `Sorry, something went wrong. Please try again, or reach us on WhatsApp: ${BRAND.whatsapp}`

    try {
      const res = await fetch('/api/assistant', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: history }),
        signal:  controller.signal,
      })

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null) as { error?: string } | null
        patchLast((m) => ({ ...m, content: data?.error || fallback, error: true }))
        return
      }

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        let nl: number
        while ((nl = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, nl).trim()
          buffer = buffer.slice(nl + 1)
          if (!line) continue

          let event: { t: string; v?: string }
          try { event = JSON.parse(line) } catch { continue }

          if (event.t === 'text' && event.v) {
            const chunk = event.v
            patchLast((m) => ({ ...m, content: m.content + chunk }))
          } else if (event.t === 'error') {
            patchLast((m) => ({ ...m, content: event.v || fallback, error: true }))
          }
        }
      }
    } catch (e) {
      if ((e as { name?: string }).name === 'AbortError') return
      patchLast((m) => ({ ...m, content: fallback, error: true }))
    } finally {
      setBusy(false)
    }
  }

  const lastIsEmptyReply =
    busy && messages.length > 0 && messages[messages.length - 1].content === ''

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="assistant-launcher"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ask LP's AI"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-18 left-4 md:bottom-8 md:left-6 z-50 h-12 pl-1.5 pr-4 rounded-full bg-[var(--color-lp-ink)] text-white flex items-center gap-2.5 shadow-[var(--shadow-card-hover)]"
          >
            <LadyAvatar className="w-9 h-9 shrink-0" />
            <span className="font-body text-sm font-medium whitespace-nowrap">Ask LP&apos;s AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="assistant-panel"
            role="dialog"
            aria-label="LP's AI"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[60] left-3 right-3 bottom-18 h-[min(72dvh,34rem)] md:left-6 md:right-auto md:bottom-8 md:w-[24rem] md:h-[34rem] flex flex-col overflow-hidden rounded-[10px] border border-[var(--color-lp-border)] bg-[var(--color-lp-card)] shadow-[var(--shadow-card-hover)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--color-lp-border)]">
              <div className="flex items-center gap-3 min-w-0">
                <LadyAvatar className="w-10 h-10 shrink-0" />
                <div className="min-w-0">
                  <p className="font-display text-lg leading-tight text-[var(--color-lp-ink)]">LP&apos;s AI</p>
                  <p className="font-body text-[11px] leading-snug text-[var(--color-lp-faint)] mt-0.5">
                    AI assistant. Please don&apos;t share personal or payment details.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="shrink-0 w-8 h-8 -mr-1 flex items-center justify-center rounded-full text-[var(--color-lp-muted)] hover:bg-[var(--color-lp-cream)]"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 font-body text-sm leading-relaxed" aria-live="polite">
              <div className="max-w-[88%] rounded-[10px] bg-[var(--color-lp-cream)] px-3 py-2 text-[var(--color-lp-body)]">
                {GREETING}
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-[var(--color-lp-border)] px-3 py-1.5 text-xs text-[var(--color-lp-body)] hover:border-[var(--color-lp-ink)]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m) =>
                m.role === 'user' ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[88%] rounded-[10px] bg-[var(--color-lp-ink)] px-3 py-2 text-white whitespace-pre-wrap break-words">
                      {m.content}
                    </div>
                  </div>
                ) : m.content ? (
                  <div key={m.id} className="max-w-[88%] rounded-[10px] bg-[var(--color-lp-cream)] px-3 py-2 text-[var(--color-lp-body)] space-y-2 break-words">
                    <RichText text={m.content} onNavigate={onNavigate} />
                  </div>
                ) : null
              )}

              {lastIsEmptyReply && (
                <div className="inline-flex gap-1 rounded-[10px] bg-[var(--color-lp-cream)] px-3 py-3" aria-label="Assistant is typing">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-[var(--color-lp-faint)] animate-pulse"
                      style={{ animationDelay: `${d * 150}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input) }}
              className="flex items-end gap-2 border-t border-[var(--color-lp-border)] p-3"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
                }}
                rows={1}
                maxLength={MAX_CHARS}
                placeholder="Ask about bags, sizes or delivery"
                aria-label="Your message"
                className="flex-1 resize-none max-h-24 rounded-[10px] border border-[var(--color-lp-border)] bg-transparent px-3 py-2 font-body text-sm text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] focus:outline-none focus:border-[var(--color-lp-ink)]"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="shrink-0 h-10 w-10 rounded-full bg-[var(--color-lp-ink)] text-white flex items-center justify-center disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
