import subprocess, base64, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
K='../kit'
r=subprocess.run([K+'/node_modules/.bin/esbuild','src/main.tsx','--bundle','--format=iife','--target=es2019','--jsx-factory=React.createElement','--jsx-fragment=React.Fragment','--loader:.svg=dataurl','--log-level=warning','--outfile=build/app.js'],capture_output=True)
r.stderr=r.stderr.decode('utf-8','replace')
if r.returncode: print(r.stderr); sys.exit(1)
if r.stderr: print(r.stderr[:3000])
b64=lambda p: base64.b64encode(open(p,'rb').read()).decode()
F=K+'/test/fonts/'
fonts=f"""@font-face{{font-family:Geist;src:url(data:font/woff2;base64,{b64(F+'Geist-Variable.woff2')}) format('woff2');font-weight:100 900}}
@font-face{{font-family:'Geist Mono';src:url(data:font/woff2;base64,{b64(F+'GeistMono-Variable.woff2')}) format('woff2');font-weight:100 900}}
@font-face{{font-family:'Gochi Hand';src:url(data:font/woff2;base64,{b64(F+'gochi-hand-latin-400-normal.woff2')}) format('woff2')}}
@font-face{{font-family:'IBM Plex Sans Arabic';src:url(data:font/woff2;base64,{b64(F+'PlexArabic-400.woff2')}) format('woff2');font-weight:400}}
@font-face{{font-family:'IBM Plex Sans Arabic';src:url(data:font/woff2;base64,{b64(F+'PlexArabic-600.woff2')}) format('woff2');font-weight:600}}
@font-face{{font-family:'IBM Plex Sans Arabic';src:url(data:font/woff2;base64,{b64(F+'PlexArabic-700.woff2')}) format('woff2');font-weight:700 900}}
"""
kitcss=''.join(l for l in open(K+'/src/kit.css').read().splitlines(True) if not l.startswith('@import'))
css=open(K+'/test/tokens.css').read()+fonts+kitcss+open('src/app.css').read()+open('src/cards2.css').read()
js=lambda p: open(p).read().replace('</script','<\\/script')
html=f"""<title>Gratifi</title>
<style>{css}</style>
<div id="root"></div>
<script>{js(K+'/test/react.production.min.js')}</script>
<script>{js(K+'/test/react-dom.production.min.js')}</script>
<script>{js('build/app.js')}</script>
"""
open('build/gratifi.html','w').write(html)
# local test page with a full doc
open('build/test.html','w').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script>window.__errs=[];addEventListener("error",e=>__errs.push(e.message));</script>'+html.replace('<title>','<title>',1)+'</head></html>')
fake = '''<script>
window.claude = { use: async (n) => n !== 'sample' ? null : Object.assign(async function (turns, o) {
  window.__calls = (window.__calls || []); window.__calls.push({ turns, tools: o.tools.map(t => t.name), tier: o.modelTier, cache: o.cache })
  const last = turns[turns.length - 1].content.toLowerCase(); const T = n => o.tools.find(t => t.name === n)
  const say = async (s) => { let acc = ''; for (const w of s.split(' ')) { if (o.signal && o.signal.aborted) { const e = { code: 'cancelled', text: acc }; throw e } acc += (acc ? ' ' : '') + w; o.onText && o.onText({ text: acc, delta: w }); await new Promise(r => setTimeout(r, 20)) } return { text: acc, truncated: false } }
  await new Promise(r => setTimeout(r, 200))
  if (/flight/.test(last)) { const r = await T('search_flights').execute({ destination: 'Lisbon', travellers: 2 }, {}); window.__last = r; return say('Here are the best flights to Lisbon. The morning direct is my pick; tap one to choose a fare.') }
  if (/freeze/.test(last)) { await T('card_and_account').execute({ topic: 'freeze card' }, {}); return say('Your card controls are below. Freeze it with the first switch.') }
  if (/fail/.test(last)) { throw { code: 'upstream_error', message: 'x' } }
  if (/nope/.test(last)) { throw { code: 'not_granted', message: 'x' } }
  return say('I can help with that. What would you like to do?')
}, { limits: async () => ({ maxInputBytes: 65536, tools: { maxCount: 16 } }), json: async () => ({}) }) };
</script>'''
open('build/test-ai.html','w').write('<!doctype html><html><head><meta charset="utf-8"><script>window.__errs=[];addEventListener("error",e=>__errs.push(e.message));</script>'+fake+html+'</head></html>')

# installable app (PWA) for Vercel: full page, manifest, service worker, icons
import hashlib, shutil
os.makedirs('build/site', exist_ok=True)
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  '<meta name="theme-color" content="#F4F4F3" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#232326" media="(prefers-color-scheme: dark)"><meta name="color-scheme" content="light dark">'
  '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">'
  '<meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="Gratifi">'
  '<meta name="description" content="Your points and card assistant.">'
  '<link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="icon" href="/icon.svg" type="image/svg+xml">')
reg = '<script>if("serviceWorker" in navigator&&location.protocol==="https:")addEventListener("load",()=>navigator.serviceWorker.register("/sw.js"))</script>'
open('build/site/index.html','w').write(head + html + reg + '</head></html>')
build = hashlib.sha1(html.encode()).hexdigest()[:10]
open('build/site/sw.js','w').write(open('pwa/sw.js').read().replace('__BUILD__', build))
for f in ['manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png']: shutil.copy('pwa/'+f, 'build/site/'+f)
print('ok', len(html)//1024, 'KB')
