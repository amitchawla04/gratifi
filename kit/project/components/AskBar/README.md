# AskBar

The ask bar: type or tap the mic. Floats above the tab bar on every screen.

## When to use

Always present. It turns into a send button when there is text, and a live wave while listening.

## What you provide

```ts
Gratifi.AskBar(props: { placeholder?: string; value?: string; listening?: boolean; onSend?: (text: string) => void; onMic?: () => void })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { AskBar } = window.Gratifi

<div style={{ width: 360 }}><AskBar />
</div><div style={{ width: 360 }}><AskBar value="Lisbon for two in October" />
</div><div style={{ width: 360 }}><AskBar listening />
</div>
```

`Gratifi.demos.AskBar()` renders every state on this card.
