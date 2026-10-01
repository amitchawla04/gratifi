// The kit reads React from the page (window.React), so the bundle stays one classic script.
export const React: any = (window as any).React
export const { useState, useEffect, useRef, useMemo } = React
export const cx = (...a: any[]) => a.filter(Boolean).join(' ')
export const gbp = (n: number, dp = 0) => (n < 0 ? '−' : '') + '£' + Math.abs(n).toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp })
export const int = (n: number) => Math.round(n).toLocaleString('en-GB')
