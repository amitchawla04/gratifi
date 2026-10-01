# Toast

A short black confirmation at the bottom, with optional undo.

## When to use

Small changes that happened at once.

## What you provide

```ts
Gratifi.Toast(props: { undo?: string; onUndo?; children })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Toast } = window.Gratifi

<div style={{ width: 360 }}><Toast undo="Undo">Offer added to your card</Toast></div><div style={{ width: 360 }}><Toast>Price alert set for Lisbon</Toast></div>
```

`Gratifi.demos.Toast()` renders every state on this card.
