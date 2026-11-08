# 🎙️ Voice Order Notebook & Digital Khata
### *Sovereign AI Voice Assistant for Indian Kirana & Small Retail*

> Built for the **Great Indian AI Internship Challenge 2026** by [Gnani.ai](https://gnani.ai).  
> **Live Demo:** [https://voice-order-notebook-production.up.railway.app](https://voice-order-notebook-production.up.railway.app)  
> **Target Categories:** *Hinglish / Code-Mixed Voice*, *Real-World Impact*, *Best 60-Second Demo*.

---

## 📌 Problem Statement
Over 12 million small grocery (*kirana*) and retail shops in India receive dozens of spoken orders daily over the counter or via phone calls in Hindi and Hinglish. 

Managing these orders on physical paper registers (*bahi-khata*) or attempting to type them into point-of-sale software is slow, error-prone, and unnatural while tending to customers. Shopkeepers cannot easily track:
1. **Advance Pre-Orders**: What needs to be packed and delivered tomorrow morning vs. today evening.
2. **Udhaar (Credit) Accounts**: Who owes how much and whether money was received via Cash, UPI, or remains pending.

**Voice Order Notebook** solves this with a voice-first interface: the shopkeeper speaks naturally in colloquial Hindi/Hinglish, and the system extracts structured items, quantities, delivery times, and credit dues in real-time.

---

## ⚡ Tech Stack & Gnani Model Integration

- **Speech-to-Text Model**: **Gnani Prisma v2.5** (`https://api.vachana.ai/stt/v3`) with language code `hi-IN`.
- **Backend**: Node.js (`server.js`) with native HTTP & Fetch APIs, deployed on Railway.
- **Frontend**: Vanilla HTML5 / CSS3 / JavaScript with in-browser **16kHz Mono WAV encoding** using the Web Audio API.
- **Custom Rule-Based NLP Engine (`extract.js`)**:
  - **Hindi Number Words**: Resolves *एक, दो, तीन, आधा (0.5), डेढ़ (1.5), ढाई (2.5)*.
  - **Packaging & Containers**: Understands patterns like *तेल की बोतल, पास्ता के 3 पैकेट*.
  - **Size & Volume Qualifiers**: Binds specifications like *डेढ़ लीटर वाली, 5 के जी वाले* to the respective item.
  - **Contextual Time Parsing**: Extracts delivery slots (*आज शाम, कल सुबह, शाम 05:00 बजे*) and propagates time context across sentences.
  - **Smart Udhaar & Payment Parsing**: Automatically detects credit terms (*उधार लिख लो, बाकी*) and payment modes (*UPI से दे दिया, कैश*).

---

## 🚀 Key Features

1. **One-Tap Voice Recording with Live Timer**: In-browser Web Audio API converts microphone input to uncompressed 16kHz WAV and streams it to Gnani Prisma.
2. **Real-World Hinglish Speech Recognition**: Natively parses code-mixed Hindi & English phrasing without requiring keyboard typing.
3. **Structured Entity & Credit Extraction**: Transforms raw audio transcripts into clean records with customer name, items, quantities, delivery slots, and bill amount.
4. **Human-in-the-Loop Verification**: An editable table allows shopkeepers to adjust quantities, remove rows, or add missing items before saving.
5. **Interactive Digital Bahi-Khata (Register)**:
   - **Live Stats Bar**: Real-time counters for Total Orders, Pending Deliveries, and Total Udhaar (बाकी रकम).
   - **1-Tap Status Toggles**: Click `⏳ Pending` ↔ `✅ Delivered` or `📕 Udhaar` ↔ `💰 Paid`.
   - **Filter & Search**: Quickly filter by delivery status or search customers by name.
6. **Instant WhatsApp Order Slips**: One-click sharing of formatted receipts and payment reminders directly to customers or delivery boys via WhatsApp.
7. **Judge Test Chips**: Pre-loaded sample audio simulations allowing instant 1-tap testing without requiring a microphone.

---

## 🛠️ Local Setup & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/somilbhat01/voice-order-notebook.git
   cd voice-order-notebook
   ```

2. **Set your Gnani API Key**:
   ```bash
   export GNANI_API_KEY="your-gnani-vachana-api-key"
   ```

3. **Start the application**:
   ```bash
   npm start
   # or: node server.js
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🌐 Live Cloud Deployment
- **Hosted App**: [https://voice-order-notebook-production.up.railway.app](https://voice-order-notebook-production.up.railway.app)
- **Repository**: [https://github.com/somilbhat01/voice-order-notebook](https://github.com/somilbhat01/voice-order-notebook)
