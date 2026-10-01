# Badge

A small pill for one status or fact: Confirmed, 3 left, Best for you.

## When to use

On cards, next to the thing it describes.

## What you provide

```ts
Gratifi.Badge(props: { tone?: 'good' | 'warn' | 'danger' | 'accent' | 'ink'; icon?: string; children })
```

## Rules

- One badge per card. Two means neither matters.
- Status tones always carry a word.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Badge } = window.Gratifi

<Badge>Fri 16 Oct</Badge>
<Badge tone="good" icon="check">Confirmed</Badge>
<Badge tone="warn">3 left</Badge>
<Badge tone="danger">Cancelled</Badge>
<Badge tone="accent" icon="sparkle">Best for you</Badge>
<Badge tone="ink">Member price</Badge>
```

`Gratifi.demos.Badge()` renders every state on this card.
