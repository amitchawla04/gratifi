# BenefitRow

A card benefit as a row: what it is, the limit, what's left.

## When to use

The card's benefits list.

## What you provide

```ts
Gratifi.BenefitRow(props: { icon?; name; sub; value?; onClick? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { BenefitRow } = window.Gratifi

<div className="gr-card" style={{ width: 360, gap: 0, paddingTop: 4, paddingBottom: 4 }}><BenefitRow icon="sofa" name="Airport lounges" sub="2 visits a year" value="2 left" />
<BenefitRow icon="shield" name="Purchase protection" sub="Up to 120 days" />
<BenefitRow icon="globe" name="No fees abroad" sub="On purchases in other currencies" />
</div>
```

`Gratifi.demos.BenefitRow()` renders every state on this card.
