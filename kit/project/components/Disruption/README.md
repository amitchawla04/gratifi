# Disruption

A cancelled or badly delayed flight: what happened, the options already worked out, what the customer may be owed.

## When to use

The moment a flight is disrupted.

## What you provide

```ts
Gratifi.Disruption(props: { title?; body?; options?: {id, t, s, tag?}[]; owed?: string })
```

## Rules

- Lead with the fix, not the apology.
- Compensation says "may be owed" and names the rule.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Disruption } = window.Gratifi

<Disruption owed="You may be owed up to £350 each under UK rules. I’ll start the claim once you’re rebooked." />
```

`Gratifi.demos.Disruption()` renders every state on this card.
