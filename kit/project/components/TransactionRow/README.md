# TransactionRow

A card transaction with merchant, facts, amount and points earned.

## When to use

Statement lists.

## What you provide

```ts
Gratifi.TransactionRow(props: { mono; color?; ink?; name; meta?: string[]; amount: number; points?: number; refund?: boolean })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { TransactionRow } = window.Gratifi

<div className="gr-card" style={{ width: 360, gap: 0 }}><TransactionRow mono="N" color="#1F3A5F" ink="#fff" name="Northway Air" meta={['Travel', 'Today']} amount={72} points={216} />
<div className="gr-hr" />
<TransactionRow mono="H" color="#2E5E4E" ink="#fff" name="Harbour & Co" meta={['Offer: 10% back']} amount={4.2} refund />
<div className="gr-hr" />
<TransactionRow mono="B" name="Bloom" meta={['Shopping', 'Mon']} amount={28.5} />
</div>
```

`Gratifi.demos.TransactionRow()` renders every state on this card.
