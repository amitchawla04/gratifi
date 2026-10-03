# Gratifi — Product Doc

Sep 27, 2026 · @Amit Chawla

Gratifi (working name) is a white-label personal assistant for every customer of a brand, built as an expert in loyalty, rewards, deals, offers and privileges. Think of Muse, the personal AI agent Meta launched in the US in September 2026: it knows the person, watches for what matters to them and gets things done for them, asking before anything sensitive. We're building that same experience for customer engagement. An enterprise puts its own brand on it, plugs it into its apps, and every one of its customers has their own assistant straight away. It runs on the company's own business: its products, its rewards, its program structure and its data. The customer sees the brand's world, not ours. R360's content (our catalogue, travel, experiences, delivery and cash payouts) sits on top as an add-on the brand can switch on whenever it wants more to offer.

A brand that wants a proper engagement program today has to buy software, stitch it into its systems, hire a team to run it, and wait months to go live. We give it a platform it owns, on its own brand, live in days: a personal assistant for every member, and AI agents that do the day-to-day work of a loyalty team. When it wants more to offer members, it switches on our content, built on 17 years of buying, delivering and paying out rewards across India, the Gulf and Singapore.

Our main markets are the UK, the EU and South-East Asia, with India and the Gulf where R360 already has relationships. We'll sell first to companies launching or rebuilding a program, brands that reward the people who sell for them, and big programs whose members have gone quiet.

## What we need from the team

Please read the whole doc, then answer the question for your area as a comment on the section it's about. Anyone can also flag something we've got wrong or a target we've missed.

| Owner | Please check | The question we need answered |
| --- | --- | --- |
| CTO | The intelligence layer, the 7-day build, the product stack | Can we build the assistant, the intelligence layer and the guard agent in seven days, and which parts of our current systems can we reuse? |
| Product lead | Playbooks, go-live steps, targets | Which two playbooks do we build first, and are the 7-day and 2-to-3-week targets realistic? |
| CFO | How we make money | What should the platform fees be, what margin do we need on the content and payout add-ons, and how big should a brand's deposit be? |
| Head of sales, India | Who we sell to first, and the Deal scores tab | Which of the India targets do we already know someone at? Add the warm-introduction points |
| Head of growth, International | Gulf and Singapore targets | Which Gulf and Singapore targets do we already know? And which content-only deals should R360's content team pick up? |
| Head of legal | Rules we must follow | What's missing for each market, especially gift card rules, tax on partner rewards and privacy? |
| Head of risk | Fraud checks and agent spend limits | What limits and checks must be in place before the first pilot goes live? |

## Terms used in this doc

- **Platform:** The white-label product itself. It carries the brand's name, lives inside the brand's apps, and runs on the brand's products, rewards, rules and data.
- **Assistant:** Each member's own AI assistant, in the brand's name. It knows their points, tier, offers, deals and privileges, remembers what they like, and acts for them once they say yes. This is the member agent, one for every member.
- **Intelligence layer:** What every answer passes through before a member sees it. It pulls in live facts and the brand's rules, picks the best move, checks it and only then answers or acts. The AI model sits inside it and never answers alone.
- **Module:** A piece a brand switches on: a data connector, a program feature like tiers or scan and claim, a place members meet the assistant, or an R360 add-on. The full catalogue is in Company data map.
- **Content add-on:** R360's catalogue, travel, experiences, delivery and cash payouts. A brand switches it on inside the platform when it wants more to offer.
- **Playbook:** A ready-made program for one audience, say electricians, with the rules, screens and messaging already built.
- **Agents:** There are six. The setup agent designs a program and launches it. The run agent manages offers day to day and wins back members who've gone quiet. The member agent is each member's assistant: it talks with them on WhatsApp or in-app, in their own language, and acts for them. The guard agent approves every action that spends points or moves money, and catches fraud. The insight agent answers the brand's questions on demand. The switch agent migrates members and points from a brand's old vendor.
- **Control room:** Where the brand's loyalty and finance teams, and our program team, approve what the agents propose, set spend limits, track results and roll back actions.
- **Active member:** Anyone who earned or spent points at least once in the calendar month. Opening a message doesn't count.

## What the member gets

Every member gets an assistant built to know the program as well as the brand's best loyalty manager, and works only for them. It lives in the brand's app and on WhatsApp, speaks their language, and does five things.

1. **Knows everything about their membership.** Points, tier, what's about to expire, and which offers, deals and privileges apply to them right now, across every program the brand runs.
2. **Speaks up before it matters.** Points about to expire, a target nearly hit, a price drop on something they saved, a payout that's landed. It works in the background and only speaks when there's something worth saying.
3. **Does it for them.** Redeems, books a hotel with points, claims missing points, reorders, cashes out to their bank, raises a complaint and follows it up. It asks before it spends a single point or rupee.
4. **Remembers.** Their usual order, the trip they're planning, what they don't want to hear about. They can see what it remembers and wipe any of it.
5. **Leaves the member in charge.** Every action is logged where the member can see it, and the brand's control room can reverse any of it.

