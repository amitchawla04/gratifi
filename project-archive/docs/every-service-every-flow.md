# Gratifi — Every Service, Every Flow

Oct 2, 2026 · @Amit Chawla

## What "complete in chat" means

Every service in Gratifi has to run from "I want this" to "here's your ticket" without leaving the chat. Today the app does the first half well (ask, see options, pick) and stops too early. This doc lists every service, every flow, every sub-flow and every branch below that, so we can build the missing half.

**The bar.** Meta's Muse (launched Sept 2026) searches live flight inventory across 500+ airlines, checks fares, books, cancels and manages trips. It asks before every purchase and pays with a one-time card ([PhocusWire](https://www.phocuswire.com/news/technology/meta-launches-ai-agent-travel-booking), [Deep Arrival](https://deeparrival.com/news/meta-muse-agent-books-travel-september-2026/)). For concerts it shows live seats and prices from Ticketmaster, but it hands you over to Ticketmaster to pay ([AI Musicpreneur](https://www.aimusicpreneur.com/ai-music-news/meta-muse-ai-agent-ticketmaster-live-event-discovery/)). Instinct works over text: it books, rebooks, watches fares, applies credits, manages seats, tracks sold-out tickets and books restaurants ([Skift](https://skift.com/2026/09/04/a-viral-ai-bot-just-showed-travel-what-frictionless-actually-means/), [Vellum](https://www.vellum.ai/blog/official-instinct-breakdown)).

**Where we go further.** Muse pushes people out to pay. Gratifi never does: the customer pays with points, card or both, and R360 pays the merchant behind the scenes. Instinct sometimes acts without asking. Gratifi always shows a review and asks for one tap (and an OTP where the bank needs one).

**The one pattern.** Every booking in every service follows the same nine steps. Only the cards inside each step change.

1. **Ask.** Typed, spoken or tapped from a chip. The agent fills in what it can (home airport, travellers, card) and asks only for what is missing.
2. **Options.** Live results as picture cards with points first and cash second. A best pick on top, then the rest, with filters.
3. **Pick.** Tap a card to open its detail: what you get, the rules, the price breakdown.
4. **Details.** Everything the merchant needs: who is going, seats, sizes, times, extras. Each one is its own small card, asked one at a time, pre-filled where we know it.
5. **Review.** One sheet with everything: item, people, dates, rules, the total in points and cash, and what happens if plans change.
6. **Pay.** Points, card or a split, with a slider. OTP or Face ID where needed.
7. **Done.** A confirmation card with the code, plus the pass (boarding pass, ticket QR, voucher) and Add to Wallet.
8. **Manage.** From the booking card: change, cancel, add extras, get help. Each of these is its own flow.
9. **Watch.** The agent keeps an eye on it: check-in opens, gate changes, delays, price drops, event reminders, return windows. It messages first and offers the fix.

## Shared sub-flows

Eight sub-flows show up in almost every service. We build each one once and reuse it everywhere, so a fix in one place fixes every service.

1. **Who's going**
   1. Pick from saved people: me, partner, kids, colleagues
   2. Add a new person: name as on ID, date of birth, gender where the airline needs it
      1. Child or infant: age on travel date decides the fare
      2. Passport details for international trips, scanned or typed
   3. Contact for updates: phone and email, pre-filled
   4. Loyalty numbers: airline, hotel and cinema memberships added to the booking
2. **Choosing**
   1. Best pick plus the list
   2. Filters as chips: price, time, stops, rating, distance, brand
   3. Sort: cheapest, fastest, best value in points
   4. Compare two side by side
   5. "Show me more" and "something different"
   6. Nothing found: closest dates, nearby places, or set an alert
3. **Paying**
   1. All points, if the balance covers it
   2. Points plus card, with a slider and the split shown live
   3. All card: the bank card on file, or another card
   4. Not enough points: show the gap, offer the split, or buy points where the bank allows it
   5. Verify: Face ID, then OTP if the bank asks
   6. Payment fails: say why in plain words, keep the basket, offer another way
   7. Price changed before paying: show old and new, ask again
