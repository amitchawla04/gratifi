# FilterBar

Sort first, then filter chips, on one scrolling line.

## When to use

Above result lists.

## What you provide

```ts
Gratifi.FilterBar(props: { sort?: string; filters: string[] })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { FilterBar } = window.Gratifi

<div style={{ width: 380, overflow: 'hidden' }}><FilterBar filters={['Direct', 'Morning', 'Cabin bag', 'Under £200', 'Heathrow']} />
</div>
```

`Gratifi.demos.FilterBar()` renders every state on this card.
