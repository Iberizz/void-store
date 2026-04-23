'use client'

import { useState } from 'react'
import { Reply } from 'lucide-react'
import MessageStatusSelect from '@/components/admin/MessageStatusSelect'
import MessageReplyModal   from '@/components/admin/MessageReplyModal'

type Message = {
  id: string; name: string; email: string; topic: string
  message: string; status: string; processed_by: string | null; created_at: string
}

const STATUS_STYLES = {
  new:       { color: '#4DFFB4', bg: 'rgba(77,255,180,0.08)'  },
  read:      { color: '#E8E8E8', bg: 'rgba(232,232,232,0.06)' },
  processed: { color: '#666666', bg: 'rgba(102,102,102,0.08)' },
}

export default function MessagesClient({ messages }: { messages: Message[] }) {
  const [replying, setReplying] = useState<Message | null>(null)

  return (
    <>
      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_2fr_auto_1fr] gap-4 px-4 mb-2">
        {['Date', 'From', 'Topic', 'Message', '', 'Status'].map((h, i) => (
          <p key={i} className="font-sans text-void-muted text-xs tracking-[0.12em] uppercase">{h}</p>
        ))}
      </div>

      <div className="space-y-px">
        {messages.map((msg) => {
          const s    = STATUS_STYLES[msg.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.new
          const date = new Date(msg.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })

          return (
            <div
              key={msg.id}
              className="bg-void-surface hover:bg-void-card transition-colors duration-150 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_2fr_auto_1fr] gap-4 items-start px-4 py-4"
              style={{ opacity: msg.status === 'processed' ? 0.55 : 1 }}
            >
              {/* Date */}
              <div>
                <p className="font-sans text-void-white text-xs">{date}</p>
                <p className="font-mono text-void-muted text-[10px] mt-0.5">{msg.id.slice(0, 8)}…</p>
              </div>

              {/* From */}
              <div className="min-w-0">
                <p className="font-sans text-void-white text-xs truncate">{msg.name}</p>
                <a href={`mailto:${msg.email}`}
                  className="font-sans text-void-muted text-xs truncate hover:text-void-green transition-colors block">
                  {msg.email}
                </a>
              </div>

              {/* Topic */}
              <p className="font-sans text-void-muted text-xs">{msg.topic}</p>

              {/* Message */}
              <div>
                <p className="font-sans text-void-white text-xs leading-relaxed line-clamp-3">
                  {msg.message}
                </p>
                {msg.processed_by && (
                  <p className="font-sans text-void-muted text-[10px] mt-1">
                    Processed by {msg.processed_by}
                  </p>
                )}
              </div>

              {/* Reply button */}
              <button
                onClick={() => setReplying(msg)}
                className="flex items-center gap-1.5 font-sans text-xs text-void-muted hover:text-void-green transition-colors mt-0.5"
                title="Reply"
              >
                <Reply size={13} strokeWidth={1.5} />
                <span className="hidden lg:inline">Reply</span>
              </button>

              {/* Status */}
              <MessageStatusSelect messageId={msg.id} current={msg.status} />
            </div>
          )
        })}
      </div>

      {/* Reply modal */}
      {replying && (
        <MessageReplyModal msg={replying} onClose={() => setReplying(null)} />
      )}
    </>
  )
}