4. **Review and confirm**
   1. One sheet: item, people, dates, rules, total
   2. Terms in one line, full terms behind a link
   3. Cancel and change rules in plain words, before paying
5. **Done**
   1. Confirmation card with booking code
   2. Pass: boarding pass, ticket QR, voucher code or order number
   3. Add to Apple or Google Wallet
   4. Add to calendar
   5. Share with the people on the booking
   6. Receipt and points earned
6. **Change**
   1. Change date, time or person
   2. Show the difference in points and cash before agreeing
   3. Add extras after booking: seat, bag, meal, upgrade
7. **Cancel and refund**
   1. What you get back, before you cancel: points, cash, fee
   2. Full or part cancel: one person, one night, one item
   3. Refund tracker: requested, approved, back on card or points
8. **Something went wrong**
   1. Delay, cancellation or no-show by the merchant
      1. Agent messages first with the fix: rebook, refund or claim
      2. Compensation claim where the law gives one (UK, EU flight rules)
   2. Wrong item, damaged, didn't arrive
   3. Talk to a person: hand over with the full story, so the customer never repeats it

## The card and money

The card leads the app and is what the bank buys, so these flows come before every partner service. Each runs only where the bank has switched on the matching connection.

### Card controls

1. **Freeze and unfreeze**
2. **Lost or stolen**: block, order a new card, digital card for use now
3. **Limits**: spending limit, online, contactless, abroad, cash
4. **Travel**: countries and dates, so the card isn't blocked
5. **PIN**: view or reset
6. **Card details**: number, expiry, CVV behind Face ID; add to Wallet

### Spending and statements

1. **What did I spend**: by category, merchant, month, as pictures
2. **Statement**: amount due, minimum, due date; download PDF
3. **Pay the bill**: full, minimum or custom, from the bank account, schedule it
4. **Split a big purchase into monthly payments**: plan options, cost, confirm

### Disputes

1. **I don't recognise this**: show merchant details first, then raise a dispute
2. **Charged twice, wrong amount, refund not received**
3. **Fraud**: block the card at once, list recent charges to mark, new card
4. **Track**: raised, temporary credit, resolved

### Card benefits

1. **What I get**: lounges, insurance, purchase protection, warranty, offers, with what's left this year
2. **Use one**: lounge pass, claim, activate an offer
3. **Upgrade the card**: compare, apply, decision

### Points

1. **Balance**: total, expiring soon, earned this month, where it came from
2. **Transfer to partners**: airline or hotel programme, rate shown, membership number, amount, confirm
3. **Use against a card purchase**: pick a past transaction, pay it off with points
4. **Send to family**: pool or gift points where allowed
5. **Expiry**: warning 30 days ahead with ideas to use them
6. **Missing points**: pick the transaction, raise a claim, track it

### Investments and savings

1. **Points into gold, funds or savings** where licensed: amount, risk note, partner name, confirm
2. **Track**: value, history, sell or withdraw

### Charity

1. **Give points**: cause, amount, what it pays for
2. **Receipt** for tax where the country allows it

### Concierge

1. **Anything else**: the request goes to a human team with the full context
2. **Track**: accepted, options sent, booked; options come back as the same cards as every other flow

## Travel

Travel is the deepest category, and flights alone carry the most branches. Each service below lists its flows, then sub-flows, then the branches inside them.

### Flights

