# Sticker

A die-cut sticker for one short fact: "5% back", "Last room".

## When to use

On photos and cards, for the one fact that sells it.

## What you provide

```ts
Gratifi.Sticker(props: { tone?: 'accent' | 'ink' | 'paper'; tilt?: number; icon?: string; children })
```

## Rules

- Two words at most.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Sticker } = window.Gratifi

<Sticker>5% back</Sticker>
<Sticker tone="ink" tilt={4}>Last room</Sticker>
<Sticker tone="paper" icon="star" tilt={-3}>Members</Sticker>
```

`Gratifi.demos.Sticker()` renders every state on this card.
