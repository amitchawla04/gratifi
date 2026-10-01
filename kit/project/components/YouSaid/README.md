# YouSaid

What the customer said, right-aligned in the black pill.

## When to use

Every customer turn, typed or spoken.

## What you provide

```ts
Gratifi.YouSaid(props: { children })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { YouSaid } = window.Gratifi

<div className="gr-thread" style={{ width: 360 }}><YouSaid>Lisbon for two, 16 to 18 October. Morning flight out.</YouSaid>
<YouSaid>Only direct</YouSaid></div>
```

`Gratifi.demos.YouSaid()` renders every state on this card.