1. **Book**
   1. Trip type: one way, return, multi-city
   2. Search: from, to, dates, people, cabin
      1. Flexible dates: cheapest-day calendar
      2. "Anywhere warm in March": destination ideas with prices
      3. Nearby airports: London (all), Dubai plus Sharjah
   3. Results: best pick, then list, with filters for stops, times, airline, bags included
   4. Fare choice: Light, Standard, Flex, each with bags, seat, change and refund rules side by side
   5. Return leg: pick the way back with its own fares
   6. Travellers: shared sub-flow, plus passport and frequent-flyer numbers
   7. Seats: seat map per leg and per person
      1. Free, paid, extra legroom, exit row (with its rules)
      2. Sit together: auto-place a family
      3. Skip: the airline assigns at check-in
   8. Bags: cabin and hold per person per leg, weight shown
   9. Extras: meals, priority boarding, lounge, fast track, insurance, airport transfer
   10. Review, pay, done: boarding pass appears once check-in opens
2. **Pay with miles instead**: transfer points to an airline programme, then book an award seat
3. **Check in**
   1. Reminder when check-in opens
   2. One-tap check-in for everyone on the booking
   3. Boarding pass to Wallet
   4. Passport or visa check fails: say what's missing
4. **Change**
   1. New date or time: fare difference shown first
   2. Change name spelling
   3. Add seat, bag, meal or upgrade after booking
   4. Upgrade with points: cabin bid or fixed price
5. **Cancel**: refund amount, travel credit or nothing, shown before cancelling; part-cancel one traveller
6. **Day of travel**
   1. Gate, terminal and boarding time on the trip card
   2. Gate change or delay: alert with the new time
   3. Lounge access at this airport: card benefit or pay
7. **Disruption**
   1. Cancelled: rebook on the next flight, or refund
   2. Delayed over 3 hours: compensation claim (UK and EU rules)
   3. Missed connection: protected rebook
   4. Lost bag: report and track
8. **Watch**: fare alert on a route, price drop after booking, seat opens up

### Stays

1. **Book**
   1. Search: where, dates, rooms, guests (child ages)
   2. Results: best pick, list, map view, filters for price, rating, pool, breakfast, free cancellation
   3. Hotel detail: photos, amenities, location, reviews summary
   4. Room choice: room type, bed, view, with or without breakfast, refundable or not
   5. Guest details and special requests: early check-in, late check-out, cot, accessible room
   6. Review, pay, done: voucher and hotel address card
2. **Change**: dates, room type, add a night, add breakfast
3. **Cancel**: free until a date, or the fee shown
4. **During the stay**: directions, late check-out request, hotel phone, add a spa or dinner
5. **Problem**: room not as booked, overbooked hotel, refund claim
6. **Package**: hotel plus flight in one basket, one payment

### Trains and buses

1. **Book**: from, to, date and time, people, railcards
   1. Single, return or open return
   2. Class and seat reservation
   3. Split ticketing where cheaper (UK)
2. **Ticket**: mobile ticket QR in Wallet
3. **Change or refund**: before departure; delay repay after
4. **Disruption**: platform change, delay, cancelled train with next options

### Rides and transfers

1. **Now**: pickup (current location), drop, ride type, fare in points and cash, driver card with live map
2. **Later**: schedule an airport pickup tied to the flight; waits if the flight is late
3. **Chauffeur**: hourly hire, card benefit where included
4. **Problem**: driver no-show, wrong fare, lost item

### Car hire

1. **Book**: pick-up and drop-off place and time, car type, driver age, extras (child seat, extra driver), cover options
2. **Change, cancel, extend**
3. **At pick-up**: documents checklist, booking code

### Airport

1. **Lounge**: by airport and terminal; free visits from the card or pay with points; QR to enter
2. **Fast track security**
3. **Meet and greet**: arrival or departure, names, flight number, porter
4. **Airport transfer**: links to Rides
5. **Problem**: lounge full, service no-show, refund

### Visa

1. **Check**: do I need a visa for this trip, from passport and destination
2. **Apply**: form questions one at a time, documents upload, fee, appointment where needed
3. **Track**: submitted, in review, approved, refused

### eSIM

1. **Buy**: country or region, data size, days, price
2. **Install**: one-tap install, QR fallback
3. **Top up and check usage**

### Travel insurance

1. **Buy**: single trip or yearly, who is covered, cover level side by side; card cover shown first so nobody pays twice
2. **Claim**: what happened, receipts upload, track the claim

