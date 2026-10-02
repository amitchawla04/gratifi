import runpy, re, collections
from cases import C as FL
from inventory import I, CATS
SMAP = {'Inspire': 'Discover', 'Search': 'Search', 'Choose': 'Choose', 'Pay': 'Pay', 'Extras': 'Add-ons', 'Before the trip': 'Before', 'Day of travel': 'During', 'Disruption': 'Problem', 'After the trip': 'After', 'Points and card': 'Account'}
def fl_item(c):
    j = c['job'].lower(); st = c['stage']
    if any(k in j for k in ('multi-city', 'group', 'open jaw' , 'someone else')) or 'open jaw' in c['constraint'].lower() or '5 or more' in c['constraint']: return 'FL-02'
    if 'upgrade' in j or 'award' in j: return 'FL-03'
    if st == 'Extras': return 'FL-04'
    if st == 'Pay': return 'FL-08'
    if st == 'Disruption' or 'schedule change' in j or 'denied' in j or 'lost bag' in j or 'diverted' in j or 'downgraded' in j or 'missed the flight' in j: return 'FL-07'
    if st == 'Before the trip' and any(k in j for k in ('change', 'cancel', 'name')): return 'FL-05'
    if st in ('Before the trip', 'Day of travel'): return 'FL-06'
    if st == 'After the trip': return 'FL-08' if any(k in j for k in ('refund', 'receipt', 'points')) else 'FL-06'
    if st == 'Points and card': return 'FL-08'
    return 'FL-01'
rows = []
for c in FL:
    rows.append(dict(item=fl_item(c), stage=SMAP[c['stage']], job=c['job'], constraint=c['constraint'], exception=c['exception'], says=c['says'], does=c['does'], blocks=c['blocks'], rules=c['rules'], markets=c['markets'], vol=c['vol'], val=c['val'], risk=c['risk']))
try:
    rows += runpy.run_path('cases_fl2.py')['CASES']
except FileNotFoundError: pass
for f in 'abcdef': rows += runpy.run_path(f'cases_{f}.py')['CASES']
if __name__ == '__main__':
    by = collections.defaultdict(list)
    for r in rows: by[r['item']].append(r)
    gaps = []
    for it in I:
        rs = by[it[0]]; hap = sum(1 for r in rs if not r['exception']); exc = len(rs) - hap
        ok = len(rs) >= 6 and hap >= 2 and exc >= 2
        if not ok: gaps.append((it[0], it[3], len(rs), hap, exc))
    print('rows', len(rows), 'gaps', gaps)
