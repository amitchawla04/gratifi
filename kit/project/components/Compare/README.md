# Compare

Two or three options side by side; the best fit gets the orange column.

## When to use

When the customer asks "which one?".

## What you provide

```ts
Gratifi.Compare(props: { columns: string[]; rows: {label, values: (ReactNode | boolean)[]}[]; best?: number })
```

## Rules

- At most five rows: only what differs.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Compare } = window.Gratifi

<Compare columns={['07:25 NW', '11:40 CL', '06:10 AU']} best={0} rows={[{ label: 'Lands', values: ['10:00', '14:20', '11:55'] }, { label: 'Direct', values: [true, true, false] }, { label: 'Cabin bag', values: [true, false, true] }, { label: 'Price', values: ['£186', '£142', '£128'] }]} />
```

`Gratifi.demos.Compare()` renders every state on this card.
