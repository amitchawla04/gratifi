# AirlineMark

The airline's two-letter mark on its colour.

## When to use

Anywhere an airline is named. The kit ships fictional airlines only.

## What you provide

```ts
Gratifi.AirlineMark(props: { code?: string; size?: number })
```

## Rules

- Real carriers' logos come from the content provider, never drawn.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { AirlineMark } = window.Gratifi

{Object.keys(AIRLINES).map(k => <div key={k} className="gr-row" style={{ gap: 8 }}><AirlineMark code={k} />
<span style={{ fontWeight: 600 }}>{AIRLINES[k].name}</span></div>)}
```

`Gratifi.demos.AirlineMark()` renders every state on this card.