| Member | Moment | What the assistant does |
| --- | --- | --- |
| An electrician, for a cable brand | Scans three packs on a job | Credits the points, tells him he's one scan from his monthly slab, and asks "Send ₹150 to your bank?" Pays out on a yes. In Hindi, on WhatsApp |
| A shopkeeper, for a drinks brand | Mid-month | "Twelve more cases hits your target. Place the order?" Places it through the brand's ordering system and tracks the bonus |
| A shopper, for a grocery chain | Points expire in 30 days | Suggests using them on this week's usual basket, or saving for a movie night. Applies them at checkout on a yes |
| A member of a Gulf airline program | Planning a trip home to India | Finds a hotel her miles cover, books it through R360 travel once she approves, and sends the confirmation |
| A rider, for a food delivery app | Evening shift | "One more shift finishes your weekend streak." Tracks it and pays the bonus to his bank |

These are illustrative. Company data map has a line like this for each of the 99 companies we scored.

## How it's built: the same shape as Meta's Muse

We're copying Muse's architecture and pointing it at one job: customer engagement. Here's each part of Muse and our version of it ([Meta](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/), [TechCrunch](https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/)).

| Part | How Muse does it | How we do it |
| --- | --- | --- |
| A private space for each person | Each person's agent runs on its own isolated cloud computer | Each member's assistant runs in its own walled-off space. One brand's data never reaches another brand's assistant |
| A gatekeeper | The Sentinel agent: nothing Muse does reaches the internet unless it approves | The guard agent: nothing spends points, moves money or leaves the platform unless it approves. It also stops fake scans, bots and point drain |
| Real actions | Shopping, filling in forms, booking travel | Redeeming, booking with points, claiming missing points, reordering, cashing out |
| Works in the background | Keeps working after the app is closed, and comes back when it needs approval | Watches expiries, targets, offers and payouts, and comes back when it needs a yes |
| Memory | Remembers what matters and suggests things unprompted; the person can tell it to forget | Remembers each member's preferences and history; the member can see it and wipe it |
| Safety | Asks before sensitive actions; full audit trail; fine-grained permissions | Asks before spending anything; every action logged; the brand sets spend limits in the control room |
| Plug-ins | A connector platform for developers; more than 1,500 applied to build on it in under a week | The module catalogue: ready-made connectors for 14 kinds of brand data, plus a kit for the brand's developers and partners to add their own |
| Commerce built in | Partners such as Stripe, Shopify, PayPal and Walmart | R360 content built in (catalogue, travel, experiences, cash payouts, delivery), plus the brand's own partners |
| Where people use it | The Muse app, WhatsApp and the web, with Meta's AI glasses coming | The brand's app, WhatsApp and web. Rewards are also published so outside AI shopping assistants can see them |
| The brain | Meta's own model, Muse Spark | A leading model, swapped as better ones arrive. It never answers alone: everything passes through our intelligence layer |
| Who pays | Free for most use, with paid plans on top | Free to members. The brand pays the platform fee, and we earn on content and payouts |

The one big difference: Muse works for a person across the whole internet. Ours works for a member inside one brand's world, under that brand's name, and the brand stays in control.

## The intelligence layer

We don't train our own model. The leading models are already smart enough, and we'd never beat them in a week. What makes the assistant an expert is the layer every answer passes through before a member sees it. It pulls in the member's live facts and the brand's rules at the moment of asking (retrieval, often called RAG), picks the best move, checks it, and only then answers or acts.

&#91;embedded content: the intelligence layer · 4 steps and a learning loop\]

| Step | What happens | What it draws on |
| --- | --- | --- |
| 1. Know | Pulls the member's live balance, tier, orders, offers and memory, plus the brand's rules and catalogue, at the moment of asking | The points ledger, the brand's connectors, the rulebook, R360's catalogue |
| 2. Decide | Picks the best answer or next step for this member, inside the limits the brand set | The decision engine, and our playbook knowledge of what works in each kind of program |
| 3. Check | The guard agent checks the rules for that market, the spend limits, fraud signals and the brand's tone. Every number is checked against the ledger | The market rule packs, spend limits, fraud rules |
| 4. Act | Answers, or uses a tool to redeem, book, claim or pay out, once the member says yes. Every action is logged | Tools connected to the ledger, the add-ons and the brand's systems |
| 5. Learn | What the member did next goes back into the decision engine | Results from every conversation |

Three rules hold whatever the model does:

1. The assistant never states a balance, price or date it didn't read from a live system.
2. It never spends a point or a rupee without the member's yes and the guard agent's approval.
3. No change ships until it passes the test set: a few hundred real member requests, from "what's my balance" to "my payout never arrived", with the right answer for each. We start writing it on day 1.

The model can be swapped without changing any of this, so we can move to a better one the week it launches.

### What the AI decides, and what it never decides

One rule splits the whole product. **Anything that is a fact, moves value or carries legal weight is deterministic:** it comes from the ledger or the rules engine, and it's the same answer every time. **Anything that is language, judgement or taste can be probabilistic:** the AI handles it, inside limits the deterministic side sets.

