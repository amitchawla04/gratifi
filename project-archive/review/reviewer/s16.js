const open = require('./h.js');
(async () => {
  const H = await open('UK', 'light', 'test.html', 's16'); const { p } = H;
  await H.nav(3); await H.ask('Book a lounge'); await H.pickItem(0); await H.detailCta(); await H.btn('Confirm', true);
  let S = await H.state(); console.log('left', S.loungeLeft);
  await H.ask('cancel it'); console.log('CANCEL LOUNGE:', (await H.last()).replace(/\n/g,' | '));
  await H.btn('Yes, cancel'); S = await H.state(); console.log('after cancel left', S.loungeLeft, (await H.last()).replace(/\n/g,' | '));
  await H.ask('Screenly'); console.log('SCREENLY:', (await H.last()).slice(0,150).replace(/\n/g,' | '));
  await H.ask('Start a streaming subscription'); await H.pickItem(0); await H.detailCta(); console.log('SUB CHK:', (await H.last()).replace(/\n/g,' | '));
  await H.close();
})();
