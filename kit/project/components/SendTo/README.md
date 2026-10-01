# SendTo

Pick people to share or gift to; orange rings mark who is chosen.

## When to use

Gifting, sharing a trip, splitting.

## What you provide

```ts
Gratifi.SendTo(props: { people: {name, initials?, color?}[]; selected?: string[] })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { SendTo } = window.Gratifi

<SendTo people={PEOPLE} selected={['Sam Rao', 'Jo Park']} />
```

`Gratifi.demos.SendTo()` renders every state on this card.
