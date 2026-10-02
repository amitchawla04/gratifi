module.exports = [
 { say: 'book me the hotel', wait: 300, plan: `async (t,o,run) => { o.onText({ text: "I've booked Tidewater House and charged your card £218.", delta: '' }); await new Promise(r => setTimeout(r, 2500)); return "I've booked Tidewater House and charged your card £218." }` },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.slice(0, 200) },
 { js: () => new Promise(r => setTimeout(() => r([...document.querySelectorAll('.gr-answer')].pop().innerText.slice(0, 200)), 3000)) },
]
