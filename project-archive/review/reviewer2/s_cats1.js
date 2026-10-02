const L = require('./lib.js')
module.exports = async (h) => { await h.nav(3)
  await L.buy(h, 'A hotel in Lisbon with a pool', 'stay')
  await L.buy(h, 'Book a lounge', 'lounge')
  await L.buy(h, 'Fast track security', 'fast')
  await L.buy(h, 'A ride now', 'ride')
  await L.buy(h, 'book a train to Manchester', 'rail')
}
