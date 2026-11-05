const { extractOrder } = require("./extract");
const text = "शर्मा जी को 2 के जी आटा और 3 लीटर तेल कल सुबह चाहिए और उसके साथ उन्हें कल दोपहर के लिए 5 के जी चिकन भी चाहिए";
const order = extractOrder(text);
console.log("Customer:", order.customer);
console.table(order.items);
