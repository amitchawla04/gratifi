# Suggestions

Next questions as chips the customer can tap instead of typing.

## When to use

After an answer, three or four.

## What you provide

```ts
Gratifi.Suggestions(props: { items: string[]; onPick?: (s: string) => void })
```

## Rules

- Short, in the customer's words: "Only direct", "Cheaper dates?".

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Suggestions } = window.Gratifi

<div style={{ width: 360 }}><Suggestions items={['Only direct', 'Cheaper dates?', 'Add a hotel', 'Use points']} />
</div>
```

`Gratifi.demos.Suggestions()` renders every state on this card.
