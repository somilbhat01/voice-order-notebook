# 🎙️ Voice Order Notebook — Sovereign AI for Indian Kirana

> Built for the **Great Indian AI Internship Challenge 2026** by [Gnani.ai](https://gnani.ai).  
> Category target: **Hinglish / Code-mixed Voice & Real-World Impact**.

---

## 📌 Problem Statement
Small retail and grocery (*kirana*) shop owners across India receive dozens of spoken orders daily over the counter or via phone calls in Hindi and Hinglish. Typing these orders into point-of-sale software or accounting apps is tedious and slow, especially when Hindi keyboards are difficult to use.

**Voice Order Notebook** solves this with a voice-first interface: a shopkeeper speaks naturally in Hindi or Hinglish, and the app transcribes, extracts structured order entities (Customer, Items, Quantities, Units, Delivery times), presents an editable table for quick verification, and allows instant saving and WhatsApp sharing.

---

## ⚡ Tech Stack & Gnani Models Used
- **Speech-to-Text Model**: **Gnani Prisma v2.5** (`https://api.vachana.ai/stt/v3`) via `hi-IN` language code.
- **Backend**: Node.js (`server.js`) with native HTTP & Fetch APIs.
- **Entity Extraction Engine**: Custom Rule-Based NLP parser (`extract.js`) optimized for conversational Hindi & Hinglish phrasing:
  - **Hindi Number Words**: Handles *एक, दो, तीन, आधा (0.5), डेढ़ (1.5), ढाई (2.5)*.
  - **Packaging & Containers**: Understands patterns like *तेल की बोतल, पास्ता के 3 पैकेट*.
  - **Size & Volume Qualifiers**: Binds specifications like *डेढ़ लीटर वाली, 5 के जी वाले* to the correct item.
  - **Contextual Time Parsing**: Extracts delivery slots (*आज शाम, कल सुबह, शाम 05:00 बजे*) and propagates time across order segments.
- **Frontend**: Pure HTML5 / CSS3 / Vanilla JS with Web Audio API for in-browser 16kHz mono WAV encoding.

---

## 🚀 Key Features
1. **One-Tap Voice Recording**: Captures audio and converts it directly in-browser to 16kHz uncompressed WAV.
2. **High-Accuracy Hindi STT**: Powered by Gnani Prisma v2.5.
3. **Structured Entity Extraction**: Converts messy speech transcripts into structured rows with items, quantities, units, and timestamps.
4. **Editable Verification Grid**: Human-in-the-loop design — the shopkeeper can modify quantities, add missing items, or delete rows in seconds.
5. **WhatsApp Order Dispatch**: One-click sharing of formatted receipts directly to customers or delivery partners via WhatsApp.
6. **Local Persistence**: Saves all orders with timestamps for easy daily tracking.

---

## 🛠️ Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/voice-order-notebook.git
   cd voice-order-notebook
   ```

2. **Set your Gnani API Key**:
   ```bash
   export GNANI_API_KEY="your-vachana-api-key"
   ```

3. **Start the server**:
   ```bash
   npm start
   # or: node server.js
   ```

4. **Open in browser**:
   Visit [http://localhost:3000](http://localhost:3000).
