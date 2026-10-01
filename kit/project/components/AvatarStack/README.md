# AvatarStack

Overlapping initials for the people on a trip or gift.

## When to use

Up to three, then +N.

## What you provide

```ts
Gratifi.AvatarStack(props: { people: {name, src?}[]; max?: number })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { AvatarStack } = window.Gratifi

<AvatarStack people={PEOPLE.slice(0, 2)} />
<AvatarStack people={PEOPLE} />
```

`Gratifi.demos.AvatarStack()` renders every state on this card.
