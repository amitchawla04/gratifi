# Brief: write Gratifi use cases for your categories

Gratifi is an AI assistant a bank gives its card customers (white-label, built by Reward360 / R360). Customers talk to it; it answers in plain words, shows proof on a card built from a fixed UI kit, and the customer decides with a normal button. It runs in six markets: UK, EU (euro, English first), India (IN), UAE (AE, English and Arabic), Singapore (SG), Malaysia (MY).

Your job: write every use case a customer could have for the inventory items you are given, so that NOTHING is missing. One row = one thing a customer wants done, in one situation.

## Output
Write ONE Python file at the path you are given, containing exactly:

```python
CASES = [
  dict(item='ST-01', stage='Search', job='Book a hotel', constraint='Dates fixed', exception='', says='A hotel in Lisbon for 16 to 18 Oct, near the river', does='Three best options with a recommendation and the reason', blocks='Answer, Rail, HotelCard', rules='Supplier rates only; recommendation reason must be a stated fact', markets='', vol=5, val=5, risk=2),
  ...
]
```

Fields:
- item: an inventory ID from your list (every row must use one).
- stage: one of: Discover, Search, Choose, Pay, Add-ons, Before, During, Problem, After, Account.
- job: short verb phrase, what they want done. Reuse the same job text across rows that differ only by constraint or exception.
- constraint: what shapes the answer (budget in points, dates fixed, travelling with kids, business trip, accessibility, premium, group, etc.) or ''.
- exception: what went wrong (sold out, price rose, payment declined, supplier down, not enough points, cancelled by supplier, late delivery, wrong item, fraud flag, etc.) or ''.
- says: one realistic example of what the customer says (British English; or '(Gratifi starts it)' for proactive).
- does: what Gratifi does, plain words, one sentence.
- blocks: comma-separated UI kit components from the list in kit_blocks.txt. If the kit has no block for it, write NEW: <BlockName> (e.g. NEW: SizePicker). Be honest: new blocks are how we find gaps.
- rules: what the SYSTEMS decide (never the model): prices from supplier, eligibility from bank, re-price before pay, refund amounts from terms, consent, limits. Short.
- markets: only where a market genuinely differs (regulation, payment method, product availability, culture, language). Be careful with facts: if not certain, write "to confirm". Never invent amounts. Useful known points: payment confirm = Face ID (UK, EU, AE, SG), one-time code (IN), bank-app approval (MY); automatic card payment = Direct Debit (UK), direct debit (EU, AE), auto-debit (IN, MY), GIRO (SG); data laws UK GDPR, EU GDPR, India DPDP Act, Singapore PDPA, Malaysia PDPA, UAE PDPL. Investments and insurance selling need licences per market (to confirm). Arabic content needs native review.
- vol, val, risk: integers 1 to 5 (volume = how often asked; value = revenue or loyalty impact; risk = harm if wrong: money, rights, safety, regulation).

## Coverage rules (a checker will enforce these)
For EVERY inventory item you are given:
- at least 6 rows; aim for 10 to 25 for big items;
- at least 2 happy-path rows (exception '');
- at least 2 exception rows covering what goes wrong;
- if it can be changed or cancelled, at least 1 change/cancel row;
- if money or points move, at least 1 Pay row;
- proactive rows ('(Gratifi starts it)') where the assistant should speak first;
- human handover (Handoff block) wherever a person must decide (complaints, vulnerable customers, fraud, legal, safety).

Style: British English, plain words, no jargon, no "seamless", "unlock", "elevate", "delight", no emoji, say "bank" never "card issuer". No real brand names as partners in 'says' or 'does' except where the inventory names the supply (e.g. Uber, Viator). Airlines and hotels in examples: fictional or generic.

When done, run `python3 -c "import runpy; d=runpy.run_path('<your file>'); print(len(d['CASES']))"` to prove it loads, and report the count per item.
