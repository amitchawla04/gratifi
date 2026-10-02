module.exports = async (h) => { const { p, nav, full, click, last } = h
  await nav(2); await p.getByRole('button', { name: /Stays/ }).first().click(); await p.waitForTimeout(600); await full('explore-stays')
  console.log('A', (await p.locator('.app-main').innerText()).replace(/\n+/g,' | ').slice(0,700))
  await nav(1); await p.getByRole('button', { name: /See flights/ }).first().click(); await p.waitForTimeout(800); await full('home-banner')
  console.log('B', (await last()).slice(0,400))
  await nav(1); await p.getByText('Tidewater House').first().click(); await p.waitForTimeout(800); await full('home-featured')
  console.log('C', (await last()).slice(0,400))
}