**Deterministic: set by systems and rules, and the AI only reads it out**

| What | Where it comes from |
| --- | --- |
| Points balance, points earned, expiry dates | The points ledger |
| Tier, and what's needed for the next one | The rules engine |
| Whether a member qualifies for an offer | The rules engine |
| The price of any reward in points | The catalogue and the brand's point value |
| Whether a redemption, booking or payout went through, and the amount | The ledger and the add-on systems |
| Tax worked out and deducted | The tax rules for that market |
| Order, delivery and refund status | The delivery system |
| KYC and consent status | The brand's records |
| Terms, conditions and any legal wording | Approved text, used word for word |
| Fraud decisions and spend limits | The guard agent's rules and the brand's limits |
| What the law allows in each market (no gifts to doctors, the 10% tax on partner rewards, gift card rules) | The rule pack for that market |

**Probabilistic: where the AI is allowed to use judgement**

| What | The limit around it |
| --- | --- |
| Understanding what the member means, in any language | If it isn't sure, it asks rather than guesses |
| How a reply is worded, and its tone | The brand's voice; every fact in it comes from the table above |
| Which offer or reward to suggest | Chosen only from the list the rules engine says the member qualifies for |
| When to speak up, and how often | Within the brand's message limits and the member's consent |
| Explaining a rule in plain words | The rule itself is quoted from the rule pack |
| Reading a bill or receipt photo | Only credited when the numbers pass checks; otherwise the member is asked or a person reviews it |
| Remembering what a member likes | The member can see it and wipe it; it never changes a balance or eligibility |
| Drafting playbooks and answering staff questions | A person approves before anything goes live |

Where the two meet, the order never changes: the AI proposes, the deterministic side checks, and only then does anything happen. If a system can't be reached, the assistant says it can't check right now. It never fills the gap with a guess.

## Modules a brand can add

A brand builds its program from modules, the way someone sets up a phone: connect its data, switch on the features it wants, choose where members meet the assistant, and add R360 content if it wants more to offer. The guard agent checks each module against that market's rules before it goes live, and the brand can switch any of it off from the control room.

| Group | What's in it |
| --- | --- |
| Connect their data | 14 ready-made connectors: customer and CRM, store sales, online and app orders, app activity, trade systems, pack codes and bills, payments and wallet, bookings and travel, policies and health (with consent), workforce operations, telecom usage and billing, vehicles and service, an existing program's ledger, and the product catalogue |
| Program modules | Points and tiers, personal offers and deals, privileges and perks, paid membership, referrals, challenges and streaks, scan and claim, partner earn and burn, wellness rewards |
| Where members meet it | In-app assistant, WhatsApp assistant, web, and a feed for AI shopping assistants |
| R360 content | Rewards catalogue, travel, experiences, cash payouts, delivery |
| Always on | The six agents, the control room, the audit trail, and member memory with a forget control |

We mapped all 99 companies in Deal scores against this catalogue in Company data map. 96 of them need an assistant. Of the other three, Al-Futtaim already runs its own, and Tawuniya and Grab are tied to a partner or build in-house. After the assistant, the modules most needed are the rewards catalogue (50 companies), experiences (36) and points and tiers (33). That's why phase 1 builds the assistant, the guard agent, the points engine and the first two playbooks, with the content and payout add-ons live from day one. Every other module arrives as brands ask for it.

## Why we're building it this way

Seven things we learned in the research shaped this product. The details are in the other tabs.

