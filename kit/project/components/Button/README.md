# Button

The black pill and its family: primary, secondary, quiet, accent and ghost.

## When to use

One primary per view: the thing the customer came to do. Secondary for the other choice, ghost for "Not now".

## What you provide

```ts
Gratifi.Button(props: { variant?: 'primary' | 'secondary' | 'quiet' | 'accent' | 'ghost'; size?: 'sm' | 'lg'; block?: boolean; icon?: string; iconRight?: string; loading?: boolean; disabled?: boolean; onClick?: () => void; children })
```

## Rules

- Say what happens with the amount: "Pay £72 with Face ID", not "Continue".
- `accent` is rare: for using points, never for paying.
- Labels are verbs in sentence case.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Button } = window.Gratifi

<div className="gr-row" style={{ flexWrap: 'wrap' }}><Button>Book for £35</Button>
<Button variant="secondary">See details</Button>
<Button variant="quiet">Not now</Button>
<Button variant="accent" icon="sparkle">Use points</Button>
<Button variant="ghost">Skip</Button></div><div className="gr-row" style={{ flexWrap: 'wrap' }}><Button size="sm" icon="plus">Add</Button>
<Button size="lg" icon="faceid">Pay with Face ID</Button>
<Button loading>Booking</Button>
<Button disabled>Sold out</Button></div><div style={{ width: 340 }}><Button block size="lg" iconRight="arrow">Continue</Button></div>
```

`Gratifi.demos.Button()` renders every state on this card.
