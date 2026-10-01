# CheckPop

The orange check that pops once when something is done.

## When to use

Booked, paid, sent, added.

## What you provide

```ts
Gratifi.CheckPop(props: { size?: number; animate?: boolean })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { CheckPop } = window.Gratifi

<CheckPop />
<CheckPop size={40} />
<CheckPop size={24} animate={false} />
```

`Gratifi.demos.CheckPop()` renders every state on this card.
