// Installed-app (home screen) viewport fix for iOS.
// iOS 26 can give an installed web app a layout viewport one status-bar height shorter than the
// screen, so anything pinned to the bottom stops short and leaves an empty strip. We measure the
// real screen and size the app shell to reach its bottom edge.
export function fitViewport() {
  const root = document.documentElement
  const probe = document.createElement('div')
  probe.setAttribute('data-sa-probe', '')
  probe.style.cssText = 'position:fixed;top:0;left:0;width:0;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)'
  document.body.appendChild(probe)
  const standalone = () => (navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches
  const apply = () => {
    const a = document.activeElement as HTMLElement | null
    if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')) return // keyboard open: leave layout alone
    const cs = getComputedStyle(probe)
    const sat = parseFloat(cs.paddingTop) || 0
    const sab = parseFloat(cs.paddingBottom) || 0
    const W = window.innerWidth, H = window.innerHeight
    let h = H, bottomInset = sab
    if (standalone() && W < H && Math.abs(screen.width - W) < 4) {
      const missing = screen.height - H
      if (sat > 0 && missing > 8) {
        // page is drawn from the very top of the screen: reach the real bottom edge
        h = screen.height
      } else if (sat === 0 && missing > 72) {
        // page starts below an opaque status bar and is short by a further status-bar height
        h = H + Math.round(missing / 2)
      }
      if (h !== H && bottomInset < 20) bottomInset = 34 // home indicator
    }
    root.style.setProperty('--app-h', h + 'px')
    root.style.setProperty('--sabx', bottomInset + 'px')
  }
  apply()
  const later = () => { apply(); setTimeout(apply, 120); setTimeout(apply, 500) }
  ;['resize', 'orientationchange', 'pageshow', 'focusout'].forEach(e => window.addEventListener(e, later))
  document.addEventListener('visibilitychange', later)
  window.visualViewport?.addEventListener('resize', later)
  later()
}
