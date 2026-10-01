# NavBar

The floating tab bar; the current tab becomes a black pill with its label.

## When to use

App-level navigation, four or five tabs.

## What you provide

```ts
Gratifi.NavBar(props: { items?: {id, icon, label}[]; current?: string; onChange?: (id: string) => void })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { NavBar } = window.Gratifi

<div style={{ width: 360 }}><NavBar />
</div><div style={{ width: 360 }}><NavBar current="trips" />
</div>
```

`Gratifi.demos.NavBar()` renders every state on this card.
