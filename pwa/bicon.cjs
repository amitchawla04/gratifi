const { chromium } = require('playwright');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#123A63"/><stop offset="1" stop-color="#081F38"/></linearGradient></defs>
<rect width="512" height="512" fill="url(#g)"/>
<g transform="translate(256 262) rotate(-8)"><rect x="-150" y="-95" width="300" height="190" rx="28" fill="#fff"/><rect x="-118" y="-52" width="58" height="42" rx="9" fill="#E3C77A"/><rect x="-118" y="40" width="120" height="16" rx="8" fill="#C9D4E0"/></g>
<g transform="translate(318 176) scale(6.2)" fill="#FF6A1F"><path d="M11 2.5c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" transform="translate(-11 -9.5)"/></g>
</svg>`;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:512,height:512}});
await p.setContent(`<html><body style="margin:0">${svg}</body></html>`);
for (const [n,s] of [['icon-512',512],['icon-192',192],['apple-touch-icon',180]]) { await p.setViewportSize({width:s,height:s}); await p.evaluate(s=>{const e=document.querySelector('svg');e.setAttribute('width',s);e.setAttribute('height',s)},s); await p.screenshot({path:`bcard/public/icons/${n}.png`}); }
await b.close();})();
