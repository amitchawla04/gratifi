# The master inventory: everything R360 and Gratifi sell, run or service for a bank's customers.
# Sources: "Commerce in chat" doc (18 categories, project inventory), "Gratifi AI-first app" sitemap (12 bank areas),
# R360 product lines (Open Rewards, TripSure, PHANTOM, Airport VIP, iRewards 2.0, Piingle, new-age rewards, ZERO, CACHE, R360 core).
# (item_id, category_no, category, item, what it covers, supply / where it comes from, live status as last recorded)

CATS = [
 ('C01', 'Flights'), ('C02', 'Stays'), ('C03', 'Airport and travel privileges'), ('C04', 'Ground transport'),
 ('C05', 'Experiences'), ('C06', 'Dining'), ('C07', 'Quick commerce and grocery'), ('C08', 'Shopping'),
 ('C09', 'Gift cards'), ('C10', 'Subscriptions and digital'), ('C11', 'Entertainment tickets'), ('C12', 'Points and miles'),
 ('C13', 'Investments and savings'), ('C14', 'Charity'), ('C15', 'Travel documents'), ('C16', 'Concierge'),
 ('C17', 'Bank entitlements and rewards'), ('C18', 'Everyday bank servicing'), ('C19', 'Engagement and moments'),
]

I = [
 # C01 Flights
 ('FL-01', 'C01', 'One-way and return flights', 'Search, compare, book', 'TripSure, PHANTOM (TBO, TripJack, MistyFly), Kiwi.com and Expedia MCPs', 'In build'),
 ('FL-02', 'C01', 'Multi-city, open jaw, groups', 'Complex itineraries', 'Same as FL-01', 'In build'),
 ('FL-03', 'C01', 'Award seats and upgrades', 'Points for seats and cabins', 'Bank programmes, airline partners', 'To source'),
 ('FL-04', 'C01', 'Seats, bags, meals, assistance', 'Ancillaries', 'Supplier APIs', 'In build'),
 ('FL-05', 'C01', 'Changes and cancellations', 'Manage booking', 'Supplier APIs, fare rules', 'In build'),
 ('FL-06', 'C01', 'Check-in and day of travel', 'Boarding pass, status, gate', 'Airline feeds', 'In build'),
 ('FL-07', 'C01', 'Disruption and compensation', 'Delays, cancellations, claims', 'Airline feeds, local rules', 'In build'),
 ('FL-08', 'C01', 'Payment, refunds and invoices', 'Points, card, refunds, tax invoices', 'R360 core, bank', 'In build'),
 # C02 Stays
 ('ST-01', 'C02', 'Hotels', 'Search, compare, book rooms', 'TripSure 2.5M+ hotels, HotelBeds, WebBeds, Expedia MCP', 'Hotels-first launch'),
 ('ST-02', 'C02', 'Apartments and villas', 'Longer and group stays', 'Suppliers to confirm', 'To source'),
 ('ST-03', 'C02', 'Resorts and packages', 'Stay plus flights or extras', 'TripSure, partners', 'To source'),
 ('ST-04', 'C02', 'Changes and cancellations', 'Dates, rooms, guests, refunds', 'Supplier rules', 'In build'),
 ('ST-05', 'C02', 'During the stay', 'Check-in, requests, problems at the property', 'Hotel partners, concierge', 'To build'),
 ('ST-06', 'C02', 'Member rates and hotel loyalty', 'Bank rates, hotel programme numbers', 'Bank, hotel programmes', 'To source'),
 # C03 Airport and travel privileges
 ('AP-01', 'C03', 'Meet and greet', 'Arrival and departure assistance', 'Airport VIP (22 airports)', 'Build package done'),
 ('AP-02', 'C03', 'Fast track', 'Security and immigration fast track', 'Airport VIP', 'Build package done'),
 ('AP-03', 'C03', 'Lounges', 'Card lounge visits and paid passes', 'Airport VIP, bank programmes', 'Build package done'),
 ('AP-04', 'C03', 'Airport transfers and porters', 'Buggy, porter, transfer between terminals', 'Airport VIP', 'Build package done'),
 ('AP-05', 'C03', 'Other airport services', 'Sleep pods, spa, baggage wrap, storage and the rest of the 44-service catalogue', 'Airport VIP', 'Build package done'),
 ('AP-06', 'C03', 'Service exceptions', 'No-show agent, flight change, wrong terminal (the 15 exception protocols)', 'Airport VIP', 'Build package done'),
 # C04 Ground transport
 ('GT-01', 'C04', 'Cabs and rides', 'On-demand rides in town', 'Uber MCP, partners', 'MCP priority'),
 ('GT-02', 'C04', 'Airport rides', 'Rides timed to flights', 'Uber MCP, Airport VIP', 'MCP priority'),
 ('GT-03', 'C04', 'Rail', 'Train tickets', 'Partners to confirm', 'To source'),
 ('GT-04', 'C04', 'Car hire', 'Self-drive rental', 'Partners to confirm', 'To source'),
 ('GT-05', 'C04', 'Chauffeur', 'Pre-booked cars with driver', 'Partners, concierge', 'To source'),
 # C05 Experiences
 ('EX-01', 'C05', 'Attractions and theme parks', 'Tickets with dates and time slots', 'Viator, TripAdvisor MCPs', 'MCP priority'),
 ('EX-02', 'C05', 'Tours and day trips', 'Guided tours, excursions', 'Viator, TripAdvisor', 'MCP priority'),
 ('EX-03', 'C05', 'Global experiences', 'Curated experiences priced in points', 'iRewards Global Experiences', 'Live (ICICI)'),
 ('EX-04', 'C05', 'Classes and workshops', 'Cooking, sport, creative classes', 'Partners', 'To source'),
 ('EX-05', 'C05', 'Wellness and spa', 'Spa, fitness, wellness bookings', 'Partners', 'To source'),
 # C06 Dining
 ('DN-01', 'C06', 'Table bookings', 'Reserve a table', 'Resy MCP, partner restaurants', 'MCP priority'),
 ('DN-02', 'C06', 'Set menus and chef\'s tables', 'Prepaid dining experiences', 'Partners', 'To source'),
 ('DN-03', 'C06', 'Dining offers and card benefits', 'Discounts, complimentary items, programmes', 'Bank, partners', 'Live in some banks'),
 ('DN-04', 'C06', 'Waitlists and hard-to-get tables', 'Waitlist, release alerts, concierge', 'Resy, concierge', 'To build'),
 # C07 Quick commerce
 ('QC-01', 'C07', '10-minute delivery', 'Hyperlocal instant delivery', 'iRewards hyperlocal, Instamart-type partners', 'Live (ICICI)'),
 ('QC-02', 'C07', 'Groceries', 'Scheduled grocery orders', 'Instacart MCP, partners', 'MCP priority'),
 ('QC-03', 'C07', 'Food delivery', 'Restaurant delivery', 'Swiggy MCP', 'Parked; documented for when live'),
 # C08 Shopping
 ('SH-01', 'C08', 'Electronics', 'Phones, laptops, audio', 'R360 catalogue, Shopify brands, eBay', 'Live'),
 ('SH-02', 'C08', 'Fashion and beauty', 'Clothing, shoes, beauty', 'R360 catalogue, Shopify brands', 'Live'),
 ('SH-03', 'C08', 'Home and kitchen', 'Appliances, homeware', 'R360 catalogue', 'Live'),
 ('SH-04', 'C08', 'Points catalogue', 'R360 product marketplace priced in points', 'R360 core, iRewards marketplace', 'Live'),
 ('SH-05', 'C08', 'Brand shops with extra points', 'Shop on the brand\'s own site with accelerated points (CACHE)', 'CACHE brand channel', 'Live'),
 ('SH-06', 'C08', 'Brand stores through MCP', 'Order in chat from a brand\'s own tools; R360 pays the merchant', 'Open Rewards (Shopify, eBay MCPs)', 'Prototype'),
 ('SH-07', 'C08', 'Delivery, returns and warranty', 'Track, return, replace, repair', 'R360 fulfilment, brands', 'Live'),
 # C09 Gift cards
 ('GC-01', 'C09', 'Brand gift cards', 'Buy with points or card', 'Piingle, R360 catalogue', 'Live'),
 ('GC-02', 'C09', 'E-vouchers from points', 'Instant vouchers for spending elsewhere', 'R360 catalogue', 'Live'),
 ('GC-03', 'C09', 'Gifting to others', 'Send a card to someone', 'Piingle', 'Tech ready'),
 ('GC-04', 'C09', 'Balance, expiry and use', 'Check, top up, redeem, expiry', 'Piingle, brands', 'Tech ready'),
 ('GC-05', 'C09', 'Stored value and bulk', 'Multi-brand and stored-value cards, bulk for business', 'Piingle', 'Relaunch being shaped'),
 # C10 Subscriptions
 ('SB-01', 'C10', 'Streaming video', 'Video subscriptions', 'iRewards subscriptions', 'Live (ICICI)'),
 ('SB-02', 'C10', 'Music and audio', 'Music, podcasts, audiobooks', 'iRewards subscriptions', 'Live (ICICI)'),
 ('SB-03', 'C10', 'Apps and software', 'Productivity, fitness, learning apps', 'Partners', 'To source'),
 ('SB-04', 'C10', 'News and magazines', 'Digital news and magazines', 'Partners', 'To source'),
 ('SB-05', 'C10', 'Card-linked subscription benefits', 'Subscriptions included with the card', 'Bank', 'Depends on card'),
 ('SB-06', 'C10', 'Renew, pause and cancel', 'Manage any subscription bought through Gratifi', 'Partners', 'To build'),
 # C11 Entertainment
 ('ET-01', 'C11', 'Cinema', 'Film tickets, offers', 'Partners', 'To source'),
 ('ET-02', 'C11', 'Concerts and presales', 'Live music, presale access', 'Partners, bank programmes', 'To source'),
 ('ET-03', 'C11', 'Sport', 'Match and event tickets', 'Partners', 'To source'),
 ('ET-04', 'C11', 'Theatre and festivals', 'Shows, festivals', 'Partners', 'To source'),
 ('ET-05', 'C11', 'Bank entertainment programmes', 'Programmes such as Barclaycard Entertainment', 'Bank', 'Depends on bank'),
 # C12 Points and miles
 ('PM-01', 'C12', 'Transfer to airline programmes', 'Move points to miles', 'Bank programmes', 'Depends on bank'),
 ('PM-02', 'C12', 'Transfer to hotel programmes', 'Move points to hotel points', 'Bank programmes', 'Depends on bank'),
 ('PM-03', 'C12', 'Earning and balance', 'What I have, how I earn, what it\'s worth', 'Bank ledger', 'Live'),
 ('PM-04', 'C12', 'Expiry, tiers and status', 'Expiring points, tier progress', 'Bank', 'Live'),
 ('PM-05', 'C12', 'Buy, gift or pool points', 'Top up, share with family', 'Bank', 'Depends on bank'),
 ('PM-06', 'C12', 'Milestones and bonus campaigns', 'Spend targets, bonus offers', 'iRewards milestone campaigns, bank', 'Live (ICICI)'),
 ('PM-07', 'C12', 'Points against the bill', 'Statement credit or cashback from points', 'Bank', 'Depends on bank'),
 # C13 Investments
 ('IV-01', 'C13', 'Digital gold', 'Points into gold', 'New-age rewards', 'Idea; regulation to study'),
 ('IV-02', 'C13', 'Shares', 'Points into shares', 'New-age rewards', 'Idea; regulation to study'),
 ('IV-03', 'C13', 'Funds', 'Points into mutual funds or unit trusts', 'New-age rewards', 'Idea; regulation to study'),
 ('IV-04', 'C13', 'Savings top-up', 'Points into a savings or deposit account', 'Bank', 'Idea'),
 # C14 Charity
 ('CH-01', 'C14', 'Donate points', 'Give points to a charity', 'Partners', 'To source'),
 ('CH-02', 'C14', 'Donate cashback or round-ups', 'Give money back or round-ups', 'Partners, bank', 'To source'),
 ('CH-03', 'C14', 'Receipts and tax relief', 'Donation receipts, Gift Aid and local equivalents', 'Partners', 'To source'),
 # C15 Travel documents
 ('TD-01', 'C15', 'Visas', 'Check, apply, track', 'TripSure visa', 'In development'),
 ('TD-02', 'C15', 'Forex card and currency', 'Travel money', 'Partners, bank', 'To source'),
 ('TD-03', 'C15', 'Travel insurance', 'Cover for a trip', 'Partners, bank cover', 'To source'),
 ('TD-04', 'C15', 'eSIM and roaming', 'Data abroad', 'Partners', 'To source'),
 ('TD-05', 'C15', 'Passport and document reminders', 'Expiry and validity checks', 'Gratifi', 'To build'),
 # C16 Concierge
 ('CO-01', 'C16', 'Hard-to-get tables', 'Restaurants that are full', 'PHANTOM, Quintessentially', 'Console built'),
 ('CO-02', 'C16', 'Gifts and sourcing', 'Find and deliver a gift or rare item', 'PHANTOM, Quintessentially', 'Console built'),
 ('CO-03', 'C16', 'Events and access', 'Sold-out events, private access', 'PHANTOM, Quintessentially', 'Console built'),
 ('CO-04', 'C16', 'Bespoke trip planning', 'Complex or luxury trips', 'PHANTOM', 'Console built'),
 ('CO-05', 'C16', 'Errands and home', 'Everyday help where offered', 'Partners', 'Depends on card'),
 # C17 Bank entitlements and rewards
 ('BE-01', 'C17', 'Everything with my card', 'The full list of benefits and what\'s left', 'Gratifi entitlement catalogue', 'Concept live'),
 ('BE-02', 'C17', 'Purchase protection and warranty', 'Cover on things bought with the card', 'Bank', 'Depends on card'),
 ('BE-03', 'C17', 'Getting money back', 'Section 75, chargeback and local equivalents', 'Bank, local law', 'Live'),
 ('BE-04', 'C17', 'Insurance and cover', 'Travel, device, other cover with the card', 'Bank', 'Depends on card'),
 ('BE-05', 'C17', 'Cashback and rewards programmes', 'Avios, cashback, partner programmes', 'Bank', 'Live'),
 ('BE-06', 'C17', 'Card-linked offers', 'Add offers, earn when you spend', 'Bank, R360', 'Live'),
 ('BE-07', 'C17', 'Know your rights', 'Plain-words rights for this card and market', 'Bank, local law', 'To build'),
 # C18 Everyday bank servicing
 ('BS-01', 'C18', 'Front door and settings', 'Ways in, what Gratifi remembers, settings, card switching', 'Gratifi', 'Concept live'),
 ('BS-02', 'C18', 'Money today', 'Balance, what\'s due, pay, automatic payments, payment date, credit balance', 'Bank', 'Concept live'),
 ('BS-03', 'C18', 'Spending and statements', 'Transactions, one payment, statements, search', 'Bank', 'Concept live'),
 ('BS-04', 'C18', 'Card and security', 'Controls, lost or stolen, approvals, fraud and scams, extra cardholders', 'Bank', 'Concept live'),
 ('BS-05', 'C18', 'Credit', 'Limit, transfers, instalment plans, rates and fees, paying down, credit score', 'Bank', 'Concept live'),
 ('BS-06', 'C18', 'Using the card abroad', 'Before, during and after travel: fees, blocks, cash', 'Bank', 'Concept live'),
 ('BS-07', 'C18', 'Help and care', 'A person, money worries, customers who need more care, bereavement, accessibility, complaints, closing', 'Bank', 'Concept live'),
 ('BS-08', 'C18', 'Business tools', 'Employee cards, controls, expenses, business benefits', 'Bank', 'Concept live'),
 # C19 Engagement
 ('EN-01', 'C19', 'Proactive moments', 'The right thing for this person, here, now (ZERO ranker)', 'ZERO, Gratifi', 'In build'),
 ('EN-02', 'C19', 'Notifications and alerts', 'Push, alerts, quiet hours, consent', 'Gratifi, bank', 'Concept live'),
 ('EN-03', 'C19', 'Challenges and streaks', 'Spend or behaviour challenges with rewards', 'Gratifi, bank', 'To build'),
 ('EN-04', 'C19', 'Onboarding and first reward', 'First use, first redemption', 'Gratifi', 'To build'),
 ('EN-05', 'C19', 'Referrals', 'Refer a friend rewards', 'Bank', 'Depends on bank'),
 ('EN-06', 'C19', 'Feedback and preferences', 'Ratings, likes, what not to show', 'Gratifi', 'To build'),
]
