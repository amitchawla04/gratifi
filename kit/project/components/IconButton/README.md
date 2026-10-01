# IconButton

A round 44px button with one icon: back, share, save, alerts.

## When to use

For header actions and compact controls. `label` is required and read aloud.

## What you provide

```ts
Gratifi.IconButton(props: { icon: string; label: string; dark?: boolean; flat?: boolean; small?: boolean; dot?: boolean; onClick?: () => void })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { IconButton } = window.Gratifi

<IconButton icon="back" label="Back" />
<IconButton icon="bell" label="Alerts" dot />
<IconButton icon="heart" label="Save" small />
<IconButton icon="share" label="Share" flat />
<IconButton icon="mic" label="Speak" dark />
```

`Gratifi.demos.IconButton()` renders every state on this card.
