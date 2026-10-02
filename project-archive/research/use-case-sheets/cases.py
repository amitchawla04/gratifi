# Flight use cases for Gratifi. One row = one thing a customer wants done.
# Fields: stage, job, constraint, exception, says, does, blocks, rules, markets, vol, val, risk
# vol/val/risk are 1 (low) to 5 (high). Market notes only where a market differs.

C = []
def u(stage, job, constraint, exception, says, does, blocks, rules, markets='', vol=3, val=3, risk=2):
    C.append(dict(stage=stage, job=job, constraint=constraint, exception=exception, says=says, does=does, blocks=blocks, rules=rules, markets=markets, vol=vol, val=val, risk=risk))

S1, S2, S3, S4, S5, S6, S7, S8, S9, S10 = 'Inspire', 'Search', 'Choose', 'Pay', 'Extras', 'Before the trip', 'Day of travel', 'Disruption', 'After the trip', 'Points and card'

# ---------------- Inspire ----------------
u(S1, 'Find somewhere to go', 'Budget', '', 'Somewhere warm in October for under 40,000 points', 'Suggests 3 places the points cover, with flight price and weather', 'Answer, Rail, Polaroid, Price', 'Only places with live fares under the budget', '', 4, 3, 1)
u(S1, 'Find somewhere to go', 'Dates fixed', '', 'Where can I go for the long weekend?', 'Finds direct flights for those dates, shortest first', 'Answer, Rail, FlightCard', 'Uses the bank holiday calendar for the market', 'Holiday calendars differ: bank holidays (UK, EU), Diwali/Deepavali (IN, SG, MY), Eid/Hari Raya (AE, MY, SG, IN), Chinese New Year (SG, MY)', 4, 3, 1)
u(S1, 'Find somewhere to go', 'Points only', '', 'What can I get with my points alone?', 'Shows trips fully covered by the balance', 'Answer, Dial, Rail', 'Balance and point value from the bank', '', 4, 4, 1)
u(S1, 'Find somewhere to go', 'Travelling with kids', '', 'Somewhere easy with a toddler, short flight', 'Filters to under 3 hours, direct, family-friendly stays', 'Answer, Rail, Chips', 'Flight time cap is a hard filter', '', 3, 3, 1)
u(S1, 'Get a price alert', 'Route known', '', 'Tell me if London to Lisbon drops under £150', 'Sets an alert and confirms the threshold', 'Toast, Toggle', 'Alert fires on supplier price, not an estimate', '', 3, 2, 1)
u(S1, 'Get told about a deal', 'Card benefit', '', '(Gratifi starts it)', 'Moment: a card offer on a route the customer flies often', 'StickyNote, OfferCard', 'Only offers the customer is eligible for; marketing consent checked', 'Consent rules differ: UK GDPR/PECR, EU GDPR, India DPDP Act, Singapore PDPA, Malaysia PDPA, UAE PDPL', 3, 4, 2)
u(S1, 'Plan around an event', 'Date fixed by event', '', 'Flights for the F1 weekend', 'Finds flights and warns about peak prices', 'Answer, PriceCalendar, StateCard', 'Event dates from content partner', '', 2, 3, 1)
u(S1, 'Compare two places', 'Undecided', '', 'Lisbon or Porto for 3 nights?', 'Side-by-side of flight, hotel and total in points', 'Compare', 'Totals include taxes', '', 2, 3, 1)

