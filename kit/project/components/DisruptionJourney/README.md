# DisruptionJourney

Disruption in four screens: delay heads-up, cancellation with options, rebooked, and price or seat changes mid-booking. Each market names its own compensation rule.

## When to use

The reference for exceptions.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { DisruptionJourney } = window.Gratifi

<MarketSwitch render={m => <DisruptionJourney market={m} />} />
```

`Gratifi.demos.DisruptionJourney()` renders every state on this card.
