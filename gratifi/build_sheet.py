# Builds the component sign-off sheet (src/sheet.tsx) into build/components.html, one self-contained page.
import subprocess, base64, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
K='../kit'
r=subprocess.run([K+'/node_modules/.bin/esbuild','src/sheet.tsx','--bundle','--format=iife','--target=es2019','--jsx-factory=React.createElement','--jsx-fragment=React.Fragment','--loader:.svg=dataurl','--log-level=warning','--outfile=build/sheet.js'],capture_output=True)
if r.returncode: print(r.stderr.decode()); sys.exit(1)
b64=lambda p: base64.b64encode(open(p,'rb').read()).decode()
F=K+'/test/fonts/'
fonts=f"""@font-face{{font-family:Geist;src:url(data:font/woff2;base64,{b64(F+'Geist-Variable.woff2')}) format('woff2');font-weight:100 900}}
@font-face{{font-family:'Geist Mono';src:url(data:font/woff2;base64,{b64(F+'GeistMono-Variable.woff2')}) format('woff2');font-weight:100 900}}
@font-face{{font-family:'Gochi Hand';src:url(data:font/woff2;base64,{b64(F+'gochi-hand-latin-400-normal.woff2')}) format('woff2')}}
"""
kitcss=''.join(l for l in open(K+'/src/kit.css').read().splitlines(True) if not l.startswith('@import'))
sheet="""
html,body{height:auto!important;overflow:auto!important}
body{margin:0;background:var(--ground,#EDEBE7);font-family:var(--font-sans);color:var(--ink);-webkit-font-smoothing:antialiased}
.sh{max-width:1240px;margin:0 auto;padding:40px 16px 80px}
.sh-h{max-width:640px;margin:0 0 32px}
.sh-k{margin:0 0 8px;font-size:.8125rem;font-weight:700;color:var(--accent);letter-spacing:.02em}
.sh-h h1{margin:0 0 10px;font-size:2rem;line-height:1.1;font-weight:800;letter-spacing:-.02em}
.sh-h p{margin:0;font-size:1rem;line-height:1.5;color:var(--ink-soft)}
.sh-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:36px 28px;align-items:start}
.sh-it{display:flex;flex-direction:column;gap:12px;min-width:0}
.sh-l{display:flex;gap:12px;align-items:flex-start}
.sh-n{font-family:var(--font-mono);font-size:.75rem;font-weight:700;color:var(--ink-soft);background:var(--card);border-radius:8px;padding:4px 7px;margin-top:2px}
.sh-l h2{margin:0;font-size:1.0625rem;font-weight:800;letter-spacing:-.01em}
.sh-l p{margin:2px 0 0;font-size:.8125rem;color:var(--ink-soft);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.sh-was{font-size:.6875rem;font-weight:700;border-radius:6px;padding:2px 6px;background:#E2E0DB;color:#4A4A50}
.sh-was.new{background:var(--accent);color:#fff}
.sh-phone{max-width:400px;width:100%}
@media (max-width:420px){.sh-grid{grid-template-columns:1fr}.sh-h h1{font-size:1.625rem}}
"""
css=open(K+'/test/tokens.css').read()+fonts+kitcss+open('src/app.css').read()+open('src/cards2.css').read()+sheet
js=lambda p: open(p).read().replace('</script','<\\/script')
html=f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gratifi Chat Components</title>
<style>{css}</style></head><body><div id="root"></div>
<script>window.__errs=[];addEventListener("error",e=>__errs.push(e.message));</script>
<script>{js(K+'/test/react.production.min.js')}</script>
<script>{js(K+'/test/react-dom.production.min.js')}</script>
<script>{js('build/sheet.js')}</script></body></html>"""
open('build/components.html','w').write(html)
print('ok', len(html)//1024, 'KB')
