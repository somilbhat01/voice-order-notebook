"use strict";
const N = (s) => s.normalize("NFC");

/* ── Dictionaries ── */
const UNITS = {
  "के जी": "kg", "किलो": "kg", "kg": "kg",
  "लीटर": "litre", "litre": "litre", "liter": "litre",
  "ग्राम": "g", "gram": "g",
  "पैकेट": "packet", "packet": "packet",
  "दर्जन": "dozen", "dozen": "dozen",
  "पीस": "pc", "प्लेट": "plate",
  "बोतल": "bottle", "bottle": "bottle",
  "डिब्बा": "box", "box": "box",
  "थैला": "bag",
};

const ITEMS = {
  "आटा": "Atta",        "atta": "Atta",
  "तेल": "Oil",         "oil": "Oil",
  "चिकन": "Chicken",    "chicken": "Chicken",
  "चावल": "Rice",       "rice": "Rice",
  "दाल": "Dal",         "dal": "Dal",
  "चीनी": "Sugar",      "sugar": "Sugar",
  "दूध": "Milk",        "milk": "Milk",
  "नमक": "Salt",        "salt": "Salt",
  "चाय": "Tea",         "tea": "Tea",
  "पानी": "Water",      "water": "Water",
  "पनीर": "Paneer",     "paneer": "Paneer",
  "अंडा": "Egg",        "अंडे": "Eggs",
  "पिज़्ज़ा": "Pizza",  "पिज्जा": "Pizza", "पिज़ा": "Pizza", "pizza": "Pizza",
  "बर्गर": "Burger",    "burger": "Burger",
  "कोल्ड ड्रिंक": "Cold drink",
  "बिस्कुट": "Biscuits","biscuit": "Biscuits",
  "मैगी": "Maggi",      "maggi": "Maggi",
  "साबुन": "Soap",      "soap": "Soap",
  "पास्ता": "Pasta",    "pasta": "Pasta",
  "ब्रेड": "Bread",     "bread": "Bread",
  "मक्खन": "Butter",    "butter": "Butter",
  "घी": "Ghee",         "ghee": "Ghee",
  "आलू": "Potato",      "potato": "Potato",
  "प्याज": "Onion",     "प्याज़": "Onion",  "onion": "Onion",
  "टमाटर": "Tomato",    "tomato": "Tomato",
  "हल्दी": "Turmeric",  "turmeric": "Turmeric",
  "मिर्च": "Chilli",    "chilli": "Chilli",
  "मसाला": "Masala",    "masala": "Masala",
  "बेसन": "Besan",      "besan": "Besan",
  "सूजी": "Suji",
  "मैदा": "Maida",      "maida": "Maida",
  "कॉफी": "Coffee",     "coffee": "Coffee",
  "दही": "Curd",        "curd": "Curd",
  "मटन": "Mutton",      "mutton": "Mutton",
  "मछली": "Fish",       "fish": "Fish",
  "केला": "Banana",     "banana": "Banana",
  "सेब": "Apple",       "apple": "Apple",
  "नूडल्स": "Noodles",  "noodles": "Noodles",
  "शैम्पू": "Shampoo",  "shampoo": "Shampoo",
  "डिटर्जेंट": "Detergent", "detergent": "Detergent",
  "सरसों": "Mustard",
};

const NUMWORDS = {
  "एक": 1,  "दो": 2,     "तीन": 3,  "चार": 4,  "पाँच": 5, "पांच": 5,
  "छह": 6,  "छः": 6,     "सात": 7,  "आठ": 8,   "नौ": 9,   "दस": 10,
  "ग्यारह": 11, "बारह": 12, "पंद्रह": 15, "बीस": 20, "पच्चीस": 25,
  "आधा": 0.5, "डेढ़": 1.5, "डेढ": 1.5, "ढाई": 2.5,
};

const DAYS  = { "आज": "Today", "कल": "Tomorrow", "परसों": "Day after tomorrow" };
const PARTS = { "सुबह": "morning", "दोपहर": "afternoon", "शाम": "evening", "रात": "night" };

/* ── Regex helpers ── */
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const alt = (keys) => keys.map(N).sort((a, b) => b.length - a.length).map(esc).join("|");

const ITEM_MAP = Object.fromEntries(Object.entries(ITEMS).map(([k, v]) => [N(k).toLowerCase(), v]));
const UNIT_MAP = Object.fromEntries(Object.entries(UNITS).map(([k, v]) => [N(k).toLowerCase(), v]));
const NUM_MAP  = Object.fromEntries(Object.entries(NUMWORDS).map(([k, v]) => [N(k), v]));

const L = "[\\p{L}\\p{M}]";

// Main pattern: (optional qty)(optional unit)(item)
const ITEM_RE = new RegExp(
  "(?:(\\d+(?:\\.\\d+)?|(?<!" + L + ")(?:" + alt(Object.keys(NUMWORDS)) + ")(?!" + L + "))\\s*" +
  "(?:(" + alt(Object.keys(UNITS)) + ")(?!" + L + ")\\s*)?)?" +
  "(?<!" + L + ")(" + alt(Object.keys(ITEMS)) + ")(?!" + L + ")",
  "giu"
);

const NUM_ALT  = "\\d+(?:\\.\\d+)?|" + alt(Object.keys(NUMWORDS));
const UNIT_ALT = alt(Object.keys(UNITS));

