const { extractOrder } = require("./extract");

const tests = [
  {
    label: "1 — Original (3 items, 2 times)",
    input: "शर्मा जी को 2 के जी आटा और 3 लीटर तेल कल सुबह चाहिए और उसके साथ उन्हें कल दोपहर के लिए 5 के जी चिकन भी चाहिए",
    expect: { customer: "शर्मा जी", items: ["Atta","Oil","Chicken"] }
  },
  {
    label: "2 — Pizza (number word, no unit)",
    input: "मुझे दो पिज़्ज़ा चाहिए",
    expect: { customer: "Unknown", items: ["Pizza"] }
  },
  {
    label: "3 — Screenshot sentence (size crosses boundary + बजे time)",
    input: "मुझे कल 3 नमक के पैकेट चाहिए 1 1 के जी वाले और 2 तेल की बोतल चाहिए डेढ़ लीटर वाली और 5 पास्ता के पैकेट चाहिए और 2 पिज़्ज़ा चाहिए शाम 05:00 बजे",
    expect: { customer: "Unknown", items: ["Salt","Oil (1.5 litre)","Pasta","Pizza"] }
  },
  {
    label: "4 — Earlier complex sentence (5-litre oil, back-qty pasta)",
    input: "मुझे 2 के जी नमक एक किलो आटा 3 तेल की बोतल 5 लीटर वाली और पास्ता के 3 पैकेट चाहिए",
    expect: { customer: "Unknown", items: ["Salt","Atta","Oil (5 litre)","Pasta"] }
  },
  {
    label: "5 — Unknown gibberish (blank fallback row)",
    input: "हेलो कैसे हो",
    expect: { customer: "Unknown", items: [""] }
  },
];

let pass = 0, fail = 0;
tests.forEach(({ label, input, expect }) => {
  const r = extractOrder(input);
  const customerOk = r.customer === expect.customer;
  const names = r.items.map((i) => i.item);
  const itemsOk = JSON.stringify(names) === JSON.stringify(expect.items);
  const ok = customerOk && itemsOk;
  if (ok) pass++;
  else fail++;

  const icon = ok ? "✅" : "❌";
  console.log("\n" + icon + " " + label);
  if (!ok) {
    if (!customerOk) console.log("   customer: got", r.customer, "expected", expect.customer);
    if (!itemsOk)    console.log("   items:    got", names, "expected", expect.items);
  }
  console.table(r.items);
});

console.log("\n── Results:", pass, "passed,", fail, "failed ──");