| What we learned | So we decided |
| --- | --- |
| The biggest reward budgets aren't for shoppers. They go to the people who sell or recommend a brand. In India, rewards for dealers and tradespeople alone are estimated at [₹26,800 crore a year](https://www.storyboard18.com/brand-makers/indias-rs-26800-crore-channel-loyalty-market-sees-engagement-fatigue-report-91804.htm). That estimate comes from a supplier in the market | We serve every group a company rewards, not just its shoppers |
| Many of our best targets already have a program, like Etihad Guest, e& Smiles, KrisFlyer and Zillion. What they lack is good things for members to spend points on | The platform runs on whatever rewards they already have. Our content is an add-on they switch on when they want more |
| Shopkeepers and tradespeople want cash, and they want it on WhatsApp. Payouts straight to bank accounts are up 60%. More than 70% want to redeem on WhatsApp, and 78% prefer vouchers they can use at many brands ([Almonds report](https://almonds.ai/channel-loyalty-report-2026/)) | Members choose cash or a reward. WhatsApp and local languages come first |
| New programs often launch with very little to offer. Akasa hasn't published what its points buy, ADCOOP only gives discounts, and Cenomi has two partners | The content add-on can be switched on from the first day |
| Fraud and tax can make or break a program. AI shopping agents are now draining points quickly ([TrustSphere](https://www.trustsphere.ai/post/autonomous-shopping-agents-are-turning-loyalty-and-rewards-programmes-into-a-soft-target-in-2026)), and India takes 10% tax on rewards to business partners above ₹20,000 a year | Fraud checks and tax are built in from the start |
| Many target brands already run their program with another supplier, and they won't rebuild from scratch | Moving to us has to be easy. We aim to move members and points across in a day |
| Of the 99 companies we mapped, 96 need an assistant for their members, and only Al-Futtaim already runs one | Every member gets their own assistant from day one, built the way Meta built Muse |

## Who it's for

Any company that uses rewards to change what people do. One system handles all seven groups below, so a brand can reward its shoppers and its shopkeepers from the same place.

| Who gets rewarded | Example companies | What the company wants | What the person wants | Where we reach them |
| --- | --- | --- | --- | --- |
| Shoppers and app users | Lulu, Zepto, McDonald's India | Buy again, use the app | Points, vouchers, experiences | App, web, WhatsApp, AI shopping assistants |
| Shopkeepers and dealers | Coca-Cola India, HUL, Udaan | Stock and sell more | Cash to bank, multi-brand vouchers, store credit | WhatsApp, the brand's ordering app |
| Tradespeople who recommend (electricians, painters, mechanics, farm shops) | Polycab, Birla Opus, UPL, Mahindra | Recommend and use the brand | Cash to bank, vouchers, insurance | WhatsApp, a code scanned from the pack |
| Agents and sales staff | LIC, Emaar brokers, phone-shop promoters | Sell more | Trips, cash, recognition | App, WhatsApp |
| Riders and drivers | Swiggy, Rapido, Urban Company | Stay on and work the busy hours | Cash bonuses, insurance, vouchers | Driver app |
| Policyholders and patients | Aditya Birla Health, Sukoon, Healthy 365 | Stay healthy, renew | Premium back, wellness vouchers | Insurer or health app |
| Members of an existing program | Etihad Guest, e& Smiles, KrisFlyer | Give members more to spend points on | A bigger, better reward shop | Their own app, with our catalogue inside |

## Where the white space is

Here's what a company runs into today when it wants a proper rewards program. It waits 3 to 18 months to go live. It has to find rewards and delivery separately. And whatever it builds needs a team to run it every day. That's the white space.

Five things customers can't get today, and we can give them:

1. **Live in days, not months.** Setting up a program today takes 3 to 18 months ([Brandmovers](https://blog.brandmovers.com/how-to-launch-a-loyalty-program-in-90-days)). A business with stores, an app, shopkeepers and partners should be live in days.
2. **Their brand, their business.** The platform carries the company's name and runs on its own products, rewards, structure and data. Nothing gets replaced, and the customer never sees us.
3. **More to offer, when they want it.** Most platforms stop at software. With us, a brand can switch on a world of content (rewards, travel, experiences, delivery, cash payouts) across India, the Gulf and Singapore, without signing up anyone new.
4. **An assistant for every member, not just tools for the marketer.** Today's AI helps marketers build campaigns faster. Almost no one gives each member their own assistant that knows their points, finds the best use for them, and redeems, books or cashes out on a yes, on WhatsApp in their own language. Of the 99 companies we mapped, only Al-Futtaim runs anything like it.
5. **Rewards that AI shopping assistants can see.** When ChatGPT or Gemini shops for someone, it can't see a brand's points or offers unless they're set up for it ([Talon.One](https://www.talon.one/blog/agentic-commerce)). Gap already sells inside Gemini, but its points aren't there ([Gap Inc.](https://www.gapinc.com/en-us/articles/2026/03/gap-inc-elevates-online-shopping-with-ai-powered-f)).

## What we sell

The platform is the product. A company either launches a new program on it or moves an existing program onto it. Content and payouts are add-ons it switches on as it needs them.

|  | Platform: new program | Platform: existing program | Content add-on | Payout add-on |
| --- | --- | --- | --- | --- |
| What they get | A complete program on their brand: an assistant for every member, points engine, screens inside their apps, agents, control room | Our engine, assistant and agents take over their current program. Members and points move across | R360's catalogue, travel and experiences, priced in the brand's own points, with delivery handled | Cash to bank for members, with tax worked out |
| Who it's for | Companies starting or rebuilding a program | Programs whose members have gone quiet | Any platform customer that wants more to offer | Shopkeeper and tradesperson programs |
| Examples from our list | Vi ("Vi Stars"), Polycab ("Polyratna"), Udaan, Cenomi | McDonald's India (3.7M monthly users from 55M downloads), Coca-Cola India, Shoppers Stop, Sukoon | Akasa Air, IKEA India, ADCOOP | Polycab, UPL, Coca-Cola India |
| What they give us | Customer list, sales, rewards, and the app or WhatsApp number | Members, sales, points, rewards, and permission to message members | Nothing extra; it's switched on inside the platform | Members' bank details, collected by the platform |
| Target time to go live | About 7 days | 2 to 3 weeks | Same day | Same day |
| How we earn | A setup fee and a monthly fee for each active member | A monthly fee for each active member | Our margin on each reward | A fee on each payout |
| Ready from | Day 7, with the design partner | Week 12, once the switch agent is built | Day 7, on the platform | Day 7, on the platform |

Programs that only want our content, like Etihad Guest, e& Smiles and KrisFlyer, can buy it from R360's content team on its own. Those deals are good business, but they don't count as platform customers.

## The product stack

The stack has eight layers, with a control room across all of them. Each member's assistant sits near the top, and the guard agent stands between it and anything that spends points or moves money. The brand brings only the bottom layer, its own systems.

&#91;embedded content: product stack · 8 layers and a control room\]

Several pieces of the stack come straight out of the research:

- **Cash to bank sits next to vouchers.** Shopkeepers and tradespeople prefer cash, and payouts by bank transfer are up 60%.
- **WhatsApp comes first.** For shopkeepers and tradespeople it's the main way in, and it works in their own language.
- **Pack codes, bill uploads and distributor systems are part of the Connectors layer.** That's how shopkeepers and mechanics earn points.
- **The core engine handles tax.** Neither the member nor the brand has to work it out.
- **The insight agent** lets a brand ask "which dealers went quiet this month?" and get a straight answer instead of a dashboard.
- **The switch agent** moves members and points across from an old supplier, ideally in a day, so changing to us is easy.

## Ready-made playbooks

Playbooks are what make us fast. Each one arrives with its rules, screens, messages, fraud checks and legal wording for each market already done. The setup agent picks one and adjusts it for the brand.

| Playbook | Who gets rewarded | How they earn | What they get | First targets |
| --- | --- | --- | --- | --- |
| Shopper club | Shoppers, app users | Buying, app visits, referrals | Points, vouchers, experiences | Zepto, McDonald's India, Lulu |
| Paid membership | Members paying monthly | They pay a monthly fee and get perks worth more than it | Partner perks, cashback | Careem Plus, Zepto Club, talabat pro |
| Shopkeeper rewards | Shopkeepers, dealers | Orders, sales targets, displays | Cash to bank, multi-brand vouchers, store credit | Coca-Cola India, HUL, Udaan, Jumbotail |
| Tradesperson rewards | Electricians, painters, mechanics, farm shops | Scanning codes in packs they use or sell | Cash to bank, vouchers, insurance | Polycab, UPL, Birla Opus, Mahindra |
| Pack scan-to-earn | Buyers of packaged goods | Scanning a pack code or uploading a bill | Vouchers, prize draws, brand products | Nestlé, P&G, Mondelez in India (none run one for shoppers yet) |
| Wellness rewards | Policyholders, residents | Steps, check-ups, healthy habits | Premium back, wellness vouchers | Aditya Birla Health, Sukoon, Healthy 365 |
| Agent and broker rewards | Agents, brokers, shop promoters | Sales and targets | Trips, cash, recognition tiers | Emaar, LIC, phone-shop promoters |
| Rider and driver rewards | Riders, drivers, service partners | Busy-hour shifts, ratings, staying on | Cash bonuses, insurance, vouchers | Swiggy, Rapido, Urban Company |
| Content add-on only | Members of an existing program | Spending points they already have | Our catalogue inside their app | Etihad Guest, e& Smiles, KrisFlyer, Zillion |

## How a program goes live

For a full program, we're aiming to go live in about 7 days. Today it takes 3 to 18 months. Seven days is still a target, not a fact. The first three pilots have to prove it.

1. **Check the data (before signing).** Our agents spend a day looking at a sample of the brand's data. If it's too messy, we tell them straight away and quote for cleaning it up.
2. **Connect (day 1).** The brand gives us access to its customer list, sales data, and app or WhatsApp number. For shopkeepers and tradespeople we also connect the distributor system or the pack codes. If there's an old supplier, the switch agent moves members and points across.
3. **Set the goal and pick a playbook (day 1).** The brand tells us what it wants, for example "get electricians to scan 20% more packs this quarter." The setup agent drafts the rules, the rewards and what it's likely to cost.
4. **Choose modules and rewards (day 2).** The brand switches on the program modules and places members will meet the assistant, then picks its rewards: its own, ours, cash to bank, or a mix.
5. **Approve (days 2 to 3).** The brand reviews the program, the cost estimate, sample screens and messages, and how tax will work. A person signs off the legal terms.
6. **Test with a small group (days 3 to 5).** About 1% of members. The guard agent watches for fraud and unexpected costs.
7. **Go live (by day 7).** The run agent and every member's assistant take over, and the brand keeps an eye on things from the control room.

Moving an existing program onto the platform follows steps 1, 2, 3, 5, 6 and 7, and takes 2 to 3 weeks. The content and payout add-ons can be switched on at step 4 for any program.

## How we make money

Customers pay for the platform: a setup fee for a new program, and a monthly fee for each active member. Content and payouts are add-ons, charged only when they're used.

| What we charge | Who pays | Why it makes sense |
| --- | --- | --- |
| A one-time setup fee | New programs on the platform | Covers the data check and setting everything up |
| A monthly fee for each active member | Every platform customer | Brands pay only for members who earned or spent points that month, not for their whole list |
| Our margin on each reward | Brands using the content add-on | Grows as members redeem more |
| A fee on each cash payout | Brands using the payout add-on | Set so that a rupee paid out in cash earns us about the same as a voucher |
| A share of the extra sales (optional) | Brands that want our fee tied to what we deliver | Measured against a group of members who got no offers. Pampers Club measured it this way and saw 47% more sales ([Iris](https://discover.iris-northamerica.com/braze/pampers)) |

The CFO sets prices once we know what the first three pilots actually cost us.

## Who we sell to first

The UK and EU targets lead, from UK & EU targets (100 companies, scored the same way). The India, Gulf and South-East Asia targets below them come from our first research round.

In the first 90 days we sign three paying pilots for the platform and put them live by week 12. The scores come from Deal scores. They're out of 100, and a warm introduction adds up to 10 more.

| Group | What they buy | Top targets (score) | Owner |
| --- | --- | --- | --- |
| UK and EU: building or relaunching a program | Platform, new program | easyJet (100), Lufthansa Miles & More (93), British Gas (90), Toolstation (90), Aviva (90) | Head of growth, International |
| UK and EU: programs just cut or changed, members confused | Platform, existing program | Air France-KLM Flying Blue (93), Barclays (93), NatWest (93), Conad (93), Boots (83) | Head of growth, International |
| UK and EU: trade and telecom | Platform, new program | Screwfix (83), Vodafone UK (83), EE (83), Travis Perkins (80), Wickes (80) | Head of growth, International |
| India: companies launching or rebuilding a program | Platform, new program | Vi (83), Polycab (80), Udaan (73), Akasa Air (73) | Head of sales, India |
| India: big programs with quiet members | Platform, existing program | McDonald's India (83), Coca-Cola India (83), Shoppers Stop (73) | Head of sales, India |
| Gulf and Singapore: new or rebuilt programs | Platform, new or existing program | Tabby (76), Cenomi (73), Sukoon (73), Etiqa Singapore (73) | Head of growth, International |
| Programs that only want more content | Content add-on, sold on its own by R360's content team | Etihad Guest (83), e& Smiles (83), KrisFlyer (83), stc Qitaf (76), BonusLink (76) | Head of growth, International |

Other high scorers, like Lulu, Majid Al Futtaim, Zepto and ADNOC Distribution, have only just launched or changed their programs. We'll go to them once the first pilots give us proof. Before anyone picks up the phone, the sales team adds points for warm introductions, because knowing the person who decides matters more than anything else.

## Build plan

First we build it, in seven days. Then we prove it with paying pilots. Then we take it to more markets. No phase starts until we've passed the checkpoint before it.

&#91;embedded content: build plan · 4 phases, 3 gates\]

The build starts on Monday 28 September 2026 and runs for seven days. It covers each member's assistant, the intelligence layer, the guard agent, the points engine, white-label screens, access for outside AI agents and the first two playbooks. The content and payout add-ons plug in from the start because R360 already runs them. A small, separate team builds it, with its own budget and P&L owner, so the bank business isn't disturbed.

## The 7-day build

Every day has one owner. The CTO owns the build as a whole and reports every evening. The head of sales, India lines up a design-partner brand by day 1, so we build on real data. The first three paying pilots then go live on it within 12 weeks.

| Day | What gets built | Owner |
| --- | --- | --- |
| 1 (Mon 28 Sep) | Pick the model. Stand up the points ledger and the data connector, on the design partner's data or a realistic sample. Start the test set of member requests | CTO; product lead writes the test set |
| 2 | The intelligence layer: live retrieval from the ledger, offers, catalogue and the brand's rules, and member memory with a forget control | CTO |
| 3 | The assistant's tools: check balance, redeem, claim missing points, cash out, track orders. The guard agent, with spend limits | CTO; head of risk sets the limits |
| 4 | Where members meet it: WhatsApp and an in-app widget in the brand's name, in English, with more languages from week 2 | CTO |
| 5 | The first two playbooks, drafted from the brand's brief. The decision engine that picks each member's offer. AI bill reading. R360's catalogue priced in the brand's points | Product lead |
| 6 | Access for outside AI agents (balance and offers, read-only). A first control room with the full action log. Run the whole test set and fix what fails | CTO |
| 7 (Sun 4 Oct) | Try to break it: fraud, trick prompts, wrong balances. Check the rule pack for each market. Demo on real data, then Gate 1 sign-off | Head of risk, head of legal, CEO |

The bar for day 7 is simple: no wrong balance or payout anywhere in the test set. Anything that misses it comes out of the demo rather than going to a customer.

How the product works for the first pilots:

| Question | How it works |
| --- | --- |
| How the brand makes it its own | Its name, colours, logo and domain. Screens drop into the brand's app as a widget, or run as pages the brand links to |
| How members get in | Inside the brand's app, on the web, or on WhatsApp |
| How they sign in | The brand's app passes the member to us, so there is no second login. On WhatsApp, they get a one-time code on their phone |
| What the assistant does in phase 1 | Answers any question about points, tiers and offers; warns before points expire; redeems, claims missing points and cashes out once the member says yes; tracks every order and payout |
| What it remembers | The member's preferences and history, kept inside that brand's space. The member can see it and wipe it |
| What runs on the brand's own setup | Its products, rewards, tiers, rules and customer data. We replace nothing it already has |
| What a point is worth | The brand sets how points are earned and what they're worth |
| Content add-on | The brand switches on R360's catalogue, travel and experiences. Every item shows its price in the brand's own points, and we handle delivery |
| Payout add-on | Cash to members' bank accounts, with tax worked out and deducted where the law needs it |
| Who pays, and when | Platform fees monthly. Content and payouts draw from a deposit the brand keeps with us, with a monthly statement and a warning before it runs low |
| Failed or cancelled rewards | Points go back to the member automatically, and the member agent tells them |
| What the brand's team does | Connects its customer list, sales and rewards, and adds the widget to its app |
| Checks before launch | A 1% test group, fraud limits switched on, and the brand's finance team signs off |

## How we know it works

We track six numbers and show them to every brand in the control room. These are starting targets. The product lead tests them in the first three pilots and resets them afterwards.

| Number | What it means | Starting target |
| --- | --- | --- |
| Time to go live | From contract signed to members earning | 7 days for a new program, 2 to 3 weeks for an existing one |
| Active members | Share of members who earn or spend in a month. Today fewer than half are active in most programs ([5W](https://www.5wpr.com/research/loyalty-premium-2026/)) | Up 10 percentage points from where the brand started, within 90 days |
| Extra sales | Sales from members who got offers, against a group that got none | Positive, and reported every month |
| Quiet members won back | Members inactive 60+ days who come back | More than in the group that got no offers |
| Fraud caught | How much fraud we stop before any reward is paid out | Less than 1% of reward value lost |
| Answered by agents | Member questions solved without a person stepping in | 8 in 10 |

## Rules we must follow

The rules are built into the playbooks, so a brand can't break them by accident. The head of legal keeps a rule pack for each market and updates it whenever a rule changes.

| Rule | Where | What the product does |
| --- | --- | --- |
| 10% tax on rewards to business partners above ₹20,000 a year ([Almonds](https://almonds.ai/how-section-194r-is-killing-the-soul-of-loyalty-programs-in-india/)) | India | The engine calculates and deducts it, and the member agent explains it on WhatsApp |
| New draft rules for gift cards, April 2026 ([Vinod Kothari](https://vinodkothari.com/2026/04/rbis-draft-ppi-norms-stricter-cash-rules-simplified-categories-no-cross-border-payments-and-more/)) | India | Our vouchers will follow the final rules, and we won't count on income from unused balances |
| Possible cap on rewards to insurance agents ([Cafemutual](https://cafemutual.com/news/insurance/36511-u-turn-in-insurance-distribution-irdai-to-fix-agents-commission-and-reward-structure-again)) | India | The agent playbook keeps rewards inside the limit |
| No gifts to doctors ([Medical Dialogues](https://medicaldialogues.in/news/industry/pharma/ucpmp-2024-govt-details-stricter-rules-to-curb-gifts-incentives-from-pharma-to-doctors-153296)) | India | Pharma programs never reward doctors. Chemist programs are allowed |
| No promotion of infant formula ([LiveLaw](https://www.livelaw.in/articles/indias-legislative-shield-infant-formula-risks-lessons-abbott-case-266171)) | India | Pack scan-to-earn excludes infant formula |
| No liquor advertising to consumers | India | Alcohol brands only get trade programs |
| The competition regulator is investigating Pernod Ricard's deals that traded store support for shelf space, May 2026 ([Arise](https://www.arise.tv/india-orders-antitrust-probe-into-pernod-ricard-over-alleged-exclusive-retail-deals/)) | India | Alcohol trade programs go ahead only after legal review, and no reward is ever tied to shelf share |
| Data protection laws (UK GDPR, EU GDPR, India DPDP Act, UAE PDPL, Singapore PDPA) | All markets | We ask before messaging anyone, and members can see and delete their data |
| People must be told when they're talking to an AI (EU AI Act, Article 50, in force since 2 August 2026) | EU | The assistant says it's an AI at the start of every conversation, in fixed wording that the AI can't change |

## Risks, fixes and owners

The biggest risk is messy data at the brand's end, which would break our promise of going live in days. Every risk below has a fix and one person who owns it.

| Risk | Fix | Owner |
| --- | --- | --- |
| The 7-day build slips | Reuse R360's existing catalogue and payout systems. If needed, cut to one playbook and WhatsApp only; correct balances and the guard agent are never cut. The CTO reports every evening | CTO |
| The assistant tells a member something wrong | Every number comes from a live system, the guard agent checks every answer, and no change ships until the test set passes | CTO |
| The brand's data is messy, so we can't go live in days | Check the data for a day before signing. Brands that fail pay for the clean-up | CTO |
| Our 7-day and 2-to-3-week targets aren't proven yet | Test them in the first three pilots, share the real times and reset the targets | Product lead |
| Customers see us as a rewards supplier, not a platform | Lead every pitch with the platform running on the customer's own brand and business. Bring content in as an add-on, after | Head of sales, India |
| We have no non-bank references yet | Turn the first three pilots into case studies quickly. Until then, pitch our bank scale with one line: same fulfilment, different points currency | CEO |
| Sales promises agents before they're built | Promise only what phase 1 delivers. Demo only what's live | Head of sales, India |
| Shopkeepers and tradespeople want cash, not vouchers | Offer the payout add-on from day one, and set its fee so cash earns us about as much as a voucher | CFO |
| The brand already works with another supplier | Run the platform on top of the current setup first. When the brand is ready, the switch agent moves members and points across | Head of sales, India |
| The old supplier won't hand over member data | Members rejoin in one tap and get bonus points. The brand's own records fill the gaps | Head of sales, India |
| An agent makes an expensive mistake | Every agent action has a spend limit. The brand approves anything above it, and every action is logged and can be rolled back in one tap | CTO |
| Bots, AI agents and fake scans drain points | The guard agent is on from day one. Limit claims per code, per phone and per day, and check who is redeeming | Head of risk |
| Members don't trust an assistant with their points | It asks before spending anything, shows every action it took, and the brand can reverse any of it. Start with reminders, claims and payouts, then add bookings once members use it | Product lead |
| One brand's data shows up in another brand's assistant | Every brand, and every member's assistant, runs walled off. Nothing is shared across brands. An outside security test runs before the first pilot | CTO |
| Government and state-owned companies buy through tenders (BPCL, LIC, Healthy 365) | Set up a small tender team, bid with a partner where needed, and don't count on these in the first 90 days | Head of growth, International |
| A head office abroad makes the decision (IKEA, Bayer, Uber) | Pitch our market as the test. If it works, offer the same program for the Gulf and South-East Asia | Head of growth, International |
| Rules change (gift cards, agent rewards, tax, privacy) | Keep a rule pack for each market and review it every quarter | Head of legal |
| A brand runs up rewards it can't pay for | Show costs live, and hold a deposit for content and payouts | CFO |
| The project pulls R360's people away from bank work | Run it as a small, separate team with its own budget and P&L owner | CEO |

## Sources

The full research sits in the other tabs: UK & EU targets (100 UK and EU companies scored and mapped), Company data map (what each of the 99 runs today and the modules it would use), Where the money is (categories and budgets), Deal scores (99 companies scored), What we checked (what was searched), First 25 brands (the first list) and Competitive landscape (sales reference) (for sales only).

- [Storyboard18: India's dealer and tradesperson rewards, ₹26,800 crore](https://www.storyboard18.com/brand-makers/indias-rs-26800-crore-channel-loyalty-market-sees-engagement-fatigue-report-91804.htm)
- [Almonds Channel Loyalty Report 2026](https://almonds.ai/channel-loyalty-report-2026/)
- [Almonds: the 10% tax on partner rewards](https://almonds.ai/how-section-194r-is-killing-the-soul-of-loyalty-programs-in-india/)
- [Brandmovers: launch times by platform type](https://blog.brandmovers.com/how-to-launch-a-loyalty-program-in-90-days)
- [Talon.One: shopping done by AI agents](https://www.talon.one/blog/agentic-commerce)
- [Gap Inc.: selling inside Google Gemini](https://www.gapinc.com/en-us/articles/2026/03/gap-inc-elevates-online-shopping-with-ai-powered-f)
- [TrustSphere: AI agents and points fraud](https://www.trustsphere.ai/post/autonomous-shopping-agents-are-turning-loyalty-and-rewards-programmes-into-a-soft-target-in-2026)
- [5W: fewer than half of members active](https://www.5wpr.com/research/loyalty-premium-2026/)
- [Iris: Pampers Club results](https://discover.iris-northamerica.com/braze/pampers)
- [Vinod Kothari: draft gift card rules](https://vinodkothari.com/2026/04/rbis-draft-ppi-norms-stricter-cash-rules-simplified-categories-no-cross-border-payments-and-more/)
- [Cafemutual: insurance agent reward cap](https://cafemutual.com/news/insurance/36511-u-turn-in-insurance-distribution-irdai-to-fix-agents-commission-and-reward-structure-again)
- [Medical Dialogues: pharma gift rules](https://medicaldialogues.in/news/industry/pharma/ucpmp-2024-govt-details-stricter-rules-to-curb-gifts-incentives-from-pharma-to-doctors-153296)
- [LiveLaw: infant formula rules](https://www.livelaw.in/articles/indias-legislative-shield-infant-formula-risks-lessons-abbott-case-266171)

* [Arise: competition probe into Pernod Ricard](https://www.arise.tv/india-orders-antitrust-probe-into-pernod-ricard-over-alleged-exclusive-retail-deals/)
* [Meta: introducing Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)
* [TechCrunch: everything coming to Muse](https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/)
