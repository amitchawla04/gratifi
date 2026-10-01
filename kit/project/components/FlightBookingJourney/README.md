# FlightBookingJourney

Flights end to end in seven screens: ask, dates, fare, seats and bags, pay, done, day of travel. Tabs switch between the six markets.

## When to use

The reference for every flight journey. Figures are illustrative.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { FlightBookingJourney } = window.Gratifi

<MarketSwitch render={m => <FlightBookingJourney market={m} />} />
```

`Gratifi.demos.FlightBookingJourney()` renders every state on this card.