## Going out

This is where Muse stops short: it shows live seats, then sends people to Ticketmaster to pay. Gratifi finishes the purchase in chat, with the ticket in the thread.

### Concerts, sports and shows

1. **Find**
   1. By artist, team, show or venue
   2. "What's on this weekend": picks by taste and city
   3. Card presale and member-only access shown first
   4. Tour dates across cities, with travel offered for away shows
2. **Book**
   1. Date and venue
   2. Seat map: sections by price, then exact seats
      1. Best available for N people, seated together
      2. Standing or general admission: quantity only
      3. Accessible seats and companion seat
   3. Ticket type: standard, VIP package, hospitality, parking add-on
   4. Ticket limit per person shown before picking
   5. Names on tickets where the venue needs them
   6. Review, pay, done: ticket QR in the thread and in Wallet
3. **Queue and sold out**
   1. High-demand sale: hold the place in the queue, message when it's your turn
   2. Sold out: watch for resale or new dates, alert when seats appear
4. **Before the event**: reminder, doors time, directions, bag rules, ride home booked
5. **Change**: transfer tickets to a friend, resell through the official exchange
6. **Cancelled or moved event**: refund or keep for the new date

### Cinema

1. **Book**
   1. Film, then cinema and time, or cinema first then what's showing
   2. Format: standard, IMAX, 3D, recliner
   3. Seat map and number of seats
   4. Snacks bundle
   5. Review, pay, done: ticket QR
2. **Card offers**: buy one get one, free popcorn, member price
3. **Change or cancel** where the cinema allows it

### Dining

1. **Book a table**
   1. Restaurant, date, time, people
   2. No slot at that time: nearest times, waitlist, or similar places nearby
   3. Seating: inside, outside, counter, private room
   4. Notes: birthday, allergies (passed to the restaurant, not stored), high chair
   5. Deposit or card hold where the restaurant asks
   6. Done: booking card with map
2. **Find**: by cuisine, area, occasion, card dining offer
3. **Change or cancel**: time, people, cancel before the deadline
4. **On the night**: running late message, pay the bill with points
5. **Hard-to-get tables**: watch for a release, alert the moment it opens

### Experiences

1. **Find**: by city and kind (tours, classes, spa, adventure, kids)
2. **Book**
   1. Date and time slot
   2. Option: group or private, language, duration
   3. Tickets by age band
   4. Pickup point where included
   5. Review, pay, done: voucher QR and meeting point
3. **Change or cancel**: free until a cutoff
4. **Weather or operator cancels**: rebook or refund

## Shopping

Shopping flows are shorter but branch more after the sale: delivery, returns, warranties.

### Products

1. **Find**
   1. By product ("noise-cancelling headphones under 30,000 points")
   2. By need or person ("gift for my dad who cycles")
   3. Compare two or three side by side
2. **Buy**
   1. Options: size, colour, storage, quantity
   2. Stock and delivery date to my address
   3. Delivery address: saved, new, or to someone else as a gift
      1. Gift wrap and message
      2. Hide the price on the gift slip
   4. Delivery speed: standard, express, store pickup
   5. Add-ons: extended warranty (card benefit shown first), setup
   6. Basket: several items in one checkout
   7. Review, pay, done: order number and delivery date
3. **Track**: dispatched, out for delivery, delivered; reschedule or redirect
4. **Return**
   1. Within the window: reason, pickup or drop-off, refund to points or card
   2. Exchange for another size or colour
   3. Outside the window: card purchase protection claim
5. **Problem**: late, damaged, missing item, wrong item
6. **Watch**: price drop alert, back in stock

### Groceries

1. **Shop**
   1. Say a list or a recipe; the agent fills the basket
   2. Swap or remove items, change quantities
   3. Reorder last week's shop
2. **Delivery**: slot choice, 10-minute delivery where available, address
3. **Substitutions**: allow, pick a replacement, or refund if out of stock
4. **Pay, track, rate**
5. **Problem**: missing or damaged item, refund

