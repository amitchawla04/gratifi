# Steps

The quiet ticked lines that show what Gratifi checked to get an answer.

## When to use

Above every answer that used data. The last line spins while it is still working.

## What you provide

```ts
Gratifi.Steps(props: { steps: string[]; running?: boolean })
```

## Rules

- Two or three steps. Each says what was checked, with a number where there is one.
- No "thinking", no "analysing".

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Steps } = window.Gratifi

<Steps steps={['Checked 38 flights from London', 'Kept morning departures', 'Priced on your card with points']} />
<Steps steps={['Checked 38 flights from London', 'Pricing on your card']} running />
```

`Gratifi.demos.Steps()` renders every state on this card.
