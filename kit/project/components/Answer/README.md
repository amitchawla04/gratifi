# Answer

Every Gratifi reply: steps, one answer line, the card that proves it, up to three next steps.

## When to use

The shape of every assistant turn.

## What you provide

```ts
Gratifi.Answer(props: { steps?: string[]; say: ReactNode; children?; actions?: {label, primary?, icon?, onClick?}[]; source?: string })
```

## Rules

- The answer line comes first and bolds the one thing that matters.
- The card is the proof: a flight, a price, a rule.
- Cite the source for anything from terms or fees.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Answer } = window.Gratifi

<div style={{ width: 360 }}><Answer steps={['Read your card’s terms', 'Checked this month’s spend']} say={<>Yes. Your card covers <b>two lounge visits a year</b>, and you have both left.</>} actions={[{ label: 'Use one on Friday' }, { label: 'Which lounges?' }]} source="Card terms, section 4.2"><StickyNote title="Friday: T5, The Orchard" clip={false} tilt={-1} width={330} from="">Opens 05:00. Your flight is 07:25.</StickyNote></Answer></div>
```

`Gratifi.demos.Answer()` renders every state on this card.
