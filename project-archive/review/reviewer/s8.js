const open = require('./h.js');
const mk = process.argv[2] || 'UK';
(async () => {
  const H = await open(mk, 'light', 'test.html', 's8'); const { p } = H;
  await H.nav(2); const n = await p.locator('.gr-cattile').count(); const chips = [];
  for (let i = 0; i < n; i++) { await p.locator('.gr-cattile').nth(i).click(); await p.waitForTimeout(200); const c = await p.locator('.app-main .gr-suggest button, .app-main .gr-chip').allInnerTexts(); chips.push(...c.map(x => x.trim())); await p.locator('.app-main .gr-ibtn').first().click(); await p.waitForTimeout(100) }
  console.log('chips', chips.length);
  const home = ['Flights for the weekend', 'A table tonight', 'Groceries now', 'Gift for a friend', 'Show me card offers', 'Book a flight', 'Groceries now', "What's included with my card?", 'Start a streaming subscription', 'Money back on a purchase', 'Earn extra points shopping', 'Use my expiring points on a gift card', 'Grow my points', 'Find a special gift', 'Theatre on Friday', 'Hire a car', 'Nappies now', 'Vegetarian dinner in London', 'A food tour in London', 'Somewhere central in Barcelona', 'Cheapest flights to Barcelona', 'One way to Paris on Friday', 'Fast track security', 'Meet and greet on arrival', 'Airport transfer', 'Using my card abroad', 'What else can I do?', 'Track my order', 'Things to do there', 'Book a table', 'Airport ride', 'Add a hotel'];
  await H.nav(3);
  for (const t of [...new Set([...chips, ...home])]) { await H.ask(t, 450); const l = (await H.last()).split('\n').filter(Boolean); console.log('>>', t.padEnd(40), '=>', l.slice(0, 3).join(' | ').slice(0, 170)) }
  await H.close();
})();