# ---------------- Search ----------------
u(S2, 'Book a return flight', 'Dates fixed', '', 'Lisbon for two, 16 to 18 October', 'Three best options with a recommendation and the reason', 'YouSaid, Steps, Answer, Rail, FlightCard, Suggestions', 'Supplier fares only; the recommendation reason must be a stated fact', '', 5, 5, 2)
u(S2, 'Book a return flight', 'Flexible dates', '', 'Cheapest week in October to Lisbon', 'Price calendar with the cheapest days marked', 'PriceCalendar', 'Calendar prices are cached; confirm live before pay', 'Week starts Sunday in IN and SG, Monday elsewhere', 5, 4, 2)
u(S2, 'Book a one-way flight', 'Dates fixed', '', 'One way to Dubai on Friday', 'Results for one-way only', 'FlightCard, Rail', '', '', 4, 4, 1)
u(S2, 'Book a multi-city trip', 'Several stops', '', 'London to Lisbon, then Porto, then home', 'Builds the legs and prices them together and separately', 'Itinerary, Compare', 'Separate tickets flagged: missed connections not protected', '', 2, 4, 3)
u(S2, 'Search with filters', 'Direct only', '', 'Only direct', 'Filters and says how many are left', 'FilterBar, Chips', '', '', 5, 3, 1)
u(S2, 'Search with filters', 'Time of day', '', 'Nothing before 9am', 'Filters by departure time', 'FilterBar', '', '', 4, 3, 1)
u(S2, 'Search with filters', 'Airline preference', '', 'Only airlines where I earn miles', 'Filters to airlines linked to the customer\'s schemes', 'FilterBar, Badge', 'Frequent flyer numbers from the profile', '', 3, 3, 1)
u(S2, 'Search with filters', 'Bag included', '', 'Must include a checked bag', 'Filters to fares with a checked bag, shows true total', 'FilterBar, FareFamilies', 'Total must include the bag', '', 4, 3, 1)
u(S2, 'Search nearby airports', 'City, not airport', '', 'Any London airport', 'Searches all airports for the city', 'FlightCard', 'Airport groups per city', '', 4, 3, 1)
u(S2, 'Search by voice', 'Hands busy', '', '(spoken) Flights to Goa next weekend', 'Transcribes, confirms understanding, searches', 'AskBar (listening), YouSaid', 'Shows what it heard before acting', 'Voice in English first; Hindi, Arabic, Malay later', 3, 3, 2)
u(S2, 'Search for a group', '5 or more', '', 'Flights for 8 of us', 'Checks seat availability for 8, offers group fare route', 'Travellers, StateCard, Handoff', 'Over 9 passengers goes to group desk', '', 2, 4, 3)
u(S2, 'Search premium cabins', 'Business class', '', 'Business class to Singapore', 'Shows business fares and points cost', 'FlightCard, FareFamilies', '', '', 2, 5, 1)
u(S2, 'Search with points and cash', 'Budget in points', '', 'Use no more than 20,000 points', 'Prices each option as points plus cash', 'PointsSlider, Price', 'Point value from the bank', '', 4, 4, 1)
u(S2, 'Nothing found', 'Too strict', 'No results', 'Direct, before 9am, under £100', 'Says which filter blocks it and offers the nearest options', 'StateCard (empty)', 'Never invents a flight', '', 3, 3, 1)
u(S2, 'Search fails', 'Supplier down', 'Timeout', '(any search)', 'Says the airline is not answering, nothing was booked, try again', 'StateCard (error)', 'Retry with backoff; switch supplier if available', '', 2, 2, 2)

# ---------------- Choose ----------------
u(S3, 'Choose between flights', 'Two close options', '', 'Which is better, the 7am or the 11am?', 'Compares on what differs: time, bag, price, points back', 'Compare', 'Only facts from the fares', '', 4, 4, 1)
u(S3, 'Understand a fare', 'Unsure what is included', '', 'Does Light include a bag?', 'Shows fare families, ticked and greyed', 'FareFamilies', 'Fare rules from the supplier, word for word in the source', '', 5, 4, 2)
u(S3, 'Understand change rules', 'Might change plans', '', 'Can I change the date later?', 'Plain-words fare rules: free, fee, not possible', 'FareRules', 'Rules from fare; never guessed', '', 4, 4, 3)
u(S3, 'See the full journey', 'Connection', '', 'How long is the stop in Porto?', 'Itinerary with layover; tight ones in amber', 'Itinerary', 'Minimum connection time per airport', '', 3, 3, 2)
u(S3, 'See the plane', 'Comfort', '', 'What plane is it?', 'Aircraft type and seat pitch if known', 'Itinerary, Meta', '', '', 2, 2, 1)
u(S3, 'Choose travellers', 'Children', '', 'Two adults and a 3 year old', 'Sets travellers with correct age bands', 'Travellers', 'Age on the day of travel; airline bands', '', 4, 3, 2)
u(S3, 'Choose travellers', 'Infant on lap', '', 'Plus a baby', 'Adds infant, one per adult', 'Travellers', 'Infants never exceed adults', '', 3, 3, 2)
u(S3, 'Choose travellers', 'Travelling alone as a minor', '', 'My daughter is flying alone, she\'s 13', 'Explains the airline\'s unaccompanied minor service and hands over', 'StateCard, Handoff', 'Unaccompanied minors always go to a person', '', 1, 3, 5)
u(S3, 'Price changed', 'Between search and choose', 'Fare rose', '(taps a flight)', 'Shows old and new price, asks to continue', 'StateCard (price)', 'Never book at a higher price without a new yes', '', 3, 3, 3)
u(S3, 'Sold out', 'Last seats', 'Fare gone', '(taps a flight)', 'Says it has gone and offers the next best', 'StateCard (soldout)', '', '', 3, 3, 2)

