# PriceCalendar

A month with the fare under each day; the chosen range in orange; lowest fares in green.

## When to use

Picking dates for flights and stays.

## What you provide

```ts
Gratifi.PriceCalendar(props: { month?: string; startDow?: number; days?: number; prices?: Record<number, number>; low?: number[]; from?: number; to?: number; disabledBefore?: number; today?: number; onPick? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { PriceCalendar } = window.Gratifi

<div className="gr-card" style={{ width: 360 }}><PriceCalendar from={16} to={18} today={2} disabledBefore={3} prices={{ 3: 142, 4: 156, 5: 164, 6: 148, 7: 132, 8: 176, 9: 212, 10: 198, 11: 184, 12: 138, 13: 124, 14: 118, 15: 158, 16: 128, 17: 204, 18: 172, 19: 126, 20: 118, 21: 122, 22: 168, 23: 214, 24: 196, 25: 178, 26: 128, 27: 116, 28: 119, 29: 162, 30: 208, 31: 134 }} low={[14, 20, 27]} />
</div>
```

`Gratifi.demos.PriceCalendar()` renders every state on this card.
