const H = require('./h.js'), B = require('./buy.js');
(async () => {
  await H.run('cat', { m: 'UK' }, async (h) => { const { p, nav } = h; await nav(3);
    await h.ask('hi', 500);
    await B.buy(h, 'A table tonight for two', { tag: 'dine', pre: async () => { await p.locator('.gr-answer').last().locator('.gr-slot').nth(2).click(); } });
    await B.buy(h, 'Book a lounge', { tag: 'lounge' });
    await B.buy(h, 'Fast track security for 2', { tag: 'ft' });
    await B.buy(h, 'A ride now', { tag: 'ride' });
    await B.buy(h, 'Hire a car for 3 days', { tag: 'car' });
    await B.buy(h, 'Train to Edinburgh', { tag: 'rail' });
    await B.buy(h, 'Things to do in Lisbon', { tag: 'exp' });
    await B.buy(h, 'Concerts', { tag: 'tix' });
  });
})();
