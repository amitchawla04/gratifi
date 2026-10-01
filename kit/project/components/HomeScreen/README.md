# HomeScreen

Home: greeting, the points dial and one moment from Gratifi.

## When to use

The reference home layout.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { HomeScreen } = window.Gratifi

<MarketSwitch render={m => <HomeScreen market={m} />} />
```

`Gratifi.demos.HomeScreen()` renders every state on this card.