### Gift cards

1. **Buy**
   1. Brand, amount, quantity
   2. For me or for someone: name, message, send now or on a date
   3. Delivery: in-app code, email or message
2. **Use**: code and PIN in Wallet, balance check
3. **Problem**: code not working, resend

### Subscriptions

1. **Start**: service and plan, monthly or yearly, paid with points or card; free months from card benefits shown first
2. **Manage**: change plan, pause, cancel
3. **Audit**: list every subscription on the card, price changes, ones not used; cancel in one tap
4. **Renewal reminder** before each charge

## The components each flow needs

Of the 36 chat components these flows need, 13 are built, 6 are partly built and 17 are missing. Most of the missing ones sit in the Details and Manage steps, which is why flows stop halfway. Every new one is drawn only from the approved 27 Sept design language and goes to Amit for sign-off before any flow uses it.

| Component | Used by | Status |
| --- | --- | --- |
| Results list with best pick | Every search | Built |
| Tile grid | Gift cards, shopping | Built |
| Offer rows | Subscriptions, airport, insurance, eSIM | Built |
| Detail card | Every item | Built |
| Option chips | Times, sizes, fares, return dates | Built |
| Count chips | Bags, tickets, guests | Built |
| Date calendar | Flights, stays, events | Built |
| Flight seat map | Flights | Built |
| Fare table | Flights | Built |
| Review sheet with OTP | Every payment | Built |
| Confirmation card | Every booking | Built |
| Pass with QR | Boarding passes, tickets, vouchers | Built |
| Booking card with actions | Every booking after purchase | Built |
| Tracker | Refunds, claims, orders | Partly built |
| Points and card payment, with split slider | Every payment | Partly built |
| Time-slot picker | Dining, experiences, showtimes, delivery slots | Partly built |
| Basket | Shopping, groceries | Partly built |
| Dispute with transaction picker | Card | Partly built |
| Document upload | Visa, claims, disputes | Partly built |
| Trip type and route form | Flights, trains | Missing |
| Traveller picker and add-person form | Flights, stays, trains, events | Missing |
| Passport and ID details | International flights, visa | Missing |
| Extras picker (tick several) | Flights, stays, cinema snacks, car hire | Missing |
| Compare side by side | Flights, stays, products, insurance | Missing |
| Map view | Stays, dining, rides, experiences | Missing |
| Room picker | Stays | Missing |
| Venue seat map (section, then seats) | Concerts, sports, theatre, cinema | Missing |
| Queue and waiting card | Big ticket sales, hard-to-get tables | Missing |
| Showtimes grid | Cinema | Missing |
| Product options (size, colour, storage) | Shopping | Missing |
| Address and gift message | Shopping, gift cards | Missing |
| Live ride card with driver and map | Rides, transfers | Missing |
| Check-in card | Flights | Missing |
| Live trip timeline (gate, delays) | Flights, trains | Missing |
| Instalment plan picker | Card | Missing |
| Subscriptions list with cancel | Subscriptions | Missing |

Partly built means: the split slider is missing from payment; time slots are plain chips; the basket works for groceries only; disputes and instalments go to a person today instead of finishing in chat; document upload covers claims only.

## Coverage tracker

The target is 100%: every service below runs end to end inside the chat, in all 7 markets, with tests passing. A row moves to Done only when every flow and branch listed above for that service works on the live link.

