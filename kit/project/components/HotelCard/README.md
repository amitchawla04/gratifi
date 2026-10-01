# HotelCard

A stay: photo, name, area, rating, what's included, and the total price.

## When to use

Hotel results.

## What you provide

```ts
Gratifi.HotelCard(props: { src; name; area; rating?; reviews?; price; points?; nights?; perks?: string[]; sticker?; back? })
```

## Rules

- Price is the total for the stay, taxes in.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { HotelCard } = window.Gratifi

<HotelCard src={ART.pool} name="Casa do Rio" area="Alfama" price={248} points={24800} perks={['Pool', 'Breakfast']} back="3× points" sticker="Member price" />
<HotelCard src={ART.room} name="Hotel Miradouro" area="Chiado" rating={4.5} reviews={1204} price={296} points={29600} perks={['Rooftop pool']} />
```

`Gratifi.demos.HotelCard()` renders every state on this card.
