# PaymentDue

What is due and when, with Pay now or Direct Debit.

## When to use

Home and statement.

## What you provide

```ts
Gratifi.PaymentDue(props: { amount?; min?; date?; days?; autopay? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { PaymentDue } = window.Gratifi

<PaymentDue />
<MarketProvider market="IN"><PaymentDue amount={142680.5} min={7134} date={'12\u00a0Nov'} days={2} autopay />
</MarketProvider>
<MarketProvider market="SG"><PaymentDue amount={1284.4} min={50} date={'4\u00a0Nov'} />
</MarketProvider>
```

`Gratifi.demos.PaymentDue()` renders every state on this card.
