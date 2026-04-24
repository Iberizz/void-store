'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'

interface Detail { label: string; value: string }

interface Props {
  specs:           string[]
  details:         Detail[]
  onSpecsChange:   (s: string[]) => void
  onDetailsChange: (d: Detail[]) => void
}

const inputClass = "w-full bg-transparent border-0 border-b border-void-border text-void-white font-sans text-sm pb-2 outline-none focus:border-void-green transition-colors duration-300"
const labelClass = "block font-sans text-xs text-void-muted tracking-[0.15em] uppercase mb-2"

export default function SpecsEditor({ specs, details, onSpecsChange, onDetailsChange }: Props) {
  const [specInput, setSpecInput] = useState('')

  function addSpec() {
    const v = specInput.trim().toUpperCase()
    if (!v || specs.includes(v)) return
    onSpecsChange([...specs, v])
    setSpecInput('')
  }

  return (
    <div className="space-y-6">
      {/* Spec tags */}
      <div>
        <p className={labelClass}>Spec Tags</p>
        {specs.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {specs.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5 font-sans text-void-muted border border-void-border px-3 py-1"
                style={{ fontSize: '10px', letterSpacing: '0.15em' }}>
                {s}
                <button onClick={() => onSpecsChange(specs.filter((_, idx) => idx !== i))}
                  aria-label={`Remove ${s}`} className="text-void-muted hover:text-[#FF6B6B] transition-colors">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-end">
          <input
            className={`${inputClass} flex-1`}
            value={specInput}
            placeholder="40MM, BERYLLIUM, ANC −42dB…"
            onChange={e => setSpecInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSpec() } }}
          />
          <button onClick={addSpec} aria-label="Add spec tag"
            className="text-void-muted hover:text-void-green transition-colors pb-2">
            <Plus size={16} strokeWidth={1.5} />
          </button>
        </div>
        <p className="font-sans text-void-border text-[10px] mt-1">Entrée pour ajouter</p>
      </div>

      {/* Details rows */}
      <div>
        <p className={labelClass}>Specifications (accordion)</p>
        <div className="space-y-3">
          {details.map((d, i) => (
            <div key={i} className="flex gap-2 items-end">
              <input className={`${inputClass} flex-1`} placeholder="Label (ex: Drivers)" value={d.label}
                onChange={e => onDetailsChange(details.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} />
              <input className={`${inputClass} flex-1`} placeholder="Valeur (ex: 40mm Beryllium)" value={d.value}
                onChange={e => onDetailsChange(details.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))} />
              <button onClick={() => onDetailsChange(details.filter((_, idx) => idx !== i))}
                aria-label="Remove row" className="text-void-muted hover:text-[#FF6B6B] transition-colors pb-2 shrink-0">
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => onDetailsChange([...details, { label: '', value: '' }])}
          className="mt-3 flex items-center gap-1.5 font-sans text-void-muted text-xs tracking-[0.1em] hover:text-void-green transition-colors">
          <Plus size={12} strokeWidth={1.5} />
          Add specification
        </button>
      </div>
    </div>
  )
}