# ---------------- Pay ----------------
u(S4, 'Pay with points', 'Enough points', '', 'Pay with points', 'Shows points total, confirm, done', 'PayWith, ConfirmSheet, Receipt', 'Points value from the bank; spend needs a button with the amount', 'Confirm: Face ID (UK, EU, AE, SG), one-time code (IN), bank app approval (MY)', 5, 5, 3)
u(S4, 'Pay with points and card', 'Not enough points', '', 'Use my points and put the rest on my card', 'Splits points and card, shows both totals', 'PayWith, PointsSlider, ConfirmSheet', 'Minimum card part set by the bank', 'Card part follows local card authentication rules', 5, 5, 3)
u(S4, 'Pay by card only', 'Save points', '', 'Keep my points, pay by card', 'Card only, shows points earned', 'PayWith, ConfirmSheet, Back', '', '', 4, 4, 2)
u(S4, 'Choose the split', 'Specific amount', '', 'Use exactly 10,000 points', 'Sets the slider, shows the card part', 'PointsSlider', 'Steps in the bank\'s minimum unit', '', 3, 3, 2)
u(S4, 'Not enough points', 'Points only asked', 'Short of points', 'Pay with points', 'Says how many short and offers points and card', 'PayWith (disabled option), StateCard', '', '', 4, 3, 2)
u(S4, 'Payment declined', 'Card issue', 'Declined', '(confirms)', 'Says nothing was booked, offers another card or points', 'StateCard (error)', 'No booking without payment success', '', 2, 3, 4)
u(S4, 'Authentication fails', 'Face ID / code', 'Failed or timed out', '(confirms)', 'Lets them retry; after 3 fails, hands to the bank\'s flow', 'ConfirmSheet, StateCard', 'Lockout rules from the bank', 'OTP retry limits set by the bank (IN)', 2, 3, 4)
u(S4, 'Price changed at pay', 'Final check', 'Fare rose', '(confirms)', 'Stops, shows new price, asks again', 'StateCard (price)', 'Re-price before every payment', '', 3, 3, 4)
u(S4, 'Get an invoice', 'Business trip', '', 'I need a tax invoice for my company', 'Captures company details, sends invoice', 'Receipt, Handoff', 'Invoice issued by the supplier', 'India: GST invoice needs the company GSTIN at booking. UK/EU: VAT shown only where charged (to confirm)', 2, 3, 2)
u(S4, 'Pay in instalments', 'Large spend', '', 'Can I split this over 3 months?', 'Explains the bank\'s instalment plan if eligible', 'Answer, Handoff', 'Eligibility and rates from the bank only', 'EMI (IN); instalment plans (MY and others); credit rules differ per market', 2, 4, 4)
u(S4, 'Use a voucher', 'Has a code', '', 'I have a £50 travel voucher', 'Applies it and shows the new total', 'PriceLines', 'Voucher validity checked by the issuer', '', 2, 3, 2)
u(S4, 'Booking confirmed', 'Success', '', '(after pay)', 'Receipt with reference, what happens next', 'CheckPop, Receipt', '', '', 5, 4, 1)
u(S4, 'Booking pending', 'Supplier slow', 'No ticket yet', '(after pay)', 'Says it is paid and being ticketed, will confirm in minutes', 'StateCard, Toast', 'Refund automatically if not ticketed in the set time', '', 2, 3, 4)

