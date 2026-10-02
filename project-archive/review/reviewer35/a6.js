const pc = (args, txt='Checkout is ready; confirm with the button.') => `async(t,o,run)=>{ await run('prepare_checkout',${JSON.stringify(args)}); return ${JSON.stringify(txt)} }`;
module.exports = [
  { say: '8 laptops', plan: pc({ id: 'SH-3', quantity: 8 }), dump: 1 },
  { click: 'Card' },
  { click: /^Pay / },
  { say: 'x', js: "document.querySelector('.app-sheet')?.innerText || 'no sheet'" },
  { say: 'x', js: "(()=>{const a=[...document.querySelectorAll('.gr-answer')].pop();return a.innerText.slice(-600)})()" },
];