// "के 3 पैकेट" or "की 2 kg"
const TAIL_QTY  = new RegExp("^\\s*(?:के|की)\\s*(" + NUM_ALT  + ")\\s*(" + UNIT_ALT + ")(?!" + L + ")", "iu");
// "की बोतल" or "के पैकेट"
const TAIL_UNIT = new RegExp("^\\s*(?:के|की)\\s*(" + UNIT_ALT + ")(?!" + L + ")", "iu");
// "1.5 लीटर वाली"
const TAIL_SIZE = new RegExp("^\\s*(\\d+(?:\\.\\d+)?)\\s*(" + UNIT_ALT + ")\\s*वाल[ीेा]", "iu");
// "डेढ़ लीटर वाली"
const NSIZE_RE  = new RegExp("^\\s*(" + alt(Object.keys(NUMWORDS)) + ")\\s*(" + UNIT_ALT + ")\\s*वाल[ीेा]", "iu");

/* ── Time extraction ── */
function findTime(text) {
  const day  = (text.match(/आज|कल|परसों/) || [])[0];
  const part = (text.match(/सुबह|दोपहर|शाम|रात/) || [])[0];
  const baje = (text.match(/(\d{1,2}(?::\d{2})?)\s*बजे/) || [])[1];
  const out  = [day && DAYS[day], part && PARTS[part]].filter(Boolean);
  if (baje) out.push("at " + baje);
  return out.join(" ") || null;
}

/* ── Payment & Amount extraction ── */
function findPayment(text) {
  if (/paid|कैश|नकद|दे दिए|हो गया|पेमेंट कर दिया/i.test(text)) return "paid";
  if (/उधार|बाकी|बाद में|खाता|खता|unpaid/i.test(text)) return "unpaid";
  return "unpaid"; // default for kirana advance orders
}

function findAmount(text) {
  const m = text.match(/(\d+(?:\.\d+)?)\s*(?:रुपये|रुपए|रूपये|rupees|rs\.?|inr)/i);
  return m ? Number(m[1]) : "";
}

/* ── Pre-process: move size qualifiers that crossed a चाहिए boundary ──
   "2 तेल की बोतल चाहिए डेढ़ लीटर वाली और..." 
   → "2 तेल की बोतल डेढ़ लीटर वाली चाहिए और..."
*/
function preprocess(text) {
  const re = new RegExp(
    "(चाहिए|चाहिये)\\s+(" +
    "(?:\\d+(?:\\.\\d+)?|" + alt(Object.keys(NUMWORDS)) + ")" +
    "\\s+(?:" + UNIT_ALT + ")" +
    "\\s+वाल[ीेा])\\s+",
    "giu"
  );
  return text.replace(re, " $2 $1 ");
}

/* ── Main extractor ── */
function extractOrder(rawText) {
  const text = N(preprocess(rawText));

  // Customer: "शर्मा जी को ..." → "शर्मा जी"
  const c = text.match(/^(.+?)\s+को\s/);
  const customer = c && !/\d/.test(c[1]) && c[1].length <= 30 ? c[1].trim() : "Unknown";

  const globalTime = findTime(text);   // fallback time from full sentence
  const items = [];
  let lastTime = globalTime;

  for (const segment of text.split(/चाहिए|चाहिये/)) {
    if (!segment.trim()) continue;

    const segTime = findTime(segment);
    // Propagate time forward: use this segment's time, or the last one seen
    const when = segTime || lastTime || "Not specified";
    if (segTime) lastTime = segTime;

    const seen = new Set();
    for (const m of segment.matchAll(ITEM_RE)) {
      let item     = ITEM_MAP[N(m[3]).toLowerCase()] || m[3];
      let hasQty   = m[1] !== undefined;
      let quantity = hasQty ? (NUM_MAP[N(m[1])] ?? Number(m[1])) : 1;
      let unit     = m[2] ? UNIT_MAP[N(m[2]).toLowerCase()] : null;
      const tail   = segment.slice(m.index + m[0].length);

      if (!unit) {
        const q = tail.match(TAIL_QTY);
        const u = tail.match(TAIL_UNIT);
        if (!hasQty && q) {
          // e.g. "नमक के 3 पैकेट"
          quantity = NUM_MAP[N(q[1])] ?? Number(q[1]);
          unit     = UNIT_MAP[N(q[2]).toLowerCase()];
          hasQty   = true;
        } else if (u) {
          // e.g. "तेल की बोतल डेढ़ लीटर वाली"
          unit = UNIT_MAP[N(u[1]).toLowerCase()];
          const rest = tail.slice(u[0].length);
          const sz   = rest.match(TAIL_SIZE) || rest.match(NSIZE_RE);
          if (sz) {
            const val = NUM_MAP[N(sz[1])] ?? Number(sz[1]);
            item += " (" + val + " " + UNIT_MAP[N(sz[2]).toLowerCase()] + ")";
          }
        }
      } else {
        // Inline unit already found — still check for size after item
        const sz = tail.match(TAIL_SIZE) || tail.match(NSIZE_RE);
        if (sz) {
          const val = NUM_MAP[N(sz[1])] ?? Number(sz[1]);
          item += " (" + val + " " + UNIT_MAP[N(sz[2]).toLowerCase()] + ")";
        }
      }

      if (!hasQty && seen.has(item)) continue; // skip duplicate no-qty mentions
      seen.add(item);
      items.push({ item, quantity, unit: unit || "pc", when });
    }
  }

  if (items.length === 0) {
    items.push({ item: "", quantity: 1, unit: "pc", when: globalTime || "Not specified" });
  }
  const payment = findPayment(text);
  const totalAmount = findAmount(text);
  return { customer, payment, totalAmount, status: "pending", items };
}

module.exports = { extractOrder };
