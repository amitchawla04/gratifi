# FareFamilies

Fare families side by side; what is included is ticked, what isn't is greyed, never hidden.

## When to use

Choosing a fare.

## What you provide

```ts
Gratifi.FareFamilies(props: { fares: {id, name, price, points?, items: [boolean, string][], pop?}[]; value?: string; onChange? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { FareFamilies } = window.Gratifi

<div style={{ width: 380, overflow: 'hidden', padding: '12px 16px' }}><FareFamilies fares={[{ id: 'light', name: 'Light', price: 148, points: 14800, items: [[true, 'Small bag'], [false, 'Cabin bag'], [false, 'Seat choice'], [false, 'Changes']] }, { id: 'std', name: 'Standard', price: 186, points: 18600, pop: 'Most picked', items: [[true, 'Small bag'], [true, 'Cabin bag'], [true, 'Standard seats'], [true, 'Free date change']] }, { id: 'flex', name: 'Flex', price: 264, points: 26400, items: [[true, 'Cabin + 23kg bag'], [true, 'Any seat'], [true, 'Full refund'], [true, 'Fast track']] }]} />
</div>
```

`Gratifi.demos.FareFamilies()` renders every state on this card.
