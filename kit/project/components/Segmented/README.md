# Segmented

Two to four tabs in a pill track: Return / One way / Multi-city.

## When to use

Switching a mode for the same content.

## What you provide

```ts
Gratifi.Segmented(props: { items: string[]; value?: string; dark?: boolean; onChange?: (v: string) => void })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Segmented } = window.Gratifi

<Segmented items={['Return', 'One way', 'Multi-city']} />
<Segmented items={['Points', 'Cash']} dark />
```

`Gratifi.demos.Segmented()` renders every state on this card.
