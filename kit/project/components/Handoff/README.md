# Handoff

Handing over to a person: who, how long, and that they can see the conversation.

## When to use

When a rule, a complaint or a failed booking needs a human.

## What you provide

```ts
Gratifi.Handoff(props: { name?: string; role?: string; wait?: string; onCall?; onChat? })
```

## Rules

- Never make the customer repeat themselves.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Handoff } = window.Gratifi

<Handoff />
```

`Gratifi.demos.Handoff()` renders every state on this card.
