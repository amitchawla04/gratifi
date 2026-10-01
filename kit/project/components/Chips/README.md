# Chips

A row of tappable filters or choices; selected chips turn into black pills.

## When to use

Filters (`multi`) and single choices with up to eight options. Counts sit in an orange dot.

## What you provide

```ts
Gratifi.Chips(props: { items: (string | {id, label, count?, icon?})[]; value?: string | string[]; multi?: boolean; wrap?: boolean; onChange?: (v) => void })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Chips } = window.Gratifi

<div style={{ width: 360 }}><Chips items={['Direct', 'Morning', 'Cabin bag', 'Under £200', 'Refundable']} value={['Direct', 'Morning']} multi />
</div>
<Chips items={[{ id: 'all', label: 'All', count: 38 }, { id: 'lhr', label: 'Heathrow', count: 21 }, { id: 'lgw', label: 'Gatwick', count: 17 }]} value="lhr" />
```

`Gratifi.demos.Chips()` renders every state on this card.
