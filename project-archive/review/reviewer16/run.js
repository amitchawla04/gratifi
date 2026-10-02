// node run.js <scenario-file> 
const f = process.argv[2]; require(require('path').resolve(f))().catch(e => { console.log('FAIL', e.message.split('\n').slice(0,3).join(' ')); process.exit(1) })
