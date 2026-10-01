# Icon

The kit's 72 line icons, drawn on a 24px grid at a 1.9 stroke with round caps.

## When to use

Use for every glyph in the kit. Pass a name from `ICONS`; an unknown name draws `info`.

## What you provide

```ts
Gratifi.Icon(props: { name: string; size?: number /* 20 */; stroke?: number /* 1.9 */; color?: string /* currentColor */; filled?: boolean; title?: string /* gives it role=img */ })
```

## Rules

- Icons take the text colour. Colour an icon only with a status token next to a word.
- Never use emoji as icons.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Icon } = window.Gratifi

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 52px)', gap: '12px 8px' }}>{(ICONS as string[]).map(n => <div key={n} title={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--card)', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={n} size={20} />
</div><span style={{ fontSize: 9, color: 'var(--ink-soft)', fontWeight: 600 }}>{n}</span></div>)}</div>
```

`Gratifi.demos.Icon()` renders every state on this card.