# ---------------- Extras ----------------
u(S5, 'Pick seats', 'Together', '', 'Seats together please', 'Seat map with a suggested pair', 'SeatMap', 'Seat prices from the airline', '', 5, 4, 1)
u(S5, 'Pick seats', 'Preference saved', '', '(automatic)', 'Uses saved aisle or window preference', 'StickyNote (blue), SeatMap', 'Preference from profile', '', 4, 3, 1)
u(S5, 'Pick seats', 'Extra legroom', '', 'Exit row please', 'Shows extra-legroom seats and price, explains exit row rules', 'SeatMap', 'Exit row eligibility rules', '', 3, 3, 2)
u(S5, 'Seat taken', 'Choosing', 'Seat gone', '(taps seat)', 'Says it has gone, suggests the nearest pair', 'StateCard (soldout)', '', '', 2, 2, 1)
u(S5, 'Add bags', 'Checked bag', '', 'Add a suitcase', 'Adds bag, shows price per person per flight', 'BagPicker', 'Bag prices from the airline', 'Cabin allowance usually 7kg on Asian carriers; 10kg or more on some European ones', 5, 4, 1)
u(S5, 'Add bags', 'Sports equipment', '', 'I\'m taking golf clubs', 'Adds special baggage if the airline allows', 'BagPicker, Handoff', 'Special items from the airline list', '', 1, 2, 2)
u(S5, 'Add meals', 'Dietary', '', 'Vegetarian meal', 'Requests the meal, confirms it is a request', 'Toast', 'Meal requests are not guaranteed', 'Common requests differ: Jain meals (IN), halal (AE, MY)', 2, 2, 1)
u(S5, 'Add lounge', 'Card benefit', '', 'Can I use a lounge?', 'Checks card benefit, books the pass', 'BenefitRow, LoungePass', 'Visits left from the bank', '', 3, 4, 1)
u(S5, 'Add fast track', 'Short on time', '', 'Add fast track security', 'Adds if available at the airport', 'Toast, PriceLines', '', '', 2, 3, 1)
u(S5, 'Add travel insurance', 'Card cover', '', 'Am I covered?', 'Explains card travel cover, offers top-up if not covered', 'Answer, BenefitRow', 'Cover terms from the bank; not advice', 'Insurance selling rules differ per market; may need a licensed partner', 3, 4, 4)
u(S5, 'Add a hotel', 'Same trip', '', 'Add a hotel', 'Hotel search for the trip dates and destination', 'HotelCard, Rail', '', '', 4, 5, 1)
u(S5, 'Add a ride', 'Airport transfer', '', 'Car to the airport', 'Books a ride timed to the flight', 'RideOption', 'Timing from flight and traffic', '', 3, 3, 2)
u(S5, 'Add special assistance', 'Reduced mobility', '', 'My mother needs a wheelchair', 'Requests assistance and confirms with the airline', 'StateCard, Handoff', 'Always confirmed with the airline', '', 1, 3, 4)
u(S5, 'Travel with a pet', 'Pet in cabin', '', 'Can my dog come?', 'Explains the airline\'s pet rules and hands over to book', 'Answer, Handoff', 'Pet rules from the airline', 'Pet import rules differ strictly by country', 1, 2, 3)

