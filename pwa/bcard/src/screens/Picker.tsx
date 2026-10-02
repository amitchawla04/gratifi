import React from 'react'
import { motion } from 'motion/react'
import { CARDS } from '../data'
import { useStore } from '../store'
import { CardArt, Ic, useFaceId } from '../ui'

export function Picker() {
  const { d } = useStore()
  const [face, run] = useFaceId()
  const groups = ['Travel', 'Cashback', 'Low rate', 'Business'] as const
  return <div className="screen">
    <div className="scroll">
      <div className="pad" style={{ gap: 20 }}>
        <div className="brand" style={{ minHeight: 48 }}><b>Barclaycard</b><span className="concept">CONCEPT</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h1 className="h1">Choose your card</h1>
          <p className="sub">Each card opens its own app: that member’s account, benefits and rewards, with Gratifi built in.</p>
        </div>
        {groups.map((g, gi) => <div key={g} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p className="label">{g === 'Business' ? 'Business cards' : g}</p>
          {CARDS.filter(c => c.group === g).map((c, i) => <motion.button key={c.id} className="pick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * (gi * 2 + i) }}
            onClick={() => run(`Open ${c.short}`, () => d({ type: 'selectCard', id: c.id }))}>
            <CardArt c={c} width={92} last4={c.last4} small />
            <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 16, fontWeight: 700 }}>{c.name}</p><p className="small">{c.pitch}</p></div>
            <Ic n="chev" s={16} c="#8A94A3" />
          </motion.button>)}
        </div>)}
        <p className="tiny" style={{ textAlign: 'center', padding: '4px 8px 0' }}>A concept by Reward360 for Barclays. Not a Barclays product. Card terms from Barclaycard’s public pages, 28 Sep 2026. Member data is invented.</p>
      </div>
      <div className="space-sm" />
    </div>
    {face}
  </div>
}
