# Polaroid

A photo on white card at a slight tilt, with a handwritten caption.

## When to use

For places, stays and rewards: things with a picture worth keeping.

## What you provide

```ts
Gratifi.Polaroid(props: { src: string; caption?: string; tilt?: number /* -3 */; width?: number; clip?: boolean })
```

## Rules

- Captions are two to four words in `hand`.
- No more than two polaroids on a screen.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Polaroid } = window.Gratifi

<Polaroid src={ART.lisbon} caption="Lisbon, Oct" />
<Polaroid src={ART.pool} caption="Casa do Rio" tilt={3} clip />
```

`Gratifi.demos.Polaroid()` renders every state on this card.