# ---------------- Before the trip ----------------
u(S6, 'Check in', 'Online', '', '(automatic)', 'Checks in when it opens, sends boarding passes', 'Toast, BoardingPass', 'Consent to auto check-in', 'India: web check-in expected for domestic flights', 5, 4, 2)
u(S6, 'Add passport details', 'International', '', '(before check-in)', 'Asks for passport details once, stores securely', 'StateCard, Handoff', 'Document data held by the bank, tokenised', '', 4, 3, 4)
u(S6, 'Check visa needs', 'International', '', 'Do I need a visa for Dubai?', 'Gives the official source and the rule for their passport', 'Answer', 'Visa info from an official source only; always linked', 'Rules differ by passport and destination; e-visas common for IN, AE', 3, 4, 4)
u(S6, 'Check ID needs', 'Domestic', '', 'What ID do I need?', 'Says what the airline accepts', 'Answer', 'From the airline', 'India: photo ID, DigiYatra optional. Malaysia: MyKad for domestic; Sabah and Sarawak have their own entry rules', 3, 3, 3)
u(S6, 'Share the trip', 'Family', '', 'Send the plan to my wife', 'Shares a read-only trip link', 'SendTo, TripFolder', 'Sharing needs the customer\'s yes', '', 3, 2, 2)
u(S6, 'Change the date', 'Before travel', '', 'Move my outbound to Saturday', 'Shows old and new, fee and fare difference, asks to confirm', 'ChangeFlight, ConfirmSheet', 'Fees from fare rules', '', 3, 4, 3)
u(S6, 'Change the name', 'Typo', '', 'My name is spelt wrong', 'Checks airline rules for name corrections, hands over if needed', 'StateCard, Handoff', 'Name changes are airline decisions', '', 2, 3, 4)
u(S6, 'Cancel the booking', 'Plans changed', '', 'Cancel my flight', 'Shows what comes back and how, asks to confirm', 'FareRules, ConfirmSheet, Receipt', 'Refund amounts from fare rules only', '', 3, 3, 4)
u(S6, 'Get reminded', 'Leaving time', '', '(automatic)', 'Tells them when to leave for the airport', 'StickyNote, Toast', 'Traffic data', '', 4, 3, 1)
u(S6, 'Check the weather', 'Packing', '', 'What\'s the weather in Lisbon?', 'Weather for the trip dates', 'Answer', '', '', 3, 1, 1)
u(S6, 'Currency and card abroad', 'Spending', '', 'Will my card work in Portugal?', 'Explains foreign fees on this card', 'BenefitRow, Answer', 'Fees from the bank', '', 3, 3, 2)
u(S6, 'Schedule change', 'Airline moved it', 'Time changed', '(Gratifi starts it)', 'Explains the change and options: accept, change, refund', 'StateCard, ChangeFlight', 'Options from airline policy and local rules', 'Refund rights for big schedule changes differ by market', 3, 4, 4)

# ---------------- Day of travel ----------------
u(S7, 'Show boarding pass', 'At the airport', '', 'Boarding pass', 'Shows it, bright and offline', 'BoardingPass', 'Available offline', '', 5, 4, 1)
u(S7, 'Track the flight', 'Live', '', 'Is my flight on time?', 'Live status, gate, times', 'FlightTracker, Status', 'Status from the airline feed', '', 5, 4, 2)
u(S7, 'Gate change', 'Live', 'Gate moved', '(Gratifi starts it)', 'Push and card with the new gate and walk time', 'FlightTracker, Toast', '', '', 3, 3, 2)
u(S7, 'Find the lounge', 'At the airport', '', 'Where\'s the lounge?', 'Lounge pass with directions', 'LoungePass', '', '', 3, 3, 1)
u(S7, 'Pick up someone', 'Arrivals', '', 'When does Sam land?', 'Tracks a shared flight', 'FlightTracker', 'Only flights shared with them', '', 2, 2, 2)
u(S7, 'Missed the flight', 'Late', 'No-show', 'I\'ve missed my flight', 'Checks rules for no-shows and the next flights', 'StateCard, FlightCard, Handoff', 'No-show rules from fare', '', 1, 3, 4)
u(S7, 'Denied boarding', 'Overbooked', 'Bumped', 'They\'ve given my seat away', 'Explains rights and next options', 'Disruption, Handoff', 'Compensation named by rule', 'UK261 and EU261 set amounts; DGCA (IN) and the Malaysian Aviation Consumer Protection Code, enforced by CAAM (MY), have their own rules; SG and AE follow airline policy', 1, 3, 5)
u(S7, 'Lost bag', 'On arrival', 'Bag missing', 'My bag didn\'t arrive', 'Starts the report, tracks it', 'StateCard, Handoff', 'Report goes to the airline', '', 1, 3, 4)

