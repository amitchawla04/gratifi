# HotelJourney

Stays in four screens: choose from the conversation, room and cancellation, pay, done.

## When to use

The reference for stays.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { HotelJourney } = window.Gratifi

<MarketSwitch render={m => <HotelJourney market={m} />} />
```

`Gratifi.demos.HotelJourney()` renders every state on this card.
