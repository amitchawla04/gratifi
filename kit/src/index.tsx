import * as B from './base'
import * as T from './talk'
import * as V from './travel'
import * as J from './journeys'
import { Icon, Spark, ICONS } from './icons'
import { ART } from './art'
import { demos } from './demos'
import { MarketProvider, MARKETS, useMarket, fmt } from './market'
import { STRINGS } from './strings'
import { DEMO } from './data'

const G: any = { ...B, ...T, ...V, ...J, Icon, Spark, ICONS, ART, demos, MarketProvider, MARKETS, useMarket, fmt, STRINGS, DEMO }
;(window as any).Gratifi = G
