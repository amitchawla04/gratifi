// Gratifi UI kit: window.Gratifi. Types are documentation.
import type { ReactNode } from "react";

/** The kit's 72 line icons, drawn on a 24px grid at a 1.9 stroke with round caps. */
export declare function Icon(props: { name: string; size?: number /* 20 */; stroke?: number /* 1.9 */; color?: string /* currentColor */; filled?: boolean; title?: string /* gives it role=img */ }): JSX.Element;
/** A grey line of short facts separated by dots: "Direct · 2h 35m · Cabin bag". */
export declare function Meta(props: { items: ReactNode[]; className?: string }): JSX.Element;
/** A price in cash, with the points alternative and an optional was price or note. */
export declare function Price(props: { amount: number; was?: number; points?: number; note?: string; size?: 'lg'; align?: 'left' | 'right' }): JSX.Element;
/** A small pill for one status or fact: Confirmed, 3 left, Best for you. */
export declare function Badge(props: { tone?: 'good' | 'warn' | 'danger' | 'accent' | 'ink'; icon?: string; children }): JSX.Element;
/** A coloured dot and a word for live state: On time, Delayed 35 min, Cancelled. */
export declare function Status(props: { tone?: 'good' | 'warn' | 'danger'; live?: boolean; children }): JSX.Element;
/** The orange "money back" chip with Gratifi's spark: "£9 back on your card". */
export declare function Back(props: { children }): JSX.Element;
/** A grey placeholder bar that shimmers while content loads. */
export declare function Skeleton(props: { w?: string | number; h?: number; r?: number }): JSX.Element;
/** The black pill and its family: primary, secondary, quiet, accent and ghost. */
export declare function Button(props: { variant?: 'primary' | 'secondary' | 'quiet' | 'accent' | 'ghost'; size?: 'sm' | 'lg'; block?: boolean; icon?: string; iconRight?: string; loading?: boolean; disabled?: boolean; onClick?: () => void; children }): JSX.Element;
/** A round 44px button with one icon: back, share, save, alerts. */
export declare function IconButton(props: { icon: string; label: string; dark?: boolean; flat?: boolean; small?: boolean; dot?: boolean; onClick?: () => void }): JSX.Element;
/** A row of tappable filters or choices; selected chips turn into black pills. */
export declare function Chips(props: { items: (string | {id, label, count?, icon?})[]; value?: string | string[]; multi?: boolean; wrap?: boolean; onChange?: (v) => void }): JSX.Element;
/** Two to four tabs in a pill track: Return / One way / Multi-city. */
export declare function Segmented(props: { items: string[]; value?: string; dark?: boolean; onChange?: (v: string) => void }): JSX.Element;
/** An on/off switch; on is orange. */
export declare function Toggle(props: { on?: boolean; label: string; onChange?: (v: boolean) => void }): JSX.Element;
/** Minus, a number, plus: for counts like travellers and bags. */
export declare function Stepper(props: { value?: number; min?: number; max?: number; label: string; onChange?: (v: number) => void }): JSX.Element;
/** The floating tab bar; the current tab becomes a black pill with its label. */
export declare function NavBar(props: { items?: {id, icon, label}[]; current?: string; onChange?: (id: string) => void }): JSX.Element;
/** A photo on white card at a slight tilt, with a handwritten caption. */
export declare function Polaroid(props: { src: string; caption?: string; tilt?: number /* -3 */; width?: number; clip?: boolean }): JSX.Element;
/** Gratifi's note, clipped on: a handwritten line, one sentence of why, one yes and a not now. */
export declare function StickyNote(props: { title: string; children?: ReactNode; tone?: 'yellow' | 'blue'; tilt?: number; action?: string; secondary?: string; onAction?; onSecondary?; from?: string; clip?: boolean; width?: number }): JSX.Element;
/** A reward or category collected like a postage stamp, with its name and value below. */
export declare function Stamp(props: { art?: string /* ART.stampPlane */; name?: string; value?: string; tilt?: number }): JSX.Element;
/** A die-cut sticker for one short fact: "5% back", "Last room". */
export declare function Sticker(props: { tone?: 'accent' | 'ink' | 'paper'; tilt?: number; icon?: string; children }): JSX.Element;
/** A saved trip as a folder: photos peek out, the plan sits on the front with what is still to book. */
export declare function TripFolder(props: { title: string; dates: string; photos?: string[]; items?: {icon, title, meta, done?}[]; people?: {name}[]; onOpen? }): JSX.Element;
/** The points balance in a black core, with orange ticks for progress to a goal. */
export declare function Dial(props: { value: number | string; label?: string; progress?: number /* 0 to 1 */; size?: number; goal?: string }): JSX.Element;
/** The orange check that pops once when something is done. */
export declare function CheckPop(props: { size?: number; animate?: boolean }): JSX.Element;
/** Overlapping initials for the people on a trip or gift. */
export declare function AvatarStack(props: { people: {name, src?}[]; max?: number }): JSX.Element;
/** The ask bar: type or tap the mic. Floats above the tab bar on every screen. */
export declare function AskBar(props: { placeholder?: string; value?: string; listening?: boolean; onSend?: (text: string) => void; onMic?: () => void }): JSX.Element;
/** What the customer said, right-aligned in the black pill. */
export declare function YouSaid(props: { children }): JSX.Element;
/** The quiet ticked lines that show what Gratifi checked to get an answer. */
export declare function Steps(props: { steps: string[]; running?: boolean }): JSX.Element;
/** Every Gratifi reply: steps, one answer line, the card that proves it, up to three next steps. */
export declare function Answer(props: { steps?: string[]; say: ReactNode; children?; actions?: {label, primary?, icon?, onClick?}[]; source?: string }): JSX.Element;
/** Three dots while Gratifi works, before steps start. */
export declare function Typing(props?: any): JSX.Element;
/** Next questions as chips the customer can tap instead of typing. */
export declare function Suggestions(props: { items: string[]; onPick?: (s: string) => void }): JSX.Element;
/** The assistant's proactive moment on home: a StickyNote with one action. */
export declare function Moment(props?: any): JSX.Element;
/** Handing over to a person: who, how long, and that they can see the conversation. */
export declare function Handoff(props: { name?: string; role?: string; wait?: string; onCall?; onChat? }): JSX.Element;
/** A short black confirmation at the bottom, with optional undo. */
export declare function Toast(props: { undo?: string; onUndo?; children }): JSX.Element;
/** A horizontal rail of cards that snaps, with a heading and See all. */
export declare function Rail(props: { title?: string; more?: string; onMore?; children }): JSX.Element;
/** A merchant offer the customer adds to their card: rate, brand, when it ends, Add. */
export declare function OfferCard(props: { brand: string; mono: string; color?: string; rate: string; sub?: string; why?: string; added?: boolean; onAdd? }): JSX.Element;
/** A product or voucher with image, price and points. */
export declare function ProductCard(props: { src: string; name: string; meta?: string[]; price: number; points?: number; badge?: string; back?: string }): JSX.Element;
/** Two or three options side by side; the best fit gets the orange column. */
export declare function Compare(props: { columns: string[]; rows: {label, values: (ReactNode | boolean)[]}[]; best?: number }): JSX.Element;
/** Sort first, then filter chips, on one scrolling line. */
export declare function FilterBar(props: { sort?: string; filters: string[] }): JSX.Element;
/** A month with the fare under each day; the chosen range in orange; lowest fares in green. */
export declare function PriceCalendar(props: { month?: string; startDow?: number; days?: number; prices?: Record<number, number>; low?: number[]; from?: number; to?: number; disabledBefore?: number; today?: number; onPick? }): JSX.Element;
/** Adults, children and infants with steppers; infants never outnumber adults. */
export declare function Travellers(props: { adults?: number; children?: number; infants?: number }): JSX.Element;
/** How to pay: points, points and card, or card. */
export declare function PayWith(props: { points?: number; cash?: number; rate?: number /* £ per point */; mix?: number; card?: string; value?: 'points' | 'mix' | 'card'; onChange? }): JSX.Element;
/** Slide between points and cash; both totals update as you move. */
export declare function PointsSlider(props: { total?: number; rate?: number; balance?: number; start?: number }): JSX.Element;
/** What the total is made of, with the total in bold. */
export declare function PriceLines(props: { lines: [string, string][]; total: [string, string]; note?: string }): JSX.Element;
/** The confirm step for anything that spends money or points: summary, lines, Face ID, done. */
export declare function ConfirmSheet(props: { title?: string; summary?: string; lines?; total?; cta?: string; state?: 'ready' | 'scanning' | 'done'; onConfirm? }): JSX.Element;
/** After it is done: the check, the reference, the facts, and what happens next. */
export declare function Receipt(props: { title?: string; reference?: string; lines?: [string, string][]; next?: string; actions?: string[] }): JSX.Element;
/** Pick people to share or gift to; orange rings mark who is chosen. */
export declare function SendTo(props: { people: {name, initials?, color?}[]; selected?: string[] }): JSX.Element;
/** One card for when things aren't as expected: price changed, sold out, can't reach, nothing found. */
export declare function StateCard(props: { kind?: 'price' | 'soldout' | 'error' | 'empty' | 'done'; title: string; body?; was?: string; now?: string; actions?: string[] }): JSX.Element;
/** The airline's two-letter mark on its colour. */
export declare function AirlineMark(props: { code?: string; size?: number }): JSX.Element;
/** One flight option: times and airports, duration and stops, the facts that decide, and the price. */
export declare function FlightCard(props: { airline?; number?; dep; arr; from; to; dur; stops?; via?; plusDays?; price; points?; tags?: string[]; bag?; back?; left?; best?; selected?; onSelect? }): JSX.Element;
/** The whole journey leg by leg, with layovers in between; a tight connection turns amber. */
export declare function Itinerary(props: { legs: {dep, arr, from, fromName, to, toName, airline, number, dur, cabin?, plane?}[]; layovers?: {text, short?}[] }): JSX.Element;
/** Fare families side by side; what is included is ticked, what isn't is greyed, never hidden. */
export declare function FareFamilies(props: { fares: {id, name, price, points?, items: [boolean, string][], pop?}[]; value?: string; onChange? }): JSX.Element;
/** A cabin section; orange is your pick, black is who you travel with, blue has extra legroom. */
export declare function SeatMap(props: { rows?; exitAfter?; taken?: string[]; extra?: number[]; mates?: string[]; picked?: string; extraPrice?: number; onPick? }): JSX.Element;
/** What bags are included, then what can be added, priced per person per flight. */
export declare function BagPicker(props: { bags?: {icon, name, sub, incl?, price?}[] }): JSX.Element;
/** The boarding pass: big airport codes, the four numbers people look for, and the code to scan. */
export declare function BoardingPass(props: { name?; airline?; number?; from?; fromCity?; to?; toCity?; date?; boards?; gate?; seat?; group?; dep? }): JSX.Element;
/** Live status: an arc for progress and three numbers for what changed. */
export declare function FlightTracker(props: { number?; from?; to?; status?; tone?: 'good' | 'warn' | 'danger'; progress?: number; dep?; depWas?; arr?; gate?; note? }): JSX.Element;
/** A cancelled or badly delayed flight: what happened, the options already worked out, what the customer may be owed. */
export declare function Disruption(props: { title?; body?; options?: {id, t, s, tag?}[]; owed?: string }): JSX.Element;
/** Change a booked flight: old against new, and the difference to pay. */
export declare function ChangeFlight(props: { was?: {day, time}; now?: {day, time}; fee?: number; diff?: number }): JSX.Element;
/** The fare's rules in plain words: green is free, amber costs, grey isn't possible. */
export declare function FareRules(props: { rules?: ['ok' | 'fee' | 'nope', string, string][] }): JSX.Element;
/** A stay: photo, name, area, rating, what's included, and the total price. */
export declare function HotelCard(props: { src; name; area; rating?; reviews?; price; points?; nights?; perks?: string[]; sticker?; back? }): JSX.Element;
/** A room to pick, with its size, bed, cancellation and total. */
export declare function RoomOption(props: { src; name; facts: string[]; price; cancel?; checked?; onPick? }): JSX.Element;
/** When money comes back if plans change, as dates on a line. */
export declare function Cancellation(props: { steps?: {tone, t, s}[] }): JSX.Element;
/** An experience or event with its time, length and price. */
export declare function ExperienceCard(props: { src; name; when?; meta?: string[]; price; points?; rating? }): JSX.Element;
/** A grid of times; full ones are struck through. */
export declare function TimeSlots(props: { slots?: [string, string][]; value?: string }): JSX.Element;
/** A gift card in the merchant's colour with its value and points. */
export declare function GiftCardTile(props: { brand?; amount?; color?; note? }): JSX.Element;
/** A ride choice with arrival time, seats and price. */
export declare function RideOption(props: { name?; eta?; seats?; price?; checked?; note?; onPick? }): JSX.Element;
/** An airport lounge pass with where, when and the code. */
export declare function LoungePass(props: { name?; where?; valid?; guests? }): JSX.Element;
/** What is due and when, with Pay now or Direct Debit. */
export declare function PaymentDue(props: { amount?; min?; date?; days?; autopay? }): JSX.Element;
/** A card transaction with merchant, facts, amount and points earned. */
export declare function TransactionRow(props: { mono; color?; ink?; name; meta?: string[]; amount: number; points?: number; refund?: boolean }): JSX.Element;
/** A card benefit as a row: what it is, the limit, what's left. */
export declare function BenefitRow(props: { icon?; name; sub; value?; onClick? }): JSX.Element;
/** An iPhone-sized frame: header, scrolling body, and the ask bar floating at the bottom. */
export declare function PhoneFrame(props: { title?; back?: boolean; right?; children; foot?; nav?: boolean; sheet?; time?; width? }): JSX.Element;
/** Home: greeting, the points dial and one moment from Gratifi. */
export declare function HomeScreen(props?: any): JSX.Element;
/** Flights end to end in seven screens: ask, dates, fare, seats and bags, pay, done, day of travel. Tabs switch between the six markets. */
export declare function FlightBookingJourney(props?: any): JSX.Element;
/** Disruption in four screens: delay heads-up, cancellation with options, rebooked, and price or seat changes mid-booking. Each market names its own compensation rule. */
export declare function DisruptionJourney(props?: any): JSX.Element;
/** Stays in four screens: choose from the conversation, room and cancellation, pay, done. */
export declare function HotelJourney(props?: any): JSX.Element;
/** Right-to-left check: the flight answer, calendar, seat map and payment in Arabic for the UAE. */
export declare function ArabicScreens(props?: any): JSX.Element;
/** The same blocks in every market: currency, number grouping, how payment is confirmed and the words all come from the market, never from the component. */
export declare function Markets(props: { market?: 'UK' | 'EU' | 'IN' | 'AE' | 'SG' | 'MY' | 'AR' | Market; children }): JSX.Element;

/** Icon names. */
export declare const ICONS: string[];
/** Gratifi's illustrations as data URIs: flight, lisbon, pool, room, food, car, cinema, jacket, torn, stampPlane, stampHotel, stampDining, stampGift, stampTicket, stampCar, stampBag, stampBalloon, stampMusic, stampTakeaway. */
export declare const ART: Record<string, string>;
/** The spark that marks what Gratifi said or added. */
export declare function Spark(props: { size?: number }): JSX.Element;
/** Fictional airlines used in the kit. */
export declare const AIRLINES: Record<string, { name: string; color: string }>;
/** Renders the states shown on each card. */
export declare const demos: Record<string, () => JSX.Element>;
