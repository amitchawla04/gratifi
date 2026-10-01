# Skeleton

A grey placeholder bar that shimmers while content loads.

## When to use

Shape it like the content that is coming.

## What you provide

```ts
Gratifi.Skeleton(props: { w?: string | number; h?: number; r?: number })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Skeleton } = window.Gratifi

<div className="gr-card" style={{ width: 320 }}><div className="gr-row"><Skeleton w={44} h={44} r={14} />
<div className="gr-grow gr-col"><Skeleton w="70%" />
<Skeleton w="40%" h={12} />
</div></div>
<Skeleton h={80} r={16} />
</div>
```

`Gratifi.demos.Skeleton()` renders every state on this card.
