'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { X, Send } from 'lucide-react'
import { updateMessageStatus } from '@/app/actions/contact'

type Message = {
  id:      string
  name:    string
  email:   string
  topic:   string
  message: string
  status:  string
}

export default function MessageReplyModal({ msg, onClose, onReplied }: { msg: Message; onClose: () => void; onReplied?: () => void }) {
  const [reply,   setReply]   = useState('')
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const textaRef              = useRef<HTMLTextAreaElement>(null)
  const [, startTransition]   = useTransition()

  useEffect(() => {
    textaRef.current?.focus()
    // Lock scroll
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  async function handleSend() {
    if (!reply.trim()) return
    setSending(true)
    setError(null)

    const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_REPLY_TEMPLATE_ID
    const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setError(`Missing env vars — serviceId:${serviceId} templateId:${templateId} publicKey:${publicKey ? 'ok' : 'missing'}`)
      setSending(false)
      return
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_name:       msg.name,
          to_email:      msg.email,
          subject:       msg.topic,
          reply_message: reply,
        },
        publicKey,
      )

      // Mark as processed
      startTransition(async () => {
        await updateMessageStatus(msg.id, 'processed')
      })

      setSent(true)
      onReplied?.()
    } catch (e: unknown) {
      const msg = e instanceof Error
        ? e.message
        : (e as { text?: string })?.text ?? 'Failed to send. Please try again.'
      setError(msg)
      console.error('EmailJS error:', e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>

      <div className="bg-void-surface border border-void-border w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-void-border">
          <div>
            <p className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase mb-1">Replying to</p>
            <p className="font-sans text-void-white text-sm">{msg.name}</p>
            <p className="font-sans text-void-muted text-xs">{msg.email}</p>
          </div>
          <button onClick={onClose} className="text-void-muted hover:text-void-white transition-colors p-1">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Original message */}
        <div className="px-6 py-4 border-b border-void-border bg-void-card">
          <p className="font-sans text-void-muted text-xs tracking-[0.1em] uppercase mb-2">
            {msg.topic}
          </p>
          <p className="font-sans text-void-muted text-xs leading-relaxed line-clamp-3">
            {msg.message}
          </p>
        </div>

        {/* Reply area */}
        {sent ? (
          <div className="p-8 text-center">
            <p className="font-sans text-void-green text-sm mb-1">Reply sent ✓</p>
            <p className="font-sans text-void-muted text-xs mb-6">Message marked as processed.</p>
            <button onClick={onClose}
              className="font-sans text-xs tracking-[0.15em] uppercase text-void-white border border-void-border px-6 py-3 hover:border-void-green hover:text-void-green transition-colors">
              Close
            </button>
          </div>
        ) : (
          <div className="p-6">
            <textarea
              ref={textaRef}
              rows={6}
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Write your reply…"
              className="w-full bg-void-card border border-void-border text-void-white font-sans text-sm p-4 outline-none placeholder:text-void-muted resize-none focus:border-void-green transition-colors"
            />

            {error && <p className="font-sans text-red-400 text-xs mt-2">{error}</p>}

            <div className="flex items-center justify-between mt-4">
              <p className="font-sans text-void-muted text-xs">
                Will be sent to <span className="text-void-white">{msg.email}</span> · marked as Processed
              </p>
              <button
                onClick={handleSend}
                disabled={!reply.trim() || sending}
                className="flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-void-base bg-void-green hover:bg-void-white transition-colors px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={12} />
                {sending ? 'Sending…' : 'Send reply'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
