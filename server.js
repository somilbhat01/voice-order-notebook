const http = require("http");
const fs = require("fs");
const path = require("path");
const { extractOrder } = require("./extract");

const PORT = Number(process.env.PORT) || 3000;
const API_KEY = process.env.GNANI_API_KEY;
const ORDERS_FILE = path.join(__dirname, "orders.json");

if (!API_KEY) {
  console.error('GNANI_API_KEY is not set. Run: export GNANI_API_KEY="your-key"');
  process.exit(1);
}

function loadOrders() {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8")); }
  catch { return []; }
}

async function transcribe(buffer) {
  const form = new FormData();
  form.append("audio_file", new Blob([buffer], { type: "audio/wav" }), "audio.wav");
  form.append("language_code", "hi-IN");
  const res = await fetch("https://api.vachana.ai/stt/v3", {
    method: "POST",
    headers: { "X-API-Key-ID": API_KEY },
    body: form,
  });
  return res.json();
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}

function send(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

const handleRequest = async (req, res) => {
  try {
    if (req.method === "GET" && (req.url === "/health" || req.url === "/ping")) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("OK");
    }

    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(fs.readFileSync(path.join(__dirname, "index.html")));
    }

    if (req.method === "POST" && req.url === "/api/order") {
      const audio = await readBody(req);
      const data = await transcribe(audio);
      if (!data.success) return send(res, 502, { error: "Transcription failed", details: data });
      const order = extractOrder(data.transcript);
      return send(res, 200, { transcript: data.transcript, ...order });
    }

    if (req.method === "POST" && req.url === "/api/save") {
      const body = JSON.parse((await readBody(req)).toString("utf8"));
      const orders = loadOrders();
      orders.unshift({
        id: Date.now(),
        savedAt: new Date().toISOString(),
        status: body.status || "pending",
        payment: body.payment || "unpaid",
        paymentMethod: body.paymentMethod || (body.payment === "paid" ? "Cash" : "Udhaar"),
        totalAmount: Number(body.totalAmount) || 0,
        ...body,
      });
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
      return send(res, 200, { ok: true });
    }

    if (req.method === "POST" && req.url === "/api/order/update") {
      const { id, updates } = JSON.parse((await readBody(req)).toString("utf8"));
      const orders = loadOrders();
      const idx = orders.findIndex((o) => o.id === id);
      if (idx !== -1) {
        orders[idx] = { ...orders[idx], ...updates };
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
        return send(res, 200, { ok: true, order: orders[idx] });
      }
      return send(res, 404, { error: "Order not found" });
    }

    if (req.method === "POST" && req.url === "/api/order/delete") {
      const { id } = JSON.parse((await readBody(req)).toString("utf8"));
      let orders = loadOrders();
      orders = orders.filter((o) => o.id !== id);
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
      return send(res, 200, { ok: true });
    }

    if (req.method === "GET" && req.url === "/api/orders") {
      return send(res, 200, loadOrders());
    }

    res.writeHead(404);
    res.end("Not found");
  } catch (e) {
    console.error(e);
    send(res, 500, { error: e.message });
  }
};

const server = http.createServer(handleRequest);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on 0.0.0.0:${PORT}`);
});

// If Railway assigned a different PORT (e.g., 8080), also listen on 3000 to match proxy settings
if (PORT !== 3000) {
  try {
    const backupServer = http.createServer(handleRequest);
    backupServer.listen(3000, "0.0.0.0", () => {
      console.log("Also listening on 0.0.0.0:3000");
    });
  } catch (err) {
    console.error("Backup listener on 3000 error:", err.message);
  }
}
