# Toggle

An on/off switch; on is orange.

## When to use

Settings that apply at once. Always with a visible label.

## What you provide

```ts
Gratifi.Toggle(props: { on?: boolean; label: string; onChange?: (v: boolean) => void })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Toggle } = window.Gratifi

<div className="gr-row"><Toggle label="Price alerts" on />
<span>Price alerts</span></div><div className="gr-row"><Toggle label="Use points first" />
<span>Use points first</span></div>
```

`Gratifi.demos.Toggle()` renders every state on this card.