# ---------------- Disruption ----------------
u(S8, 'Flight delayed', 'Short delay', '', '(Gratifi starts it)', 'Heads-up with new times and what it means', 'FlightTracker, Status', '', '', 4, 3, 2)
u(S8, 'Flight delayed', 'Long delay', 'Over 3 hours', '(Gratifi starts it)', 'Explains rights, food vouchers, rebooking', 'Disruption, Handoff', 'Rights named by rule, amounts by legal team', 'Amounts: UK £220 to £520, EU €250 to €600 by distance (EU reform agreed June 2026, adoption pending); India DGCA sets amounts (legal to confirm); others per local rule or airline', 2, 4, 5)
u(S8, 'Flight cancelled', 'Before travel', '', '(Gratifi starts it)', 'Options already worked out: next flight, other route, refund', 'Disruption, ConfirmSheet, Receipt', 'Refund always offered', '', 2, 5, 5)
u(S8, 'Flight cancelled', 'At the airport', 'Queue', '(Gratifi starts it)', 'Rebooks before the queue, holds seats together', 'Disruption, Receipt', 'Seat hold time from the airline', '', 2, 5, 5)
u(S8, 'Missed connection', 'Same ticket', 'Late first flight', '(Gratifi starts it)', 'Rebooks the onward flight', 'Disruption, Itinerary', 'Protected only on one ticket', '', 1, 4, 5)
u(S8, 'Missed connection', 'Separate tickets', 'Not protected', '(Gratifi starts it)', 'Explains it is not protected, finds the next options', 'StateCard, FlightCard, Handoff', '', '', 1, 3, 5)
u(S8, 'Claim compensation', 'After disruption', '', 'Can I claim for the delay?', 'Checks eligibility and files the claim', 'Answer, StateCard, Receipt', 'Eligibility by rule; never promises an amount outside UK/EU', 'Claims routes differ per market', 2, 4, 4)
u(S8, 'Strike or weather', 'Many flights', 'Mass disruption', '(Gratifi starts it)', 'Tells them early, offers free changes if the airline allows', 'StateCard, ChangeFlight', 'Waiver terms from the airline', '', 2, 4, 4)
u(S8, 'Hotel and ride affected', 'Knock-on', '', '(after rebooking)', 'Tells the hotel and moves the ride', 'Receipt, Toast', 'Needs customer\'s yes to contact the hotel', '', 2, 4, 2)

# ---------------- After the trip ----------------
u(S9, 'Get points back', 'Earned', '', 'Did I get my points?', 'Shows points earned from the trip', 'TransactionRow, Back', 'Points from the bank ledger', '', 4, 3, 1)
u(S9, 'Refund status', 'Cancelled trip', '', 'Where\'s my refund?', 'Shows refund state and date', 'StateCard, TransactionRow', 'Status from supplier and bank', '', 3, 3, 3)
u(S9, 'Rate the trip', 'Feedback', '', '(Gratifi asks)', 'One-tap rating that improves suggestions', 'Chips', 'Optional, never required', '', 3, 2, 1)
u(S9, 'Book the same again', 'Repeat', '', 'Same trip in December', 'Rebuilds the trip for new dates', 'Answer, Rail', '', '', 2, 4, 1)
u(S9, 'Complain', 'Unhappy', '', 'This was terrible', 'Listens, logs a complaint, hands to a person', 'Handoff', 'Complaints handling set by the bank', 'Complaint timelines differ by regulator', 1, 3, 4)

# ---------------- Points and card ----------------
u(S10, 'See points value', 'Balance', '', 'What are my points worth?', 'Balance and what it buys in flights', 'Dial, Answer', 'Point value from the bank', '', 5, 4, 1)
u(S10, 'Transfer points', 'Airline scheme', '', 'Move points to my airline miles', 'Shows transfer rate and time, confirms', 'Answer, ConfirmSheet', 'Rates and partners from the bank', 'Partners differ per bank and market', 3, 4, 3)
u(S10, 'Earn more', 'Upcoming trip', '', 'How can I earn more before the trip?', 'Shows offers and multipliers on the trip', 'OfferCard, Rail', '', '', 3, 3, 1)
u(S10, 'Points expiring', 'Balance', '', '(Gratifi starts it)', 'Warns and suggests a use', 'StickyNote', 'Expiry rules from the bank', '', 3, 4, 2)
u(S10, 'Card benefits for travel', 'Before booking', '', 'What does my card give me when I fly?', 'Lists travel benefits and what\'s left', 'BenefitRow', 'Benefits from the bank', '', 4, 4, 1)
u(S10, 'Pay the card bill', 'Statement', '', 'How much do I owe?', 'Shows amount due and pay options', 'PaymentDue', 'From the bank', 'Direct Debit (UK), direct debit (EU, AE), auto-debit (IN, MY), GIRO (SG)', 4, 3, 2)
u(S10, 'Dispute a charge', 'Airline charge', '', 'I was charged twice', 'Shows both charges, starts a dispute with the bank', 'TransactionRow, Handoff', 'Disputes run by the bank', '', 1, 3, 4)

