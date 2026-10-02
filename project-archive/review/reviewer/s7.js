const open = require('./h.js');
(async () => {
  const H = await open('UK', 'light', 'test.html', 's7'); const { p } = H;
  await H.nav(3);
  await H.ask('Skincare set'); await H.pickItem(0); await H.detailCta(); await H.pay();
  await p.locator('.app-sheet .gr-btn').last().click();
  await p.waitForTimeout(150); console.log('sheet at 150ms?', !!(await p.$('.app-sheet'))); await H.shot('t150');
  await p.waitForTimeout(900); await H.shot('t1000'); console.log('last at 1s:', (await H.last()).slice(0, 80));
  await p.waitForTimeout(1500); console.log('last at 2.5s:', (await H.last()).slice(0, 80));
  // Keep it leaves buttons
  await H.ask('cancel it'); await H.btn('Keep it'); console.log('KEEP:', await H.lastN(2));
  const yes = await p.getByRole('button', { name: 'Yes, cancel' }).count(); console.log('Yes cancel still visible after keep:', yes);
  // nonsense + follow-ups without context
  for (const t of ['asdfgh qwerty', 'only direct', 'cheaper dates?', 'cancel it', 'help me find a hotel in Lisbon', 'hey, book a table for 4 tomorrow at 8pm', 'Book a flight to Tokyo', 'what is my balance', 'how many points do I have', 'I want a refund on my groceries', 'my headphones arrived broken', 'pay my bill', 'increase my limit', 'show me card offers', 'change my seat', 'send £50 to my mum', 'book a train to Manchester tomorrow', 'dinner in Paris', 'transfer 5000 points to Northway', 'what can I do with 10000 points', 'show my bookings', 'lounge at Gatwick', 'is my card frozen?', 'I know what I want: a laptop']) {
    await H.ask(t, 500); console.log('>>', t, '=>', (await H.last()).split('\n').filter(Boolean).slice(0, 4).join(' | ').slice(0, 220));
  }
  await H.close();
})();
