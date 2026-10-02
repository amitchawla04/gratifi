module.exports = async (h) => { console.log(await h.p.evaluate(() => Object.keys(localStorage))) }
