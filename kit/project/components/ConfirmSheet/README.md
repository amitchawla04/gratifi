# ConfirmSheet

The confirm step for anything that spends money or points: summary, lines, Face ID, done.

## When to use

The last step before money moves. Nothing is paid until the customer confirms.

## What you provide

```ts
Gratifi.ConfirmSheet(props: { title?: string; summary?: string; lines?; total?; cta?: string; state?: 'ready' | 'scanning' | 'done'; onConfirm? })
```

## Rules

- The button says the amount.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { ConfirmSheet } = window.Gratifi

{[['UK', 'Face ID (UK)'], ['IN', 'One-time code (India)'], ['MY', 'Approve in the bank app (Malaysia)']].map(([m, cap]) => { const d = DEMO[m]; const tot = d.fares.std * 2, part = tot - d.mixPts * d.rate; return <MarketProvider key={m} market={m}><C t={cap}><div style={{ width: 380, height: 700, position: 'relative', borderRadius: 32, overflow: 'hidden', background: 'var(--screen)' }}><CS d={d} tot={tot} part={part} />
</div></MarketProvider> })}<div style={{ width: 380, height: 700, position: 'relative', borderRadius: 32, overflow: 'hidden', background: 'var(--screen)' }}><ConfirmSheet summary="Seats 15D, 15E · Lisbon, Fri 16 Oct" state="done" />
</div>
```

`Gratifi.demos.ConfirmSheet()` renders every state on this card.
