# ExperienceCard

An experience or event with its time, length and price.

## When to use

Things to do, dining, tickets.

## What you provide

```ts
Gratifi.ExperienceCard(props: { src; name; when?; meta?: string[]; price; points?; rating? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { ExperienceCard } = window.Gratifi

<ExperienceCard src={ART.food} name="Tasca dinner in Alfama" when="Sat 19:30" meta={['3 hours', 'Small group']} price={48} points={6000} rating={4.9} />
<ExperienceCard src={ART.lisbon} name="Fado evening" when="Fri 21:00" meta={['90 min']} price={32} points={4000} />
```

`Gratifi.demos.ExperienceCard()` renders every state on this card.