# ---------------- extra depth, flights only ----------------
more = [
 (S2, 'Book a return flight', 'Open jaw', '', 'Fly into Lisbon, back from Porto', 'Prices the open jaw as one trip', 'Itinerary, FlightCard', 'Fare construction by supplier', '', 2, 3, 2),
 (S2, 'Book for someone else', 'Gift trip', '', 'Book flights for my parents', 'Captures their names, pays from my points', 'Travellers, PayWith', 'Names must match passports', '', 2, 4, 3),
 (S2, 'Book last minute', 'Today', '', 'Next flight to Edinburgh', 'Shows flights leaving soonest with check-in cut-off', 'FlightCard, Status', 'Cut-off times per airline', '', 2, 4, 2),
 (S3, 'Hold a fare', 'Deciding', '', 'Can you hold this for a day?', 'Offers fare hold if the airline sells it', 'StateCard, ConfirmSheet', 'Hold price and time from the airline', '', 2, 3, 3),
 (S3, 'Check the carbon', 'Green choice', '', 'Which one is lower carbon?', 'Shows estimated emissions per option', 'Compare', 'Estimate from a named source', 'Carbon disclosure rules vary; EU strictest', 1, 2, 2),
 (S4, 'Pay in another currency', 'Foreign airline', '', 'Why is this in euros?', 'Explains currency and any card fee', 'PriceLines, BenefitRow', 'FX rate from the bank', '', 2, 3, 3),
 (S4, 'Split payment with a friend', 'Shared trip', '', 'Split this with Sam', 'Sends a request for their half', 'SendTo, PriceLines', 'Only if the bank supports requests', 'Payment request rails differ: Faster Payments (UK), UPI (IN), PayNow (SG), DuitNow (MY)', 2, 3, 3),
 (S5, 'Upgrade with points', 'Booked', '', 'Can I upgrade to business?', 'Checks upgrade price in points and cash', 'FareFamilies, ConfirmSheet', 'Upgrade inventory from the airline', '', 2, 4, 2),
 (S5, 'Add infant seat', 'Baby', '', 'Can I get a bassinet?', 'Requests a bassinet seat', 'SeatMap, Toast', 'Bassinet rows are airline-controlled', '', 1, 2, 2),
 (S6, 'Add a frequent flyer number', 'Earn miles', '', 'Add my miles number', 'Adds it to the booking', 'Toast', 'Number checked by the airline', '', 3, 2, 1),
 (S6, 'Travelling during a religious period', 'Ramadan', '', 'Are there meals on my flight during Ramadan?', 'Explains the airline\'s service and airport opening hours', 'Answer', 'From airline and airport', 'Relevant in AE, MY and IN; dates move each year', 1, 2, 2),
 (S7, 'Security wait times', 'At the airport', '', 'How long is security?', 'Shows the airport\'s published wait if available', 'Answer', 'Only published data', '', 2, 2, 1),
 (S7, 'Arrival: get into town', 'Landed', '', 'How do I get to the hotel?', 'Offers ride, train, and time for each', 'RideOption, Answer', '', '', 3, 3, 1),
 (S8, 'Diverted flight', 'In the air', 'Landed elsewhere', '(Gratifi starts it)', 'Explains what the airline is doing and the options', 'StateCard, Handoff', '', '', 1, 3, 5),
 (S8, 'Downgraded cabin', 'At boarding', 'Seat class lower', 'They moved me to economy', 'Explains refund rights for the difference', 'StateCard, Handoff', 'Rule-based refund', 'EU261 sets fixed percentages; others vary', 1, 3, 4),
 (S9, 'Get a receipt', 'Expenses', '', 'Send me the receipt', 'Emails the receipt and invoice', 'Receipt, Toast', '', 'India: GST invoice from the airline', 3, 2, 1),
 (S10, 'Buy points to finish a booking', 'Short', '', 'I\'m 2,000 points short', 'Offers to buy points if the bank allows, or points and card', 'PayWith, StateCard', 'Point purchase price from the bank', '', 2, 3, 3),
]
for m in more: u(*m)
