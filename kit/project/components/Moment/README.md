# Moment

The assistant's proactive moment on home: a StickyNote with one action.

## When to use

When Gratifi notices something worth doing now.

## What you provide

```ts
Gratifi.Moment(props: { same as StickyNote })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Moment } = window.Gratifi

<Moment title="Your lounge passes renew in 12 days" action="Use one on Friday" secondary="Not now">You have 2 left before they renew. Friday&apos;s flight is from T5.</Moment>
```

`Gratifi.demos.Moment()` renders every state on this card.
