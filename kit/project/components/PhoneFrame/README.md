# PhoneFrame

An iPhone-sized frame: header, scrolling body, and the ask bar floating at the bottom.

## When to use

To show a component or journey in context.

## What you provide

```ts
Gratifi.PhoneFrame(props: { title?; back?: boolean; right?; children; foot?; nav?: boolean; sheet?; time?; width? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { PhoneFrame } = window.Gratifi

<PhoneFrame title="Gratifi"><YouSaid>What does my card give me at airports?</YouSaid>
<Typing />
</PhoneFrame>
```

`Gratifi.demos.PhoneFrame()` renders every state on this card.
