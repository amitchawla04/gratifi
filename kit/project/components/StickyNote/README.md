# StickyNote

Gratifi's note, clipped on: a handwritten line, one sentence of why, one yes and a not now.

## When to use

The assistant's proactive moment. It suggests; the member decides with a normal button.

## What you provide

```ts
Gratifi.StickyNote(props: { title: string; children?: ReactNode; tone?: 'yellow' | 'blue'; tilt?: number; action?: string; secondary?: string; onAction?; onSecondary?; from?: string; clip?: boolean; width?: number })
```

## Rules

- Yellow is Gratifi. Blue is the customer's own note.
- The why names a real number from the customer's account.
- One note per screen.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { StickyNote } = window.Gratifi

<StickyNote title="Book the hotel on this card too" action="Show hotels" secondary="Not now">It earns 3× points there, so your two nights come to about 1,500 points back.</StickyNote>
<StickyNote title="Sam likes the aisle" tone="blue" from="Your note" tilt={1.5} clip={false} width={260} />
```

`Gratifi.demos.StickyNote()` renders every state on this card.
