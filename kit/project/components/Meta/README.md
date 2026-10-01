# Meta

A grey line of short facts separated by dots: "Direct · 2h 35m · Cabin bag".

## When to use

Under a title, for two to four facts that decide a choice.

## What you provide

```ts
Gratifi.Meta(props: { items: ReactNode[]; className?: string })
```

## Rules

- Keep each item to one to three words.
- The most decisive fact goes first.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Meta } = window.Gratifi

<Meta items={['Direct', '2h 35m', 'Cabin bag']} />
<Meta items={['Alfama', '4.7 ★', 'Free cancellation']} />
```

`Gratifi.demos.Meta()` renders every state on this card.
