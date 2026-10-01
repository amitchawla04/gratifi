# FlightCard

One flight option: times and airports, duration and stops, the facts that decide, and the price.

## When to use

Search results and recommendations.

## What you provide

```ts
Gratifi.FlightCard(props: { airline?; number?; dep; arr; from; to; dur; stops?; via?; plusDays?; price; points?; tags?: string[]; bag?; back?; left?; best?; selected?; onSelect? })
```

## Rules

- `best` only for the one Gratifi recommends, with the reason in the answer line.
- `left` only when the supplier says so.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { FlightCard } = window.Gratifi

<FlightCard airline="NW" number="NW 214" dep="07:25" arr="10:00" from="LHR" to="LIS" dur="2h 35m" price={186} points={18600} bag="Cabin bag" tags={['Seats together']} best="Best for you" back="5% back on your card" selected />
<FlightCard airline="CL" number="CL 902" dep="11:40" arr="14:20" from="LGW" to="LIS" dur="2h 40m" price={142} points={14200} left={3} bag="Small bag only" />
<FlightCard airline="AU" number="AU 336" bag="Cabin bag" dep="21:50" arr="06:15" plusDays={1} from="LHR" to="LIS" dur="8h 25m" stops={1} via="OPO" price={128} points={12800} />
```

`Gratifi.demos.FlightCard()` renders every state on this card.