| Service | Flows to finish | Coverage |
| --- | --- | --- |
| Card controls | Freeze; where it works (domestic, international, travel notices); how you pay (online, in store, contactless, cash, phone wallets); limits (monthly, each payment, daily by channel at home and abroad, by category); spending blocks (gambling, crypto, money transfers, premium-rate lines, adult); payment alerts (every payment, large payments, declined); lost or stolen, PIN, card details | Done end to end |
| Spending and statements | 4: spending, statement, pay the bill, monthly payments | Done end to end |
| Disputes | 4: don't recognise it, charged wrong, fraud, track | Done end to end |
| Card benefits | 3: what I get, use one, upgrade the card | Done end to end |
| Points | 6: balance, transfer, pay off a purchase, send to family, expiry, missing points | Done end to end |
| Investments and savings | 2: buy, track | Done end to end |
| Charity | 2: give, receipt | Done end to end |
| Shared sub-flows | 8: who's going, choosing, paying, review, done, change, cancel and refund, something went wrong | Done end to end |
| Flights | 8: book, pay with miles, check in, change, cancel, day of travel, disruption, watch | In progress |
| Stays | 6: book, change, cancel, during the stay, problem, package | Done end to end |
| Trains and buses | 4: book, ticket, change or refund, disruption | Done end to end |
| Rides and transfers | 4: now, later, chauffeur, problem | Done end to end |
| Car hire | 3: book; change, cancel or extend; at pick-up | Done end to end |
| Airport | 5: lounge, fast track, meet and greet, transfer, problem | Done end to end |
| Visa | 3: check, apply, track | Done end to end |
| eSIM | 3: buy, install, top up | Done end to end |
| Travel insurance | 2: buy, claim | Done end to end |
| Concerts, sports and shows | 6: find, book, queue and sold out, before the event, transfer or resell, cancelled event | Done end to end |
| Cinema | 3: book, card offers, change or cancel | Done end to end |
| Dining | 5: book, find, change or cancel, on the night, hard-to-get tables | Done end to end |
| Experiences | 4: find, book, change or cancel, operator cancels | Done end to end |
| Products | 6: find, buy, track, return, problem, watch | Done end to end |
| Groceries | 5: shop, delivery, substitutions, pay and track, problem | Done end to end |
| Gift cards | 3: buy, use, problem | Done end to end |
| Subscriptions | 4: start, manage, audit, renewal reminder | Done end to end |
| Concierge | 2: request, track | Done end to end |
| Alerts across everything | 1: watch and message first | Done end to end |

## Build order

The bank and the card come first, because that is what a bank buys. Rewards come second, and partner services such as flights come last. Each step ends with all seven markets passing their tests, Arabic included.

1. **Component sheet for sign-off.** The missing and unfinished components, drawn in the approved style. Nothing goes into a flow until Amit approves it.
2. **The card, end to end.** Pay the bill, Direct Debit, statements, transactions, freeze and controls, limits, card details and PIN, lost or stolen with a new card, activation, phone wallet, travel notices, credit limit, disputes and fraud, finished inside the chat. Instalments and balance transfers move from "goes to a person" to finished in the chat where the bank has the connection.
3. **Care and alerts.** Customers in difficulty, suspicious payments, bill reminders, declined payments.
4. **Rewards that drive card spend.** Points, expiry, card offers, challenges, transfers, grow and give.
5. **Partner services.** Flights (started 2 Oct), stays, dining, experiences, events and cinema, shopping, groceries, gift cards, subscriptions, rides, rail, car hire, airport, visa, eSIM, insurance.
6. **Watch and alerts across everything.**

## Sources

- [PhocusWire: Meta launches AI agent with travel booking](https://www.phocuswire.com/news/technology/meta-launches-ai-agent-travel-booking)
- [Deep Arrival: Meta Muse opens US travel booking on 500 Duffel airlines](https://deeparrival.com/news/meta-muse-agent-books-travel-september-2026/)
- [AI Musicpreneur: Ticketmaster joins Meta's Muse](https://www.aimusicpreneur.com/ai-music-news/meta-muse-ai-agent-ticketmaster-live-event-discovery/)
- [Skift: a viral AI bot showed travel what frictionless means](https://skift.com/2026/09/04/a-viral-ai-bot-just-showed-travel-what-frictionless-actually-means/)
- [Vellum: Instinct breakdown](https://www.vellum.ai/blog/official-instinct-breakdown)
