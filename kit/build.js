(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/base.tsx
  var base_exports = {};
  __export(base_exports, {
    AvatarStack: () => AvatarStack,
    Back: () => Back,
    Badge: () => Badge,
    Button: () => Button,
    CheckPop: () => CheckPop,
    Chips: () => Chips,
    Dial: () => Dial,
    IconButton: () => IconButton,
    Label: () => Label,
    Meta: () => Meta,
    NavBar: () => NavBar,
    PaperClip: () => PaperClip,
    Polaroid: () => Polaroid,
    Price: () => Price,
    Segmented: () => Segmented,
    Skeleton: () => Skeleton,
    Stamp: () => Stamp,
    Status: () => Status,
    Stepper: () => Stepper,
    Sticker: () => Sticker,
    StickyNote: () => StickyNote,
    Toggle: () => Toggle,
    TripFolder: () => TripFolder
  });

  // src/r.ts
  var React = window.React;
  var { useState, useEffect, useRef, useMemo } = React;
  var cx = (...a) => a.filter(Boolean).join(" ");

  // src/strings.ts
  var STRINGS = {
    en: {
      ask: "Ask Gratifi anything",
      askLabel: "Ask Gratifi",
      listening: "Listening",
      stopListening: "Stop listening",
      speak: "Speak",
      send: "Send",
      working: "Gratifi is working",
      fromGratifi: "From Gratifi",
      yourNote: "Your note",
      chatNow: "Chat now",
      callMe: "Call me",
      handoffWho: "{name} from the {role}",
      handoffHas: "Already has this conversation",
      handoffNote: "You won\u2019t need to repeat anything. {name} can see what we\u2019ve covered.",
      add: "Add",
      added: "Added",
      yes: "Yes",
      no: "No",
      bestForYou: "Best for you",
      sort: "Sort",
      best: "Best",
      seeAll: "See all",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      nights: "{n} nights",
      pickReturn: "Pick your return day",
      cheapest: "Green marks the cheapest days",
      cheapestA11y: "cheapest",
      fromPrice: "from {p}",
      dow: "M,T,W,T,F,S,S",
      adults: "Adults",
      adultsSub: "12 and over",
      children: "Children",
      childrenSub: "2 to 11",
      infants: "Infants",
      infantsSub: "Under 2, on a lap",
      infantNote: "One infant per adult. Infants sit on your lap and fly for a reduced fare.",
      fewer: "Fewer {x}",
      more: "More {x}",
      points: "Points",
      pointsAndCard: "Points and card",
      card: "Card",
      payWith: "Pay with",
      ptsHave: "{pts} \xB7 you have {bal}",
      ptsShort: "{pts} \xB7 {n} more than you have",
      ptsPlus: "{pts} + {cash}",
      onCardEnding: "{cash} on card ending {card}",
      ptsN: "{n} pts",
      orPts: "or {n} pts",
      onYourCard: "On your card",
      youHave: "You have {bal} points",
      pointRate: "1 point = {v} on travel",
      pointsToUse: "Points to use",
      confirmPay: "Confirm and pay",
      payFaceId: "Pay with Face ID",
      payApp: "Approve in your banking app",
      checking: "Checking it\u2019s you\u2026",
      nothingPaid: "Nothing is paid until you confirm",
      booked: "Booked",
      close: "Close",
      otpSent: "Enter the 6-digit code sent to your phone ending {d}",
      otpResend: "Send a new code",
      otpDigit: "Digit {n}",
      confirmWithCode: "Confirm {amt}",
      appSent: "We\u2019ve sent a request to your banking app. Approve it there to finish.",
      sendTo: "Send to",
      chosen: "{n} chosen",
      done: "Done",
      direct: "Direct",
      stop1: "1 stop",
      stopsN: "{n} stops",
      leftAtPrice: "{n} left at this price",
      economy: "Economy",
      included: "Included",
      you: "You",
      extraLegroom: "Extra legroom {p}",
      free: "Free",
      seatA11y: "Seat {id}",
      taken: "taken",
      exit: "EXIT",
      smallBag: "Small bag",
      smallBagSub: "Fits under the seat",
      cabinBag: "Cabin bag",
      cabinBagSub: "Overhead, up to {kg}kg",
      checkedBag: "Checked bag",
      checkedBagSub: "Up to {kg}kg",
      removeX: "Remove {x}",
      addX: "Add {x}",
      boards: "Boards",
      gate: "Gate",
      seat: "Seat",
      group: "Group",
      passenger: "Passenger",
      boardingCode: "Boarding code",
      departs: "Departs",
      lands: "Lands",
      cancelled: "Cancelled",
      requestRefund: "Request refund",
      moveMe: "Move me to this flight",
      rebookingOptions: "Rebooking options",
      changeOutbound: "Change your outbound",
      bookedLabel: "Booked",
      newLabel: "New",
      changeFee: "Change fee",
      freeOnFare: "Free on your fare",
      fareDiff: "Fare difference",
      toPay: "To pay",
      changeFor: "Change for {p}",
      yourFare: "Your fare: {f}",
      ifPlansChange: "If your plans change",
      total: "total",
      nightsTaxes: "{n} nights, taxes in",
      save: "Save",
      saved: "Saved",
      full: "Full",
      seatsN: "{n} seats",
      loungePass: "Lounge pass",
      youPlus: "You + {n} guest",
      paymentDue: "Payment due",
      minBy: "Minimum {amt} by {date}",
      inDays: "In {n} days",
      payNow: "Pay now",
      setUp: "Set up {dd}",
      ddPays: "{dd} pays the full balance on {date}",
      home: "Home",
      rewards: "Rewards",
      trips: "Trips",
      me: "Me",
      main: "Main",
      alerts: "Alerts",
      back: "Back",
      moreL: "More",
      goodMorning: "Good morning",
      working2: "Working",
      finished: "Finished",
      nOfBooked: "{a} of {b} booked",
      toBook: "To book",
      standardFare: "Standard",
      appReady: "Tap below and we\u2019ll send a request to your banking app.",
      youGetBack: "You get back",
      confirmPts: "Confirm {pts}",
      inDays_one: "Tomorrow",
      youPlus_other: "You + {n} guests",
      nights_one: "1 night",
      stopsN_one: "1 stop"
    },
    ar: {
      ask: "\u0627\u0633\u0623\u0644 Gratifi \u0623\u064A \u0634\u064A\u0621",
      askLabel: "\u0627\u0633\u0623\u0644 Gratifi",
      listening: "\u0623\u0633\u062A\u0645\u0639 \u0625\u0644\u064A\u0643",
      stopListening: "\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0627\u0633\u062A\u0645\u0627\u0639",
      speak: "\u062A\u062D\u062F\u0651\u062B",
      send: "\u0625\u0631\u0633\u0627\u0644",
      working: "Gratifi \u064A\u0639\u0645\u0644 \u0639\u0644\u0649 \u0637\u0644\u0628\u0643",
      fromGratifi: "\u0645\u0646 Gratifi",
      yourNote: "\u0645\u0644\u0627\u062D\u0638\u062A\u0643",
      chatNow: "\u062F\u0631\u062F\u0634\u0629 \u0627\u0644\u0622\u0646",
      callMe: "\u0627\u062A\u0635\u0644\u0648\u0627 \u0628\u064A",
      handoffWho: "{name} \u0645\u0646 {role}",
      handoffHas: "\u0627\u0637\u0651\u0644\u0639 \u0639\u0644\u0649 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",
      handoffNote: "\u0644\u0646 \u062A\u062D\u062A\u0627\u062C \u0625\u0644\u0649 \u062A\u0643\u0631\u0627\u0631 \u0623\u064A \u0634\u064A\u0621. \u064A\u0631\u0649 {name} \u0643\u0644 \u0645\u0627 \u0646\u0627\u0642\u0634\u0646\u0627\u0647.",
      add: "\u0625\u0636\u0627\u0641\u0629",
      added: "\u0623\u064F\u0636\u064A\u0641",
      yes: "\u0646\u0639\u0645",
      no: "\u0644\u0627",
      bestForYou: "\u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u0643",
      sort: "\u062A\u0631\u062A\u064A\u0628",
      best: "\u0627\u0644\u0623\u0641\u0636\u0644",
      seeAll: "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",
      prevMonth: "\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0633\u0627\u0628\u0642",
      nextMonth: "\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u062A\u0627\u0644\u064A",
      nights: "{n} \u0644\u064A\u0627\u0644\u064D",
      pickReturn: "\u0627\u062E\u062A\u0631 \u064A\u0648\u0645 \u0627\u0644\u0639\u0648\u062F\u0629",
      cheapest: "\u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0644\u0623\u0631\u062E\u0635 \u0628\u0627\u0644\u0644\u0648\u0646 \u0627\u0644\u0623\u062E\u0636\u0631",
      cheapestA11y: "\u0627\u0644\u0623\u0631\u062E\u0635",
      fromPrice: "\u0645\u0646 {p}",
      dow: "\u0646,\u062B,\u0631,\u062E,\u062C,\u0633,\u062D",
      adults: "\u0627\u0644\u0628\u0627\u0644\u063A\u0648\u0646",
      adultsSub: "12 \u0633\u0646\u0629 \u0641\u0623\u0643\u062B\u0631",
      children: "\u0627\u0644\u0623\u0637\u0641\u0627\u0644",
      childrenSub: "\u0645\u0646 2 \u0625\u0644\u0649 11",
      infants: "\u0627\u0644\u0631\u0636\u0651\u0639",
      infantsSub: "\u0623\u0642\u0644 \u0645\u0646 \u0633\u0646\u062A\u064A\u0646\u060C \u0641\u064A \u0627\u0644\u062D\u0636\u0646",
      infantNote: "\u0631\u0636\u064A\u0639 \u0648\u0627\u062D\u062F \u0644\u0643\u0644 \u0628\u0627\u0644\u063A. \u064A\u062C\u0644\u0633 \u0627\u0644\u0631\u0636\u064A\u0639 \u0641\u064A \u062D\u0636\u0646\u0643 \u0628\u0633\u0639\u0631 \u0645\u062E\u0641\u0651\u0636.",
      fewer: "\u062A\u0642\u0644\u064A\u0644 {x}",
      more: "\u0632\u064A\u0627\u062F\u0629 {x}",
      points: "\u0627\u0644\u0646\u0642\u0627\u0637",
      pointsAndCard: "\u0646\u0642\u0627\u0637 \u0648\u0628\u0637\u0627\u0642\u0629",
      card: "\u0627\u0644\u0628\u0637\u0627\u0642\u0629",
      payWith: "\u0627\u0644\u062F\u0641\u0639 \u0639\u0628\u0631",
      ptsHave: "{pts} \xB7 \u0644\u062F\u064A\u0643 {bal}",
      ptsShort: "{pts} \xB7 \u064A\u0646\u0642\u0635\u0643 {n}",
      ptsPlus: "{pts} + {cash}",
      onCardEnding: "{cash} \u0639\u0644\u0649 \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u0646\u062A\u0647\u064A\u0629 \u0628\u0640 {card}",
      ptsN: "{n} \u0646\u0642\u0637\u0629",
      orPts: "\u0623\u0648 {n} \u0646\u0642\u0637\u0629",
      onYourCard: "\u0639\u0644\u0649 \u0628\u0637\u0627\u0642\u062A\u0643",
      youHave: "\u0644\u062F\u064A\u0643 {bal} \u0646\u0642\u0637\u0629",
      pointRate: "\u0627\u0644\u0646\u0642\u0637\u0629 = {v} \u0639\u0644\u0649 \u0627\u0644\u0633\u0641\u0631",
      pointsToUse: "\u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",
      confirmPay: "\u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0648\u0627\u0644\u062F\u0641\u0639",
      payFaceId: "\u0627\u0644\u062F\u0641\u0639 \u0639\u0628\u0631 Face ID",
      payApp: "\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0641\u064A \u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0628\u0646\u0643",
      checking: "\u0646\u062A\u062D\u0642\u0642 \u0645\u0646 \u0647\u0648\u064A\u062A\u0643\u2026",
      nothingPaid: "\u0644\u0646 \u064A\u064F\u062F\u0641\u0639 \u0634\u064A\u0621 \u0642\u0628\u0644 \u062A\u0623\u0643\u064A\u062F\u0643",
      booked: "\u062A\u0645 \u0627\u0644\u062D\u062C\u0632",
      close: "\u0625\u063A\u0644\u0627\u0642",
      otpSent: "\u0623\u062F\u062E\u0644 \u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0645\u0643\u0648\u0651\u0646 \u0645\u0646 6 \u0623\u0631\u0642\u0627\u0645 \u0627\u0644\u0645\u0631\u0633\u0644 \u0625\u0644\u0649 \u0647\u0627\u062A\u0641\u0643 \u0627\u0644\u0645\u0646\u062A\u0647\u064A \u0628\u0640 {d}",
      otpResend: "\u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u062C\u062F\u064A\u062F",
      otpDigit: "\u0627\u0644\u0631\u0642\u0645 {n}",
      confirmWithCode: "\u062A\u0623\u0643\u064A\u062F {amt}",
      appSent: "\u0623\u0631\u0633\u0644\u0646\u0627 \u0637\u0644\u0628\u064B\u0627 \u0625\u0644\u0649 \u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0628\u0646\u0643. \u0648\u0627\u0641\u0642 \u0639\u0644\u064A\u0647 \u0647\u0646\u0627\u0643 \u0644\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0639\u0645\u0644\u064A\u0629.",
      sendTo: "\u0625\u0631\u0633\u0627\u0644 \u0625\u0644\u0649",
      chosen: "\u062A\u0645 \u0627\u062E\u062A\u064A\u0627\u0631 {n}",
      done: "\u062A\u0645",
      direct: "\u0645\u0628\u0627\u0634\u0631\u0629",
      stop1: "\u062A\u0648\u0642\u0641 \u0648\u0627\u062D\u062F",
      stopsN: "{n} \u062A\u0648\u0642\u0641\u0627\u062A",
      leftAtPrice: "\u0628\u0642\u064A {n} \u0628\u0647\u0630\u0627 \u0627\u0644\u0633\u0639\u0631",
      economy: "\u0627\u0644\u062F\u0631\u062C\u0629 \u0627\u0644\u0633\u064A\u0627\u062D\u064A\u0629",
      included: "\u0645\u0634\u0645\u0648\u0644",
      you: "\u0623\u0646\u062A",
      extraLegroom: "\u0645\u0633\u0627\u062D\u0629 \u0625\u0636\u0627\u0641\u064A\u0629 \u0644\u0644\u0633\u0627\u0642\u064A\u0646 {p}",
      free: "\u0645\u062A\u0627\u062D",
      seatA11y: "\u0627\u0644\u0645\u0642\u0639\u062F {id}",
      taken: "\u0645\u062D\u062C\u0648\u0632",
      exit: "\u0645\u062E\u0631\u062C",
      smallBag: "\u062D\u0642\u064A\u0628\u0629 \u0635\u063A\u064A\u0631\u0629",
      smallBagSub: "\u062A\u062D\u062A \u0627\u0644\u0645\u0642\u0639\u062F",
      cabinBag: "\u062D\u0642\u064A\u0628\u0629 \u0627\u0644\u0645\u0642\u0635\u0648\u0631\u0629",
      cabinBagSub: "\u0641\u064A \u0627\u0644\u062E\u0632\u0627\u0646\u0629 \u0627\u0644\u0639\u0644\u0648\u064A\u0629\u060C \u062D\u062A\u0649 {kg} \u0643\u063A",
      checkedBag: "\u062D\u0642\u064A\u0628\u0629 \u0645\u0634\u062D\u0648\u0646\u0629",
      checkedBagSub: "\u062D\u062A\u0649 {kg} \u0643\u063A",
      removeX: "\u0625\u0632\u0627\u0644\u0629 {x}",
      addX: "\u0625\u0636\u0627\u0641\u0629 {x}",
      boards: "\u0648\u0642\u062A \u0627\u0644\u0635\u0639\u0648\u062F",
      gate: "\u0627\u0644\u0628\u0648\u0627\u0628\u0629",
      seat: "\u0627\u0644\u0645\u0642\u0639\u062F",
      group: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629",
      passenger: "\u0627\u0644\u0645\u0633\u0627\u0641\u0631",
      boardingCode: "\u0631\u0645\u0632 \u0627\u0644\u0635\u0639\u0648\u062F",
      departs: "\u0627\u0644\u0645\u063A\u0627\u062F\u0631\u0629",
      lands: "\u0627\u0644\u0648\u0635\u0648\u0644",
      cancelled: "\u0623\u064F\u0644\u063A\u064A\u062A",
      requestRefund: "\u0637\u0644\u0628 \u0627\u0633\u062A\u0631\u062F\u0627\u062F",
      moveMe: "\u0627\u0646\u0642\u0644\u0646\u064A \u0625\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u0631\u062D\u0644\u0629",
      rebookingOptions: "\u062E\u064A\u0627\u0631\u0627\u062A \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062D\u062C\u0632",
      changeOutbound: "\u062A\u063A\u064A\u064A\u0631 \u0631\u062D\u0644\u0629 \u0627\u0644\u0630\u0647\u0627\u0628",
      bookedLabel: "\u0627\u0644\u0645\u062D\u062C\u0648\u0632",
      newLabel: "\u0627\u0644\u062C\u062F\u064A\u062F",
      changeFee: "\u0631\u0633\u0648\u0645 \u0627\u0644\u062A\u063A\u064A\u064A\u0631",
      freeOnFare: "\u0645\u062C\u0627\u0646\u064B\u0627 \u0639\u0644\u0649 \u062A\u0630\u0643\u0631\u062A\u0643",
      fareDiff: "\u0641\u0631\u0642 \u0627\u0644\u0633\u0639\u0631",
      toPay: "\u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u062F\u0641\u0639\u0647",
      changeFor: "\u0627\u0644\u062A\u063A\u064A\u064A\u0631 \u0645\u0642\u0627\u0628\u0644 {p}",
      yourFare: "\u062A\u0630\u0643\u0631\u062A\u0643: {f}",
      ifPlansChange: "\u0625\u0630\u0627 \u062A\u063A\u064A\u0651\u0631\u062A \u062E\u0637\u0637\u0643",
      total: "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A",
      nightsTaxes: "{n} \u0644\u064A\u0627\u0644\u064D\u060C \u0634\u0627\u0645\u0644 \u0627\u0644\u0636\u0631\u0627\u0626\u0628",
      save: "\u062D\u0641\u0638",
      saved: "\u0645\u062D\u0641\u0648\u0638",
      full: "\u0645\u0645\u062A\u0644\u0626",
      seatsN: "{n} \u0645\u0642\u0627\u0639\u062F",
      loungePass: "\u062A\u0635\u0631\u064A\u062D \u0627\u0644\u0635\u0627\u0644\u0629",
      youPlus: "\u0623\u0646\u062A + {n} \u0636\u064A\u0641",
      paymentDue: "\u0627\u0644\u062F\u0641\u0639\u0629 \u0627\u0644\u0645\u0633\u062A\u062D\u0642\u0629",
      minBy: "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 {amt} \u0628\u062D\u0644\u0648\u0644 {date}",
      inDays: "\u062E\u0644\u0627\u0644 {n} \u0623\u064A\u0627\u0645",
      payNow: "\u0627\u062F\u0641\u0639 \u0627\u0644\u0622\u0646",
      setUp: "\u062A\u0641\u0639\u064A\u0644 {dd}",
      ddPays: "\u064A\u0633\u062F\u0651\u062F {dd} \u0627\u0644\u0631\u0635\u064A\u062F \u0643\u0627\u0645\u0644\u064B\u0627 \u0641\u064A {date}",
      home: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",
      rewards: "\u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A",
      trips: "\u0627\u0644\u0631\u062D\u0644\u0627\u062A",
      me: "\u062D\u0633\u0627\u0628\u064A",
      main: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",
      alerts: "\u0627\u0644\u062A\u0646\u0628\u064A\u0647\u0627\u062A",
      back: "\u0631\u062C\u0648\u0639",
      moreL: "\u0627\u0644\u0645\u0632\u064A\u062F",
      goodMorning: "\u0635\u0628\u0627\u062D \u0627\u0644\u062E\u064A\u0631",
      working2: "\u0642\u064A\u062F \u0627\u0644\u0639\u0645\u0644",
      finished: "\u0627\u0643\u062A\u0645\u0644",
      nOfBooked: "\u062A\u0645 \u062D\u062C\u0632 {a} \u0645\u0646 {b}",
      toBook: "\u0644\u0644\u062D\u062C\u0632",
      standardFare: "\u0627\u0644\u0639\u0627\u062F\u064A\u0629",
      appReady: "\u0627\u0636\u063A\u0637 \u0623\u062F\u0646\u0627\u0647 \u0648\u0633\u0646\u0631\u0633\u0644 \u0637\u0644\u0628\u064B\u0627 \u0625\u0644\u0649 \u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0628\u0646\u0643.",
      youGetBack: "\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0631\u062F",
      confirmPts: "\u062A\u0623\u0643\u064A\u062F {pts}",
      nights_one: "\u0644\u064A\u0644\u0629 \u0648\u0627\u062D\u062F\u0629",
      nights_two: "\u0644\u064A\u0644\u062A\u0627\u0646",
      inDays_one: "\u063A\u062F\u064B\u0627",
      inDays_two: "\u062E\u0644\u0627\u0644 \u064A\u0648\u0645\u064A\u0646",
      stopsN_two: "\u062A\u0648\u0642\u0641\u0627\u0646",
      youPlus_two: "\u0623\u0646\u062A + \u0636\u064A\u0641\u0627\u0646"
    }
  };

  // src/market.tsx
  var MARKETS = {
    UK: { id: "UK", name: "United Kingdom", locale: "en-GB", lang: "en", dir: "ltr", currency: "GBP", symbol: "\xA3", auth: "faceid", directDebit: "Direct Debit", tax: "VAT", flightRule: { name: "UK rules", note: "UK261" }, hour12: false, firstDay: 1 },
    EU: { id: "EU", name: "Eurozone (English)", locale: "en-IE", lang: "en", dir: "ltr", currency: "EUR", symbol: "\u20AC", auth: "faceid", directDebit: "direct debit", tax: "VAT", flightRule: { name: "EU rules", note: "EU261" }, hour12: false, firstDay: 1 },
    IN: { id: "IN", name: "India", locale: "en-IN", lang: "en", dir: "ltr", currency: "INR", symbol: "\u20B9", auth: "otp", directDebit: "auto-debit", tax: "GST", flightRule: { name: "DGCA rules", note: "DGCA passenger charter" }, hour12: true, firstDay: 7 },
    AE: { id: "AE", name: "UAE", locale: "en-AE", lang: "en", dir: "ltr", currency: "AED", symbol: "AED ", auth: "faceid", directDebit: "direct debit", tax: "VAT", flightRule: { name: "the airline\u2019s policy", note: "to confirm with the bank" }, hour12: true, firstDay: 1 },
    AR: { id: "AR", name: "UAE (Arabic)", locale: "ar-AE", lang: "ar", dir: "rtl", currency: "AED", auth: "faceid", directDebit: "\u0627\u0644\u062E\u0635\u0645 \u0627\u0644\u0645\u0628\u0627\u0634\u0631", tax: "\u0636\u0631\u064A\u0628\u0629 \u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0636\u0627\u0641\u0629", flightRule: { name: "\u0633\u064A\u0627\u0633\u0629 \u0634\u0631\u0643\u0629 \u0627\u0644\u0637\u064A\u0631\u0627\u0646", note: "to confirm with the bank" }, hour12: true, firstDay: 1 },
    SG: { id: "SG", name: "Singapore", locale: "en-SG", lang: "en", dir: "ltr", currency: "SGD", symbol: "S$", auth: "faceid", directDebit: "GIRO", tax: "GST", flightRule: { name: "the airline\u2019s policy", note: "no statutory scheme" }, hour12: true, firstDay: 7 },
    MY: { id: "MY", name: "Malaysia", locale: "en-MY", lang: "en", dir: "ltr", currency: "MYR", symbol: "RM", auth: "app", directDebit: "auto-debit", tax: "SST", flightRule: { name: "Malaysian aviation rules", note: "Malaysian Aviation Consumer Protection Code 2016, enforced by CAAM" }, hour12: true, firstDay: 1 }
  };
  var cache = {};
  function fmt(m = "UK") {
    const mk = typeof m === "string" ? MARKETS[m] || MARKETS.UK : m;
    const key = JSON.stringify(mk);
    if (cache[key]) return cache[key];
    const nf = (dp) => new Intl.NumberFormat(mk.locale, { minimumFractionDigits: dp, maximumFractionDigits: dp });
    const pack = { ...STRINGS.en, ...STRINGS[mk.lang] || {} };
    const f2 = {
      ...mk,
      money: (n, dp = 0) => {
        if (mk.symbol) return (n < 0 ? "\u2212" : "") + mk.symbol + nf(dp).format(Math.abs(n));
        return new Intl.NumberFormat(mk.locale, { style: "currency", currency: mk.currency, minimumFractionDigits: dp, maximumFractionDigits: dp }).format(n);
      },
      num: (n) => nf(0).format(Math.round(n)),
      pts: (n) => pack.ptsN.replace("{n}", nf(0).format(Math.round(n))),
      date: (d, style = "short") => {
        const x = typeof d === "string" ? /* @__PURE__ */ new Date(d + "T12:00:00") : d;
        const o = style === "long" ? { weekday: "long", day: "numeric", month: "long" } : style === "day" ? { day: "numeric", month: "short" } : { weekday: "short", day: "numeric", month: "short" };
        return new Intl.DateTimeFormat(mk.locale, o).format(x).replace(",", "");
      },
      monthLabel: (y, m2) => new Intl.DateTimeFormat(mk.locale, { month: "long", year: "numeric" }).format(new Date(y, m2, 15)),
      dows: () => Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(mk.locale, { weekday: "narrow" }).format(new Date(2026, 5, 7 + (mk.firstDay % 7 + i)))),
      time: (hhmm) => hhmm,
      // flight times stay 24-hour in every market, as airlines and airports print them
      t: (key2, vars) => {
        var _a, _b;
        let k = key2;
        if (vars && vars.n != null) {
          const n = Number(String(vars.n).replace(/[^0-9.]/g, ""));
          const cat = new Intl.PluralRules(mk.lang).select(n);
          if (pack[key2 + "_" + cat] != null) k = key2 + "_" + cat;
        }
        let s = (_b = (_a = pack[k]) != null ? _a : pack[key2]) != null ? _b : key2;
        if (vars) for (const k2 in vars) s = s.split("{" + k2 + "}").join(String(vars[k2]));
        return s;
      }
    };
    cache[key] = f2;
    return f2;
  }
  var Ctx = React.createContext(fmt("UK"));
  function MarketProvider({ market = "UK", children, className, style }) {
    const f2 = fmt(market);
    return /* @__PURE__ */ React.createElement(Ctx.Provider, { value: f2 }, /* @__PURE__ */ React.createElement("div", { className, dir: f2.dir, lang: f2.locale, style: { display: "contents", ...style } }, children));
  }
  function useMarket() {
    return React.useContext(Ctx);
  }

  // src/icons.tsx
  var P = {
    cash: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "6", width: "18", height: "12", rx: "2.5" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "2.6" }), /* @__PURE__ */ React.createElement("path", { d: "M6.5 9.5v5M17.5 9.5v5" })),
    plane: /* @__PURE__ */ React.createElement("path", { d: "M10.2 13.6 4 11.3l1.4-1.4 7 .9 3.7-3.7a1.9 1.9 0 0 1 2.7 2.7l-3.7 3.7.9 7-1.4 1.4-2.3-6.2-2.9 2.9v2.3L8 22l-1.3-3.6L3 17.1l1.4-1.4h2.3z" }),
    takeoff: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M3 20h18" }), /* @__PURE__ */ React.createElement("path", { d: "m5.5 14.5 2.9.4 3.2-2.4-5.4-4 1.8-.7 7.4 2.6 3.1-2.2a1.8 1.8 0 0 1 2.1 3L10.2 17 5 16z" })),
    landing: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M3 20h18" }), /* @__PURE__ */ React.createElement("path", { d: "m4.5 9 2.6-.8 2.4 3.3 6.6-.9-.6-5.4 1.9.3 2.1 7.3 1 .4a1.8 1.8 0 0 1-1.2 3.4L6.3 14z" })),
    hotel: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M3 20V7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5V20" }), /* @__PURE__ */ React.createElement("path", { d: "M3 15h18M7 11.5h3M14 11.5h3M2 20h20" })),
    bed: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M3 18V6M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3" }), /* @__PURE__ */ React.createElement("circle", { cx: "7", cy: "10.5", r: "1.8" })),
    bag: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "5", y: "7", width: "14", height: "13", rx: "2.5" }), /* @__PURE__ */ React.createElement("path", { d: "M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M9 11v5M15 11v5" })),
    cabinbag: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "6.5", y: "8", width: "11", height: "12", rx: "2.5" }), /* @__PURE__ */ React.createElement("path", { d: "M10 8V5h4v3M9 20v1.5M15 20v1.5" })),
    seat: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M7 4h5a2 2 0 0 1 2 2v7h3.5a1.5 1.5 0 0 1 1.5 1.5V17H8a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1z" }), /* @__PURE__ */ React.createElement("path", { d: "M8 17v3M17 17v3" })),
    clock: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "8.5" }), /* @__PURE__ */ React.createElement("path", { d: "M12 7.5V12l3 2" })),
    cal: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3.5", y: "5", width: "17", height: "15.5", rx: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M3.5 10h17M8.5 3v4M15.5 3v4" })),
    search: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "6.5" }), /* @__PURE__ */ React.createElement("path", { d: "m20 20-4.2-4.2" })),
    mic: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "9", y: "3", width: "6", height: "11", rx: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" })),
    up: /* @__PURE__ */ React.createElement("path", { d: "M12 19V5M6 11l6-6 6 6" }),
    arrow: /* @__PURE__ */ React.createElement("path", { d: "M4 12h15M13 6l6 6-6 6" }),
    back: /* @__PURE__ */ React.createElement("path", { d: "m15 5-7 7 7 7" }),
    chev: /* @__PURE__ */ React.createElement("path", { d: "m9 6 6 6-6 6" }),
    down: /* @__PURE__ */ React.createElement("path", { d: "m6 9 6 6 6-6" }),
    close: /* @__PURE__ */ React.createElement("path", { d: "M6 6l12 12M18 6 6 18" }),
    check: /* @__PURE__ */ React.createElement("path", { d: "M4.5 12.5l5 5L19.5 7" }),
    plus: /* @__PURE__ */ React.createElement("path", { d: "M12 5v14M5 12h14" }),
    minus: /* @__PURE__ */ React.createElement("path", { d: "M5 12h14" }),
    filter: /* @__PURE__ */ React.createElement("path", { d: "M4 6h16M7 12h10M10 18h4" }),
    sort: /* @__PURE__ */ React.createElement("path", { d: "M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5" }),
    star: /* @__PURE__ */ React.createElement("path", { d: "m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" }),
    heart: /* @__PURE__ */ React.createElement("path", { d: "M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z" }),
    share: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 15V3.5M7.5 8 12 3.5 16.5 8" }), /* @__PURE__ */ React.createElement("path", { d: "M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12" })),
    info: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "8.5" }), /* @__PURE__ */ React.createElement("path", { d: "M12 11v5M12 8h.01" })),
    alert: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 4 2.8 19.5h18.4z" }), /* @__PURE__ */ React.createElement("path", { d: "M12 10v4.5M12 17h.01" })),
    refresh: /* @__PURE__ */ React.createElement("path", { d: "M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" }),
    swap: /* @__PURE__ */ React.createElement("path", { d: "M4 8h14l-3.5-3.5M20 16H6l3.5 3.5" }),
    card: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "6", width: "18", height: "12.5", rx: "2.5" }), /* @__PURE__ */ React.createElement("path", { d: "M3 10.5h18M7 15h3" })),
    lock: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "5", y: "10.5", width: "14", height: "10", rx: "2.5" }), /* @__PURE__ */ React.createElement("path", { d: "M8 10.5V8a4 4 0 0 1 8 0v2.5" })),
    faceid: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 9.5v1M15 9.5v1M12 9.5V13h-1M9.5 15.5c1.5 1.2 3.5 1.2 5 0" })),
    user: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "8.5", r: "3.8" }), /* @__PURE__ */ React.createElement("path", { d: "M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" })),
    users: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "9", r: "3.3" }), /* @__PURE__ */ React.createElement("path", { d: "M3 19.5c.9-3 3.2-4.6 6-4.6s5.1 1.6 6 4.6M15.5 5.9a3.2 3.2 0 0 1 0 6.2M17.5 14.9c1.8.6 3 2.1 3.5 4.6" })),
    child: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "7", r: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M8 21v-5l-2-3 3-2h6l3 2-2 3v5" })),
    infant: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "10", cy: "9", r: "4.5" }), /* @__PURE__ */ React.createElement("path", { d: "M14.5 9h5M8.5 8.5h.01M11.5 8.5h.01M9 11c.6.5 1.4.5 2 0M6 20l1.5-6.5M14 20l-1.5-6.5" })),
    pin: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "10", r: "2.4" })),
    car: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M5 16.5V12l1.8-4.2A2 2 0 0 1 8.6 6.5h6.8a2 2 0 0 1 1.8 1.3L19 12v4.5" }), /* @__PURE__ */ React.createElement("rect", { x: "3.5", y: "12", width: "17", height: "5", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M6.5 17v2M17.5 17v2M7.5 14.5h.01M16.5 14.5h.01" })),
    fork: /* @__PURE__ */ React.createElement("path", { d: "M7 3v7a2 2 0 0 0 4 0V3M9 12v9M16 21V3c-2 1.5-3 4-3 7v3h3" }),
    ticket: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M3.5 8a2 2 0 0 0 0 4 2 2 0 0 1 0 4V18h17v-2a2 2 0 0 1 0-4 2 2 0 0 1 0-4V6h-17z" }), /* @__PURE__ */ React.createElement("path", { d: "M14 6v12", strokeDasharray: "2 2.5" })),
    gift: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "9", width: "16", height: "11", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M3 9h18M12 9v11M12 9c-2-3.5-5-3-4.2-.7M12 9c2-3.5 5-3 4.2-.7" })),
    sofa: /* @__PURE__ */ React.createElement("path", { d: "M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v6H3zM6 18v2M18 18v2" }),
    bell: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" }), /* @__PURE__ */ React.createElement("path", { d: "M10 20.5a2 2 0 0 0 4 0" })),
    wifi: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M3.5 9.5a12 12 0 0 1 17 0M6.5 12.8a7.5 7.5 0 0 1 11 0M9.5 16a3.2 3.2 0 0 1 5 0" }), /* @__PURE__ */ React.createElement("path", { d: "M12 19.3h.01" })),
    meal: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M4 13h16a8 8 0 0 1-16 0zM12 5v3M8 6.5l1 2M16 6.5l-1 2M3 13h18" })),
    send: /* @__PURE__ */ React.createElement("path", { d: "M4 12 20 4l-4 16-4.5-6.5zM11.5 13.5 20 4" }),
    phone: /* @__PURE__ */ React.createElement("path", { d: "M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" }),
    chat: /* @__PURE__ */ React.createElement("path", { d: "M5 18.5V7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v6.5a2.5 2.5 0 0 1-2.5 2.5H9z" }),
    home: /* @__PURE__ */ React.createElement("path", { d: "M4 10.5 12 4l8 6.5V20h-5.5v-6h-5v6H4z" }),
    grid: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "4", width: "7", height: "7", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "13", y: "4", width: "7", height: "7", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "4", y: "13", width: "7", height: "7", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "13", y: "13", width: "7", height: "7", rx: "1.5" })),
    wallet: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3.5", y: "6", width: "17", height: "13", rx: "2.5" }), /* @__PURE__ */ React.createElement("path", { d: "M3.5 10h17M15.5 14.5h2" })),
    globe: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "8.5" }), /* @__PURE__ */ React.createElement("path", { d: "M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z" })),
    shield: /* @__PURE__ */ React.createElement("path", { d: "M12 3.5 19 6.5v5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9v-5z" }),
    doc: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M6.5 3.5h7l4 4v13h-11z" }), /* @__PURE__ */ React.createElement("path", { d: "M13.5 3.5v4h4M9 12h6M9 16h6" })),
    split: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2.5" }), /* @__PURE__ */ React.createElement("path", { d: "M9 5v14M15 5v14" })),
    bolt: /* @__PURE__ */ React.createElement("path", { d: "M13 3 5 13.5h6L10 21l8-10.5h-6z" }),
    leaf: /* @__PURE__ */ React.createElement("path", { d: "M5 19C5 10 10 5 20 4c-1 10-6 15-15 15zM5 19l7-7" }),
    pound: /* @__PURE__ */ React.createElement("path", { d: "M16.5 6.5A3.5 3.5 0 0 0 10 8v4.5c0 3-1 5-3 6.5h11M7 12.5h7" }),
    gate: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M4 20V6l8-3 8 3v14" }), /* @__PURE__ */ React.createElement("path", { d: "M9 20v-6h6v6" })),
    qr: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "4", width: "6", height: "6", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "14", y: "4", width: "6", height: "6", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "4", y: "14", width: "6", height: "6", rx: "1" }), /* @__PURE__ */ React.createElement("path", { d: "M14 14h2v2M20 14v6h-4M14 18v2" })),
    sparkle: /* @__PURE__ */ React.createElement("path", { d: "M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" }),
    more: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "6", cy: "12", r: "1.2" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "1.2" }), /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "12", r: "1.2" })),
    edit: /* @__PURE__ */ React.createElement("path", { d: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" }),
    trash: /* @__PURE__ */ React.createElement("path", { d: "M5 7h14M9.5 7V5h5v2M7 7l1 12.5h8L17 7" }),
    pet: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "6.5", cy: "10", r: "1.8" }), /* @__PURE__ */ React.createElement("circle", { cx: "10", cy: "6.5", r: "1.8" }), /* @__PURE__ */ React.createElement("circle", { cx: "14", cy: "6.5", r: "1.8" }), /* @__PURE__ */ React.createElement("circle", { cx: "17.5", cy: "10", r: "1.8" }), /* @__PURE__ */ React.createElement("path", { d: "M12 12c-3 0-5 3.5-5 5.5S9 20 12 19s5 1.5 5-1.5S15 12 12 12z" })),
    wheelchair: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "4.5", r: "1.8" }), /* @__PURE__ */ React.createElement("path", { d: "M11 7.5v6h6l2.5 5M11 10.5h5" }), /* @__PURE__ */ React.createElement("path", { d: "M8 11.5a5 5 0 1 0 6.8 6.3" })),
    sun: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" })),
    moon: /* @__PURE__ */ React.createElement("path", { d: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" }),
    eye: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3" })),
    flag: /* @__PURE__ */ React.createElement("path", { d: "M5 21V4M5 4h12l-2 4 2 4H5" }),
    headset: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M4 14v-2a8 8 0 0 1 16 0v2" }), /* @__PURE__ */ React.createElement("rect", { x: "3.5", y: "13.5", width: "4", height: "6", rx: "2" }), /* @__PURE__ */ React.createElement("rect", { x: "16.5", y: "13.5", width: "4", height: "6", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M18.5 19.5c0 1.5-1.5 2-4 2" }))
  };
  var ICONS = Object.keys(P);
  var FLIP = /* @__PURE__ */ new Set(["back", "chev", "arrow", "send", "takeoff", "landing"]);
  function Icon({ name, size = 20, stroke = 1.9, color, filled, title, className }) {
    return /* @__PURE__ */ React.createElement("svg", { className: "gr-icon " + (FLIP.has(name) ? "gr-flipx " : "") + (className || ""), width: size, height: size, viewBox: "0 0 24 24", fill: filled ? color || "currentColor" : "none", stroke: color || "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", role: title ? "img" : void 0, "aria-hidden": title ? void 0 : true, "aria-label": title }, P[name] || P.info);
  }
  function Spark({ size = 16 }) {
    return /* @__PURE__ */ React.createElement("svg", { className: "gr-icon gr-spark", width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { fill: "currentColor", d: "M11 2.5c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" }), /* @__PURE__ */ React.createElement("path", { fill: "currentColor", d: "M18.5 14.5c.3 2.2 1.1 3 3.3 3.3-2.2.3-3 1.1-3.3 3.3-.3-2.2-1.1-3-3.3-3.3 2.2-.3 3-1.1 3.3-3.3z" }));
  }

  // ../pwa/src/assets/scene-flight.svg
  var scene_flight_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="400" viewBox="0 0 480 400"><defs><linearGradient id="k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%238CC4EC"/><stop offset="1" stop-color="%23D6ECFA"/></linearGradient></defs><rect width="480" height="400" fill="url(%23k)"/>%0A<g fill="%23FFFFFF"><circle cx="80" cy="330" r="60"/><circle cx="160" cy="310" r="70"/><circle cx="250" cy="340" r="60"/><circle cx="340" cy="320" r="72"/><circle cx="430" cy="340" r="60"/><rect y="340" width="480" height="60"/></g>%0A<g fill="%23FFFFFF" opacity="0.8"><circle cx="90" cy="120" r="26"/><circle cx="120" cy="110" r="32"/><circle cx="152" cy="122" r="24"/></g>%0A<g transform="translate(240 170) rotate(-12)"><path d="M-150 0 C-150 -16 -120 -22 -90 -22 H110 C140 -22 160 -10 160 0 C160 10 140 20 110 20 H-90 C-120 20 -150 14 -150 0 Z" fill="%23FFFFFF" stroke="%23141416" stroke-width="5"/><path d="M-10 -10 L-60 -90 H-30 L50 -12 Z" fill="%23FFFFFF" stroke="%23141416" stroke-width="5" stroke-linejoin="round"/><path d="M-10 12 L-40 70 H-14 L40 14 Z" fill="%23FFFFFF" stroke="%23141416" stroke-width="5" stroke-linejoin="round"/><path d="M-130 -18 L-150 -70 H-126 L-96 -20 Z" fill="%23FF6A1F" stroke="%23141416" stroke-width="5" stroke-linejoin="round"/><g fill="%237FB2D9"><circle cx="-70" cy="-4" r="6"/><circle cx="-44" cy="-4" r="6"/><circle cx="-18" cy="-4" r="6"/><circle cx="8" cy="-4" r="6"/><circle cx="34" cy="-4" r="6"/><circle cx="60" cy="-4" r="6"/><circle cx="86" cy="-4" r="6"/></g><path d="M120 -18 C140 -16 152 -8 156 -2 L128 -2 Z" fill="%23141416"/></g></svg>';

  // ../pwa/src/assets/scene-lisbon.svg
  var scene_lisbon_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="400" viewBox="0 0 480 400"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%23FFB38A"/><stop offset="0.6" stop-color="%23FFD9B8"/><stop offset="1" stop-color="%23FFE9D2"/></linearGradient><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%237FB2D9"/><stop offset="1" stop-color="%234E86B8"/></linearGradient></defs>%0A<rect width="480" height="400" fill="url(%23s)"/><circle cx="360" cy="150" r="54" fill="%23FF7A33"/>%0A<rect y="236" width="480" height="164" fill="url(%23w)"/><path d="M0 250 H480" stroke="%23FFD9B8" stroke-width="3" opacity="0.6"/>%0A<path d="M300 236 Q360 232 420 236" stroke="%23FFB38A" stroke-width="6" opacity="0.7"/>%0A<path d="M0 400 V210 Q120 150 250 205 Q300 230 330 400 Z" fill="%23E9D3B7"/>%0A<g>%0A<rect x="20" y="190" width="46" height="60" fill="%23F6E7C8"/><path d="M16 192 L43 172 L70 192 Z" fill="%23D9643B"/>%0A<rect x="70" y="175" width="52" height="78" fill="%23FFFFFF"/><path d="M66 177 L96 154 L126 177 Z" fill="%23C85A36"/>%0A<rect x="126" y="190" width="44" height="66" fill="%23F2C94C"/><path d="M122 192 L148 172 L174 192 Z" fill="%23D9643B"/>%0A<rect x="175" y="200" width="54" height="62" fill="%238FC1D8"/><path d="M171 202 L202 180 L233 202 Z" fill="%23C85A36"/>%0A<g fill="%23141416" opacity="0.75"><rect x="30" y="205" width="10" height="14"/><rect x="48" y="205" width="10" height="14"/><rect x="82" y="190" width="10" height="14"/><rect x="102" y="190" width="10" height="14"/><rect x="82" y="215" width="10" height="14"/><rect x="102" y="215" width="10" height="14"/><rect x="138" y="205" width="10" height="14"/><rect x="187" y="215" width="10" height="14"/><rect x="207" y="215" width="10" height="14"/></g>%0A</g>%0A<g transform="translate(40 290)"><rect width="150" height="70" rx="14" fill="%23F2C230" stroke="%23141416" stroke-width="5"/><rect x="14" y="14" width="30" height="24" rx="4" fill="%23FFFFFF" stroke="%23141416" stroke-width="4"/><rect x="58" y="14" width="30" height="24" rx="4" fill="%23FFFFFF" stroke="%23141416" stroke-width="4"/><rect x="102" y="14" width="34" height="24" rx="4" fill="%23FFFFFF" stroke="%23141416" stroke-width="4"/><circle cx="36" cy="72" r="10" fill="%23141416"/><circle cx="114" cy="72" r="10" fill="%23141416"/><path d="M75 0 L75 -30 M60 -30 H90" stroke="%23141416" stroke-width="4"/></g>%0A<path d="M0 372 H480" stroke="%23141416" stroke-width="4"/></svg>';

  // ../pwa/src/assets/scene-pool.svg
  var scene_pool_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="400" viewBox="0 0 480 400"><defs><linearGradient id="k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%239CCBEA"/><stop offset="1" stop-color="%23D8ECF6"/></linearGradient><linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%235FC0D6"/><stop offset="1" stop-color="%232F93B5"/></linearGradient></defs>%0A<rect width="480" height="400" fill="url(%23k)"/>%0A<g fill="%23F6E7C8"><rect x="0" y="150" width="60" height="80"/><rect x="64" y="130" width="54" height="100" fill="%23FFFFFF"/><rect x="122" y="160" width="48" height="70" fill="%23F2C94C"/><rect x="380" y="140" width="56" height="90" fill="%23FFFFFF"/><rect x="440" y="160" width="40" height="70"/></g>%0A<g fill="%23D9643B"><path d="M-4 152 L30 130 L64 152Z"/><path d="M60 132 L91 110 L122 132Z" fill="%23C85A36"/><path d="M118 162 L146 142 L174 162Z"/><path d="M376 142 L408 120 L440 142Z" fill="%23C85A36"/><path d="M436 162 L460 146 L484 162Z"/></g>%0A<g fill="%23141416" opacity="0.75"><rect x="14" y="170" width="10" height="14"/><rect x="34" y="170" width="10" height="14"/><rect x="78" y="150" width="10" height="14"/><rect x="96" y="150" width="10" height="14"/><rect x="78" y="180" width="10" height="14"/><rect x="96" y="180" width="10" height="14"/><rect x="138" y="178" width="10" height="14"/><rect x="394" y="160" width="10" height="14"/><rect x="414" y="160" width="10" height="14"/><rect x="394" y="190" width="10" height="14"/></g>%0A<rect y="226" width="480" height="174" fill="%23F3E4CC"/>%0A<rect x="24" y="252" width="290" height="92" rx="18" fill="url(%23p)" stroke="%23141416" stroke-width="5"/>%0A<path d="M56 285 q20 -8 40 0 t40 0 M190 300 q20 -8 40 0 t40 0 M110 322 q20 -8 40 0 t40 0" stroke="%23FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/>%0A<g transform="translate(400 160)"><path d="M0 0 L0 190" stroke="%23141416" stroke-width="5"/><path d="M-70 18 Q0 -40 70 18 Z" fill="%23FF7A33" stroke="%23141416" stroke-width="5" stroke-linejoin="round"/></g>%0A<g transform="translate(340 330)"><path d="M0 0 H70 L96 -30" stroke="%23141416" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="2" y="-12" width="66" height="12" rx="4" fill="%23FFFFFF" stroke="%23141416" stroke-width="4"/><path d="M8 0 V26 M62 0 V26" stroke="%23141416" stroke-width="5"/></g>%0A<rect x="0" y="360" width="480" height="40" fill="%23E9D3B7"/><path d="M0 360 H480" stroke="%23141416" stroke-width="4"/>%0A</svg>%0A';

  // ../pwa/src/assets/scene-room.svg
  var scene_room_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="400" viewBox="0 0 480 400"><defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%23FFB38A"/><stop offset="1" stop-color="%23FFE9D2"/></linearGradient></defs>%0A<rect width="480" height="400" fill="%23EFE6DA"/>%0A<rect x="250" y="40" width="190" height="200" rx="10" fill="url(%23v)" stroke="%23141416" stroke-width="5"/>%0A<circle cx="380" cy="110" r="26" fill="%23FF7A33"/>%0A<g><rect x="262" y="170" width="40" height="66" fill="%23FFFFFF"/><path d="M258 172 L282 152 L306 172Z" fill="%23C85A36"/><rect x="306" y="186" width="44" height="50" fill="%23F2C94C"/><path d="M302 188 L328 168 L354 188Z" fill="%23D9643B"/><rect x="354" y="176" width="42" height="60" fill="%238FC1D8"/><path d="M350 178 L375 158 L400 178Z" fill="%23C85A36"/><rect x="400" y="190" width="36" height="46" fill="%23F6E7C8"/></g>%0A<path d="M345 40 V240 M250 140 H440" stroke="%23141416" stroke-width="5"/>%0A<rect x="20" y="200" width="300" height="120" rx="16" fill="%23FFFFFF" stroke="%23141416" stroke-width="5"/>%0A<rect x="20" y="150" width="300" height="70" rx="16" fill="%23CFE6F2" stroke="%23141416" stroke-width="5"/>%0A<rect x="44" y="172" width="100" height="40" rx="14" fill="%23FFFFFF" stroke="%23141416" stroke-width="4"/><rect x="160" y="172" width="100" height="40" rx="14" fill="%23FFFFFF" stroke="%23141416" stroke-width="4"/>%0A<path d="M20 262 H320" stroke="%23FF7A33" stroke-width="10"/>%0A<g transform="translate(360 250)"><rect width="80" height="70" rx="8" fill="%23F2C94C" stroke="%23141416" stroke-width="5"/><path d="M40 0 V-50 M20 -50 H60 L52 -80 H28 Z" stroke="%23141416" stroke-width="5" fill="%23FFFFFF" stroke-linejoin="round"/></g>%0A<rect x="0" y="340" width="480" height="60" fill="%23D9C4A8"/><path d="M0 340 H480" stroke="%23141416" stroke-width="4"/>%0A</svg>%0A';

  // ../pwa/src/assets/scene-food.svg
  var scene_food_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="400" viewBox="0 0 480 400"><rect width="480" height="400" fill="%23FFE2C8"/>%0A<circle cx="380" cy="90" r="46" fill="%23FF7A33" opacity="0.9"/>%0A<rect x="0" y="250" width="480" height="150" fill="%23C98B5A"/><path d="M0 250 H480" stroke="%23141416" stroke-width="5"/>%0A<path d="M0 300 H480 M0 350 H480" stroke="%23B37548" stroke-width="3"/>%0A<g transform="translate(70 120)"><path d="M10 40 L150 40 L136 150 L24 150 Z" fill="%23FFFFFF" stroke="%23141416" stroke-width="5" stroke-linejoin="round"/><path d="M40 40 Q80 -10 120 40" fill="none" stroke="%23141416" stroke-width="5"/><circle cx="80" cy="95" r="22" fill="%23FF6A1F" stroke="%23141416" stroke-width="5"/><path d="M71 95 l7 7 12-14" fill="none" stroke="%23fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>%0A<g transform="translate(260 180)"><path d="M0 30 H170 Q165 90 85 95 Q5 90 0 30 Z" fill="%23F2C94C" stroke="%23141416" stroke-width="5" stroke-linejoin="round"/><path d="M20 30 Q40 5 60 25 Q80 0 100 22 Q125 2 150 30" fill="%23FFFFFF" stroke="%23141416" stroke-width="4"/><path d="M120 -30 L90 25 M140 -25 L105 25" stroke="%23141416" stroke-width="5" stroke-linecap="round"/></g>%0A</svg>%0A';

  // ../pwa/src/assets/scene-car.svg
  var scene_car_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="400" viewBox="0 0 480 400"><defs><linearGradient id="k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%232E3A5C"/><stop offset="1" stop-color="%23FFB38A"/></linearGradient></defs>%0A<rect width="480" height="400" fill="url(%23k)"/><circle cx="380" cy="80" r="30" fill="%23FFE9D2"/>%0A<g fill="%231F2640" opacity="0.8"><rect x="20" y="170" width="60" height="90"/><rect x="90" y="140" width="50" height="120"/><rect x="330" y="150" width="60" height="110"/><rect x="400" y="180" width="60" height="80"/></g>%0A<rect y="260" width="480" height="140" fill="%233E3E45"/><path d="M0 330 H480" stroke="%23F2C94C" stroke-width="6" stroke-dasharray="30 24"/>%0A<g transform="translate(120 190)"><path d="M20 70 L40 25 Q48 10 66 10 H170 Q188 10 198 25 L222 70 Z" fill="%23FF6A1F" stroke="%23141416" stroke-width="5" stroke-linejoin="round"/><rect x="0" y="66" width="240" height="44" rx="14" fill="%23FF6A1F" stroke="%23141416" stroke-width="5"/><path d="M62 24 H112 V64 H44 Z M126 24 H176 L200 64 H126 Z" fill="%23CFE6F2" stroke="%23141416" stroke-width="4" stroke-linejoin="round"/><circle cx="56" cy="112" r="20" fill="%23141416"/><circle cx="186" cy="112" r="20" fill="%23141416"/><circle cx="56" cy="112" r="7" fill="%23DDD"/><circle cx="186" cy="112" r="7" fill="%23DDD"/><rect x="226" y="78" width="12" height="10" rx="3" fill="%23FFE9A8"/></g>%0A</svg>%0A';

  // ../pwa/src/assets/scene-cinema.svg
  var scene_cinema_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="400" viewBox="0 0 480 400"><rect width="480" height="400" fill="%232A1E3F"/>%0A<path d="M0 0 H480 V40 Q240 70 0 40 Z" fill="%23B8323B"/><path d="M0 0 V400 H40 Q60 200 40 0 Z" fill="%23B8323B"/><path d="M480 0 V400 H440 Q420 200 440 0 Z" fill="%23B8323B"/>%0A<rect x="80" y="70" width="320" height="170" rx="8" fill="%23FFF3D6"/><rect x="80" y="70" width="320" height="170" rx="8" fill="url(%23g)" opacity="0"/>%0A<circle cx="190" cy="150" r="36" fill="%23FF6A1F"/><path d="M230 200 L290 120 L350 200 Z" fill="%237FB2D9"/><path d="M260 200 L300 150 L340 200 Z" fill="%234E86B8"/>%0A<g fill="%234B3A66"><rect x="50" y="290" width="54" height="50" rx="12"/><rect x="114" y="290" width="54" height="50" rx="12"/><rect x="178" y="290" width="54" height="50" rx="12"/><rect x="242" y="290" width="54" height="50" rx="12"/><rect x="306" y="290" width="54" height="50" rx="12"/><rect x="370" y="290" width="54" height="50" rx="12"/></g>%0A<g fill="%233A2C52"><rect x="18" y="340" width="58" height="60" rx="12"/><rect x="82" y="340" width="58" height="60" rx="12"/><rect x="146" y="340" width="58" height="60" rx="12"/><rect x="210" y="340" width="58" height="60" rx="12"/><rect x="274" y="340" width="58" height="60" rx="12"/><rect x="338" y="340" width="58" height="60" rx="12"/><rect x="402" y="340" width="58" height="60" rx="12"/></g>%0A<g transform="translate(330 250)"><path d="M0 20 L60 20 L52 110 L8 110 Z" fill="%23FFFFFF" stroke="%23141416" stroke-width="5"/><path d="M8 20 L14 110 M26 20 L28 110 M44 20 L42 110" stroke="%23E3434B" stroke-width="8"/><circle cx="12" cy="14" r="12" fill="%23FFE9A8"/><circle cx="30" cy="8" r="13" fill="%23FFF3D0"/><circle cx="48" cy="14" r="12" fill="%23FFE9A8"/></g></svg>';

  // ../pwa/src/assets/scene-jacket.svg
  var scene_jacket_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="400" viewBox="0 0 480 400"><rect width="480" height="400" fill="%23F6DDE4"/><rect y="300" width="480" height="100" fill="%23EDC9D3"/>%0A<path d="M60 70 H420" stroke="%23141416" stroke-width="6" stroke-linecap="round"/>%0A<g transform="translate(240 70)"><path d="M0 0 V22 M0 22 C-14 22 -14 6 0 6" stroke="%23141416" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M0 26 L-90 70 H90 Z" fill="none" stroke="%23141416" stroke-width="5" stroke-linejoin="round"/>%0A<path d="M-40 52 L-100 80 L-130 250 L-90 256 L-72 150 L-72 290 H72 L72 150 L90 256 L130 250 L100 80 L40 52 L0 110 Z" fill="%232F5D8C" stroke="%23141416" stroke-width="5" stroke-linejoin="round"/>%0A<path d="M0 110 V290" stroke="%23141416" stroke-width="4"/><path d="M-40 52 L0 110 L40 52" fill="%23E9E4DA" stroke="%23141416" stroke-width="5" stroke-linejoin="round"/><g fill="%23FFFFFF"><circle cx="0" cy="150" r="6"/><circle cx="0" cy="190" r="6"/><circle cx="0" cy="230" r="6"/></g></g>%0A<g transform="translate(330 150) rotate(14)"><path d="M0 0 H70 L96 30 L70 60 H0 Z" fill="%23FF6A1F" stroke="%23141416" stroke-width="5" stroke-linejoin="round"/><circle cx="72" cy="30" r="7" fill="%23FFFFFF" stroke="%23141416" stroke-width="4"/><path d="M14 22 H52 M14 38 H40" stroke="%23FFFFFF" stroke-width="6" stroke-linecap="round"/></g></svg>';

  // ../pwa/src/assets/torn-lisbon.svg
  var torn_lisbon_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="540" viewBox="0 0 640 540"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%23FFB38A"/><stop offset="0.6" stop-color="%23FFD9B8"/><stop offset="1" stop-color="%23FFE9D2"/></linearGradient><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%237FB2D9"/><stop offset="1" stop-color="%234E86B8"/></linearGradient><clipPath id="c"><polygon points="40,53 80,35 120,33 160,38 200,29 240,45 280,35 320,37 360,38 400,41 440,30 480,28 520,41 560,35 588,40 606,71 604,103 614,134 609,166 594,197 597,229 605,260 587,291 599,323 591,354 589,386 588,417 608,449 600,470 560,473 520,477 480,490 440,468 400,479 360,481 320,491 280,489 240,490 200,474 160,478 120,476 80,491 27,480 50,449 49,417 48,386 47,354 40,323 38,291 47,260 54,229 42,197 44,166 38,134 27,103 35,71"/></clipPath><filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feGaussianBlur stdDeviation="12"/></filter></defs><g transform="translate(0,16)" opacity="0.16" filter="url(%23sh)"><polygon points="18,24 61,29 104,13 147,32 191,17 234,22 277,32 320,18 363,33 406,20 449,32 493,31 536,20 579,8 610,18 613,53 626,87 636,122 624,156 619,191 637,225 607,260 633,295 615,329 611,364 610,398 616,433 632,467 622,492 579,505 536,506 493,498 449,504 406,488 363,488 320,493 277,508 234,500 191,496 147,505 104,501 61,496 9,502 12,467 26,433 16,398 17,364 6,329 11,295 25,260 3,225 30,191 21,156 10,122 29,87 18,53" fill="%23000"/></g><polygon points="18,24 61,29 104,13 147,32 191,17 234,22 277,32 320,18 363,33 406,20 449,32 493,31 536,20 579,8 610,18 613,53 626,87 636,122 624,156 619,191 637,225 607,260 633,295 615,329 611,364 610,398 616,433 632,467 622,492 579,505 536,506 493,498 449,504 406,488 363,488 320,493 277,508 234,500 191,496 147,505 104,501 61,496 9,502 12,467 26,433 16,398 17,364 6,329 11,295 25,260 3,225 30,191 21,156 10,122 29,87 18,53" fill="%23FFFFFF"/><g clip-path="url(%23c)"><g transform="translate(20,20) scale(1.250,1.200)">%0A<rect width="480" height="400" fill="url(%23s)"/><circle cx="360" cy="150" r="54" fill="%23FF7A33"/>%0A<rect y="236" width="480" height="164" fill="url(%23w)"/><path d="M0 250 H480" stroke="%23FFD9B8" stroke-width="3" opacity="0.6"/>%0A<path d="M300 236 Q360 232 420 236" stroke="%23FFB38A" stroke-width="6" opacity="0.7"/>%0A<path d="M0 400 V210 Q120 150 250 205 Q300 230 330 400 Z" fill="%23E9D3B7"/>%0A<g>%0A<rect x="20" y="190" width="46" height="60" fill="%23F6E7C8"/><path d="M16 192 L43 172 L70 192 Z" fill="%23D9643B"/>%0A<rect x="70" y="175" width="52" height="78" fill="%23FFFFFF"/><path d="M66 177 L96 154 L126 177 Z" fill="%23C85A36"/>%0A<rect x="126" y="190" width="44" height="66" fill="%23F2C94C"/><path d="M122 192 L148 172 L174 192 Z" fill="%23D9643B"/>%0A<rect x="175" y="200" width="54" height="62" fill="%238FC1D8"/><path d="M171 202 L202 180 L233 202 Z" fill="%23C85A36"/>%0A<g fill="%23141416" opacity="0.75"><rect x="30" y="205" width="10" height="14"/><rect x="48" y="205" width="10" height="14"/><rect x="82" y="190" width="10" height="14"/><rect x="102" y="190" width="10" height="14"/><rect x="82" y="215" width="10" height="14"/><rect x="102" y="215" width="10" height="14"/><rect x="138" y="205" width="10" height="14"/><rect x="187" y="215" width="10" height="14"/><rect x="207" y="215" width="10" height="14"/></g>%0A</g>%0A<g transform="translate(40 290)"><rect width="150" height="70" rx="14" fill="%23F2C230" stroke="%23141416" stroke-width="5"/><rect x="14" y="14" width="30" height="24" rx="4" fill="%23FFFFFF" stroke="%23141416" stroke-width="4"/><rect x="58" y="14" width="30" height="24" rx="4" fill="%23FFFFFF" stroke="%23141416" stroke-width="4"/><rect x="102" y="14" width="34" height="24" rx="4" fill="%23FFFFFF" stroke="%23141416" stroke-width="4"/><circle cx="36" cy="72" r="10" fill="%23141416"/><circle cx="114" cy="72" r="10" fill="%23141416"/><path d="M75 0 L75 -30 M60 -30 H90" stroke="%23141416" stroke-width="4"/></g>%0A<path d="M0 372 H480" stroke="%23141416" stroke-width="4"/></g></g></svg>';

  // ../pwa/src/assets/stamp-plane.svg
  var stamp_plane_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="290" viewBox="0 0 240 290"><defs><mask id="p"><rect width="240" height="290" fill="white"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="0" cy="290" r="9" fill="black"/><circle cx="26" cy="0" r="9" fill="black"/><circle cx="26" cy="290" r="9" fill="black"/><circle cx="52" cy="0" r="9" fill="black"/><circle cx="52" cy="290" r="9" fill="black"/><circle cx="78" cy="0" r="9" fill="black"/><circle cx="78" cy="290" r="9" fill="black"/><circle cx="104" cy="0" r="9" fill="black"/><circle cx="104" cy="290" r="9" fill="black"/><circle cx="130" cy="0" r="9" fill="black"/><circle cx="130" cy="290" r="9" fill="black"/><circle cx="156" cy="0" r="9" fill="black"/><circle cx="156" cy="290" r="9" fill="black"/><circle cx="182" cy="0" r="9" fill="black"/><circle cx="182" cy="290" r="9" fill="black"/><circle cx="208" cy="0" r="9" fill="black"/><circle cx="208" cy="290" r="9" fill="black"/><circle cx="234" cy="0" r="9" fill="black"/><circle cx="234" cy="290" r="9" fill="black"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="240" cy="0" r="9" fill="black"/><circle cx="0" cy="26" r="9" fill="black"/><circle cx="240" cy="26" r="9" fill="black"/><circle cx="0" cy="52" r="9" fill="black"/><circle cx="240" cy="52" r="9" fill="black"/><circle cx="0" cy="78" r="9" fill="black"/><circle cx="240" cy="78" r="9" fill="black"/><circle cx="0" cy="104" r="9" fill="black"/><circle cx="240" cy="104" r="9" fill="black"/><circle cx="0" cy="130" r="9" fill="black"/><circle cx="240" cy="130" r="9" fill="black"/><circle cx="0" cy="156" r="9" fill="black"/><circle cx="240" cy="156" r="9" fill="black"/><circle cx="0" cy="182" r="9" fill="black"/><circle cx="240" cy="182" r="9" fill="black"/><circle cx="0" cy="208" r="9" fill="black"/><circle cx="240" cy="208" r="9" fill="black"/><circle cx="0" cy="234" r="9" fill="black"/><circle cx="240" cy="234" r="9" fill="black"/><circle cx="0" cy="260" r="9" fill="black"/><circle cx="240" cy="260" r="9" fill="black"/><circle cx="0" cy="286" r="9" fill="black"/><circle cx="240" cy="286" r="9" fill="black"/></mask></defs><rect width="240" height="290" fill="%23FFFFFF" mask="url(%23p)"/><rect x="22" y="22" width="196" height="246" rx="4" fill="%23CFE6F2"/><g transform="translate(60.0,75.0)"><g transform="rotate(40 60 64)"><path d="M60 6 C67 6 69 15 69 24 V48 L114 76 V88 L69 74 V98 L84 109 V118 L60 111 L36 118 V109 L51 98 V74 L6 88 V76 L51 48 V24 C51 15 53 6 60 6 Z" fill="%23FFFFFF" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><circle cx="60" cy="30" r="0"/></g><circle cx="102" cy="116" r="11" fill="%23FF6A1F"/></g></svg>';

  // ../pwa/src/assets/stamp-hotel.svg
  var stamp_hotel_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="290" viewBox="0 0 240 290"><defs><mask id="p"><rect width="240" height="290" fill="white"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="0" cy="290" r="9" fill="black"/><circle cx="26" cy="0" r="9" fill="black"/><circle cx="26" cy="290" r="9" fill="black"/><circle cx="52" cy="0" r="9" fill="black"/><circle cx="52" cy="290" r="9" fill="black"/><circle cx="78" cy="0" r="9" fill="black"/><circle cx="78" cy="290" r="9" fill="black"/><circle cx="104" cy="0" r="9" fill="black"/><circle cx="104" cy="290" r="9" fill="black"/><circle cx="130" cy="0" r="9" fill="black"/><circle cx="130" cy="290" r="9" fill="black"/><circle cx="156" cy="0" r="9" fill="black"/><circle cx="156" cy="290" r="9" fill="black"/><circle cx="182" cy="0" r="9" fill="black"/><circle cx="182" cy="290" r="9" fill="black"/><circle cx="208" cy="0" r="9" fill="black"/><circle cx="208" cy="290" r="9" fill="black"/><circle cx="234" cy="0" r="9" fill="black"/><circle cx="234" cy="290" r="9" fill="black"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="240" cy="0" r="9" fill="black"/><circle cx="0" cy="26" r="9" fill="black"/><circle cx="240" cy="26" r="9" fill="black"/><circle cx="0" cy="52" r="9" fill="black"/><circle cx="240" cy="52" r="9" fill="black"/><circle cx="0" cy="78" r="9" fill="black"/><circle cx="240" cy="78" r="9" fill="black"/><circle cx="0" cy="104" r="9" fill="black"/><circle cx="240" cy="104" r="9" fill="black"/><circle cx="0" cy="130" r="9" fill="black"/><circle cx="240" cy="130" r="9" fill="black"/><circle cx="0" cy="156" r="9" fill="black"/><circle cx="240" cy="156" r="9" fill="black"/><circle cx="0" cy="182" r="9" fill="black"/><circle cx="240" cy="182" r="9" fill="black"/><circle cx="0" cy="208" r="9" fill="black"/><circle cx="240" cy="208" r="9" fill="black"/><circle cx="0" cy="234" r="9" fill="black"/><circle cx="240" cy="234" r="9" fill="black"/><circle cx="0" cy="260" r="9" fill="black"/><circle cx="240" cy="260" r="9" fill="black"/><circle cx="0" cy="286" r="9" fill="black"/><circle cx="240" cy="286" r="9" fill="black"/></mask></defs><rect width="240" height="290" fill="%23FFFFFF" mask="url(%23p)"/><rect x="22" y="22" width="196" height="246" rx="4" fill="%23CFE6F2"/><g transform="translate(60.0,75.0)"><rect x="14" y="20" width="92" height="104" rx="6" fill="%23FFFFFF" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><g fill="%23141416"><rect x="30" y="36" width="16" height="16" rx="2"/><rect x="52" y="36" width="16" height="16" rx="2"/><rect x="74" y="36" width="16" height="16" rx="2"/><rect x="30" y="62" width="16" height="16" rx="2"/><rect x="74" y="62" width="16" height="16" rx="2"/></g><rect x="52" y="62" width="16" height="16" rx="2" fill="%23FF6A1F"/><path d="M46 124 V98 H74 V124" fill="%23FF6A1F" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><path d="M4 124 H116" stroke="%23141416" stroke-width="7" stroke-linecap="round" fill="none"/></g></svg>';

  // ../pwa/src/assets/stamp-dining.svg
  var stamp_dining_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="290" viewBox="0 0 240 290"><defs><mask id="p"><rect width="240" height="290" fill="white"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="0" cy="290" r="9" fill="black"/><circle cx="26" cy="0" r="9" fill="black"/><circle cx="26" cy="290" r="9" fill="black"/><circle cx="52" cy="0" r="9" fill="black"/><circle cx="52" cy="290" r="9" fill="black"/><circle cx="78" cy="0" r="9" fill="black"/><circle cx="78" cy="290" r="9" fill="black"/><circle cx="104" cy="0" r="9" fill="black"/><circle cx="104" cy="290" r="9" fill="black"/><circle cx="130" cy="0" r="9" fill="black"/><circle cx="130" cy="290" r="9" fill="black"/><circle cx="156" cy="0" r="9" fill="black"/><circle cx="156" cy="290" r="9" fill="black"/><circle cx="182" cy="0" r="9" fill="black"/><circle cx="182" cy="290" r="9" fill="black"/><circle cx="208" cy="0" r="9" fill="black"/><circle cx="208" cy="290" r="9" fill="black"/><circle cx="234" cy="0" r="9" fill="black"/><circle cx="234" cy="290" r="9" fill="black"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="240" cy="0" r="9" fill="black"/><circle cx="0" cy="26" r="9" fill="black"/><circle cx="240" cy="26" r="9" fill="black"/><circle cx="0" cy="52" r="9" fill="black"/><circle cx="240" cy="52" r="9" fill="black"/><circle cx="0" cy="78" r="9" fill="black"/><circle cx="240" cy="78" r="9" fill="black"/><circle cx="0" cy="104" r="9" fill="black"/><circle cx="240" cy="104" r="9" fill="black"/><circle cx="0" cy="130" r="9" fill="black"/><circle cx="240" cy="130" r="9" fill="black"/><circle cx="0" cy="156" r="9" fill="black"/><circle cx="240" cy="156" r="9" fill="black"/><circle cx="0" cy="182" r="9" fill="black"/><circle cx="240" cy="182" r="9" fill="black"/><circle cx="0" cy="208" r="9" fill="black"/><circle cx="240" cy="208" r="9" fill="black"/><circle cx="0" cy="234" r="9" fill="black"/><circle cx="240" cy="234" r="9" fill="black"/><circle cx="0" cy="260" r="9" fill="black"/><circle cx="240" cy="260" r="9" fill="black"/><circle cx="0" cy="286" r="9" fill="black"/><circle cx="240" cy="286" r="9" fill="black"/></mask></defs><rect width="240" height="290" fill="%23FFFFFF" mask="url(%23p)"/><rect x="22" y="22" width="196" height="246" rx="4" fill="%23F6DDE4"/><g transform="translate(60.0,75.0)"><circle cx="60" cy="68" r="40" fill="%23FFFFFF" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><circle cx="60" cy="68" r="22" fill="%23FF6A1F"/><path d="M8 24 V52 C8 58 12 62 16 62 V120 M16 24 V50 M24 24 V52 C24 58 20 62 16 62" stroke="%23141416" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M104 120 V24 C94 30 92 48 94 70 H104" stroke="%23141416" stroke-width="7" stroke-linecap="round" fill="none"/></g></svg>';

  // ../pwa/src/assets/stamp-gift.svg
  var stamp_gift_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="290" viewBox="0 0 240 290"><defs><mask id="p"><rect width="240" height="290" fill="white"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="0" cy="290" r="9" fill="black"/><circle cx="26" cy="0" r="9" fill="black"/><circle cx="26" cy="290" r="9" fill="black"/><circle cx="52" cy="0" r="9" fill="black"/><circle cx="52" cy="290" r="9" fill="black"/><circle cx="78" cy="0" r="9" fill="black"/><circle cx="78" cy="290" r="9" fill="black"/><circle cx="104" cy="0" r="9" fill="black"/><circle cx="104" cy="290" r="9" fill="black"/><circle cx="130" cy="0" r="9" fill="black"/><circle cx="130" cy="290" r="9" fill="black"/><circle cx="156" cy="0" r="9" fill="black"/><circle cx="156" cy="290" r="9" fill="black"/><circle cx="182" cy="0" r="9" fill="black"/><circle cx="182" cy="290" r="9" fill="black"/><circle cx="208" cy="0" r="9" fill="black"/><circle cx="208" cy="290" r="9" fill="black"/><circle cx="234" cy="0" r="9" fill="black"/><circle cx="234" cy="290" r="9" fill="black"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="240" cy="0" r="9" fill="black"/><circle cx="0" cy="26" r="9" fill="black"/><circle cx="240" cy="26" r="9" fill="black"/><circle cx="0" cy="52" r="9" fill="black"/><circle cx="240" cy="52" r="9" fill="black"/><circle cx="0" cy="78" r="9" fill="black"/><circle cx="240" cy="78" r="9" fill="black"/><circle cx="0" cy="104" r="9" fill="black"/><circle cx="240" cy="104" r="9" fill="black"/><circle cx="0" cy="130" r="9" fill="black"/><circle cx="240" cy="130" r="9" fill="black"/><circle cx="0" cy="156" r="9" fill="black"/><circle cx="240" cy="156" r="9" fill="black"/><circle cx="0" cy="182" r="9" fill="black"/><circle cx="240" cy="182" r="9" fill="black"/><circle cx="0" cy="208" r="9" fill="black"/><circle cx="240" cy="208" r="9" fill="black"/><circle cx="0" cy="234" r="9" fill="black"/><circle cx="240" cy="234" r="9" fill="black"/><circle cx="0" cy="260" r="9" fill="black"/><circle cx="240" cy="260" r="9" fill="black"/><circle cx="0" cy="286" r="9" fill="black"/><circle cx="240" cy="286" r="9" fill="black"/></mask></defs><rect width="240" height="290" fill="%23FFFFFF" mask="url(%23p)"/><rect x="22" y="22" width="196" height="246" rx="4" fill="%23FFE6CF"/><g transform="translate(60.0,75.0)"><rect x="12" y="52" width="96" height="76" rx="8" fill="%23FF6A1F" stroke="%23141416" stroke-width="7"/><rect x="4" y="34" width="112" height="24" rx="6" fill="%23FFFFFF" stroke="%23141416" stroke-width="7"/><path d="M60 34 V128" stroke="%23141416" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M60 34 C40 4 16 18 34 34 M60 34 C80 4 104 18 86 34" stroke="%23141416" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g></svg>';

  // ../pwa/src/assets/stamp-ticket.svg
  var stamp_ticket_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="290" viewBox="0 0 240 290"><defs><mask id="p"><rect width="240" height="290" fill="white"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="0" cy="290" r="9" fill="black"/><circle cx="26" cy="0" r="9" fill="black"/><circle cx="26" cy="290" r="9" fill="black"/><circle cx="52" cy="0" r="9" fill="black"/><circle cx="52" cy="290" r="9" fill="black"/><circle cx="78" cy="0" r="9" fill="black"/><circle cx="78" cy="290" r="9" fill="black"/><circle cx="104" cy="0" r="9" fill="black"/><circle cx="104" cy="290" r="9" fill="black"/><circle cx="130" cy="0" r="9" fill="black"/><circle cx="130" cy="290" r="9" fill="black"/><circle cx="156" cy="0" r="9" fill="black"/><circle cx="156" cy="290" r="9" fill="black"/><circle cx="182" cy="0" r="9" fill="black"/><circle cx="182" cy="290" r="9" fill="black"/><circle cx="208" cy="0" r="9" fill="black"/><circle cx="208" cy="290" r="9" fill="black"/><circle cx="234" cy="0" r="9" fill="black"/><circle cx="234" cy="290" r="9" fill="black"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="240" cy="0" r="9" fill="black"/><circle cx="0" cy="26" r="9" fill="black"/><circle cx="240" cy="26" r="9" fill="black"/><circle cx="0" cy="52" r="9" fill="black"/><circle cx="240" cy="52" r="9" fill="black"/><circle cx="0" cy="78" r="9" fill="black"/><circle cx="240" cy="78" r="9" fill="black"/><circle cx="0" cy="104" r="9" fill="black"/><circle cx="240" cy="104" r="9" fill="black"/><circle cx="0" cy="130" r="9" fill="black"/><circle cx="240" cy="130" r="9" fill="black"/><circle cx="0" cy="156" r="9" fill="black"/><circle cx="240" cy="156" r="9" fill="black"/><circle cx="0" cy="182" r="9" fill="black"/><circle cx="240" cy="182" r="9" fill="black"/><circle cx="0" cy="208" r="9" fill="black"/><circle cx="240" cy="208" r="9" fill="black"/><circle cx="0" cy="234" r="9" fill="black"/><circle cx="240" cy="234" r="9" fill="black"/><circle cx="0" cy="260" r="9" fill="black"/><circle cx="240" cy="260" r="9" fill="black"/><circle cx="0" cy="286" r="9" fill="black"/><circle cx="240" cy="286" r="9" fill="black"/></mask></defs><rect width="240" height="290" fill="%23FFFFFF" mask="url(%23p)"/><rect x="22" y="22" width="196" height="246" rx="4" fill="%23E3EFD6"/><g transform="translate(60.0,75.0)"><path d="M6 40 H114 V62 A12 12 0 0 0 114 86 V108 H6 V86 A12 12 0 0 0 6 62 Z" fill="%23FFFFFF" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><path d="M42 44 V104" stroke="%23141416" stroke-width="6" stroke-dasharray="8 8"/><circle cx="80" cy="74" r="14" fill="%23FF6A1F"/></g></svg>';

  // ../pwa/src/assets/stamp-car.svg
  var stamp_car_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="290" viewBox="0 0 240 290"><defs><mask id="p"><rect width="240" height="290" fill="white"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="0" cy="290" r="9" fill="black"/><circle cx="26" cy="0" r="9" fill="black"/><circle cx="26" cy="290" r="9" fill="black"/><circle cx="52" cy="0" r="9" fill="black"/><circle cx="52" cy="290" r="9" fill="black"/><circle cx="78" cy="0" r="9" fill="black"/><circle cx="78" cy="290" r="9" fill="black"/><circle cx="104" cy="0" r="9" fill="black"/><circle cx="104" cy="290" r="9" fill="black"/><circle cx="130" cy="0" r="9" fill="black"/><circle cx="130" cy="290" r="9" fill="black"/><circle cx="156" cy="0" r="9" fill="black"/><circle cx="156" cy="290" r="9" fill="black"/><circle cx="182" cy="0" r="9" fill="black"/><circle cx="182" cy="290" r="9" fill="black"/><circle cx="208" cy="0" r="9" fill="black"/><circle cx="208" cy="290" r="9" fill="black"/><circle cx="234" cy="0" r="9" fill="black"/><circle cx="234" cy="290" r="9" fill="black"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="240" cy="0" r="9" fill="black"/><circle cx="0" cy="26" r="9" fill="black"/><circle cx="240" cy="26" r="9" fill="black"/><circle cx="0" cy="52" r="9" fill="black"/><circle cx="240" cy="52" r="9" fill="black"/><circle cx="0" cy="78" r="9" fill="black"/><circle cx="240" cy="78" r="9" fill="black"/><circle cx="0" cy="104" r="9" fill="black"/><circle cx="240" cy="104" r="9" fill="black"/><circle cx="0" cy="130" r="9" fill="black"/><circle cx="240" cy="130" r="9" fill="black"/><circle cx="0" cy="156" r="9" fill="black"/><circle cx="240" cy="156" r="9" fill="black"/><circle cx="0" cy="182" r="9" fill="black"/><circle cx="240" cy="182" r="9" fill="black"/><circle cx="0" cy="208" r="9" fill="black"/><circle cx="240" cy="208" r="9" fill="black"/><circle cx="0" cy="234" r="9" fill="black"/><circle cx="240" cy="234" r="9" fill="black"/><circle cx="0" cy="260" r="9" fill="black"/><circle cx="240" cy="260" r="9" fill="black"/><circle cx="0" cy="286" r="9" fill="black"/><circle cx="240" cy="286" r="9" fill="black"/></mask></defs><rect width="240" height="290" fill="%23FFFFFF" mask="url(%23p)"/><rect x="22" y="22" width="196" height="246" rx="4" fill="%23FFF1B8"/><g transform="translate(60.0,75.0)"><path d="M8 84 V70 C8 64 12 60 18 58 L32 34 C34 30 38 28 42 28 H78 C82 28 86 30 88 34 L102 58 C108 60 112 64 112 70 V84 C112 88 110 90 106 90 H14 C10 90 8 88 8 84 Z" fill="%23FF6A1F" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><path d="M38 38 H82 L92 58 H28 Z" fill="%23FFFFFF" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><circle cx="32" cy="92" r="13" fill="%23FFFFFF" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><circle cx="88" cy="92" r="13" fill="%23FFFFFF" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/></g></svg>';

  // ../pwa/src/assets/stamp-bag.svg
  var stamp_bag_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="290" viewBox="0 0 240 290"><defs><mask id="p"><rect width="240" height="290" fill="white"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="0" cy="290" r="9" fill="black"/><circle cx="26" cy="0" r="9" fill="black"/><circle cx="26" cy="290" r="9" fill="black"/><circle cx="52" cy="0" r="9" fill="black"/><circle cx="52" cy="290" r="9" fill="black"/><circle cx="78" cy="0" r="9" fill="black"/><circle cx="78" cy="290" r="9" fill="black"/><circle cx="104" cy="0" r="9" fill="black"/><circle cx="104" cy="290" r="9" fill="black"/><circle cx="130" cy="0" r="9" fill="black"/><circle cx="130" cy="290" r="9" fill="black"/><circle cx="156" cy="0" r="9" fill="black"/><circle cx="156" cy="290" r="9" fill="black"/><circle cx="182" cy="0" r="9" fill="black"/><circle cx="182" cy="290" r="9" fill="black"/><circle cx="208" cy="0" r="9" fill="black"/><circle cx="208" cy="290" r="9" fill="black"/><circle cx="234" cy="0" r="9" fill="black"/><circle cx="234" cy="290" r="9" fill="black"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="240" cy="0" r="9" fill="black"/><circle cx="0" cy="26" r="9" fill="black"/><circle cx="240" cy="26" r="9" fill="black"/><circle cx="0" cy="52" r="9" fill="black"/><circle cx="240" cy="52" r="9" fill="black"/><circle cx="0" cy="78" r="9" fill="black"/><circle cx="240" cy="78" r="9" fill="black"/><circle cx="0" cy="104" r="9" fill="black"/><circle cx="240" cy="104" r="9" fill="black"/><circle cx="0" cy="130" r="9" fill="black"/><circle cx="240" cy="130" r="9" fill="black"/><circle cx="0" cy="156" r="9" fill="black"/><circle cx="240" cy="156" r="9" fill="black"/><circle cx="0" cy="182" r="9" fill="black"/><circle cx="240" cy="182" r="9" fill="black"/><circle cx="0" cy="208" r="9" fill="black"/><circle cx="240" cy="208" r="9" fill="black"/><circle cx="0" cy="234" r="9" fill="black"/><circle cx="240" cy="234" r="9" fill="black"/><circle cx="0" cy="260" r="9" fill="black"/><circle cx="240" cy="260" r="9" fill="black"/><circle cx="0" cy="286" r="9" fill="black"/><circle cx="240" cy="286" r="9" fill="black"/></mask></defs><rect width="240" height="290" fill="%23FFFFFF" mask="url(%23p)"/><rect x="22" y="22" width="196" height="246" rx="4" fill="%23CFE6F2"/><g transform="translate(60.0,75.0)"><path d="M16 42 H104 L110 124 H10 Z" fill="%23FF6A1F" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><path d="M40 56 V34 C40 20 48 12 60 12 C72 12 80 20 80 34 V56" stroke="%23141416" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="40" cy="58" r="5" fill="%23141416"/><circle cx="80" cy="58" r="5" fill="%23141416"/></g></svg>';

  // ../pwa/src/assets/stamp-balloon.svg
  var stamp_balloon_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="290" viewBox="0 0 240 290"><defs><mask id="p"><rect width="240" height="290" fill="white"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="0" cy="290" r="9" fill="black"/><circle cx="26" cy="0" r="9" fill="black"/><circle cx="26" cy="290" r="9" fill="black"/><circle cx="52" cy="0" r="9" fill="black"/><circle cx="52" cy="290" r="9" fill="black"/><circle cx="78" cy="0" r="9" fill="black"/><circle cx="78" cy="290" r="9" fill="black"/><circle cx="104" cy="0" r="9" fill="black"/><circle cx="104" cy="290" r="9" fill="black"/><circle cx="130" cy="0" r="9" fill="black"/><circle cx="130" cy="290" r="9" fill="black"/><circle cx="156" cy="0" r="9" fill="black"/><circle cx="156" cy="290" r="9" fill="black"/><circle cx="182" cy="0" r="9" fill="black"/><circle cx="182" cy="290" r="9" fill="black"/><circle cx="208" cy="0" r="9" fill="black"/><circle cx="208" cy="290" r="9" fill="black"/><circle cx="234" cy="0" r="9" fill="black"/><circle cx="234" cy="290" r="9" fill="black"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="240" cy="0" r="9" fill="black"/><circle cx="0" cy="26" r="9" fill="black"/><circle cx="240" cy="26" r="9" fill="black"/><circle cx="0" cy="52" r="9" fill="black"/><circle cx="240" cy="52" r="9" fill="black"/><circle cx="0" cy="78" r="9" fill="black"/><circle cx="240" cy="78" r="9" fill="black"/><circle cx="0" cy="104" r="9" fill="black"/><circle cx="240" cy="104" r="9" fill="black"/><circle cx="0" cy="130" r="9" fill="black"/><circle cx="240" cy="130" r="9" fill="black"/><circle cx="0" cy="156" r="9" fill="black"/><circle cx="240" cy="156" r="9" fill="black"/><circle cx="0" cy="182" r="9" fill="black"/><circle cx="240" cy="182" r="9" fill="black"/><circle cx="0" cy="208" r="9" fill="black"/><circle cx="240" cy="208" r="9" fill="black"/><circle cx="0" cy="234" r="9" fill="black"/><circle cx="240" cy="234" r="9" fill="black"/><circle cx="0" cy="260" r="9" fill="black"/><circle cx="240" cy="260" r="9" fill="black"/><circle cx="0" cy="286" r="9" fill="black"/><circle cx="240" cy="286" r="9" fill="black"/></mask></defs><rect width="240" height="290" fill="%23FFFFFF" mask="url(%23p)"/><rect x="22" y="22" width="196" height="246" rx="4" fill="%23E3EFD6"/><g transform="translate(60.0,75.0)"><path d="M60 8 C28 8 12 32 16 56 C20 76 44 90 52 98 H68 C76 90 100 76 104 56 C108 32 92 8 60 8 Z" fill="%23FF6A1F" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><path d="M60 8 C46 30 46 70 54 98 M60 8 C74 30 74 70 66 98" stroke="%23141416" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M52 98 L50 112 M68 98 L70 112" stroke="%23141416" stroke-width="7" stroke-linecap="round" fill="none"/><rect x="44" y="110" width="32" height="20" rx="4" fill="%23FFFFFF" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/></g></svg>';

  // ../pwa/src/assets/stamp-music.svg
  var stamp_music_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="290" viewBox="0 0 240 290"><defs><mask id="p"><rect width="240" height="290" fill="white"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="0" cy="290" r="9" fill="black"/><circle cx="26" cy="0" r="9" fill="black"/><circle cx="26" cy="290" r="9" fill="black"/><circle cx="52" cy="0" r="9" fill="black"/><circle cx="52" cy="290" r="9" fill="black"/><circle cx="78" cy="0" r="9" fill="black"/><circle cx="78" cy="290" r="9" fill="black"/><circle cx="104" cy="0" r="9" fill="black"/><circle cx="104" cy="290" r="9" fill="black"/><circle cx="130" cy="0" r="9" fill="black"/><circle cx="130" cy="290" r="9" fill="black"/><circle cx="156" cy="0" r="9" fill="black"/><circle cx="156" cy="290" r="9" fill="black"/><circle cx="182" cy="0" r="9" fill="black"/><circle cx="182" cy="290" r="9" fill="black"/><circle cx="208" cy="0" r="9" fill="black"/><circle cx="208" cy="290" r="9" fill="black"/><circle cx="234" cy="0" r="9" fill="black"/><circle cx="234" cy="290" r="9" fill="black"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="240" cy="0" r="9" fill="black"/><circle cx="0" cy="26" r="9" fill="black"/><circle cx="240" cy="26" r="9" fill="black"/><circle cx="0" cy="52" r="9" fill="black"/><circle cx="240" cy="52" r="9" fill="black"/><circle cx="0" cy="78" r="9" fill="black"/><circle cx="240" cy="78" r="9" fill="black"/><circle cx="0" cy="104" r="9" fill="black"/><circle cx="240" cy="104" r="9" fill="black"/><circle cx="0" cy="130" r="9" fill="black"/><circle cx="240" cy="130" r="9" fill="black"/><circle cx="0" cy="156" r="9" fill="black"/><circle cx="240" cy="156" r="9" fill="black"/><circle cx="0" cy="182" r="9" fill="black"/><circle cx="240" cy="182" r="9" fill="black"/><circle cx="0" cy="208" r="9" fill="black"/><circle cx="240" cy="208" r="9" fill="black"/><circle cx="0" cy="234" r="9" fill="black"/><circle cx="240" cy="234" r="9" fill="black"/><circle cx="0" cy="260" r="9" fill="black"/><circle cx="240" cy="260" r="9" fill="black"/><circle cx="0" cy="286" r="9" fill="black"/><circle cx="240" cy="286" r="9" fill="black"/></mask></defs><rect width="240" height="290" fill="%23FFFFFF" mask="url(%23p)"/><rect x="22" y="22" width="196" height="246" rx="4" fill="%23E3EFD6"/><g transform="translate(60.0,75.0)"><path d="M44 102 V26 L100 14 V90" stroke="%23141416" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M44 42 L100 30" stroke="%23141416" stroke-width="7" stroke-linecap="round" fill="none"/><ellipse cx="32" cy="102" rx="16" ry="12" fill="%23FF6A1F" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><ellipse cx="88" cy="90" rx="16" ry="12" fill="%23FF6A1F" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/></g></svg>';

  // ../pwa/src/assets/stamp-takeaway.svg
  var stamp_takeaway_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="290" viewBox="0 0 240 290"><defs><mask id="p"><rect width="240" height="290" fill="white"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="0" cy="290" r="9" fill="black"/><circle cx="26" cy="0" r="9" fill="black"/><circle cx="26" cy="290" r="9" fill="black"/><circle cx="52" cy="0" r="9" fill="black"/><circle cx="52" cy="290" r="9" fill="black"/><circle cx="78" cy="0" r="9" fill="black"/><circle cx="78" cy="290" r="9" fill="black"/><circle cx="104" cy="0" r="9" fill="black"/><circle cx="104" cy="290" r="9" fill="black"/><circle cx="130" cy="0" r="9" fill="black"/><circle cx="130" cy="290" r="9" fill="black"/><circle cx="156" cy="0" r="9" fill="black"/><circle cx="156" cy="290" r="9" fill="black"/><circle cx="182" cy="0" r="9" fill="black"/><circle cx="182" cy="290" r="9" fill="black"/><circle cx="208" cy="0" r="9" fill="black"/><circle cx="208" cy="290" r="9" fill="black"/><circle cx="234" cy="0" r="9" fill="black"/><circle cx="234" cy="290" r="9" fill="black"/><circle cx="0" cy="0" r="9" fill="black"/><circle cx="240" cy="0" r="9" fill="black"/><circle cx="0" cy="26" r="9" fill="black"/><circle cx="240" cy="26" r="9" fill="black"/><circle cx="0" cy="52" r="9" fill="black"/><circle cx="240" cy="52" r="9" fill="black"/><circle cx="0" cy="78" r="9" fill="black"/><circle cx="240" cy="78" r="9" fill="black"/><circle cx="0" cy="104" r="9" fill="black"/><circle cx="240" cy="104" r="9" fill="black"/><circle cx="0" cy="130" r="9" fill="black"/><circle cx="240" cy="130" r="9" fill="black"/><circle cx="0" cy="156" r="9" fill="black"/><circle cx="240" cy="156" r="9" fill="black"/><circle cx="0" cy="182" r="9" fill="black"/><circle cx="240" cy="182" r="9" fill="black"/><circle cx="0" cy="208" r="9" fill="black"/><circle cx="240" cy="208" r="9" fill="black"/><circle cx="0" cy="234" r="9" fill="black"/><circle cx="240" cy="234" r="9" fill="black"/><circle cx="0" cy="260" r="9" fill="black"/><circle cx="240" cy="260" r="9" fill="black"/><circle cx="0" cy="286" r="9" fill="black"/><circle cx="240" cy="286" r="9" fill="black"/></mask></defs><rect width="240" height="290" fill="%23FFFFFF" mask="url(%23p)"/><rect x="22" y="22" width="196" height="246" rx="4" fill="%23FFE6CF"/><g transform="translate(60.0,75.0)"><path d="M18 40 H102 L94 124 H26 Z" fill="%23FFFFFF" stroke="%23141416" stroke-width="7" stroke-linejoin="round"/><path d="M40 40 V28 C40 16 48 10 60 10 C72 10 80 16 80 28 V40" stroke="%23141416" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="60" cy="80" r="18" fill="%23FF6A1F" stroke="%23141416" stroke-width="6"/><path d="M52 80 L58 86 L70 74" stroke="%23FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g></svg>';

  // src/art.ts
  var ART = { flight: scene_flight_default, lisbon: scene_lisbon_default, pool: scene_pool_default, room: scene_room_default, food: scene_food_default, car: scene_car_default, cinema: scene_cinema_default, jacket: scene_jacket_default, torn: torn_lisbon_default, stampPlane: stamp_plane_default, stampHotel: stamp_hotel_default, stampDining: stamp_dining_default, stampGift: stamp_gift_default, stampTicket: stamp_ticket_default, stampCar: stamp_car_default, stampBag: stamp_bag_default, stampBalloon: stamp_balloon_default, stampMusic: stamp_music_default, stampTakeaway: stamp_takeaway_default };

  // src/base.tsx
  function Meta({ items, className }) {
    const list = items.filter(Boolean);
    return /* @__PURE__ */ React.createElement("div", { className: cx("gr-meta", className) }, list.map((x, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { display: "inline-flex", alignItems: "center", columnGap: 6, whiteSpace: i > 0 ? "nowrap" : void 0 } }, i > 0 && /* @__PURE__ */ React.createElement("span", { className: "gr-dot", style: { width: 3, height: 3, borderRadius: 2, background: "var(--ink-faint)", display: "inline-block" } }), /* @__PURE__ */ React.createElement("span", { style: { whiteSpace: "normal" } }, x))));
  }
  function Label({ children }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-label" }, children);
  }
  function Price({ amount, was, points, pointsCash, note, size, align = "right" }) {
    const M = useMarket();
    const dp = amount % 1 ? 2 : 0;
    return /* @__PURE__ */ React.createElement("div", { className: cx("gr-price", size === "lg" && "gr-lg", align === "left" && "gr-left") }, was != null && /* @__PURE__ */ React.createElement("s", null, M.money(was)), /* @__PURE__ */ React.createElement("b", null, M.money(amount, dp)), points != null && /* @__PURE__ */ React.createElement("span", { className: "gr-pts" }, M.t("orPts", { n: M.num(points) }), pointsCash ? ` + ${M.money(pointsCash)}` : ""), note && /* @__PURE__ */ React.createElement("small", null, note));
  }
  function Back({ children }) {
    return /* @__PURE__ */ React.createElement("span", { className: "gr-back" }, /* @__PURE__ */ React.createElement(Spark, { size: 12 }), children);
  }
  function Badge({ tone, icon, children }) {
    return /* @__PURE__ */ React.createElement("span", { className: cx("gr-badge", tone && "gr-" + tone) }, icon && /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 13, stroke: 2.2 }), children);
  }
  function Status({ tone = "good", live, children }) {
    const c = tone === "good" ? "var(--good)" : tone === "warn" ? "var(--warn)" : "var(--danger)";
    return /* @__PURE__ */ React.createElement("span", { className: cx("gr-status", live && "gr-live"), style: { color: c } }, /* @__PURE__ */ React.createElement("i", null), children);
  }
  function Skeleton({ w = "100%", h = 14, r }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-skel", style: { width: w, height: h, borderRadius: r } });
  }
  function Button({ variant = "primary", size, block, icon, iconRight, loading, disabled, children, onClick, ...rest }) {
    return /* @__PURE__ */ React.createElement("button", { className: cx("gr-btn", "gr-btn-" + variant, size && "gr-btn-" + size, block && "gr-btn-block"), disabled: disabled || loading, onClick, ...rest }, loading ? /* @__PURE__ */ React.createElement("span", { className: "gr-spin", "aria-hidden": "true" }) : icon && /* @__PURE__ */ React.createElement(Icon, { name: icon, size: size === "sm" ? 16 : 18, stroke: 2.1 }), children, iconRight && !loading && /* @__PURE__ */ React.createElement(Icon, { name: iconRight, size: 16, stroke: 2.2 }));
  }
  function IconButton({ icon, label, dark, flat, small, dot, onClick }) {
    return /* @__PURE__ */ React.createElement("button", { className: cx("gr-ibtn", dark && "gr-dark", flat && "gr-flat", small && "gr-sm"), "aria-label": label, onClick }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: small ? 18 : 20, stroke: 2.1 }), dot && /* @__PURE__ */ React.createElement("span", { className: "gr-badge-dot" }));
  }
  function Chips({ items, value, multi, onChange, wrap }) {
    const norm = items.map((x) => typeof x === "string" ? { id: x, label: x } : x);
    const [own, setOwn] = useState(value != null ? value : multi ? [] : null);
    const cur = value != null ? value : own;
    const on = (id) => multi ? cur.includes(id) : cur === id;
    const tap = (id) => {
      const next = multi ? on(id) ? cur.filter((x) => x !== id) : [...cur, id] : on(id) ? null : id;
      setOwn(next);
      onChange == null ? void 0 : onChange(next);
    };
    return /* @__PURE__ */ React.createElement("div", { className: cx("gr-chips", wrap && "gr-wrap"), role: "group" }, norm.map((c) => /* @__PURE__ */ React.createElement("button", { key: c.id, className: "gr-chip", "aria-pressed": on(c.id), onClick: () => tap(c.id) }, c.icon && /* @__PURE__ */ React.createElement(Icon, { name: c.icon, size: 15, stroke: 2.1 }), c.label, c.count != null && /* @__PURE__ */ React.createElement("span", { className: "gr-count" }, c.count))));
  }
  function Segmented({ items, value, onChange, dark }) {
    const [own, setOwn] = useState(value != null ? value : items[0]);
    const cur = value != null ? value : own;
    return /* @__PURE__ */ React.createElement("div", { className: cx("gr-seg", dark && "gr-seg-dark"), role: "tablist" }, items.map((x) => /* @__PURE__ */ React.createElement("button", { key: x, role: "tab", "aria-selected": cur === x, onClick: () => {
      setOwn(x);
      onChange == null ? void 0 : onChange(x);
    } }, x)));
  }
  function Toggle({ on, onChange, label }) {
    const [own, setOwn] = useState(!!on);
    const cur = on != null ? on : own;
    return /* @__PURE__ */ React.createElement("button", { role: "switch", "aria-checked": cur, "aria-label": label, className: "gr-toggle", onClick: () => {
      setOwn(!cur);
      onChange == null ? void 0 : onChange(!cur);
    } });
  }
  function Stepper({ value, min = 0, max = 9, onChange, label }) {
    const M = useMarket();
    const [own, setOwn] = useState(value != null ? value : min);
    const cur = value != null ? value : own;
    const set = (v) => {
      setOwn(v);
      onChange == null ? void 0 : onChange(v);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "gr-stepper", role: "group", "aria-label": label }, /* @__PURE__ */ React.createElement("button", { "aria-label": M.t("fewer", { x: label }), disabled: cur <= min, onClick: () => set(cur - 1) }, /* @__PURE__ */ React.createElement(Icon, { name: "minus", size: 16, stroke: 2.4 })), /* @__PURE__ */ React.createElement("output", { "aria-live": "polite" }, M.num(cur)), /* @__PURE__ */ React.createElement("button", { "aria-label": M.t("more", { x: label }), disabled: cur >= max, onClick: () => set(cur + 1) }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 16, stroke: 2.4 })));
  }
  function NavBar({ items, current = "home", onChange }) {
    const M = useMarket();
    items = items || [{ id: "home", icon: "home", label: M.t("home") }, { id: "rewards", icon: "gift", label: M.t("rewards") }, { id: "trips", icon: "plane", label: M.t("trips") }, { id: "me", icon: "user", label: M.t("me") }];
    const [own, setOwn] = useState(current);
    const cur = onChange ? current : own;
    return /* @__PURE__ */ React.createElement("nav", { className: "gr-nav", "aria-label": M.t("main") }, items.map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, "aria-current": cur === t.id ? "page" : void 0, "aria-label": t.label, onClick: () => {
      setOwn(t.id);
      onChange == null ? void 0 : onChange(t.id);
    } }, /* @__PURE__ */ React.createElement(Icon, { name: t.icon, size: 20, stroke: 2.1 }), cur === t.id && t.label)));
  }
  function PaperClip() {
    return /* @__PURE__ */ React.createElement("svg", { className: "gr-clip", viewBox: "0 0 40 96", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M28 30V76a10 10 0 0 1-20 0V16a12 12 0 0 1 24 0v54a4 4 0 0 1-8 0V30", fill: "none", stroke: "#9A9CA3", strokeWidth: "4.5", strokeLinecap: "round" }));
  }
  function Polaroid({ src, caption, tilt = -3, width = 200, clip }) {
    return /* @__PURE__ */ React.createElement("figure", { className: "gr-polaroid", style: { ["--tilt"]: tilt + "deg", width, margin: 0 } }, clip && /* @__PURE__ */ React.createElement(PaperClip, null), /* @__PURE__ */ React.createElement("div", { className: "gr-ph" }, /* @__PURE__ */ React.createElement("img", { src, alt: caption || "" })), caption && /* @__PURE__ */ React.createElement("figcaption", { className: "gr-hand" }, caption));
  }
  function StickyNote({ title, children, tone = "yellow", tilt = -1.2, action, secondary, onAction, onSecondary, from: fromIn, clip = true, width = 330 }) {
    const M = useMarket();
    const from = fromIn === void 0 ? M.t(tone === "blue" ? "yourNote" : "fromGratifi") : fromIn;
    return /* @__PURE__ */ React.createElement("div", { className: cx("gr-sticky", tone === "blue" && "gr-blue"), style: { ["--tilt"]: tilt + "deg", maxWidth: width } }, clip && /* @__PURE__ */ React.createElement(PaperClip, null), /* @__PURE__ */ React.createElement("div", { className: "gr-hand" }, title), children && /* @__PURE__ */ React.createElement("p", null, children), (action || secondary) && /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between", marginTop: 4 } }, action && /* @__PURE__ */ React.createElement(Button, { size: "sm", onClick: onAction }, action), secondary && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", onClick: onSecondary }, secondary)), from && /* @__PURE__ */ React.createElement("div", { className: "gr-from" }, tone !== "blue" && /* @__PURE__ */ React.createElement(Spark, { size: 12 }), from));
  }
  function Stamp({ art = ART.stampPlane, value, name, tilt = 2 }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-stamp", style: { ["--tilt"]: tilt + "deg" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-art" }, /* @__PURE__ */ React.createElement("img", { src: art, alt: "" })), (value || name) && /* @__PURE__ */ React.createElement("div", { className: "gr-sv" }, /* @__PURE__ */ React.createElement("span", null, name), /* @__PURE__ */ React.createElement("span", null, value)));
  }
  function Sticker({ children, tone = "accent", tilt = -6, icon }) {
    return /* @__PURE__ */ React.createElement("span", { className: cx("gr-sticker", tone !== "accent" && "gr-" + tone), style: { ["--tilt"]: tilt + "deg" } }, icon && /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 14, stroke: 2.4 }), children);
  }
  function TripFolder({ title, dates, photos = [], items = [], people = [], onOpen }) {
    const M = useMarket();
    const spots = [{ left: "46%", r: -8 }, { left: "62%", r: 4 }, { left: "78%", r: 12 }];
    return /* @__PURE__ */ React.createElement("div", { className: "gr-folder" }, photos.slice(0, 3).map((p, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "gr-peek", style: { left: spots[i].left, transform: `rotate(${spots[i].r}deg)`, zIndex: i } }, /* @__PURE__ */ React.createElement("img", { src: p, alt: "" }))), /* @__PURE__ */ React.createElement("div", { className: "gr-tab" }), /* @__PURE__ */ React.createElement("button", { className: "gr-fbody", onClick: onOpen, style: { textAlign: "start", width: "100%" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-col", style: { gap: 2 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-title" }, title), /* @__PURE__ */ React.createElement(Meta, { items: [dates, M.t("nOfBooked", { a: items.filter((i) => i.done).length, b: items.length })] })), people.length > 0 && /* @__PURE__ */ React.createElement(AvatarStack, { people })), /* @__PURE__ */ React.createElement("div", { className: "gr-col", style: { gap: 8 } }, items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "gr-row", style: { gap: 10 } }, /* @__PURE__ */ React.createElement("span", { className: "gr-ibtn gr-flat gr-sm", style: { width: 32, height: 32 } }, /* @__PURE__ */ React.createElement(Icon, { name: it.icon, size: 16 })), /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, it.title), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, it.meta)), it.done ? /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 18, color: "var(--good)", stroke: 2.4 }) : /* @__PURE__ */ React.createElement(Badge, { tone: "warn" }, M.t("toBook")))))));
  }
  function Dial({ value, label, progress = 0.6, size = 200, goal }) {
    const M = useMarket();
    label = label != null ? label : M.t("points");
    const n = 48, r1 = size / 2 - 6, r2 = size / 2 - 20, c = size / 2;
    const ticks = Array.from({ length: n }, (_, i) => {
      const a = (-220 + i / (n - 1) * 260) * Math.PI / 180;
      const on = i / (n - 1) <= progress;
      return /* @__PURE__ */ React.createElement("line", { key: i, x1: c + r1 * Math.cos(a), y1: c + r1 * Math.sin(a), x2: c + r2 * Math.cos(a), y2: c + r2 * Math.sin(a), stroke: on ? "var(--accent)" : "var(--ink-faint)", strokeWidth: on ? 3.2 : 2.2, strokeLinecap: "round" });
    });
    const core = size * 0.58;
    return /* @__PURE__ */ React.createElement("div", { className: "gr-dial", style: { width: size, height: size, marginBottom: goal ? 30 : 0 }, role: "img", "aria-label": `${value} ${label}${goal ? ", " + goal : ""}` }, /* @__PURE__ */ React.createElement("svg", { width: size, height: size }, ticks), /* @__PURE__ */ React.createElement("div", { className: "gr-core", style: { width: core, height: core } }, /* @__PURE__ */ React.createElement("b", null, typeof value === "number" ? M.num(value) : value), /* @__PURE__ */ React.createElement("span", null, label)), goal && /* @__PURE__ */ React.createElement("div", { className: "gr-meta", style: { position: "absolute", top: "100%", marginTop: 6, justifyContent: "center", textAlign: "center", width: size + 60, left: -30 } }, goal));
  }
  function CheckPop({ size = 64, animate = true }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("span", { className: cx("gr-check", animate && "gr-pop"), style: { ["--size"]: size + "px" }, role: "img", "aria-label": M.t("done") }, /* @__PURE__ */ React.createElement("svg", { width: size * 0.55, height: size * 0.55, viewBox: "0 0 100 100" }, /* @__PURE__ */ React.createElement("path", { d: "M24 52 42 69 76 34", fill: "none", stroke: "var(--on-accent)", strokeWidth: "12", strokeLinecap: "round", strokeLinejoin: "round" })));
  }
  function AvatarStack({ people, max = 3 }) {
    const shown = people.slice(0, max), more = people.length - shown.length;
    return /* @__PURE__ */ React.createElement("div", { className: "gr-avatars", "aria-label": people.map((p) => p.name).join(", ") }, shown.map((p) => /* @__PURE__ */ React.createElement("span", { key: p.name, className: "gr-av" }, p.src ? /* @__PURE__ */ React.createElement("img", { src: p.src, alt: "" }) : p.name.split(" ").map((s) => s[0]).join("").slice(0, 2))), more > 0 && /* @__PURE__ */ React.createElement("span", { className: "gr-av gr-more" }, "+", more));
  }

  // src/talk.tsx
  var talk_exports = {};
  __export(talk_exports, {
    Answer: () => Answer,
    AskBar: () => AskBar,
    Compare: () => Compare,
    ConfirmSheet: () => ConfirmSheet,
    FilterBar: () => FilterBar,
    Handoff: () => Handoff,
    Moment: () => Moment,
    OfferCard: () => OfferCard,
    PayWith: () => PayWith,
    PointsSlider: () => PointsSlider,
    PriceCalendar: () => PriceCalendar,
    PriceLines: () => PriceLines,
    ProductCard: () => ProductCard,
    Rail: () => Rail,
    Receipt: () => Receipt,
    SendTo: () => SendTo,
    StateCard: () => StateCard,
    Steps: () => Steps,
    Suggestions: () => Suggestions,
    Toast: () => Toast,
    Travellers: () => Travellers,
    Typing: () => Typing,
    YouSaid: () => YouSaid
  });
  function AskBar({ placeholder, value, listening, onSend, onMic }) {
    const M = useMarket();
    const [t, setT] = useState(value || "");
    return /* @__PURE__ */ React.createElement("form", { className: cx("gr-ask", listening && "gr-listening"), onSubmit: (e) => {
      e.preventDefault();
      if (t.trim()) {
        onSend == null ? void 0 : onSend(t);
        setT("");
      }
    } }, /* @__PURE__ */ React.createElement(Spark, { size: 18 }), listening ? /* @__PURE__ */ React.createElement("span", { className: "gr-wave", role: "status", "aria-label": M.t("listening") }, /* @__PURE__ */ React.createElement("span", { className: "gr-meta", style: { marginInlineEnd: 8, color: "var(--ink)" } }, M.t("listening")), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => /* @__PURE__ */ React.createElement("i", { key: i, style: { animationDelay: `${i % 5 * 0.12}s`, height: [8, 14, 20, 12, 18, 10, 22, 14, 9, 16, 12, 7][i] } }))) : /* @__PURE__ */ React.createElement("input", { "aria-label": M.t("askLabel"), placeholder: placeholder != null ? placeholder : M.t("ask"), value: t, onChange: (e) => setT(e.target.value) }), t && !listening ? /* @__PURE__ */ React.createElement("button", { type: "submit", className: "gr-send", "aria-label": M.t("send") }, /* @__PURE__ */ React.createElement(Icon, { name: "up", size: 20, stroke: 2.4 })) : /* @__PURE__ */ React.createElement("button", { type: "button", className: "gr-mic", "aria-label": listening ? M.t("stopListening") : M.t("speak"), onClick: onMic }, /* @__PURE__ */ React.createElement(Icon, { name: "mic", size: 20, stroke: 2.1 })));
  }
  function YouSaid({ children }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-you" }, children);
  }
  function Steps({ steps, running }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-steps", "aria-live": "polite" }, steps.map((s, i) => {
      const now = running && i === steps.length - 1;
      return /* @__PURE__ */ React.createElement("div", { key: s, className: cx("gr-step", now && "gr-now"), style: { animationDelay: `${i * 0.12}s` } }, /* @__PURE__ */ React.createElement("span", { className: "gr-tick" }, !now && /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 12, stroke: 3 })), s);
    }));
  }
  function Answer({ steps, say, children, actions, source }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-answer" }, steps && /* @__PURE__ */ React.createElement(Steps, { steps }), /* @__PURE__ */ React.createElement("div", { className: "gr-say" }, say), children, actions && actions.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "gr-actions" }, actions.slice(0, 3).map((a, i) => /* @__PURE__ */ React.createElement(Button, { key: a.label, size: "sm", variant: a.primary || i === 0 && !actions.some((x) => x.primary) ? "primary" : "secondary", icon: a.icon, onClick: a.onClick }, a.label))), source && /* @__PURE__ */ React.createElement("div", { className: "gr-source" }, /* @__PURE__ */ React.createElement(Icon, { name: "doc", size: 13 }), source));
  }
  function Typing() {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("div", { className: "gr-typing", role: "status", "aria-label": M.t("working") }, /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null));
  }
  function Suggestions({ items, onPick }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-chips gr-wrap" }, items.map((s) => /* @__PURE__ */ React.createElement("button", { key: s, className: "gr-chip gr-suggest", onClick: () => onPick == null ? void 0 : onPick(s) }, s)));
  }
  function Moment(props) {
    return /* @__PURE__ */ React.createElement(StickyNote, { ...props });
  }
  function Handoff({ name = "Priya", role = "travel team", wait = "Joins in about 2 minutes", onCall, onChat }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { maxWidth: 360 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-row" }, /* @__PURE__ */ React.createElement("span", { className: "gr-av", style: { width: 48, height: 48, fontSize: 15, border: 0 } }, name[0]), /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { className: "gr-heading" }, M.t("handoffWho", { name, role })), /* @__PURE__ */ React.createElement(Meta, { items: [wait, M.t("handoffHas")] }))), /* @__PURE__ */ React.createElement("div", { className: "gr-banner gr-info" }, /* @__PURE__ */ React.createElement(Icon, { name: "info", size: 18 }), /* @__PURE__ */ React.createElement("span", null, M.t("handoffNote", { name }))), /* @__PURE__ */ React.createElement("div", { className: "gr-actions" }, /* @__PURE__ */ React.createElement(Button, { icon: "chat", onClick: onChat }, M.t("chatNow")), /* @__PURE__ */ React.createElement(Button, { variant: "secondary", icon: "phone", onClick: onCall }, M.t("callMe"))));
  }
  function Toast({ children, undo, onUndo }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-toast", role: "status" }, /* @__PURE__ */ React.createElement("span", { className: "gr-grow" }, children), undo && /* @__PURE__ */ React.createElement("button", { className: "gr-undo", onClick: onUndo }, undo));
  }
  function Rail({ title, more, onMore, children }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-col", style: { gap: 12, width: "100%" } }, (title || more) && /* @__PURE__ */ React.createElement("div", { className: "gr-railhead" }, title && /* @__PURE__ */ React.createElement("div", { className: "gr-heading" }, title), more && /* @__PURE__ */ React.createElement("button", { className: "gr-link", onClick: onMore }, more)), /* @__PURE__ */ React.createElement("div", { className: "gr-rail" }, children));
  }
  function OfferCard({ brand, mono, color = "var(--card-sunk)", rate, sub, why, added, onAdd }) {
    const M = useMarket();
    const [on, setOn] = useState(!!added);
    return /* @__PURE__ */ React.createElement("div", { className: "gr-offer" }, /* @__PURE__ */ React.createElement("div", { className: "gr-logo", style: { background: color, color: "#fff" } }, mono), /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { className: "gr-rate" }, rate), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, brand), why ? /* @__PURE__ */ React.createElement("div", { className: "gr-meta", style: { color: "var(--accent-ink)", flexWrap: "nowrap", gap: 4 } }, /* @__PURE__ */ React.createElement(Spark, { size: 11 }), /* @__PURE__ */ React.createElement("span", null, why)) : /* @__PURE__ */ React.createElement(Meta, { items: [sub] })), /* @__PURE__ */ React.createElement(Button, { size: "sm", variant: on ? "quiet" : "primary", icon: on ? "check" : void 0, onClick: () => {
      setOn(!on);
      onAdd == null ? void 0 : onAdd(!on);
    } }, on ? M.t("added") : M.t("add")));
  }
  function ProductCard({ src, name, meta, price, points, badge, back }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("button", { className: "gr-product", style: { textAlign: "start" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-ph" }, /* @__PURE__ */ React.createElement("img", { src, alt: "" }), badge && /* @__PURE__ */ React.createElement("span", { className: "gr-badge" }, badge)), /* @__PURE__ */ React.createElement("div", { className: "gr-in" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650, fontSize: 15, lineHeight: "20px" } }, name), meta && /* @__PURE__ */ React.createElement(Meta, { items: meta }), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-price gr-left" }, /* @__PURE__ */ React.createElement("b", { style: { fontSize: 17 } }, M.money(price)), points && /* @__PURE__ */ React.createElement("span", { className: "gr-pts" }, M.t("orPts", { n: M.num(points) }))), back && /* @__PURE__ */ React.createElement("span", { className: "gr-back" }, back))));
  }
  function Compare({ columns, rows, best }) {
    const M = useMarket();
    const cell = (v) => v === true ? /* @__PURE__ */ React.createElement("span", { className: "gr-yes" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 15, stroke: 2.6 }), M.t("yes")) : v === false ? /* @__PURE__ */ React.createElement("span", { className: "gr-no" }, /* @__PURE__ */ React.createElement(Icon, { name: "minus", size: 15 }), M.t("no")) : v;
    return /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { padding: 8, overflowX: "auto", maxWidth: 380 } }, /* @__PURE__ */ React.createElement("table", { className: "gr-compare" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null), columns.map((c, i) => /* @__PURE__ */ React.createElement("th", { key: c, className: i === best ? "gr-best" : void 0 }, c, i === best && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4 } }, /* @__PURE__ */ React.createElement(Badge, { tone: "accent" }, M.t("bestForYou"))))))), /* @__PURE__ */ React.createElement("tbody", null, rows.map((r) => /* @__PURE__ */ React.createElement("tr", { key: r.label }, /* @__PURE__ */ React.createElement("th", null, r.label), r.values.map((v, i) => /* @__PURE__ */ React.createElement("td", { key: i, className: i === best ? "gr-best" : void 0 }, cell(v))))))));
  }
  function FilterBar({ sort, filters }) {
    const M = useMarket();
    const s = sort != null ? sort : M.t("best");
    return /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { gap: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("button", { className: "gr-chip", "aria-label": `${M.t("sort")}: ${s}`, style: { flex: "none", background: "var(--card)", boxShadow: "var(--shadow-card)" } }, /* @__PURE__ */ React.createElement(Icon, { name: "sort", size: 15, stroke: 2.1 }), s), /* @__PURE__ */ React.createElement("div", { className: "gr-grow", style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement(Chips, { items: filters, multi: true })));
  }
  function PriceCalendar({ year = 2026, month = 9, prices = {}, low = [], from, to, disabledBefore = 0, today, onPick }) {
    const M = useMarket();
    const [a, setA] = useState(from), [b, setB] = useState(to);
    const pick = (d) => {
      if (!a || a && b) {
        setA(d);
        setB(void 0);
      } else if (d > a) setB(d);
      else {
        setA(d);
        setB(void 0);
      }
      onPick == null ? void 0 : onPick(d);
    };
    const days = new Date(year, month + 1, 0).getDate();
    const lead = (new Date(year, month, 1).getDay() - M.firstDay % 7 + 7) % 7;
    const mName = new Intl.DateTimeFormat(M.locale, { month: "long" }).format(new Date(year, month, 15));
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push(/* @__PURE__ */ React.createElement("div", { key: "x" + i }));
    for (let d = 1; d <= days; d++) {
      const dis = d < disabledBefore, s = d === a, e = d === b, inr = a && b && d > a && d < b, p = prices[d];
      cells.push(/* @__PURE__ */ React.createElement("button", { key: d, className: cx("gr-day", s && "gr-start", (e || s && !b) && "gr-end", inr && "gr-in-range", d === today && !s && !e && "gr-today"), "aria-disabled": dis, "aria-pressed": s || e, "aria-label": `${M.num(d)} ${mName}${p != null ? ", " + M.t("fromPrice", { p: M.money(p) }) : ""}${low.includes(d) ? ", " + M.t("cheapestA11y") : ""}`, onClick: () => !dis && pick(d) }, /* @__PURE__ */ React.createElement("span", null, M.num(d)), /* @__PURE__ */ React.createElement("small", { className: low.includes(d) ? "gr-low" : void 0, "aria-hidden": "true" }, !dis && p != null ? M.money(p) : "\xA0")));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "gr-cal" }, /* @__PURE__ */ React.createElement("div", { className: "gr-cal-head" }, /* @__PURE__ */ React.createElement("div", { className: "gr-heading" }, M.monthLabel(year, month)), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { gap: 6 } }, /* @__PURE__ */ React.createElement("button", { className: "gr-ibtn gr-flat gr-sm", "aria-label": M.t("prevMonth") }, /* @__PURE__ */ React.createElement(Icon, { name: "back", size: 18 })), /* @__PURE__ */ React.createElement("button", { className: "gr-ibtn gr-flat gr-sm", "aria-label": M.t("nextMonth") }, /* @__PURE__ */ React.createElement(Icon, { name: "chev", size: 18 })))), /* @__PURE__ */ React.createElement("div", { className: "gr-cal-grid" }, M.dows().map((x, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "gr-dow" }, x)), cells), a && /* @__PURE__ */ React.createElement("div", { className: "gr-meta", style: { marginTop: 10 } }, b ? M.t("nights", { n: M.num(b - a) }) : M.t("pickReturn"), low.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "gr-dot" }), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--good)" } }, M.t("cheapest")))));
  }
  function Travellers({ adults = 1, children = 0, infants = 0 }) {
    const M = useMarket();
    const [n, setN] = useState({ adults, children, infants });
    const row = (k, icon, min, max) => /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "gr-row" }, /* @__PURE__ */ React.createElement("span", { className: "gr-ibtn gr-flat gr-sm" }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 18 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650 } }, M.t(k)), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, M.t(k + "Sub")))), /* @__PURE__ */ React.createElement(Stepper, { value: n[k], min, max, label: M.t(k), onChange: (v) => setN({ ...n, [k]: v }) }));
    return /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { maxWidth: 360 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-pax" }, row("adults", "user", 1, 9), row("children", "child", 0, 8), row("infants", "infant", 0, n.adults)), n.infants > 0 && /* @__PURE__ */ React.createElement("div", { className: "gr-meta", style: { marginTop: 10 } }, M.t("infantNote")));
  }
  function PayWith({ points = 48210, cash = 372, rate = 0.01, mix = 3e4, card = "4821", value = "mix", onChange }) {
    const M = useMarket();
    const full = Math.round(cash / rate);
    const offOf = (id) => id === "points" ? full > points : id === "mix" ? mix > points : false;
    const [v, setV] = useState(offOf(value) ? ["points", "mix", "card"].find((x) => !offOf(x)) : value);
    const opts = [
      { id: "points", t: M.t("points"), s: full > points ? M.t("ptsShort", { pts: M.pts(full), n: M.num(full - points) }) : M.t("ptsHave", { pts: M.pts(full), bal: M.num(points) }), icon: "sparkle", off: full > points },
      { id: "mix", t: M.t("pointsAndCard"), s: M.t("ptsPlus", { pts: M.pts(mix), cash: M.money(cash - mix * rate) }), icon: "split", off: mix > points },
      { id: "card", t: M.t("card"), s: M.t("onCardEnding", { cash: M.money(cash), card }), icon: "card", off: false }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "gr-paywith", role: "radiogroup", "aria-label": M.t("payWith") }, opts.map((o) => /* @__PURE__ */ React.createElement("button", { key: o.id, role: "radio", "aria-checked": v === o.id, "aria-disabled": o.off, onClick: () => {
      if (o.off) return;
      setV(o.id);
      onChange == null ? void 0 : onChange(o.id);
    } }, /* @__PURE__ */ React.createElement(Icon, { name: o.icon, size: 20 }), /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650 } }, o.t), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, o.s)), v === o.id && /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 18, stroke: 2.6 }))));
  }
  function PointsSlider({ total = 186, rate = 0.01, balance = 48210, start = 0.5, step = 100 }) {
    const M = useMarket();
    const maxPts = Math.min(balance, Math.floor(total / rate));
    const [f2, setF] = useState(start);
    const pts = Math.round(maxPts * f2 / step) * step, cash = Math.max(0, total - pts * rate);
    return /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { maxWidth: 360 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-split" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "gr-label" }, M.t("points")), /* @__PURE__ */ React.createElement("b", null, M.num(pts))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "end" } }, /* @__PURE__ */ React.createElement("span", { className: "gr-label" }, M.t("onYourCard")), /* @__PURE__ */ React.createElement("b", null, M.money(cash, 2)))), /* @__PURE__ */ React.createElement("div", { className: "gr-slider" }, /* @__PURE__ */ React.createElement("input", { type: "range", min: "0", max: "1", step: "0.01", value: f2, "aria-label": M.t("pointsToUse"), style: { ["--fill"]: f2 * 100 + "%" }, onChange: (e) => setF(+e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, M.t("youHave", { bal: M.num(balance) }), /* @__PURE__ */ React.createElement("span", { className: "gr-dot" }), M.t("pointRate", { v: M.money(rate, rate < 0.01 ? 3 : 2) })));
  }
  function PriceLines({ lines, total, note }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-lines" }, lines.map(([a, b]) => /* @__PURE__ */ React.createElement("div", { key: a }, /* @__PURE__ */ React.createElement("span", null, a), /* @__PURE__ */ React.createElement("span", null, b))), /* @__PURE__ */ React.createElement("div", { className: "gr-total" }, /* @__PURE__ */ React.createElement("span", null, total[0]), /* @__PURE__ */ React.createElement("span", null, total[1])), note && /* @__PURE__ */ React.createElement("div", { className: "gr-meta", style: { paddingTop: 8 } }, note));
  }
  function ConfirmSheet({ title, summary, lines, total, cta, state = "ready", auth, phone = "21", onConfirm }) {
    const M = useMarket();
    const how = auth || M.auth;
    const [s, setS] = useState(state);
    const [code, setCode] = useState(state === "code" ? "482193" : "");
    useEffect(() => {
      if (s === "scanning") {
        const t = setTimeout(() => setS("done"), 1300);
        return () => clearTimeout(t);
      }
    }, [s]);
    const amount = total ? total[1] : "";
    const label = cta || (how === "otp" ? M.t("confirmWithCode", { amt: amount }) : how === "app" ? M.t("payApp") : M.t("payFaceId"));
    return /* @__PURE__ */ React.createElement("div", { className: "gr-sheetwrap" }, /* @__PURE__ */ React.createElement("div", { className: "gr-sheet", role: "dialog", "aria-label": title || M.t("confirmPay") }, /* @__PURE__ */ React.createElement("div", { className: "gr-grab" }), s === "done" ? /* @__PURE__ */ React.createElement("div", { className: "gr-col", style: { alignItems: "center", gap: 12, padding: "10px 0 6px", textAlign: "center" } }, /* @__PURE__ */ React.createElement(CheckPop, { size: 64 }), /* @__PURE__ */ React.createElement("div", { className: "gr-title" }, M.t("booked")), /* @__PURE__ */ React.createElement("div", { className: "gr-meta", style: { justifyContent: "center" } }, summary)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-title" }, title || M.t("confirmPay")), /* @__PURE__ */ React.createElement("button", { className: "gr-ibtn gr-flat gr-sm", "aria-label": M.t("close") }, /* @__PURE__ */ React.createElement(Icon, { name: "close", size: 18 }))), summary && /* @__PURE__ */ React.createElement("div", { className: "gr-well", style: { fontSize: 14, fontWeight: 550 } }, summary), lines && /* @__PURE__ */ React.createElement(PriceLines, { lines, total }), how === "otp" ? /* @__PURE__ */ React.createElement("div", { className: "gr-otp" }, /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, M.t("otpSent", { d: phone })), /* @__PURE__ */ React.createElement("div", { className: "gr-otp-boxes", dir: "ltr" }, [0, 1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ React.createElement("input", { key: i, inputMode: "numeric", maxLength: 1, "aria-label": M.t("otpDigit", { n: i + 1 }), value: code[i] || "", onChange: (e) => setCode((code.slice(0, i) + e.target.value.slice(-1) + code.slice(i + 1)).slice(0, 6)) }))), /* @__PURE__ */ React.createElement("button", { className: "gr-link", style: { alignSelf: "flex-start" } }, M.t("otpResend"))) : how === "app" ? /* @__PURE__ */ React.createElement("div", { className: "gr-faceid" }, /* @__PURE__ */ React.createElement("div", { className: "gr-ring" }, /* @__PURE__ */ React.createElement(Icon, { name: "phone", size: 36, stroke: 1.6 })), /* @__PURE__ */ React.createElement("div", { className: "gr-meta", style: { textAlign: "center" } }, s === "scanning" ? M.t("appSent") : s === "ready" ? M.t("appReady") : M.t("appSent"))) : /* @__PURE__ */ React.createElement("div", { className: cx("gr-faceid", s === "scanning" && "gr-scanning") }, /* @__PURE__ */ React.createElement("div", { className: "gr-ring" }, /* @__PURE__ */ React.createElement(Icon, { name: "faceid", size: 40, stroke: 1.6 })), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, s === "scanning" ? M.t("checking") : M.t("nothingPaid"))), /* @__PURE__ */ React.createElement(Button, { size: "lg", block: true, icon: how === "faceid" ? "faceid" : how === "app" ? "phone" : "lock", disabled: how === "otp" && code.length < 6, onClick: () => {
      setS("scanning");
      onConfirm == null ? void 0 : onConfirm();
    }, loading: s === "scanning" }, label))));
  }
  function Receipt({ title = "You\u2019re going to Lisbon", reference = "GR-48213", lines, next, actions }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-receipt", style: { maxWidth: 360 } }, /* @__PURE__ */ React.createElement(CheckPop, { size: 60 }), /* @__PURE__ */ React.createElement("div", { className: "gr-col", style: { alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-title" }, title), /* @__PURE__ */ React.createElement("span", { className: "gr-ref gr-code" }, reference)), /* @__PURE__ */ React.createElement("div", { className: "gr-perf" }), lines && /* @__PURE__ */ React.createElement("div", { className: "gr-lines" }, lines.map(([a, b]) => /* @__PURE__ */ React.createElement("div", { key: a }, /* @__PURE__ */ React.createElement("span", null, a), /* @__PURE__ */ React.createElement("span", null, b)))), next && /* @__PURE__ */ React.createElement("div", { className: "gr-banner gr-info", style: { width: "100%", textAlign: "start" } }, /* @__PURE__ */ React.createElement(Spark, { size: 16 }), /* @__PURE__ */ React.createElement("span", null, next)), actions && /* @__PURE__ */ React.createElement("div", { className: "gr-actions", style: { justifyContent: "center" } }, actions.map((a, i) => /* @__PURE__ */ React.createElement(Button, { key: a, size: "sm", variant: i ? "secondary" : "primary" }, a))));
  }
  function SendTo({ people, selected = [] }) {
    const M = useMarket();
    const [sel, setSel] = useState(selected);
    return /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { maxWidth: 380 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-heading" }, M.t("sendTo")), /* @__PURE__ */ React.createElement("span", { className: "gr-meta" }, M.t("chosen", { n: M.num(sel.length) }))), /* @__PURE__ */ React.createElement("div", { className: "gr-sendto" }, people.map((p) => {
      const on = sel.includes(p.name);
      return /* @__PURE__ */ React.createElement("button", { key: p.name, "aria-pressed": on, onClick: () => setSel(on ? sel.filter((x) => x !== p.name) : [...sel, p.name]) }, /* @__PURE__ */ React.createElement("span", { className: "gr-pic", style: { background: p.color } }, p.initials || p.name[0], on && /* @__PURE__ */ React.createElement(CheckPop, { size: 22, animate: true })), p.name.split(" ")[0]);
    })));
  }
  function StateCard({ kind = "price", title, body, was, now, actions = [] }) {
    const map = { price: ["warn", "refresh"], soldout: ["danger", "close"], error: ["danger", "alert"], empty: ["", "search"], done: ["good", "check"] };
    const [tone, icon] = map[kind];
    return /* @__PURE__ */ React.createElement("div", { className: cx("gr-state", tone && "gr-" + tone), style: { maxWidth: 360 }, role: kind === "error" ? "alert" : void 0 }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("span", { className: "gr-ic" }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 22, stroke: 2.2 })), /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { className: "gr-heading" }, title), body && /* @__PURE__ */ React.createElement("div", { className: "gr-body", style: { color: "var(--ink-soft)", marginTop: 2 } }, body))), was && now && /* @__PURE__ */ React.createElement("div", { className: "gr-diff" }, /* @__PURE__ */ React.createElement("s", null, was), /* @__PURE__ */ React.createElement(Icon, { name: "arrow", size: 16, color: "var(--ink-soft)" }), /* @__PURE__ */ React.createElement("b", null, now)), actions.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "gr-actions" }, actions.map((a, i) => /* @__PURE__ */ React.createElement(Button, { key: a, size: "sm", variant: i ? "secondary" : "primary" }, a))));
  }

  // src/travel.tsx
  var travel_exports = {};
  __export(travel_exports, {
    AIRLINES: () => AIRLINES,
    AirlineMark: () => AirlineMark,
    BagPicker: () => BagPicker,
    BenefitRow: () => BenefitRow,
    BoardingPass: () => BoardingPass,
    Cancellation: () => Cancellation,
    ChangeFlight: () => ChangeFlight,
    Disruption: () => Disruption,
    ExperienceCard: () => ExperienceCard,
    FareFamilies: () => FareFamilies,
    FareRules: () => FareRules,
    FlightCard: () => FlightCard,
    FlightTracker: () => FlightTracker,
    GiftCardTile: () => GiftCardTile,
    HotelCard: () => HotelCard,
    Itinerary: () => Itinerary,
    LoungePass: () => LoungePass,
    PaymentDue: () => PaymentDue,
    RideOption: () => RideOption,
    RoomOption: () => RoomOption,
    SeatMap: () => SeatMap,
    TimeSlots: () => TimeSlots,
    TransactionRow: () => TransactionRow
  });
  var AIRLINES = {
    NW: { name: "Northway Air", color: "#1F3A5F" },
    CL: { name: "Coastline", color: "#0F7C80" },
    AU: { name: "Aurora Air", color: "#5B3FA8" }
  };
  function AirlineMark({ code = "NW", size = 30 }) {
    const a = AIRLINES[code] || { name: code, color: "#444" };
    return /* @__PURE__ */ React.createElement("span", { className: "gr-mark", role: "img", style: { background: a.color, width: size, height: size }, "aria-label": a.name, title: a.name }, code);
  }
  function FlightCard({ airline = "NW", number = "NW 214", dep, arr, from, to, dur, stops = 0, via, plusDays, price, points, tags = [], bag, back, left, best, selected, onSelect }) {
    var _a, _b;
    const M = useMarket();
    const stopTxt = stops ? stops === 1 ? M.t("stop1") : M.t("stopsN", { n: stops }) : M.t("direct");
    return /* @__PURE__ */ React.createElement("button", { className: cx("gr-flight", selected && "gr-selected"), "aria-pressed": !!selected, onClick: onSelect, "aria-label": `${(_a = AIRLINES[airline]) == null ? void 0 : _a.name}, ${dep} ${from}, ${arr} ${to}, ${dur}, ${stopTxt}, ${M.money(price)}` }, /* @__PURE__ */ React.createElement("div", { className: "gr-top" }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { gap: 8 } }, /* @__PURE__ */ React.createElement(AirlineMark, { code: airline }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650, fontSize: 14 } }, (_b = AIRLINES[airline]) == null ? void 0 : _b.name), /* @__PURE__ */ React.createElement("div", { className: "gr-meta gr-code", style: { fontSize: 12 } }, number))), best ? /* @__PURE__ */ React.createElement(Badge, { tone: "accent", icon: "sparkle" }, best) : left ? /* @__PURE__ */ React.createElement(Badge, { tone: "warn" }, M.t("leftAtPrice", { n: left })) : null), /* @__PURE__ */ React.createElement("div", { className: "gr-route" }, /* @__PURE__ */ React.createElement("div", { className: "gr-end" }, /* @__PURE__ */ React.createElement("span", { className: "gr-time" }, dep), /* @__PURE__ */ React.createElement("span", { className: "gr-iata" }, from)), /* @__PURE__ */ React.createElement("div", { className: "gr-path" }, /* @__PURE__ */ React.createElement("span", { className: "gr-dur" }, dur), /* @__PURE__ */ React.createElement("div", { className: "gr-track" }, stops > 0 && /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("span", { className: "gr-plane" }, /* @__PURE__ */ React.createElement(Icon, { name: "plane", size: 16, stroke: 2 }))), /* @__PURE__ */ React.createElement("span", { className: cx("gr-stops", !stops && "gr-direct") }, stopTxt, stops && via ? " \xB7 " + via : "")), /* @__PURE__ */ React.createElement("div", { className: "gr-end gr-r" }, /* @__PURE__ */ React.createElement("span", { className: "gr-time" }, arr, plusDays ? /* @__PURE__ */ React.createElement("span", { className: "gr-plus" }, "+", plusDays) : null), /* @__PURE__ */ React.createElement("span", { className: "gr-iata" }, to))), /* @__PURE__ */ React.createElement("div", { className: "gr-hr" }), /* @__PURE__ */ React.createElement("div", { className: "gr-bottom" }, /* @__PURE__ */ React.createElement("div", { className: "gr-col", style: { gap: 6 } }, /* @__PURE__ */ React.createElement(Meta, { items: [...bag ? [bag] : [], ...tags] }), back && /* @__PURE__ */ React.createElement("span", { className: "gr-back" }, /* @__PURE__ */ React.createElement(Spark, { size: 12 }), back)), /* @__PURE__ */ React.createElement(Price, { amount: price, points })));
  }
  function Itinerary({ legs, layovers = [] }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { maxWidth: 360 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-itin" }, legs.map((l, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, /* @__PURE__ */ React.createElement("div", { className: "gr-leg" }, /* @__PURE__ */ React.createElement("div", { className: "gr-t" }, l.dep), /* @__PURE__ */ React.createElement("div", { className: "gr-rail2" }, /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("span", null)), /* @__PURE__ */ React.createElement("div", { className: "gr-info" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650 } }, l.fromName, " ", /* @__PURE__ */ React.createElement("span", { className: "gr-meta", style: { display: "inline" } }, l.from)), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { gap: 8 } }, /* @__PURE__ */ React.createElement(AirlineMark, { code: l.airline, size: 22 }), /* @__PURE__ */ React.createElement(Meta, { items: [l.number, l.dur, l.cabin || M.t("economy"), ...l.plane ? [l.plane] : []] })))), /* @__PURE__ */ React.createElement("div", { className: "gr-leg" }, /* @__PURE__ */ React.createElement("div", { className: "gr-t" }, l.arr), /* @__PURE__ */ React.createElement("div", { className: "gr-rail2" }, /* @__PURE__ */ React.createElement("i", { style: { background: "var(--ink)" } })), /* @__PURE__ */ React.createElement("div", { className: "gr-info", style: { paddingBottom: i < legs.length - 1 ? 8 : 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650 } }, l.toName, " ", /* @__PURE__ */ React.createElement("span", { className: "gr-meta", style: { display: "inline" } }, l.to)))), layovers[i] && /* @__PURE__ */ React.createElement("div", { className: cx("gr-layover", layovers[i].short && "gr-short") }, /* @__PURE__ */ React.createElement(Icon, { name: layovers[i].short ? "alert" : "clock", size: 16 }), layovers[i].text)))));
  }
  function FareFamilies({ fares, value, onChange }) {
    var _a;
    const [v, setV] = useState(value != null ? value : (_a = fares[1]) == null ? void 0 : _a.id);
    return /* @__PURE__ */ React.createElement("div", { className: "gr-fares", role: "radiogroup", "aria-label": fares.map((f2) => f2.name).join(", ") }, fares.map((f2) => /* @__PURE__ */ React.createElement("button", { key: f2.id, className: "gr-fare", role: "radio", "aria-checked": v === f2.id, onClick: () => {
      setV(f2.id);
      onChange == null ? void 0 : onChange(f2.id);
    } }, f2.pop && /* @__PURE__ */ React.createElement("span", { className: "gr-pop2" }, /* @__PURE__ */ React.createElement(Badge, { tone: "accent" }, f2.pop)), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-heading" }, f2.name), /* @__PURE__ */ React.createElement("span", { className: "gr-radio" })), /* @__PURE__ */ React.createElement("ul", null, f2.items.map(([on, t]) => /* @__PURE__ */ React.createElement("li", { key: t, className: on ? void 0 : "gr-off" }, /* @__PURE__ */ React.createElement(Icon, { name: on ? "check" : "minus", size: 15, stroke: on ? 2.6 : 2, color: on ? "var(--good)" : void 0 }), t))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "auto" } }, /* @__PURE__ */ React.createElement(Price, { amount: f2.price, points: f2.points, align: "left" })))));
  }
  function SeatMap({ rows = [12, 13, 14, 15, 16], exitAfter = 13, taken = ["12A", "12B", "13F", "14C", "15A", "15B", "16E", "16F"], extra = [14], mates = ["15D"], picked = "15E", extraPrice = 28, mateName = "Sam", onPick }) {
    const M = useMarket();
    const [p, setP] = useState(picked);
    const L = ["A", "B", "C"], R = ["D", "E", "F"];
    const seat = (r, c) => {
      const id = r + c, t = taken.includes(id), m = mates.includes(id), x = extra.includes(r), on = p === id;
      return /* @__PURE__ */ React.createElement("button", { key: id, className: cx("gr-seat", t && "gr-taken", x && !t && !on && !m && "gr-extra", on && "gr-pick", m && "gr-mate"), "aria-disabled": t, "aria-pressed": on, "aria-label": `${M.t("seatA11y", { id })}${t ? ", " + M.t("taken") : x ? ", " + M.t("extraLegroom", { p: M.money(extraPrice) }) : ""}${m ? ", " + mateName : ""}`, onClick: () => {
        if (!t && !m) {
          setP(id);
          onPick == null ? void 0 : onPick(id);
        }
      } }, on ? /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 14, stroke: 3 }) : m ? mateName[0] : "");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "gr-seatmap", dir: "ltr" }, /* @__PURE__ */ React.createElement("div", { className: "gr-seatrow", style: { marginBottom: 2 } }, L.map((c) => /* @__PURE__ */ React.createElement("span", { key: c, className: "gr-rn" }, c)), /* @__PURE__ */ React.createElement("span", null), R.map((c) => /* @__PURE__ */ React.createElement("span", { key: c, className: "gr-rn" }, c))), rows.map((r) => /* @__PURE__ */ React.createElement(React.Fragment, { key: r }, /* @__PURE__ */ React.createElement("div", { className: "gr-seatrow" }, L.map((c) => seat(r, c)), /* @__PURE__ */ React.createElement("span", { className: "gr-rn" }, r), R.map((c) => seat(r, c))), r === exitAfter && /* @__PURE__ */ React.createElement("div", { className: "gr-exit", dir: "ltr" }, /* @__PURE__ */ React.createElement("span", null, "\u25C2 ", M.t("exit")), /* @__PURE__ */ React.createElement("span", null, M.t("exit"), " \u25B8")))), /* @__PURE__ */ React.createElement("div", { className: "gr-seatkey", style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { style: { background: "var(--accent)" } }), M.t("you")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { style: { background: "var(--pill)" } }), mateName), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { style: { background: "var(--sticky-blue)" } }), M.t("extraLegroom", { p: M.money(extraPrice) })), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { style: { background: "var(--card-sunk)", boxShadow: "inset 0 0 0 1.5px var(--ink-faint)" } }), M.t("free"))));
  }
  function BagPicker({ bags, cabinKg = 7, checkedKg = 23, cabinPrice = 18, checkedPrice = 32 }) {
    const M = useMarket();
    bags = bags || [
      { icon: "bag", name: M.t("smallBag"), sub: M.t("smallBagSub"), incl: true },
      { icon: "cabinbag", name: M.t("cabinBag"), sub: M.t("cabinBagSub", { kg: M.num(cabinKg) }), price: cabinPrice },
      { icon: "cabinbag", name: M.t("checkedBag"), sub: M.t("checkedBagSub", { kg: M.num(checkedKg) }), price: checkedPrice }
    ];
    const [n, setN] = useState({});
    return /* @__PURE__ */ React.createElement("div", { className: "gr-bags", style: { maxWidth: 360, width: "100%" } }, bags.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.name, className: "gr-bag" }, /* @__PURE__ */ React.createElement("span", { className: "gr-bic" }, /* @__PURE__ */ React.createElement(Icon, { name: b.icon, size: 22 })), /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650 } }, b.name), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, b.sub)), b.incl ? /* @__PURE__ */ React.createElement(Badge, { tone: "good", icon: "check" }, M.t("included")) : /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { gap: 10 } }, /* @__PURE__ */ React.createElement("span", { className: "gr-meta", style: { color: "var(--ink)", fontWeight: 650 } }, "+", M.money(b.price)), /* @__PURE__ */ React.createElement("div", { className: "gr-stepper", role: "group", "aria-label": b.name }, /* @__PURE__ */ React.createElement("button", { "aria-label": M.t("removeX", { x: b.name }), disabled: !n[b.name], onClick: () => setN({ ...n, [b.name]: (n[b.name] || 0) - 1 }) }, /* @__PURE__ */ React.createElement(Icon, { name: "minus", size: 16, stroke: 2.4 })), /* @__PURE__ */ React.createElement("output", null, n[b.name] || 0), /* @__PURE__ */ React.createElement("button", { "aria-label": M.t("addX", { x: b.name }), disabled: (n[b.name] || 0) >= 2, onClick: () => setN({ ...n, [b.name]: (n[b.name] || 0) + 1 }) }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 16, stroke: 2.4 })))))));
  }
  function QR({ seed = 7 }) {
    const M = useMarket();
    const cells = Array.from({ length: 49 }, (_, i) => {
      const r = Math.floor(i / 7), c = i % 7;
      const finder = r < 2 && c < 2 || r < 2 && c > 4 || r > 4 && c < 2;
      return finder || (i * 37 + r * 17 + c * 11 + seed) % 7 < 3;
    });
    return /* @__PURE__ */ React.createElement("div", { className: "gr-qr", role: "img", "aria-label": M.t("boardingCode") }, cells.map((on, i) => /* @__PURE__ */ React.createElement("i", { key: i, className: on ? void 0 : "gr-o" })));
  }
  function BoardingPass({ name = "A CHAWLA", airline = "NW", number = "NW 214", from = "LHR", fromCity = "London", to = "LIS", toCity = "Lisbon", date = "Fri 16 Oct", boards = "06:45", gate = "B32", seat = "15E", group = "2", dep = "07:25" }) {
    var _a;
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("div", { className: "gr-pass" }, /* @__PURE__ */ React.createElement("div", { className: "gr-ptop" }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { gap: 8 } }, /* @__PURE__ */ React.createElement(AirlineMark, { code: airline, size: 26 }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 650, fontSize: 14 } }, (_a = AIRLINES[airline]) == null ? void 0 : _a.name)), /* @__PURE__ */ React.createElement("span", { className: "gr-code", style: { opacity: 0.75 } }, number)), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between", alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "gr-big" }, from), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, opacity: 0.7, fontWeight: 550 } }, fromCity, " \xB7 ", dep)), /* @__PURE__ */ React.createElement("span", { className: "gr-flipx" }, /* @__PURE__ */ React.createElement(Icon, { name: "plane", size: 22 })), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "end" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-big" }, to), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, opacity: 0.7, fontWeight: 550 } }, toCity))), /* @__PURE__ */ React.createElement("div", { className: "gr-pgrid" }, [[M.t("boards"), boards], [M.t("gate"), gate], [M.t("seat"), seat], [M.t("group"), group]].map(([k, v]) => /* @__PURE__ */ React.createElement("div", { key: k }, /* @__PURE__ */ React.createElement("span", { className: "gr-label" }, k), /* @__PURE__ */ React.createElement("b", null, v))))), /* @__PURE__ */ React.createElement("div", { className: "gr-cut" }), /* @__PURE__ */ React.createElement("div", { className: "gr-pbot" }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { width: "100%", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "gr-label", style: { color: "#66666E" } }, M.t("passenger")), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700 } }, name), /* @__PURE__ */ React.createElement("div", { className: "gr-meta", style: { color: "#66666E" } }, date)), /* @__PURE__ */ React.createElement(QR, null))));
  }
  function FlightTracker({ number = "NW 214", from = "LHR", to = "LIS", status = "Delayed 35 min", tone = "warn", progress = 0, dep = "08:00", depWas = "07:25", arr = "10:35", gate = "B32", note }) {
    const M = useMarket();
    const x = 10 + progress * 280, y = 60 - Math.sin(progress * Math.PI) * 50;
    return /* @__PURE__ */ React.createElement("div", { className: "gr-tracker" }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { gap: 8 } }, /* @__PURE__ */ React.createElement(AirlineMark, { code: number.slice(0, 2) }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "gr-heading", dir: "ltr", style: { textAlign: "start" } }, from, " \u2192 ", to), /* @__PURE__ */ React.createElement("div", { className: "gr-meta gr-code" }, number))), /* @__PURE__ */ React.createElement(Status, { tone, live: true }, status)), /* @__PURE__ */ React.createElement("div", { className: "gr-arc" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 300 70", preserveAspectRatio: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M10 60 Q150 -40 290 60", fill: "none", stroke: "var(--ink-faint)", strokeWidth: "2", strokeDasharray: "4 5" }), progress > 0 && /* @__PURE__ */ React.createElement("path", { d: "M10 60 Q150 -40 290 60", fill: "none", stroke: "var(--accent)", strokeWidth: "3", strokeLinecap: "round", pathLength: "1", strokeDasharray: `${progress} 1` }), /* @__PURE__ */ React.createElement("circle", { cx: "10", cy: "60", r: "5", fill: "var(--ink)" }), /* @__PURE__ */ React.createElement("circle", { cx: "290", cy: "60", r: "5", fill: "var(--card)", stroke: "var(--ink)", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("g", { transform: `translate(${x - 9} ${y - 9})` }, /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "9", r: "13", fill: "var(--card)", style: { filter: "drop-shadow(0 2px 4px rgba(0,0,0,.15))" } }))), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: `calc(${x / 300 * 100}% - 9px)`, top: y - 9, color: "var(--ink)" } }, /* @__PURE__ */ React.createElement(Icon, { name: "plane", size: 18, stroke: 2.1 }))), /* @__PURE__ */ React.createElement("div", { className: "gr-tgrid" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "gr-label" }, M.t("departs")), /* @__PURE__ */ React.createElement("b", { className: depWas ? "gr-chg" : void 0 }, dep), depWas && /* @__PURE__ */ React.createElement("s", { className: "gr-meta" }, depWas)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "gr-label" }, M.t("lands")), /* @__PURE__ */ React.createElement("b", null, arr)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "gr-label" }, M.t("gate")), /* @__PURE__ */ React.createElement("b", null, gate))), note && /* @__PURE__ */ React.createElement("div", { className: "gr-banner gr-info" }, /* @__PURE__ */ React.createElement(Spark, { size: 16 }), /* @__PURE__ */ React.createElement("span", null, note)));
  }
  function Disruption({ title = "Your 07:25 to Lisbon is cancelled", body = "Northway Air cancelled it at 07:05. You don\u2019t need to queue. Here\u2019s what you can do now.", options = [
    { id: "a", t: "Next direct, 11:40 today", s: "Lands 14:15 \xB7 seats together held for 20 min", tag: "Best" },
    { id: "b", t: "Via Porto, 10:55 today", s: "Lands 15:10 \xB7 55 min later than the direct" },
    { id: "c", t: "Full refund to your card", s: "Card part and points back, in 5 to 7 working days" }
  ], owed, flight = "NW 214", day = "Fri 16 Oct" }) {
    const M = useMarket();
    const [v, setV] = useState("a");
    return /* @__PURE__ */ React.createElement("div", { className: "gr-card gr-xl", style: { maxWidth: 360 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-banner gr-danger" }, /* @__PURE__ */ React.createElement(Icon, { name: "alert", size: 18 }), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("b", null, M.t("cancelled")), " \xB7 ", flight, " \xB7 ", day)), /* @__PURE__ */ React.createElement("div", { className: "gr-title" }, title), /* @__PURE__ */ React.createElement("div", { className: "gr-body", style: { color: "var(--ink-soft)" } }, body), /* @__PURE__ */ React.createElement("div", { className: "gr-opts", role: "radiogroup", "aria-label": M.t("rebookingOptions") }, options.map((o) => /* @__PURE__ */ React.createElement("button", { key: o.id, className: "gr-opt", role: "radio", "aria-checked": v === o.id, onClick: () => setV(o.id) }, /* @__PURE__ */ React.createElement("span", { className: "gr-radio" }), /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650 } }, o.t), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, o.s)), o.tag && /* @__PURE__ */ React.createElement(Badge, { tone: "accent" }, o.tag)))), owed && /* @__PURE__ */ React.createElement("div", { className: "gr-banner gr-good" }, /* @__PURE__ */ React.createElement(Icon, { name: "cash", size: 18 }), /* @__PURE__ */ React.createElement("span", null, owed)), /* @__PURE__ */ React.createElement(Button, { block: true, size: "lg" }, v === "c" ? M.t("requestRefund") : M.t("moveMe")));
  }
  function ChangeFlight({ was = { day: "Fri 16 Oct", time: "07:25 to 10:00" }, now = { day: "Sat 17 Oct", time: "09:10 to 11:45" }, fee = 0, diff = 24 }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { maxWidth: 360 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-heading" }, M.t("changeOutbound")), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { alignItems: "stretch" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-well gr-grow", style: { fontSize: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-label" }, M.t("bookedLabel")), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650, textDecoration: "line-through" } }, was.day), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, was.time)), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { color: "var(--ink-soft)" } }, /* @__PURE__ */ React.createElement(Icon, { name: "arrow", size: 18, className: "gr-flipx" })), /* @__PURE__ */ React.createElement("div", { className: "gr-well gr-grow", style: { background: "var(--accent-soft)", fontSize: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-label", style: { color: "var(--accent-ink)" } }, M.t("newLabel")), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650 } }, now.day), /* @__PURE__ */ React.createElement("div", { className: "gr-meta", style: { color: "var(--ink)" } }, now.time))), /* @__PURE__ */ React.createElement("div", { className: "gr-lines" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, M.t("changeFee")), /* @__PURE__ */ React.createElement("span", null, fee ? M.money(fee) : M.t("freeOnFare"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, M.t("fareDiff")), /* @__PURE__ */ React.createElement("span", null, diff >= 0 ? "+" + M.money(diff) : M.money(diff))), /* @__PURE__ */ React.createElement("div", { className: "gr-total" }, /* @__PURE__ */ React.createElement("span", null, fee + diff >= 0 ? M.t("toPay") : M.t("youGetBack")), /* @__PURE__ */ React.createElement("span", null, M.money(Math.abs(fee + diff))))), /* @__PURE__ */ React.createElement(Button, { block: true }, M.t("changeFor", { p: M.money(Math.max(0, fee + diff)) })));
  }
  function FareRules({ rules = [
    ["ok", "Change date", "Free up to 24 hours before"],
    ["fee", "Cancel", "Fee applies, rest back as travel credit"],
    ["ok", "Seat choice", "Standard seats free"],
    ["nope", "Refund to card", "Not on this fare"]
  ], fare }) {
    const M = useMarket();
    const ic = { ok: "check", fee: "cash", nope: "minus" };
    return /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { maxWidth: 360, gap: 4 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-heading", style: { marginBottom: 4 } }, M.t("yourFare", { f: fare != null ? fare : M.t("standardFare") })), /* @__PURE__ */ React.createElement("div", { className: "gr-rules" }, rules.map(([k, t, s]) => /* @__PURE__ */ React.createElement("div", { key: t }, /* @__PURE__ */ React.createElement("span", { className: cx("gr-ric", "gr-" + k) }, /* @__PURE__ */ React.createElement(Icon, { name: ic[k], size: 16, stroke: 2.4 })), /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650, fontSize: 14 } }, t), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, s))))));
  }
  function HotelCard({ src, name, area, rating, reviews, price, points, nights = 2, perks = [], sticker, back }) {
    const M = useMarket();
    const [fav, setFav] = useState(false);
    return /* @__PURE__ */ React.createElement("div", { className: "gr-hotel" }, sticker && /* @__PURE__ */ React.createElement(Sticker, { tilt: -8 }, sticker), /* @__PURE__ */ React.createElement("div", { className: "gr-ph" }, /* @__PURE__ */ React.createElement("img", { src, alt: "" }), /* @__PURE__ */ React.createElement("span", { className: "gr-fav" }, /* @__PURE__ */ React.createElement(IconButton, { icon: "heart", label: fav ? M.t("saved") : M.t("save"), small: true, onClick: () => setFav(!fav) }))), /* @__PURE__ */ React.createElement("div", { className: "gr-in" }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "gr-heading" }, name), /* @__PURE__ */ React.createElement(Meta, { items: [area] })), rating != null && /* @__PURE__ */ React.createElement("span", { className: "gr-rating" }, /* @__PURE__ */ React.createElement(Icon, { name: "star", size: 14, filled: true, color: "var(--accent)" }), rating, reviews != null && /* @__PURE__ */ React.createElement("span", { className: "gr-meta", style: { fontWeight: 500 } }, "(", M.num(reviews), ")"))), perks.length > 0 && /* @__PURE__ */ React.createElement(Meta, { items: perks }), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between", alignItems: "flex-end" } }, back ? /* @__PURE__ */ React.createElement("span", { className: "gr-back" }, /* @__PURE__ */ React.createElement(Spark, { size: 12 }), back) : /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement(Price, { amount: price, points, note: M.t("nightsTaxes", { n: M.num(nights) }) }))));
  }
  function RoomOption({ src, name, facts, price, cancel, checked, onPick }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("button", { className: "gr-room", role: "radio", "aria-checked": !!checked, onClick: onPick }, /* @__PURE__ */ React.createElement("div", { className: "gr-ph" }, /* @__PURE__ */ React.createElement("img", { src, alt: "" })), /* @__PURE__ */ React.createElement("div", { className: "gr-grow gr-col", style: { gap: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650 } }, name), /* @__PURE__ */ React.createElement(Meta, { items: facts }), cancel && /* @__PURE__ */ React.createElement("span", { className: "gr-meta", style: { color: "var(--good)", fontWeight: 600 } }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 13, stroke: 2.6 }), cancel), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, marginTop: "auto" } }, M.money(price), " ", /* @__PURE__ */ React.createElement("span", { className: "gr-meta", style: { display: "inline", fontWeight: 500 } }, M.t("total")))), /* @__PURE__ */ React.createElement("span", { className: "gr-radio", style: { alignSelf: "center", boxShadow: checked ? "inset 0 0 0 7px var(--ink)" : void 0 } }));
  }
  function Cancellation({ steps = [
    { tone: "good", t: "Free cancellation", s: "Until 23:59, Tue 13 Oct" },
    { tone: "warn", t: "First night charged", s: "From Wed 14 Oct" },
    { tone: "danger", t: "No refund", s: "From check-in, Fri 16 Oct" }
  ] }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { maxWidth: 360, width: "100%" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-heading" }, M.t("ifPlansChange")), /* @__PURE__ */ React.createElement("div", { className: "gr-timeline" }, steps.map((x, i) => /* @__PURE__ */ React.createElement("div", { key: x.t, className: "gr-tl" }, /* @__PURE__ */ React.createElement("div", { className: "gr-dotc" }, /* @__PURE__ */ React.createElement("i", { style: { background: `var(--${x.tone})` } }), i < steps.length - 1 && /* @__PURE__ */ React.createElement("span", null)), /* @__PURE__ */ React.createElement("div", { className: "gr-txt" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650, fontSize: 14 } }, x.t), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, x.s))))));
  }
  function ExperienceCard({ src, name, when, meta, price, points, rating }) {
    return /* @__PURE__ */ React.createElement("div", { className: "gr-exp" }, /* @__PURE__ */ React.createElement("div", { className: "gr-ph" }, /* @__PURE__ */ React.createElement("img", { src, alt: "" }), when && /* @__PURE__ */ React.createElement("span", { className: "gr-when" }, when)), /* @__PURE__ */ React.createElement("div", { className: "gr-in" }, /* @__PURE__ */ React.createElement("div", { className: "gr-heading", style: { fontSize: 16 } }, name), /* @__PURE__ */ React.createElement(Meta, { items: meta }), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between" } }, rating ? /* @__PURE__ */ React.createElement("span", { className: "gr-rating" }, /* @__PURE__ */ React.createElement(Icon, { name: "star", size: 14, filled: true, color: "var(--accent)" }), rating) : /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement(Price, { amount: price, points }))));
  }
  function TimeSlots({ slots = [["18:00", 42], ["18:30", 42], ["19:00", "Full"], ["19:30", 48], ["20:00", 48], ["20:30", 48], ["21:00", "Full"], ["21:30", 38]], value = "19:30" }) {
    const M = useMarket();
    const [v, setV] = useState(value);
    return /* @__PURE__ */ React.createElement("div", { className: "gr-slots", style: { maxWidth: 360 } }, slots.map(([t, s0]) => {
      const full = s0 === "Full" || s0 === M.t("full");
      const s = typeof s0 === "number" ? M.money(s0) : s0;
      return /* @__PURE__ */ React.createElement("button", { key: t, className: "gr-slot", "aria-disabled": full, "aria-pressed": v === t, onClick: () => !full && setV(t), "aria-label": `${t}, ${full ? M.t("full") : s}` }, t, /* @__PURE__ */ React.createElement("small", null, full ? M.t("full") : s));
    }));
  }
  function GiftCardTile({ brand = "Harbour & Co", amount: amt = 50, color = "#2E5E4E", note }) {
    const M = useMarket();
    const amount = typeof amt === "number" ? M.money(amt) : amt;
    return /* @__PURE__ */ React.createElement("div", { className: "gr-gift", style: { background: color } }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between", position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement("span", { className: "gr-gname" }, brand), /* @__PURE__ */ React.createElement(Icon, { name: "gift", size: 20 })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-amt" }, amount), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, opacity: 0.85, fontWeight: 600 } }, note)));
  }
  function RideOption({ name = "Standard", eta = "4 min away", seats = 4, price = 38, checked, onPick, note }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("button", { className: "gr-ride", role: "radio", "aria-checked": !!checked, onClick: onPick }, /* @__PURE__ */ React.createElement("span", { className: "gr-car" }, /* @__PURE__ */ React.createElement(Icon, { name: "car", size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650 } }, name), /* @__PURE__ */ React.createElement(Meta, { items: [eta, M.t("seatsN", { n: M.num(seats) }), ...note ? [note] : []] })), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700 } }, M.money(price)));
  }
  function LoungePass({ name = "The Orchard", where = "Heathrow T5 \xB7 after security", valid = "Fri 16 Oct \xB7 3 hours before your flight", guests = 1 }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("div", { className: "gr-lounge" }, /* @__PURE__ */ React.createElement("div", { className: "gr-lt" }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { className: "gr-label" }, M.t("loungePass")), /* @__PURE__ */ React.createElement(Icon, { name: "sofa", size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "gr-title", style: { color: "inherit" } }, name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, opacity: 0.8, fontWeight: 550 } }, where)), /* @__PURE__ */ React.createElement("div", { className: "gr-lb" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650, fontSize: 14 } }, M.t("youPlus", { n: M.num(guests) })), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, valid)), /* @__PURE__ */ React.createElement(QR, { seed: 3 })));
  }
  function PaymentDue({ amount = 642.18, min = 25, date = "4\xA0Nov", days = 9, autopay = false }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("div", { className: "gr-due" }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { className: "gr-label" }, M.t("paymentDue")), days <= 3 ? /* @__PURE__ */ React.createElement(Badge, { tone: "warn" }, M.t("inDays", { n: M.num(days) })) : /* @__PURE__ */ React.createElement(Badge, null, date)), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { alignItems: "flex-end", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "gr-time" }, M.money(amount, 2)), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, M.t("minBy", { amt: M.money(min, 2), date })))), autopay ? /* @__PURE__ */ React.createElement("div", { className: "gr-banner gr-good" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 18 }), /* @__PURE__ */ React.createElement("span", null, M.t("ddPays", { dd: M.directDebit.charAt(0).toUpperCase() + M.directDebit.slice(1), date }))) : /* @__PURE__ */ React.createElement("div", { className: "gr-actions" }, /* @__PURE__ */ React.createElement(Button, { size: "sm" }, M.t("payNow")), /* @__PURE__ */ React.createElement(Button, { size: "sm", variant: "secondary" }, M.t("setUp", { dd: M.directDebit }))));
  }
  function TransactionRow({ mono, color = "var(--card-sunk)", ink = "var(--ink)", name, meta, amount, points, refund }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("div", { className: "gr-txn" }, /* @__PURE__ */ React.createElement("span", { className: "gr-mono", style: { background: color, color: ink } }, mono), /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650 } }, name), /* @__PURE__ */ React.createElement(Meta, { items: meta })), /* @__PURE__ */ React.createElement("div", { className: "gr-col", style: { gap: 0, alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("span", { className: cx("gr-amt", refund && "gr-in") }, refund ? "+" : "", M.money(amount, 2)), points && /* @__PURE__ */ React.createElement("span", { className: "gr-back", style: { fontSize: 12 } }, "+", M.pts(points))));
  }
  function BenefitRow({ icon = "shield", name, sub, value, onClick }) {
    return /* @__PURE__ */ React.createElement("button", { className: "gr-benefit", style: { width: "100%", textAlign: "start" }, onClick }, /* @__PURE__ */ React.createElement("span", { className: "gr-bi" }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 19 })), /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650, fontSize: 15 } }, name), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, sub)), value && /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 650, fontSize: 14 } }, value), /* @__PURE__ */ React.createElement(Icon, { name: "chev", size: 18, color: "var(--ink-faint)", className: "gr-flipx" }));
  }

  // src/journeys.tsx
  var journeys_exports = {};
  __export(journeys_exports, {
    ArabicScreens: () => ArabicScreens,
    DisruptionJourney: () => DisruptionJourney,
    FlightBookingJourney: () => FlightBookingJourney,
    HomeScreen: () => HomeScreen,
    HotelJourney: () => HotelJourney,
    MarketSwitch: () => MarketSwitch,
    PhoneFrame: () => PhoneFrame
  });

  // src/data.ts
  var BASE_CAL = { 3: 142, 4: 156, 5: 164, 6: 148, 7: 132, 8: 176, 9: 212, 10: 198, 11: 184, 12: 138, 13: 124, 14: 118, 15: 158, 16: 128, 17: 204, 18: 172, 19: 126, 20: 118, 21: 122, 22: 168, 23: 214, 24: 196, 25: 178, 26: 128, 27: 116, 28: 119, 29: 162, 30: 208, 31: 134 };
  function calendar(d) {
    const k = d.flights[2].price / 128, out = {};
    for (const day in BASE_CAL) out[+day] = Math.round(BASE_CAL[day] * k / d.round) * d.round;
    return out;
  }
  function lowDays(p) {
    const v = Object.values(p).sort((a, b) => a - b), cut = v[2];
    return Object.keys(p).map(Number).filter((k) => p[k] <= cut);
  }
  var f = (airline, number, dep, arr, from, to, dur, price, rate, extra = {}) => ({ airline, number, dep, arr, from, to, dur, price, points: Math.round(price / rate), ...extra });
  var DEMO = {
    UK: {
      market: "UK",
      home: "London",
      homeCode: "LHR",
      away: "Lisbon",
      awayCode: "LIS",
      mate: "Sam",
      rate: 0.01,
      balance: 48210,
      card: "4821",
      round: 1,
      flights: [
        f("NW", "NW 214", "07:25", "10:00", "LHR", "LIS", "2h 35m", 186, 0.01, { bag: "Cabin bag", tags: ["Seats together"], best: "Best for you", back: "5% back on your card" }),
        f("CL", "CL 902", "11:40", "14:20", "LGW", "LIS", "2h 40m", 142, 0.01, { bag: "Small bag only", left: 3 }),
        f("AU", "AU 330", "06:10", "11:55", "LHR", "LIS", "5h 45m", 128, 0.01, { stops: 1, via: "OPO", bag: "Cabin bag" })
      ],
      fares: { light: 148, std: 186, flex: 264 },
      cancelFee: 60,
      extraSeat: 28,
      cabinKg: 10,
      checkedKg: 23,
      cabinBag: 18,
      checkedBag: 32,
      plane: "A320neo",
      mixPts: 3e4,
      nextFlight: { number: "NW 218", dep: "11:40", arr: "14:15" },
      via: { code: "OPO", name: "Porto", dep: "10:55", arr: "15:10" },
      owed: "You may be owed up to \xA3350 each under UK rules. I\u2019ll start the claim once you\u2019re rebooked.",
      lounge: { name: "The Orchard", where: "Heathrow T5 \xB7 after security" },
      gate: "B32",
      hotel: { name: "Casa do Rio", area: "Alfama", alt: "Hotel Miradouro", altArea: "Chiado", price: 248, alt2: 296, suite: 342, firstNight: 124 },
      ask: "Lisbon for two, 16 to 18 October. Morning flight out.",
      hotelAsk: "Somewhere central for those nights, with a pool.",
      phoneEnd: "77",
      claimAction: "Start claim",
      room: "Double, river view"
    },
    EU: {
      market: "EU",
      home: "Dublin",
      homeCode: "DUB",
      away: "Lisbon",
      awayCode: "LIS",
      mate: "Aoife",
      rate: 0.01,
      balance: 42600,
      card: "7730",
      round: 1,
      flights: [
        f("NW", "NW 316", "06:40", "09:25", "DUB", "LIS", "2h 45m", 164, 0.01, { bag: "Cabin bag", tags: ["Seats together"], best: "Best for you", back: "5% back on your card" }),
        f("CL", "CL 118", "11:15", "14:05", "DUB", "LIS", "2h 50m", 139, 0.01, { bag: "Small bag only", left: 2 }),
        f("AU", "AU 552", "06:05", "11:40", "DUB", "LIS", "5h 35m", 118, 0.01, { stops: 1, via: "MAD", bag: "Cabin bag" })
      ],
      fares: { light: 129, std: 164, flex: 239 },
      cancelFee: 55,
      extraSeat: 25,
      cabinKg: 10,
      checkedKg: 23,
      cabinBag: 16,
      checkedBag: 30,
      plane: "A320neo",
      mixPts: 26e3,
      nextFlight: { number: "NW 318", dep: "12:05", arr: "14:50" },
      via: { code: "MAD", name: "Madrid", dep: "11:20", arr: "15:45" },
      owed: "You may be owed up to \u20AC400 each under EU rules. I\u2019ll start the claim once you\u2019re rebooked.",
      lounge: { name: "The Orchard", where: "Dublin T2 \xB7 after security" },
      gate: "412",
      hotel: { name: "Casa do Rio", area: "Alfama", alt: "Hotel Miradouro", altArea: "Chiado", price: 276, alt2: 318, suite: 380, firstNight: 138 },
      ask: "Lisbon for two, 16 to 18 October. Early flight out.",
      hotelAsk: "Somewhere central for those nights, with a pool.",
      phoneEnd: "42",
      claimAction: "Start claim",
      room: "Double, river view"
    },
    IN: {
      market: "IN",
      home: "Mumbai",
      homeCode: "BOM",
      away: "Goa",
      awayCode: "GOI",
      mate: "Riya",
      rate: 0.25,
      balance: 96400,
      card: "5512",
      round: 10,
      flights: [
        f("NW", "NW 571", "07:10", "08:25", "BOM", "GOI", "1h 15m", 5480, 0.25, { bag: "Cabin bag", tags: ["Seats together"], best: "Best for you", back: "5% back on your card" }),
        f("CL", "CL 229", "09:40", "10:55", "BOM", "GOI", "1h 15m", 4990, 0.25, { bag: "Cabin bag only", left: 4 }),
        f("AU", "AU 804", "06:00", "10:05", "BOM", "GOI", "4h 05m", 4120, 0.25, { stops: 1, via: "BLR", bag: "Cabin bag" })
      ],
      fares: { light: 4650, std: 5480, flex: 7900 },
      cancelFee: 2999,
      extraSeat: 650,
      cabinKg: 7,
      checkedKg: 15,
      cabinBag: 0,
      checkedBag: 1850,
      plane: "A320neo",
      mixPts: 36e3,
      nextFlight: { number: "NW 575", dep: "11:30", arr: "12:45" },
      via: { code: "BLR", name: "Bengaluru", dep: "10:15", arr: "14:40" },
      owed: "Under DGCA rules the airline must offer you another flight or a full refund, and may owe you compensation. I\u2019ll check what applies and file it.",
      lounge: { name: "The Orchard", where: "Mumbai T2 \xB7 after security" },
      gate: "42A",
      hotel: { name: "Casa Mar", area: "Assagao", alt: "Hotel Baga Bay", altArea: "Calangute", price: 14600, alt2: 17200, suite: 21400, firstNight: 7300 },
      ask: "Goa for two, 16 to 18 October. Morning flight from Mumbai.",
      hotelAsk: "A quiet place with a pool for those nights.",
      phoneEnd: "09",
      claimAction: "Start claim",
      room: "Double, pool view"
    },
    AE: {
      market: "AE",
      home: "Dubai",
      homeCode: "DXB",
      away: "Muscat",
      awayCode: "MCT",
      mate: "Omar",
      rate: 0.02,
      balance: 88500,
      card: "3309",
      round: 5,
      flights: [
        f("NW", "NW 612", "07:25", "08:35", "DXB", "MCT", "1h 10m", 690, 0.02, { bag: "Cabin bag", tags: ["Seats together"], best: "Best for you", back: "5% back on your card" }),
        f("CL", "CL 404", "11:40", "12:50", "DXB", "MCT", "1h 10m", 610, 0.02, { bag: "Small bag only", left: 3 }),
        f("AU", "AU 918", "06:10", "10:05", "DXB", "MCT", "3h 55m", 540, 0.02, { stops: 1, via: "DOH", bag: "Cabin bag" })
      ],
      fares: { light: 560, std: 690, flex: 1050 },
      cancelFee: 250,
      extraSeat: 95,
      cabinKg: 7,
      checkedKg: 23,
      cabinBag: 0,
      checkedBag: 120,
      plane: "A320neo",
      mixPts: 55e3,
      nextFlight: { number: "NW 616", dep: "12:15", arr: "13:25" },
      via: { code: "DOH", name: "Doha", dep: "10:40", arr: "14:30" },
      owed: "Compensation here depends on the airline\u2019s policy. I\u2019ve asked Northway for meal vouchers and any compensation, and I\u2019ll tell you what they say.",
      lounge: { name: "The Orchard", where: "Dubai T1 \xB7 after passport control" },
      gate: "C14",
      hotel: { name: "Dar al Bahr", area: "Qurum", alt: "Hotel Mutrah", altArea: "Mutrah", price: 1180, alt2: 1420, suite: 1760, firstNight: 590 },
      ask: "Muscat for two, 16 to 18 October. Morning flight out.",
      hotelAsk: "Near the beach for those nights, with a pool.",
      phoneEnd: "61",
      claimAction: "Ask about compensation",
      room: "Double, sea view"
    },
    SG: {
      market: "SG",
      home: "Singapore",
      homeCode: "SIN",
      away: "Bali",
      awayCode: "DPS",
      mate: "Wei Ling",
      rate: 0.01,
      balance: 64300,
      card: "0418",
      round: 1,
      flights: [
        f("NW", "NW 118", "07:25", "10:10", "SIN", "DPS", "2h 45m", 298, 0.01, { bag: "Cabin bag", tags: ["Seats together"], best: "Best for you", back: "5% back on your card" }),
        f("CL", "CL 760", "11:40", "14:30", "SIN", "DPS", "2h 50m", 262, 0.01, { bag: "Small bag only", left: 3 }),
        f("AU", "AU 226", "06:10", "11:20", "SIN", "DPS", "5h 10m", 219, 0.01, { stops: 1, via: "KUL", bag: "Cabin bag" })
      ],
      fares: { light: 238, std: 298, flex: 420 },
      cancelFee: 90,
      extraSeat: 38,
      cabinKg: 7,
      checkedKg: 20,
      cabinBag: 0,
      checkedBag: 45,
      plane: "A321neo",
      mixPts: 48e3,
      nextFlight: { number: "NW 122", dep: "12:20", arr: "15:05" },
      via: { code: "KUL", name: "Kuala Lumpur", dep: "10:30", arr: "16:00" },
      owed: "Singapore has no fixed compensation scheme, so the airline\u2019s policy applies. I\u2019ve asked Northway what they\u2019ll offer and I\u2019ll tell you.",
      lounge: { name: "The Orchard", where: "Changi T3 \xB7 after immigration" },
      gate: "B6",
      hotel: { name: "Rumah Laut", area: "Seminyak", alt: "Hotel Canggu Sands", altArea: "Canggu", price: 420, alt2: 486, suite: 590, firstNight: 210 },
      ask: "Bali for two, 16 to 18 October. Morning flight out.",
      hotelAsk: "Close to the beach for those nights, with a pool.",
      phoneEnd: "38",
      claimAction: "Ask about compensation",
      room: "Double, garden view"
    },
    MY: {
      market: "MY",
      home: "Kuala Lumpur",
      homeCode: "KUL",
      away: "Kota Kinabalu",
      awayCode: "BKI",
      mate: "Aina",
      rate: 0.01,
      balance: 8e4,
      card: "6624",
      round: 1,
      flights: [
        f("NW", "NW 450", "07:25", "10:00", "KUL", "BKI", "2h 35m", 389, 0.01, { bag: "Cabin bag", tags: ["Seats together"], best: "Best for you", back: "5% back on your card" }),
        f("CL", "CL 312", "11:40", "14:20", "KUL", "BKI", "2h 40m", 345, 0.01, { bag: "Small bag only", left: 2 }),
        f("AU", "AU 670", "06:10", "11:30", "KUL", "BKI", "5h 20m", 289, 0.01, { stops: 1, via: "KCH", bag: "Cabin bag" })
      ],
      fares: { light: 319, std: 389, flex: 560 },
      cancelFee: 120,
      extraSeat: 45,
      cabinKg: 7,
      checkedKg: 20,
      cabinBag: 0,
      checkedBag: 65,
      plane: "A320neo",
      mixPts: 4e4,
      nextFlight: { number: "NW 454", dep: "12:10", arr: "14:45" },
      via: { code: "KCH", name: "Kuching", dep: "10:50", arr: "16:05" },
      owed: "Under Malaysian aviation rules you can choose another flight or a full refund, and the airline must look after you while you wait. I\u2019ll handle the claim.",
      lounge: { name: "The Orchard", where: "KLIA T1 \xB7 after immigration" },
      gate: "C21",
      hotel: { name: "Rumah Pantai", area: "Tanjung Aru", alt: "Hotel Gaya Bay", altArea: "City centre", price: 690, alt2: 780, suite: 960, firstNight: 345 },
      ask: "Kota Kinabalu for two, 16 to 18 October. Morning flight out.",
      hotelAsk: "By the sea for those nights, with a pool.",
      phoneEnd: "15",
      claimAction: "Start claim",
      room: "Double, sea view"
    }
  };

  // src/journeys.tsx
  function PhoneFrame({ title, back, right, children, foot, nav, sheet, time = "9:41", width }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement("div", { className: "gr gr-phone", dir: M.dir, lang: M.locale, style: width ? { width } : void 0 }, /* @__PURE__ */ React.createElement("div", { className: "gr-island" }), /* @__PURE__ */ React.createElement("div", { className: "gr-status-bar", dir: "ltr" }, /* @__PURE__ */ React.createElement("span", null, time), /* @__PURE__ */ React.createElement("span", { className: "gr-row", style: { gap: 5 } }, /* @__PURE__ */ React.createElement(Icon, { name: "wifi", size: 16, stroke: 2.2 }), /* @__PURE__ */ React.createElement("svg", { width: "25", height: "12", viewBox: "0 0 25 12", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("rect", { x: ".5", y: ".5", width: "21", height: "11", rx: "3.5", fill: "none", stroke: "currentColor", opacity: ".4" }), /* @__PURE__ */ React.createElement("rect", { x: "2", y: "2", width: "16", height: "8", rx: "2", fill: "currentColor" }), /* @__PURE__ */ React.createElement("rect", { x: "23", y: "4", width: "1.5", height: "4", rx: ".75", fill: "currentColor", opacity: ".4" })))), (title || back || right) && /* @__PURE__ */ React.createElement("div", { className: "gr-hdr" }, back ? /* @__PURE__ */ React.createElement(IconButton, { icon: "back", label: M.t("back"), small: true }) : /* @__PURE__ */ React.createElement("span", { style: { width: 36 } }), /* @__PURE__ */ React.createElement("div", { className: "gr-heading", style: { textAlign: "center", flex: 1 } }, title), right || /* @__PURE__ */ React.createElement("span", { style: { width: 36 } })), /* @__PURE__ */ React.createElement("div", { className: "gr-scroll" }, children), /* @__PURE__ */ React.createElement("div", { className: "gr-fade" }), /* @__PURE__ */ React.createElement("div", { className: "gr-foot" }, foot != null ? foot : nav ? /* @__PURE__ */ React.createElement(NavBar, null) : /* @__PURE__ */ React.createElement(AskBar, null)), sheet);
  }
  function Step({ n, name, children }) {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "gr-stepname" }, /* @__PURE__ */ React.createElement("b", null, n), name), children);
  }
  var LIVE = ["UK", "EU", "IN", "AE", "SG", "MY"];
  function MarketSwitch({ render, markets = LIVE, start = "UK" }) {
    const [m, setM] = useState(start);
    return /* @__PURE__ */ React.createElement("div", { className: "gr", style: { background: "var(--ground)" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 20px 0" } }, /* @__PURE__ */ React.createElement(Chips, { items: markets.map((id) => ({ id, label: MARKETS[id].name })), value: m, onChange: (v) => v && setM(v) })), render(m));
  }
  var hm = (s) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m;
  };
  var at = (n) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
  var gap = (n) => n >= 60 ? `${Math.floor(n / 60)}h${n % 60 ? " " + n % 60 + "m" : ""}` : `${n} min`;
  function FlightBookingJourney({ market = "UK" }) {
    return /* @__PURE__ */ React.createElement(MarketProvider, { market }, /* @__PURE__ */ React.createElement(FlightBooking, { d: DEMO[market] || DEMO.UK }));
  }
  function FlightBooking({ d }) {
    const M = useMarket();
    const [nw] = d.flights;
    const total = d.fares.std * 2, cardPart = total - d.mixPts * d.rate;
    const fri = M.date("2026-10-16"), sun = M.date("2026-10-18"), wed = M.date("2026-10-14");
    return /* @__PURE__ */ React.createElement("div", { className: "gr gr-journey", dir: M.dir }, /* @__PURE__ */ React.createElement(Step, { n: 1, name: "Ask" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Gratifi", right: /* @__PURE__ */ React.createElement(IconButton, { icon: "more", label: M.t("moreL"), small: true, flat: true }) }, /* @__PURE__ */ React.createElement(YouSaid, null, d.ask), /* @__PURE__ */ React.createElement(Answer, { steps: [`Checked 38 flights from ${d.home}`, "Kept morning departures", "Priced on your card with points"], say: /* @__PURE__ */ React.createElement(React.Fragment, null, "Three good options. ", /* @__PURE__ */ React.createElement("b", null, "The ", nw.dep, " Northway"), " is the one I'd pick: direct, seats together, and 5% back on your card.") }, /* @__PURE__ */ React.createElement(Rail, null, d.flights.map((f2, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { width: 310 } }, /* @__PURE__ */ React.createElement(FlightCard, { ...f2 }))))), /* @__PURE__ */ React.createElement(Suggestions, { items: ["Only direct", "Cheaper dates?", "Add a hotel"] }))), /* @__PURE__ */ React.createElement(Step, { n: 2, name: "Dates" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "When?", back: true }, /* @__PURE__ */ React.createElement("div", { className: "gr-card" }, /* @__PURE__ */ React.createElement(PriceCalendar, { year: 2026, month: 9, from: 16, to: 18, today: 2, disabledBefore: 3, prices: calendar(d), low: lowDays(calendar(d)) })), /* @__PURE__ */ React.createElement(Travellers, { adults: 2 }))), /* @__PURE__ */ React.createElement(Step, { n: 3, name: "Fare" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Choose your fare", back: true }, /* @__PURE__ */ React.createElement(Itinerary, { legs: [{ dep: nw.dep, arr: nw.arr, from: d.homeCode, fromName: d.home, to: d.awayCode, toName: d.away, airline: "NW", number: nw.number, dur: nw.dur, plane: d.plane }] }), /* @__PURE__ */ React.createElement(FareFamilies, { fares: [
      { id: "light", name: "Light", price: d.fares.light, points: Math.round(d.fares.light / d.rate), items: [[true, "Small bag"], [false, "Cabin bag"], [false, "Seat choice"], [false, "Changes"]] },
      { id: "std", name: "Standard", price: d.fares.std, points: Math.round(d.fares.std / d.rate), pop: "Most picked", items: [[true, "Small bag"], [true, "Cabin bag"], [true, "Standard seats"], [true, "Free date change"]] },
      { id: "flex", name: "Flex", price: d.fares.flex, points: Math.round(d.fares.flex / d.rate), items: [[true, `Cabin + ${d.checkedKg}kg bag`], [true, "Any seat"], [true, "Full refund"], [true, "Fast track"]] }
    ] }), /* @__PURE__ */ React.createElement(FareRules, { rules: [["ok", "Change date", "Free up to 24 hours before"], ["fee", "Cancel", `${M.money(d.cancelFee)} fee, rest back as travel credit`], ["ok", "Seat choice", "Standard seats free"], ["nope", "Refund to card", "Not on this fare"]] }))), /* @__PURE__ */ React.createElement(Step, { n: 4, name: "Seats and bags" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Seats", back: true, foot: /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { background: "var(--card)", borderRadius: 999, padding: "8px 8px 8px 20px", boxShadow: "var(--shadow-float)" } }, /* @__PURE__ */ React.createElement("div", { className: "gr-grow" }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 650 } }, "15D and 15E"), /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, "Together, ", d.mate, " on the aisle")), /* @__PURE__ */ React.createElement("button", { className: "gr-btn gr-btn-primary" }, "Next")) }, /* @__PURE__ */ React.createElement(StickyNote, { title: `${d.mate} likes the aisle`, tone: "blue", tilt: -1, width: 260, clip: false }), /* @__PURE__ */ React.createElement("div", { className: "gr-say" }, "So I've put ", d.mate, " on the aisle in 15D, and you next to ", d.mate, " in 15E."), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "center" } }, /* @__PURE__ */ React.createElement(SeatMap, { extraPrice: d.extraSeat, mateName: d.mate })), /* @__PURE__ */ React.createElement(Label, null, "Bags"), /* @__PURE__ */ React.createElement(BagPicker, { bags: [
      { icon: "bag", name: M.t("smallBag"), sub: M.t("smallBagSub"), incl: true },
      { icon: "cabinbag", name: M.t("cabinBag"), sub: M.t("cabinBagSub", { kg: d.cabinKg }), incl: true },
      { icon: "cabinbag", name: M.t("checkedBag"), sub: M.t("checkedBagSub", { kg: d.checkedKg }), price: d.checkedBag }
    ] }))), /* @__PURE__ */ React.createElement(Step, { n: 5, name: "Pay" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Pay", back: true, foot: /* @__PURE__ */ React.createElement("span", null), sheet: /* @__PURE__ */ React.createElement(ConfirmSheet, { summary: `2 \xD7 ${nw.number} \xB7 ${fri} \xB7 Standard`, lines: [["2 adults, Standard", M.money(total, 2)], [`Points used (${M.pts(d.mixPts)})`, M.money(-d.mixPts * d.rate, 2)], ["Taxes and fees", "Included"]], total: [M.t("onYourCard"), M.money(cardPart, 2)], phone: d.phoneEnd }) }, /* @__PURE__ */ React.createElement(Label, null, M.t("payWith")), /* @__PURE__ */ React.createElement(PayWith, { points: d.balance, cash: total, rate: d.rate, mix: d.mixPts, card: d.card }))), /* @__PURE__ */ React.createElement(Step, { n: 6, name: "Done" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "", foot: /* @__PURE__ */ React.createElement("span", null) }, /* @__PURE__ */ React.createElement(Receipt, { title: `You\u2019re going to ${d.away}`, reference: "GR-48213", lines: [["Flights", `${fri} to ${sun}`], ["Seats", "15D, 15E"], ["Paid", `${M.pts(d.mixPts)} + ${M.money(cardPart)}`]], next: `Check-in opens ${wed} at ${nw.dep}. I\u2019ll do it and send the boarding passes.`, actions: ["Add a hotel", "Share trip"] }))), /* @__PURE__ */ React.createElement(Step, { n: 7, name: "Day of travel" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Your trip", back: true }, /* @__PURE__ */ React.createElement(BoardingPass, { airline: "NW", number: nw.number, from: d.homeCode, fromCity: d.home, to: d.awayCode, toCity: d.away, date: fri, dep: nw.dep, boards: at(hm(nw.dep) - 40), gate: d.gate }), /* @__PURE__ */ React.createElement(LoungePass, { name: d.lounge.name, where: d.lounge.where, valid: `${fri} \xB7 3 hours before your flight` }))));
  }
  function DisruptionJourney({ market = "UK" }) {
    return /* @__PURE__ */ React.createElement(MarketProvider, { market }, /* @__PURE__ */ React.createElement(DisruptionFlow, { d: DEMO[market] || DEMO.UK }));
  }
  function DisruptionFlow({ d }) {
    const M = useMarket();
    const [nw, cl] = d.flights;
    const fri = M.date("2026-10-16");
    const refund = d.fares.std * 2 - d.mixPts * d.rate;
    const up = Math.round(cl.price * 1.17 / d.round) * d.round;
    return /* @__PURE__ */ React.createElement("div", { className: "gr gr-journey", dir: M.dir }, /* @__PURE__ */ React.createElement(Step, { n: 1, name: "Heads-up" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Your trip", back: true }, /* @__PURE__ */ React.createElement(FlightTracker, { number: nw.number, from: d.homeCode, to: d.awayCode, status: "Delayed 35 min", tone: "warn", dep: at(hm(nw.dep) + 35), depWas: nw.dep, arr: at(hm(nw.arr) + 35), gate: d.gate, note: `Still time for the lounge. ${d.lounge.name} is open.` }))), /* @__PURE__ */ React.createElement(Step, { n: 2, name: "Cancelled" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Gratifi" }, /* @__PURE__ */ React.createElement(Disruption, { flight: nw.number, day: fri, title: `Your ${nw.dep} to ${d.away} is cancelled`, body: `Northway Air cancelled it at ${at(hm(nw.dep) - 20)}. You don\u2019t need to queue. Here\u2019s what you can do now.`, options: [
      { id: "a", t: `Next direct, ${d.nextFlight.dep} today`, s: `Lands ${d.nextFlight.arr} \xB7 seats together held for 20 min`, tag: "Best" },
      { id: "b", t: `Via ${d.via.name}, ${d.via.dep} today`, s: `Lands ${d.via.arr} \xB7 ${gap(hm(d.via.arr) - hm(d.nextFlight.arr))} later than the direct` },
      { id: "c", t: "Full refund", s: `${M.money(refund)} to your card and ${M.pts(d.mixPts)} back, in 5 to 7 working days` }
    ], owed: d.owed }))), /* @__PURE__ */ React.createElement(Step, { n: 3, name: "Rebooked" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "", foot: /* @__PURE__ */ React.createElement("span", null) }, /* @__PURE__ */ React.createElement(Receipt, { title: `You\u2019re on the ${d.nextFlight.dep}`, reference: "GR-48213", lines: [["New flight", `${d.nextFlight.number} \xB7 ${d.nextFlight.dep} \u2192 ${d.nextFlight.arr}`], ["Seats", "14D, 14E together"], ["Cost", "Nothing to pay"]], next: "I\u2019ve told your hotel you\u2019ll arrive later, and moved your ride.", actions: ["See boarding pass", d.claimAction] }))), /* @__PURE__ */ React.createElement(Step, { n: 4, name: "While booking" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Gratifi" }, /* @__PURE__ */ React.createElement(StateCard, { kind: "price", title: "The fare went up since you looked", body: "Coastline changed the price while you were choosing.", was: M.money(cl.price), now: M.money(up), actions: [`Book at ${M.money(up)}`, "See other flights"] }), /* @__PURE__ */ React.createElement(StateCard, { kind: "soldout", title: "15E has just gone", body: "Someone took it a moment ago. 16C and 16D are free, side by side across the aisle.", actions: ["Take 16C and 16D", "Pick again"] }))));
  }
  function HotelJourney({ market = "UK" }) {
    return /* @__PURE__ */ React.createElement(MarketProvider, { market }, /* @__PURE__ */ React.createElement(HotelFlow, { d: DEMO[market] || DEMO.UK }));
  }
  function HotelFlow({ d }) {
    const M = useMarket();
    const h = d.hotel;
    const fri = M.date("2026-10-16"), sun = M.date("2026-10-18"), tue = M.date("2026-10-13"), wed = M.date("2026-10-14");
    const pts = Math.round(h.price / d.rate);
    return /* @__PURE__ */ React.createElement("div", { className: "gr gr-journey", dir: M.dir }, /* @__PURE__ */ React.createElement(Step, { n: 1, name: "Choose" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Gratifi" }, /* @__PURE__ */ React.createElement(YouSaid, null, d.hotelAsk), /* @__PURE__ */ React.createElement(Answer, { steps: ["Checked 212 places near your flights", "Kept ones with a pool"], say: /* @__PURE__ */ React.createElement(React.Fragment, null, "Two stand out. ", /* @__PURE__ */ React.createElement("b", null, h.name), " is in ", h.area, " and gives 3\xD7 points on your card.") }, /* @__PURE__ */ React.createElement(Rail, null, /* @__PURE__ */ React.createElement(HotelCard, { src: ART.pool, name: h.name, area: h.area, price: h.price, points: pts, perks: ["Pool", "Breakfast"], back: "3\xD7 points", sticker: "Member price" }), /* @__PURE__ */ React.createElement(HotelCard, { src: ART.room, name: h.alt, area: h.altArea, rating: 4.5, reviews: 1204, price: h.alt2, points: Math.round(h.alt2 / d.rate), perks: ["Rooftop pool"] }))))), /* @__PURE__ */ React.createElement(Step, { n: 2, name: "Room" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: h.name, back: true }, /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18 } }, /* @__PURE__ */ React.createElement(Polaroid, { src: ART.pool, caption: "The pool at dusk", tilt: -2, width: 260, clip: true })), /* @__PURE__ */ React.createElement("div", { className: "gr-col", role: "radiogroup", "aria-label": "Rooms", style: { gap: 12 } }, /* @__PURE__ */ React.createElement(RoomOption, { src: ART.room, name: d.room, facts: ["22m\xB2", "King bed"], price: h.price, cancel: `Free cancellation to ${M.date("2026-10-13", "day")}`, checked: true }), /* @__PURE__ */ React.createElement(RoomOption, { src: ART.room, name: "Junior suite", facts: ["34m\xB2", "Balcony"], price: h.suite })), /* @__PURE__ */ React.createElement(Cancellation, { steps: [{ tone: "good", t: "Free cancellation", s: `Until 23:59, ${tue}` }, { tone: "warn", t: `First night charged, ${M.money(h.firstNight)}`, s: `From ${wed}` }, { tone: "danger", t: "No refund", s: `From check-in, ${fri}` }] }))), /* @__PURE__ */ React.createElement(Step, { n: 3, name: "Pay" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Pay", back: true, foot: /* @__PURE__ */ React.createElement("span", null), sheet: /* @__PURE__ */ React.createElement(ConfirmSheet, { summary: `${h.name} \xB7 ${fri} to ${sun} \xB7 ${d.room}`, lines: [[M.t("nightsTaxes", { n: 2 }), M.money(h.price, 2)], [`Points used (${M.pts(pts)})`, M.money(-h.price, 2)]], total: [M.t("onYourCard"), M.money(0, 2)], cta: M.auth === "faceid" ? "Book with Face ID" : M.auth === "otp" ? M.t("confirmPts", { pts: M.pts(pts) }) : void 0, phone: d.phoneEnd }) }, /* @__PURE__ */ React.createElement(Label, null, M.t("payWith")), /* @__PURE__ */ React.createElement(PayWith, { points: d.balance, cash: h.price, rate: d.rate, mix: Math.round(pts * 0.8 / 100) * 100, card: d.card, value: "points" }))), /* @__PURE__ */ React.createElement(Step, { n: 4, name: "Done" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "", foot: /* @__PURE__ */ React.createElement("span", null) }, /* @__PURE__ */ React.createElement(Receipt, { title: `${h.name} is booked`, reference: "GR-48219", lines: [["Stay", `${fri} to ${sun}`], ["Room", d.room], ["Paid", M.pts(pts)]], next: `Free cancellation until 23:59, ${tue}. I\u2019ve added it to your ${d.away} trip.`, actions: ["See the trip", "Add a dinner"] }))));
  }
  function HomeScreen({ market = "UK" }) {
    return /* @__PURE__ */ React.createElement(MarketProvider, { market }, /* @__PURE__ */ React.createElement(HomeInner, { d: DEMO[market] || DEMO.UK }));
  }
  function HomeInner({ d }) {
    const M = useMarket();
    const goal = Math.round((d.fares.std * 2 + d.hotel.price) / d.rate / 100) * 100;
    return /* @__PURE__ */ React.createElement(PhoneFrame, { nav: true }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "space-between", paddingTop: 4 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "gr-meta" }, M.t("goodMorning")), /* @__PURE__ */ React.createElement("div", { className: "gr-display" }, "Amit")), /* @__PURE__ */ React.createElement(IconButton, { icon: "bell", label: M.t("alerts"), dot: true })), /* @__PURE__ */ React.createElement("div", { className: "gr-card gr-xl", style: { alignItems: "center" } }, /* @__PURE__ */ React.createElement(Dial, { value: d.balance, progress: Math.min(1, d.balance / goal), goal: `${M.num(goal)} for ${d.away} flights and hotel` })), /* @__PURE__ */ React.createElement(StickyNote, { title: "Your lounge passes renew in 12 days", tilt: -1.5, action: "Use one on Friday", secondary: "Not now", width: 330 }, "You have 2 left before they renew. Friday's flight leaves from ", d.lounge.where.split(" \xB7 ")[0], ", where ", d.lounge.name, " is."));
  }
  function ArabicScreens() {
    return /* @__PURE__ */ React.createElement(MarketProvider, { market: "AR" }, /* @__PURE__ */ React.createElement(ArabicInner, null));
  }
  function ArabicInner() {
    const M = useMarket();
    const d = DEMO.AE;
    const [nw, cl, au] = d.flights;
    const total = d.fares.std * 2, cardPart = total - d.mixPts * d.rate;
    return /* @__PURE__ */ React.createElement("div", { className: "gr gr-journey", dir: "rtl" }, /* @__PURE__ */ React.createElement(Step, { n: 1, name: "\u0627\u0644\u0633\u0624\u0627\u0644" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Gratifi" }, /* @__PURE__ */ React.createElement(YouSaid, null, "\u0645\u0633\u0642\u0637 \u0644\u0634\u062E\u0635\u064A\u0646\u060C \u0645\u0646 16 \u0625\u0644\u0649 18 \u0623\u0643\u062A\u0648\u0628\u0631. \u0631\u062D\u0644\u0629 \u0635\u0628\u0627\u062D\u064A\u0629."), /* @__PURE__ */ React.createElement(Answer, { steps: ["\u0631\u0627\u062C\u0639\u062A\u064F 38 \u0631\u062D\u0644\u0629 \u0645\u0646 \u062F\u0628\u064A", "\u0623\u0628\u0642\u064A\u062A\u064F \u0627\u0644\u0631\u062D\u0644\u0627\u062A \u0627\u0644\u0635\u0628\u0627\u062D\u064A\u0629", "\u0627\u062D\u062A\u0633\u0628\u062A\u064F \u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u0646\u0642\u0627\u0637 \u0639\u0644\u0649 \u0628\u0637\u0627\u0642\u062A\u0643"], say: /* @__PURE__ */ React.createElement(React.Fragment, null, "\u062B\u0644\u0627\u062B\u0629 \u062E\u064A\u0627\u0631\u0627\u062A \u062C\u064A\u062F\u0629. \u0623\u0646\u0635\u062D\u0643 ", /* @__PURE__ */ React.createElement("b", null, "\u0628\u0631\u062D\u0644\u0629 \u0646\u0648\u0631\u062B \u0648\u0627\u064A \u0627\u0644\u0633\u0627\u0639\u0629 ", nw.dep), ": \u0645\u0628\u0627\u0634\u0631\u0629\u060C \u0648\u0645\u0642\u0627\u0639\u062F \u0645\u062A\u062C\u0627\u0648\u0631\u0629\u060C \u0648\u0627\u0633\u062A\u0631\u062F\u0627\u062F 5\u066A \u0639\u0644\u0649 \u0628\u0637\u0627\u0642\u062A\u0643.") }, /* @__PURE__ */ React.createElement(Rail, null, /* @__PURE__ */ React.createElement("div", { style: { width: 310 } }, /* @__PURE__ */ React.createElement(FlightCard, { ...nw, bag: "\u062D\u0642\u064A\u0628\u0629 \u0627\u0644\u0645\u0642\u0635\u0648\u0631\u0629", tags: ["\u0645\u0642\u0627\u0639\u062F \u0645\u062A\u062C\u0627\u0648\u0631\u0629"], best: "\u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u0643", back: "\u0627\u0633\u062A\u0631\u062F\u0627\u062F 5\u066A \u0639\u0644\u0649 \u0628\u0637\u0627\u0642\u062A\u0643" })), /* @__PURE__ */ React.createElement("div", { style: { width: 310 } }, /* @__PURE__ */ React.createElement(FlightCard, { ...cl, bag: "\u062D\u0642\u064A\u0628\u0629 \u0635\u063A\u064A\u0631\u0629 \u0641\u0642\u0637" })), /* @__PURE__ */ React.createElement("div", { style: { width: 310 } }, /* @__PURE__ */ React.createElement(FlightCard, { ...au, bag: "\u062D\u0642\u064A\u0628\u0629 \u0627\u0644\u0645\u0642\u0635\u0648\u0631\u0629" })))), /* @__PURE__ */ React.createElement(Suggestions, { items: ["\u0631\u062D\u0644\u0627\u062A \u0645\u0628\u0627\u0634\u0631\u0629 \u0641\u0642\u0637", "\u062A\u0648\u0627\u0631\u064A\u062E \u0623\u0631\u062E\u0635\u061F", "\u0623\u0636\u0641 \u0641\u0646\u062F\u0642\u064B\u0627"] }))), /* @__PURE__ */ React.createElement(Step, { n: 2, name: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0648\u0627\u0644\u0645\u0642\u0639\u062F" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "\u0645\u062A\u0649\u061F", back: true }, /* @__PURE__ */ React.createElement("div", { className: "gr-card" }, /* @__PURE__ */ React.createElement(PriceCalendar, { year: 2026, month: 9, from: 16, to: 18, today: 2, disabledBefore: 3, prices: calendar(d), low: lowDays(calendar(d)) })), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { justifyContent: "center" } }, /* @__PURE__ */ React.createElement(SeatMap, { extraPrice: d.extraSeat, mateName: "\u0639\u0645\u0631" })))), /* @__PURE__ */ React.createElement(Step, { n: 3, name: "\u0627\u0644\u062F\u0641\u0639" }, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "\u0627\u0644\u062F\u0641\u0639", back: true, foot: /* @__PURE__ */ React.createElement("span", null), sheet: /* @__PURE__ */ React.createElement(ConfirmSheet, { summary: `2 \xD7 ${nw.number} \xB7 ${M.date("2026-10-16")}`, lines: [["\u0628\u0627\u0644\u063A\u0627\u0646\u060C \u0627\u0644\u062A\u0630\u0643\u0631\u0629 \u0627\u0644\u0639\u0627\u062F\u064A\u0629", M.money(total, 2)], ["\u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629", M.money(-d.mixPts * d.rate, 2)]], total: [M.t("onYourCard"), M.money(cardPart, 2)] }) }, /* @__PURE__ */ React.createElement(Label, null, M.t("payWith")), /* @__PURE__ */ React.createElement(PayWith, { points: d.balance, cash: total, rate: d.rate, mix: d.mixPts, card: d.card }))));
  }

  // src/demos.tsx
  var S = ({ children, screen, col, gap: gap2 }) => /* @__PURE__ */ React.createElement("div", { className: "gr gr-stage" + (screen ? " gr-screen" : ""), style: { flexDirection: col ? "column" : void 0, gap: gap2 } }, children);
  var C = ({ t, children, w }) => /* @__PURE__ */ React.createElement("div", { className: "gr-col", style: { gap: 8, width: w } }, children, /* @__PURE__ */ React.createElement("div", { className: "gr-caption" }, t));
  var PEOPLE = [{ name: "Sam Rao", initials: "SR", color: "#3D5A80" }, { name: "Maya Chen", initials: "MC", color: "#7A4E9E" }, { name: "Jo Park", initials: "JP", color: "#2E7D5B" }, { name: "Leo Brandt", initials: "LB", color: "#B5542B" }, { name: "Ana Silva", initials: "AS", color: "#5B6B7A" }];
  function CS({ d, tot, part }) {
    const M = useMarket();
    return /* @__PURE__ */ React.createElement(ConfirmSheet, { summary: `2 \xD7 ${d.flights[0].number} \xB7 ${M.date("2026-10-16")} \xB7 Standard`, lines: [["2 adults, Standard", M.money(tot, 2)], [`Points used (${M.pts(d.mixPts)})`, M.money(-d.mixPts * d.rate, 2)]], total: [M.t("onYourCard"), M.money(part, 2)], phone: d.card.slice(2), state: M.auth === "otp" ? "code" : "ready" });
  }
  var demos = {
    /* ---------- foundations ---------- */
    Icon: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(10, 52px)", gap: "12px 8px" } }, ICONS.map((n) => /* @__PURE__ */ React.createElement("div", { key: n, title: n, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: 12, background: "var(--card)", boxShadow: "var(--shadow-card)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(Icon, { name: n, size: 20 })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "var(--ink-soft)", fontWeight: 600 } }, n))))),
    Meta: () => /* @__PURE__ */ React.createElement(S, { col: true, gap: 12 }, /* @__PURE__ */ React.createElement(Meta, { items: ["Direct", "2h 35m", "Cabin bag"] }), /* @__PURE__ */ React.createElement(Meta, { items: ["Alfama", "4.7 \u2605", "Free cancellation"] })),
    Price: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement(C, { t: "Cash and points" }, /* @__PURE__ */ React.createElement("div", { className: "gr-card" }, /* @__PURE__ */ React.createElement(Price, { amount: 186, points: 18600 }))), /* @__PURE__ */ React.createElement(C, { t: "Was and now" }, /* @__PURE__ */ React.createElement("div", { className: "gr-card" }, /* @__PURE__ */ React.createElement(Price, { amount: 142, was: 166 }))), /* @__PURE__ */ React.createElement(C, { t: "Large, with note" }, /* @__PURE__ */ React.createElement("div", { className: "gr-card" }, /* @__PURE__ */ React.createElement(Price, { amount: 496, size: "lg", note: "2 nights, taxes in" })))),
    Badge: () => /* @__PURE__ */ React.createElement(S, { gap: 10 }, /* @__PURE__ */ React.createElement(Badge, null, "Fri 16 Oct"), /* @__PURE__ */ React.createElement(Badge, { tone: "good", icon: "check" }, "Confirmed"), /* @__PURE__ */ React.createElement(Badge, { tone: "warn" }, "3 left"), /* @__PURE__ */ React.createElement(Badge, { tone: "danger" }, "Cancelled"), /* @__PURE__ */ React.createElement(Badge, { tone: "accent", icon: "sparkle" }, "Best for you"), /* @__PURE__ */ React.createElement(Badge, { tone: "ink" }, "Member price")),
    Status: () => /* @__PURE__ */ React.createElement(S, { gap: 16 }, /* @__PURE__ */ React.createElement(Status, { live: true }, "On time"), /* @__PURE__ */ React.createElement(Status, { tone: "warn", live: true }, "Delayed 35 min"), /* @__PURE__ */ React.createElement(Status, { tone: "danger" }, "Cancelled")),
    Back: () => /* @__PURE__ */ React.createElement(S, { gap: 12 }, /* @__PURE__ */ React.createElement(Back, null, "\xA39 back on your card"), /* @__PURE__ */ React.createElement(Back, null, "3\xD7 points")),
    Skeleton: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { width: 320 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-row" }, /* @__PURE__ */ React.createElement(Skeleton, { w: 44, h: 44, r: 14 }), /* @__PURE__ */ React.createElement("div", { className: "gr-grow gr-col" }, /* @__PURE__ */ React.createElement(Skeleton, { w: "70%" }), /* @__PURE__ */ React.createElement(Skeleton, { w: "40%", h: 12 }))), /* @__PURE__ */ React.createElement(Skeleton, { h: 80, r: 16 }))),
    /* ---------- actions ---------- */
    Button: () => /* @__PURE__ */ React.createElement(S, { col: true, gap: 14 }, /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Button, null, "Book for \xA335"), /* @__PURE__ */ React.createElement(Button, { variant: "secondary" }, "See details"), /* @__PURE__ */ React.createElement(Button, { variant: "quiet" }, "Not now"), /* @__PURE__ */ React.createElement(Button, { variant: "accent", icon: "sparkle" }, "Use points"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost" }, "Skip")), /* @__PURE__ */ React.createElement("div", { className: "gr-row", style: { flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Button, { size: "sm", icon: "plus" }, "Add"), /* @__PURE__ */ React.createElement(Button, { size: "lg", icon: "faceid" }, "Pay with Face ID"), /* @__PURE__ */ React.createElement(Button, { loading: true }, "Booking"), /* @__PURE__ */ React.createElement(Button, { disabled: true }, "Sold out")), /* @__PURE__ */ React.createElement("div", { style: { width: 340 } }, /* @__PURE__ */ React.createElement(Button, { block: true, size: "lg", iconRight: "arrow" }, "Continue"))),
    IconButton: () => /* @__PURE__ */ React.createElement(S, { gap: 12 }, /* @__PURE__ */ React.createElement(IconButton, { icon: "back", label: "Back" }), /* @__PURE__ */ React.createElement(IconButton, { icon: "bell", label: "Alerts", dot: true }), /* @__PURE__ */ React.createElement(IconButton, { icon: "heart", label: "Save", small: true }), /* @__PURE__ */ React.createElement(IconButton, { icon: "share", label: "Share", flat: true }), /* @__PURE__ */ React.createElement(IconButton, { icon: "mic", label: "Speak", dark: true })),
    Chips: () => /* @__PURE__ */ React.createElement(S, { col: true, gap: 14 }, /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(Chips, { items: ["Direct", "Morning", "Cabin bag", "Under \xA3200", "Refundable"], value: ["Direct", "Morning"], multi: true })), /* @__PURE__ */ React.createElement(Chips, { items: [{ id: "all", label: "All", count: 38 }, { id: "lhr", label: "Heathrow", count: 21 }, { id: "lgw", label: "Gatwick", count: 17 }], value: "lhr" })),
    Segmented: () => /* @__PURE__ */ React.createElement(S, { col: true, gap: 14 }, /* @__PURE__ */ React.createElement(Segmented, { items: ["Return", "One way", "Multi-city"] }), /* @__PURE__ */ React.createElement(Segmented, { items: ["Points", "Cash"], dark: true })),
    Toggle: () => /* @__PURE__ */ React.createElement(S, { gap: 20 }, /* @__PURE__ */ React.createElement("div", { className: "gr-row" }, /* @__PURE__ */ React.createElement(Toggle, { label: "Price alerts", on: true }), /* @__PURE__ */ React.createElement("span", null, "Price alerts")), /* @__PURE__ */ React.createElement("div", { className: "gr-row" }, /* @__PURE__ */ React.createElement(Toggle, { label: "Use points first" }), /* @__PURE__ */ React.createElement("span", null, "Use points first"))),
    Stepper: () => /* @__PURE__ */ React.createElement(S, { gap: 20 }, /* @__PURE__ */ React.createElement(Stepper, { label: "adults", value: 2, min: 1 }), /* @__PURE__ */ React.createElement(Stepper, { label: "bags" })),
    NavBar: () => /* @__PURE__ */ React.createElement(S, { col: true, gap: 14 }, /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(NavBar, null)), /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(NavBar, { current: "trips" }))),
    /* ---------- objects ---------- */
    Polaroid: () => /* @__PURE__ */ React.createElement(S, { gap: 30 }, /* @__PURE__ */ React.createElement(Polaroid, { src: ART.lisbon, caption: "Lisbon, Oct" }), /* @__PURE__ */ React.createElement(Polaroid, { src: ART.pool, caption: "Casa do Rio", tilt: 3, clip: true })),
    StickyNote: () => /* @__PURE__ */ React.createElement(S, { gap: 30 }, /* @__PURE__ */ React.createElement(StickyNote, { title: "Book the hotel on this card too", action: "Show hotels", secondary: "Not now" }, "It earns 3\xD7 points there, so your two nights come to about 1,500 points back."), /* @__PURE__ */ React.createElement(StickyNote, { title: "Sam likes the aisle", tone: "blue", from: "Your note", tilt: 1.5, clip: false, width: 260 })),
    Stamp: () => /* @__PURE__ */ React.createElement(S, { gap: 24 }, /* @__PURE__ */ React.createElement(Stamp, { name: "Flights", value: "13,000" }), /* @__PURE__ */ React.createElement(Stamp, { art: ART.stampHotel, name: "Stays", value: "3\xD7", tilt: -3 }), /* @__PURE__ */ React.createElement(Stamp, { art: ART.stampDining, name: "Dining", value: "\xA320", tilt: 4 }), /* @__PURE__ */ React.createElement(Stamp, { art: ART.stampTicket, name: "Cinema", value: "2 for 1", tilt: -1 })),
    Sticker: () => /* @__PURE__ */ React.createElement(S, { gap: 24 }, /* @__PURE__ */ React.createElement(Sticker, null, "5% back"), /* @__PURE__ */ React.createElement(Sticker, { tone: "ink", tilt: 4 }, "Last room"), /* @__PURE__ */ React.createElement(Sticker, { tone: "paper", icon: "star", tilt: -3 }, "Members")),
    TripFolder: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement("div", { style: { width: 360, paddingTop: 40 } }, /* @__PURE__ */ React.createElement(TripFolder, { title: "Lisbon", dates: "16 to 18 Oct", photos: [ART.lisbon, ART.pool, ART.food], people: [{ name: "Amit Chawla" }, { name: "Sam Rao" }], items: [{ icon: "plane", title: "NW 214 \xB7 07:25", meta: "Seats 15D, 15E", done: true }, { icon: "hotel", title: "Casa do Rio", meta: "2 nights", done: true }, { icon: "car", title: "Airport ride", meta: "Fri 10:15" }] }))),
    Dial: () => /* @__PURE__ */ React.createElement(S, { gap: 30 }, /* @__PURE__ */ React.createElement(Dial, { value: 48210, progress: 0.78, goal: "62,000 for Lisbon flights and hotel" }), /* @__PURE__ */ React.createElement(Dial, { value: "\xA342", label: "Back in Oct", progress: 0.3, size: 160 })),
    CheckPop: () => /* @__PURE__ */ React.createElement(S, { gap: 24 }, /* @__PURE__ */ React.createElement(CheckPop, null), /* @__PURE__ */ React.createElement(CheckPop, { size: 40 }), /* @__PURE__ */ React.createElement(CheckPop, { size: 24, animate: false })),
    AvatarStack: () => /* @__PURE__ */ React.createElement(S, { gap: 24 }, /* @__PURE__ */ React.createElement(AvatarStack, { people: PEOPLE.slice(0, 2) }), /* @__PURE__ */ React.createElement(AvatarStack, { people: PEOPLE })),
    /* ---------- conversation ---------- */
    AskBar: () => /* @__PURE__ */ React.createElement(S, { col: true, gap: 16 }, /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(AskBar, null)), /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(AskBar, { value: "Lisbon for two in October" })), /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(AskBar, { listening: true }))),
    YouSaid: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement("div", { className: "gr-thread", style: { width: 360 } }, /* @__PURE__ */ React.createElement(YouSaid, null, "Lisbon for two, 16 to 18 October. Morning flight out."), /* @__PURE__ */ React.createElement(YouSaid, null, "Only direct"))),
    Steps: () => /* @__PURE__ */ React.createElement(S, { screen: true, gap: 30 }, /* @__PURE__ */ React.createElement(C, { t: "Finished" }, /* @__PURE__ */ React.createElement(Steps, { steps: ["Checked 38 flights from London", "Kept morning departures", "Priced on your card with points"] })), /* @__PURE__ */ React.createElement(C, { t: "Working" }, /* @__PURE__ */ React.createElement(Steps, { steps: ["Checked 38 flights from London", "Pricing on your card"], running: true }))),
    Answer: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(Answer, { steps: ["Read your card\u2019s terms", "Checked this month\u2019s spend"], say: /* @__PURE__ */ React.createElement(React.Fragment, null, "Yes. Your card covers ", /* @__PURE__ */ React.createElement("b", null, "two lounge visits a year"), ", and you have both left."), actions: [{ label: "Use one on Friday" }, { label: "Which lounges?" }], source: "Card terms, section 4.2" }, /* @__PURE__ */ React.createElement(StickyNote, { title: "Friday: T5, The Orchard", clip: false, tilt: -1, width: 330, from: "" }, "Opens 05:00. Your flight is 07:25.")))),
    Typing: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(Typing, null)),
    Suggestions: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(Suggestions, { items: ["Only direct", "Cheaper dates?", "Add a hotel", "Use points"] }))),
    Moment: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement(Moment, { title: "Your lounge passes renew in 12 days", action: "Use one on Friday", secondary: "Not now" }, "You have 2 left before they renew. Friday's flight is from T5.")),
    Handoff: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(Handoff, null)),
    Toast: () => /* @__PURE__ */ React.createElement(S, { col: true, gap: 12 }, /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(Toast, { undo: "Undo" }, "Offer added to your card")), /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(Toast, null, "Price alert set for Lisbon"))),
    /* ---------- commerce ---------- */
    Rail: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement("div", { style: { width: 380, overflow: "hidden", padding: "0 16px" } }, /* @__PURE__ */ React.createElement(Rail, { title: "Offers on your card", more: "See all 24" }, [["Harbour & Co", "H", "#2E5E4E", "10% back"], ["Northway Air", "N", "#1F3A5F", "5% back"], ["Bloom", "B", "#B5542B", "\xA35 off \xA330"]].map(([b, m, c, r]) => /* @__PURE__ */ React.createElement("div", { key: b, style: { width: 300 } }, /* @__PURE__ */ React.createElement(OfferCard, { brand: b, mono: m, color: c, rate: r, sub: "Until 31 Oct" })))))),
    OfferCard: () => /* @__PURE__ */ React.createElement(S, { screen: true, col: true, gap: 12 }, /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(OfferCard, { brand: "Harbour & Co", mono: "H", color: "#2E5E4E", rate: "10% back", sub: "Until 31 Oct \xB7 up to \xA315" })), /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(OfferCard, { brand: "Northway Air", mono: "N", color: "#1F3A5F", rate: "5% back", why: "You fly with them most", added: true }))),
    ProductCard: () => /* @__PURE__ */ React.createElement(S, { screen: true, gap: 14 }, /* @__PURE__ */ React.createElement("div", { style: { width: 200 } }, /* @__PURE__ */ React.createElement(ProductCard, { src: ART.jacket, name: "Rain shell jacket", meta: ["Outdoor", "Free delivery"], price: 120, points: 15e3, badge: "New" })), /* @__PURE__ */ React.createElement("div", { style: { width: 200 } }, /* @__PURE__ */ React.createElement(ProductCard, { src: ART.cinema, name: "Cinema for two", meta: ["Any Friday"], price: 24, points: 3e3, back: "2 for 1" }))),
    Compare: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(Compare, { columns: ["07:25 NW", "11:40 CL", "06:10 AU"], best: 0, rows: [{ label: "Lands", values: ["10:00", "14:20", "11:55"] }, { label: "Direct", values: [true, true, false] }, { label: "Cabin bag", values: [true, false, true] }, { label: "Price", values: ["\xA3186", "\xA3142", "\xA3128"] }] })),
    FilterBar: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement("div", { style: { width: 380, overflow: "hidden" } }, /* @__PURE__ */ React.createElement(FilterBar, { filters: ["Direct", "Morning", "Cabin bag", "Under \xA3200", "Heathrow"] }))),
    PriceCalendar: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { width: 360 } }, /* @__PURE__ */ React.createElement(PriceCalendar, { from: 16, to: 18, today: 2, disabledBefore: 3, prices: { 3: 142, 4: 156, 5: 164, 6: 148, 7: 132, 8: 176, 9: 212, 10: 198, 11: 184, 12: 138, 13: 124, 14: 118, 15: 158, 16: 128, 17: 204, 18: 172, 19: 126, 20: 118, 21: 122, 22: 168, 23: 214, 24: 196, 25: 178, 26: 128, 27: 116, 28: 119, 29: 162, 30: 208, 31: 134 }, low: [14, 20, 27] }))),
    Travellers: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement(Travellers, { adults: 2, infants: 1 })),
    PayWith: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(PayWith, null))),
    PointsSlider: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement(PointsSlider, null)),
    PriceLines: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { width: 360 } }, /* @__PURE__ */ React.createElement(PriceLines, { lines: [["2 adults, Standard", "\xA3372.00"], ["Seats 15D, 15E", "Included"], ["Points used (30,000 pts)", "\u2212\xA3300.00"]], total: ["On your card", "\xA372.00"], note: "Taxes and fees included." }))),
    ConfirmSheet: () => /* @__PURE__ */ React.createElement(S, { gap: 20 }, [["UK", "Face ID (UK)"], ["IN", "One-time code (India)"], ["MY", "Approve in the bank app (Malaysia)"]].map(([m, cap]) => {
      const d = DEMO[m];
      const tot = d.fares.std * 2, part = tot - d.mixPts * d.rate;
      return /* @__PURE__ */ React.createElement(MarketProvider, { key: m, market: m }, /* @__PURE__ */ React.createElement(C, { t: cap }, /* @__PURE__ */ React.createElement("div", { style: { width: 380, height: 700, position: "relative", borderRadius: 32, overflow: "hidden", background: "var(--screen)" } }, /* @__PURE__ */ React.createElement(CS, { d, tot, part }))));
    }), /* @__PURE__ */ React.createElement(C, { t: "Done" }, /* @__PURE__ */ React.createElement("div", { style: { width: 380, height: 700, position: "relative", borderRadius: 32, overflow: "hidden", background: "var(--screen)" } }, /* @__PURE__ */ React.createElement(ConfirmSheet, { summary: "Seats 15D, 15E \xB7 Lisbon, Fri 16 Oct", state: "done" })))),
    Receipt: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement(Receipt, { lines: [["Flights", "Fri 16 to Sun 18 Oct"], ["Seats", "15D, 15E"], ["Paid", "30,000 pts + \xA372"]], next: "Check-in opens Wed 14 Oct. I\u2019ll do it and send the boarding passes.", actions: ["Add a hotel", "Share trip"] })),
    SendTo: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement(SendTo, { people: PEOPLE, selected: ["Sam Rao", "Jo Park"] })),
    StateCard: () => /* @__PURE__ */ React.createElement(S, { screen: true, gap: 16 }, /* @__PURE__ */ React.createElement(StateCard, { kind: "price", title: "The fare went up since you looked", body: "Coastline changed the price while you were choosing.", was: "\xA3142", now: "\xA3166", actions: ["Book at \xA3166", "Other flights"] }), /* @__PURE__ */ React.createElement(StateCard, { kind: "soldout", title: "15E has just gone", body: "16C and 16D are free, side by side across the aisle.", actions: ["Take 16C and 16D"] }), /* @__PURE__ */ React.createElement(StateCard, { kind: "error", title: "Northway isn\u2019t answering", body: "Nothing has been booked or paid. Try again in a minute.", actions: ["Try again"] }), /* @__PURE__ */ React.createElement(StateCard, { kind: "empty", title: "No direct flights that morning", body: "There are two after 12:00, or direct on Thursday.", actions: ["Show Thursday", "After 12:00"] })),
    /* ---------- flights ---------- */
    AirlineMark: () => /* @__PURE__ */ React.createElement(S, { gap: 14 }, Object.keys(AIRLINES).map((k) => /* @__PURE__ */ React.createElement("div", { key: k, className: "gr-row", style: { gap: 8 } }, /* @__PURE__ */ React.createElement(AirlineMark, { code: k }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600 } }, AIRLINES[k].name)))),
    FlightCard: () => /* @__PURE__ */ React.createElement(S, { screen: true, gap: 16 }, /* @__PURE__ */ React.createElement(FlightCard, { airline: "NW", number: "NW 214", dep: "07:25", arr: "10:00", from: "LHR", to: "LIS", dur: "2h 35m", price: 186, points: 18600, bag: "Cabin bag", tags: ["Seats together"], best: "Best for you", back: "5% back on your card", selected: true }), /* @__PURE__ */ React.createElement(FlightCard, { airline: "CL", number: "CL 902", dep: "11:40", arr: "14:20", from: "LGW", to: "LIS", dur: "2h 40m", price: 142, points: 14200, left: 3, bag: "Small bag only" }), /* @__PURE__ */ React.createElement(FlightCard, { airline: "AU", number: "AU 336", bag: "Cabin bag", dep: "21:50", arr: "06:15", plusDays: 1, from: "LHR", to: "LIS", dur: "8h 25m", stops: 1, via: "OPO", price: 128, points: 12800 })),
    Itinerary: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(Itinerary, { legs: [{ dep: "06:35", arr: "08:45", from: "LHR", fromName: "London Heathrow", to: "OPO", toName: "Porto", airline: "AU", number: "AU 340", dur: "2h 10m" }, { dep: "09:30", arr: "10:25", from: "OPO", fromName: "Porto", to: "LIS", toName: "Lisbon", airline: "AU", number: "AU 1184", dur: "55m" }], layovers: [{ text: "45 min in Porto \xB7 same terminal, tight", short: true }] })),
    FareFamilies: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement("div", { style: { width: 380, overflow: "hidden", padding: "12px 16px" } }, /* @__PURE__ */ React.createElement(FareFamilies, { fares: [{ id: "light", name: "Light", price: 148, points: 14800, items: [[true, "Small bag"], [false, "Cabin bag"], [false, "Seat choice"], [false, "Changes"]] }, { id: "std", name: "Standard", price: 186, points: 18600, pop: "Most picked", items: [[true, "Small bag"], [true, "Cabin bag"], [true, "Standard seats"], [true, "Free date change"]] }, { id: "flex", name: "Flex", price: 264, points: 26400, items: [[true, "Cabin + 23kg bag"], [true, "Any seat"], [true, "Full refund"], [true, "Fast track"]] }] }))),
    SeatMap: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(SeatMap, null)),
    BagPicker: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(BagPicker, null)),
    BoardingPass: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(BoardingPass, null)),
    FlightTracker: () => /* @__PURE__ */ React.createElement(S, { screen: true, gap: 16 }, /* @__PURE__ */ React.createElement(FlightTracker, { status: "On time", tone: "good", depWas: "", dep: "07:25", arr: "10:00", progress: 0 }), /* @__PURE__ */ React.createElement(FlightTracker, { progress: 0.55, status: "In the air", tone: "good", dep: "08:00", depWas: "", arr: "10:35", note: "Lands in 1h 10m. Your ride is booked for 10:50." })),
    Disruption: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(Disruption, { owed: "You may be owed up to \xA3350 each under UK rules. I\u2019ll start the claim once you\u2019re rebooked." })),
    ChangeFlight: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(ChangeFlight, null)),
    FareRules: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(FareRules, null)),
    /* ---------- stays and more ---------- */
    HotelCard: () => /* @__PURE__ */ React.createElement(S, { screen: true, gap: 20 }, /* @__PURE__ */ React.createElement(HotelCard, { src: ART.pool, name: "Casa do Rio", area: "Alfama", price: 248, points: 24800, perks: ["Pool", "Breakfast"], back: "3\xD7 points", sticker: "Member price" }), /* @__PURE__ */ React.createElement(HotelCard, { src: ART.room, name: "Hotel Miradouro", area: "Chiado", rating: 4.5, reviews: 1204, price: 296, points: 29600, perks: ["Rooftop pool"] })),
    RoomOption: () => /* @__PURE__ */ React.createElement(S, { screen: true, col: true, gap: 12 }, /* @__PURE__ */ React.createElement("div", { className: "gr-col", role: "radiogroup", "aria-label": "Rooms", style: { gap: 12 } }, /* @__PURE__ */ React.createElement(RoomOption, { src: ART.room, name: "Double, river view", facts: ["22m\xB2", "King bed"], price: 248, cancel: "Free cancellation to 13 Oct", checked: true }), /* @__PURE__ */ React.createElement(RoomOption, { src: ART.room, name: "Junior suite", facts: ["34m\xB2", "Balcony"], price: 342 }))),
    Cancellation: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(Cancellation, null)),
    ExperienceCard: () => /* @__PURE__ */ React.createElement(S, { screen: true, gap: 16 }, /* @__PURE__ */ React.createElement(ExperienceCard, { src: ART.food, name: "Tasca dinner in Alfama", when: "Sat 19:30", meta: ["3 hours", "Small group"], price: 48, points: 6e3, rating: 4.9 }), /* @__PURE__ */ React.createElement(ExperienceCard, { src: ART.lisbon, name: "Fado evening", when: "Fri 21:00", meta: ["90 min"], price: 32, points: 4e3 })),
    TimeSlots: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { width: 360 } }, /* @__PURE__ */ React.createElement("div", { className: "gr-heading" }, "Saturday 17 Oct"), /* @__PURE__ */ React.createElement(TimeSlots, null))),
    GiftCardTile: () => /* @__PURE__ */ React.createElement(S, { gap: 16 }, /* @__PURE__ */ React.createElement(GiftCardTile, { note: "6,250 pts" }), /* @__PURE__ */ React.createElement(GiftCardTile, { brand: "Bloom", amount: 25, color: "#B5542B", note: "3,125 pts" }), /* @__PURE__ */ React.createElement(GiftCardTile, { brand: "Northway Air", amount: 100, color: "#1F3A5F", note: "12,500 pts" })),
    RideOption: () => /* @__PURE__ */ React.createElement(S, { screen: true, col: true, gap: 10 }, /* @__PURE__ */ React.createElement("div", { className: "gr-col", role: "radiogroup", "aria-label": "Rides", style: { gap: 10, width: 360 } }, /* @__PURE__ */ React.createElement(RideOption, { checked: true }), /* @__PURE__ */ React.createElement(RideOption, { name: "Larger", eta: "7 min away", seats: 6, price: 52, note: "Room for 4 bags" }))),
    LoungePass: () => /* @__PURE__ */ React.createElement(S, { screen: true }, /* @__PURE__ */ React.createElement(LoungePass, null)),
    /* ---------- bank ---------- */
    PaymentDue: () => /* @__PURE__ */ React.createElement(S, { screen: true, gap: 16 }, /* @__PURE__ */ React.createElement(C, { t: "UK" }, /* @__PURE__ */ React.createElement(PaymentDue, null)), /* @__PURE__ */ React.createElement(C, { t: "India: auto-debit, lakh grouping" }, /* @__PURE__ */ React.createElement(MarketProvider, { market: "IN" }, /* @__PURE__ */ React.createElement(PaymentDue, { amount: 142680.5, min: 7134, date: "12\xA0Nov", days: 2, autopay: true }))), /* @__PURE__ */ React.createElement(C, { t: "Singapore: GIRO" }, /* @__PURE__ */ React.createElement(MarketProvider, { market: "SG" }, /* @__PURE__ */ React.createElement(PaymentDue, { amount: 1284.4, min: 50, date: "4\xA0Nov" })))),
    TransactionRow: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { width: 360, gap: 0 } }, /* @__PURE__ */ React.createElement(TransactionRow, { mono: "N", color: "#1F3A5F", ink: "#fff", name: "Northway Air", meta: ["Travel", "Today"], amount: 72, points: 216 }), /* @__PURE__ */ React.createElement("div", { className: "gr-hr" }), /* @__PURE__ */ React.createElement(TransactionRow, { mono: "H", color: "#2E5E4E", ink: "#fff", name: "Harbour & Co", meta: ["Offer: 10% back"], amount: 4.2, refund: true }), /* @__PURE__ */ React.createElement("div", { className: "gr-hr" }), /* @__PURE__ */ React.createElement(TransactionRow, { mono: "B", name: "Bloom", meta: ["Shopping", "Mon"], amount: 28.5 }))),
    BenefitRow: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement("div", { className: "gr-card", style: { width: 360, gap: 0, paddingTop: 4, paddingBottom: 4 } }, /* @__PURE__ */ React.createElement(BenefitRow, { icon: "sofa", name: "Airport lounges", sub: "2 visits a year", value: "2 left" }), /* @__PURE__ */ React.createElement(BenefitRow, { icon: "shield", name: "Purchase protection", sub: "Up to 120 days" }), /* @__PURE__ */ React.createElement(BenefitRow, { icon: "globe", name: "No fees abroad", sub: "On purchases in other currencies" }))),
    /* ---------- screens ---------- */
    PhoneFrame: () => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement(PhoneFrame, { title: "Gratifi" }, /* @__PURE__ */ React.createElement(YouSaid, null, "What does my card give me at airports?"), /* @__PURE__ */ React.createElement(Typing, null))),
    HomeScreen: () => /* @__PURE__ */ React.createElement(MarketSwitch, { render: (m) => /* @__PURE__ */ React.createElement(S, null, /* @__PURE__ */ React.createElement(HomeScreen, { market: m })) }),
    FlightBookingJourney: () => /* @__PURE__ */ React.createElement(MarketSwitch, { render: (m) => /* @__PURE__ */ React.createElement(FlightBookingJourney, { market: m }) }),
    DisruptionJourney: () => /* @__PURE__ */ React.createElement(MarketSwitch, { render: (m) => /* @__PURE__ */ React.createElement(DisruptionJourney, { market: m }) }),
    HotelJourney: () => /* @__PURE__ */ React.createElement(MarketSwitch, { render: (m) => /* @__PURE__ */ React.createElement(HotelJourney, { market: m }) }),
    ArabicScreens: () => /* @__PURE__ */ React.createElement(ArabicScreens, null),
    Markets: () => /* @__PURE__ */ React.createElement(S, { gap: 18 }, ["UK", "EU", "IN", "AE", "SG", "MY", "AR"].map((m) => {
      const d = DEMO[m === "AR" ? "AE" : m];
      return /* @__PURE__ */ React.createElement(MarketProvider, { key: m, market: m }, /* @__PURE__ */ React.createElement(C, { t: MARKETS[m].name + " \xB7 " + MARKETS[m].currency + " \xB7 " + { faceid: "Face ID", otp: "one-time code", app: "bank app approval" }[MARKETS[m].auth] }, /* @__PURE__ */ React.createElement("div", { className: "gr-col", style: { gap: 12, width: 340 } }, /* @__PURE__ */ React.createElement(FlightCard, { ...d.flights[0], best: void 0, back: void 0, tags: [], bag: void 0 }), /* @__PURE__ */ React.createElement(PayWith, { points: d.balance, cash: d.fares.std * 2, rate: d.rate, mix: d.mixPts, card: d.card }))));
    }))
  };

  // src/index.tsx
  var G = { ...base_exports, ...talk_exports, ...travel_exports, ...journeys_exports, Icon, Spark, ICONS, ART, demos, MarketProvider, MARKETS, useMarket, fmt, STRINGS, DEMO };
  window.Gratifi = G;
})();
