set -e
cd "$(dirname "$0")/.."
./node_modules/.bin/esbuild src/index.tsx --bundle --format=iife --target=es2019 --jsx-factory=React.createElement --jsx-fragment=React.Fragment --loader:.svg=dataurl --log-level=warning --outfile=build.js
python3 test/tokens.py
cp build.js test/bundle.js
{ printf "@font-face{font-family:Geist;src:url(fonts/Geist-Variable.woff2) format('woff2');font-weight:100 900}\n@font-face{font-family:'Geist Mono';src:url(fonts/GeistMono-Variable.woff2) format('woff2');font-weight:100 900}\n@font-face{font-family:'Gochi Hand';src:url(fonts/gochi-hand-latin-400-normal.woff2) format('woff2')}\n@font-face{font-family:'IBM Plex Sans Arabic';src:url(fonts/PlexArabic-400.woff2);font-weight:400}\n@font-face{font-family:'IBM Plex Sans Arabic';src:url(fonts/PlexArabic-600.woff2);font-weight:600}\n@font-face{font-family:'IBM Plex Sans Arabic';src:url(fonts/PlexArabic-700.woff2);font-weight:700 900}\n"; grep -v "^@import" src/kit.css; } > test/bundle.css
