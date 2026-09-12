import { NextRequest, NextResponse } from 'next/server';

// ─── Gemini (optional upgrade) ───────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are Aria, a warm medical tourism assistant for Tatavera Health. Help international patients with treatments, hospitals, costs, visa, and travel in India. Be concise (3-5 sentences). Services are 100% free for patients. Partner hospitals: Apollo Chennai, Medanta Gurugram, Fortis FMRI, Kokilaben Mumbai, BLK-Max Delhi, Aster Kochi, Manipal Bangalore, Artemis Gurugram. Costs (USD): Heart bypass $6-9k, Knee replacement $3.5-5.5k, Liver transplant $28-45k, BMT $18-35k, IVF $2.5-4k, Spine $5.5-10k. e-Medical Visa takes 3-5 days, we provide invitation letters. Always end with an offer to connect with the team.`;

// ─── Built-in response engine (works with zero API key) ──────────────────────

type KBEntry = { keywords: string[]; reply: string };

const KB: KBEntry[] = [
  {
    keywords: ['knee', 'knee replacement', 'knee surgery', 'tkr', 'total knee', 'orthopedic', 'ortho', 'joint replacement', 'hip replacement', 'hip surgery'],
    reply: `Great choice — India is the #1 destination for joint replacement surgery globally. Here's what you need to know:\n\n🦴 **Knee Replacement Cost in India**\n• Total Knee Replacement: $3,500–$5,500\n• Bilateral Knee (both knees): $6,000–$9,000\n• Robotic-assisted: $5,000–$8,000\n• USA comparison: $35,000–$70,000 → you save 80–90%\n\n🏥 **Best Hospitals for Knee Replacement**\n1. **Medanta, Gurugram** — 1,650 beds, robotic knee specialist, 97.8% success rate\n2. **Fortis Memorial, Gurgaon** — JCI 5× Gold Seal, top robotic ortho program\n3. **Kokilaben, Mumbai** — India's largest robotic surgery centre (da Vinci Xi)\n4. **Apollo, Chennai** — 145 countries served, knee from $3,500\n5. **Artemis, Gurgaon** — First JCI-accredited in Gurgaon\n\n⏱️ **Timeline**: 10–14 days total stay | Hospital: 4–5 days\n\nWould you like me to connect you with a case manager for a free personalised quote? Just click **Book Free Consultation** or WhatsApp us! 💬`,
  },
  {
    keywords: ['heart', 'cardiac', 'bypass', 'cabg', 'angioplasty', 'valve', 'open heart', 'heart surgery', 'cardiovascular'],
    reply: `India leads the world in cardiac surgery outcomes at a fraction of Western costs.\n\n❤️ **Cardiac Surgery Costs in India**\n• Heart Bypass (CABG): $6,000–$9,000 (vs $80,000–$150,000 in USA)\n• Angioplasty (stent): $3,000–$5,500\n• Heart Valve Replacement: $8,000–$14,000\n• TAVI (minimally invasive valve): $12,000–$20,000\n• Savings: **70–90% vs USA/UK**\n\n🏥 **Best Cardiac Hospitals**\n1. **Medanta, Gurugram** — Founded by Dr. Naresh Trehan, 10,000+ heart surgeries/year\n2. **Apollo, Chennai** — India's first JCI hospital, 98.2% cardiac success rate\n3. **Fortis Memorial, Gurgaon** — Top 30 most technologically advanced globally\n4. **Kokilaben, Mumbai** — Robotic cardiac surgery pioneer\n\nAll our partner hospitals are JCI-accredited with 95–99% success rates. Our service is **100% free** for patients.\n\nReady to get a free cost estimate? Click **Book Free Consultation** or WhatsApp us! 💬`,
  },
  {
    keywords: ['cancer', 'oncology', 'tumor', 'chemotherapy', 'radiation', 'proton', 'cyberknife', 'lymphoma', 'leukemia'],
    reply: `India offers world-class cancer treatment at 70–80% lower cost than the USA/UK.\n\n🔬 **Cancer Treatment Costs in India**\n• Chemotherapy (per cycle): $800–$2,500\n• Radiation therapy (full course): $4,000–$8,000\n• Proton Therapy: $25,000–$35,000 (vs $120,000+ in USA)\n• CyberKnife Radiosurgery: $6,000–$12,000\n• Robotic Cancer Surgery: $5,000–$14,000\n\n🏥 **Best Cancer Hospitals**\n1. **Apollo, Chennai** — Proton therapy centre, 145 countries treated\n2. **BLK-Max, Delhi** — CyberKnife, TrueBeam, haematology leader\n3. **Manipal, Bangalore** — 3,000+ robotic oncology procedures\n4. **Fortis FMRI, Gurgaon** — Gamma Knife, advanced oncology\n\nFor cancer treatment, we strongly recommend sharing your reports for a specialist opinion. Our case managers speak English, Arabic, French & Russian.\n\nClick **Book Free Consultation** to get matched with the right oncologist — completely free! 💬`,
  },
  {
    keywords: ['liver', 'liver transplant', 'hepatic', 'cirrhosis', 'liver cancer'],
    reply: `India is among the top 5 countries globally for liver transplants, with success rates matching the best international centres.\n\n🫀 **Liver Transplant Costs**\n• Living Donor Liver Transplant: $28,000–$40,000\n• Cadaveric Liver Transplant: $35,000–$45,000\n• USA comparison: $300,000–$500,000 → **save 85–92%**\n\n🏥 **Best Liver Transplant Hospitals**\n1. **Medanta, Gurugram** — Dr. A.S. Soin, 5,000+ transplants, 95.8% success\n2. **Apollo, Chennai** — JCI Gold Seal, complex transplants\n3. **Aster Medcity, Kochi** — Multi-organ transplant leader, South India\n4. **BLK-Max, Delhi** — Leading transplant centre, JCI accredited\n\n⏱️ Timeline: 4–8 weeks total stay required\n\nFor liver transplant, please upload your medical reports for a specialist review. Click **Book Free Consultation** — our team will revert within 24 hours! 💬`,
  },
  {
    keywords: ['ivf', 'fertility', 'infertility', 'ivf treatment', 'iui', 'egg', 'embryo', 'surrogacy', 'test tube'],
    reply: `India has some of the highest IVF success rates in Asia with costs 60–75% lower than Western countries.\n\n👶 **IVF & Fertility Costs in India**\n• IVF (single cycle): $2,500–$4,000\n• IVF with donor egg: $3,500–$5,500\n• IUI: $300–$600 per cycle\n• Frozen Embryo Transfer: $1,000–$1,800\n• USA comparison: $12,000–$20,000 per cycle\n\n🏥 **Best IVF Hospitals**\n1. **BLK-Max, Delhi** — High success rates, international patient unit\n2. **Manipal, Bangalore** — Comprehensive fertility centre\n3. **Apollo, Chennai** — Personalised IVF protocols\n4. **Kokilaben, Mumbai** — Advanced reproductive medicine\n\n⏱️ Timeline: 3–4 weeks (outpatient, no hospitalisation needed)\n\nMany of our patients from Africa and the Middle East have successfully had babies through Indian IVF programmes. Click **Book Free Consultation** for a personalised plan! 💬`,
  },
  {
    keywords: ['spine', 'spinal', 'disc', 'back surgery', 'tlif', 'plif', 'scoliosis', 'laminectomy', 'back pain'],
    reply: `India's spine surgery centres offer cutting-edge minimally invasive techniques at 70–85% lower cost.\n\n🦷 **Spine Surgery Costs in India**\n• TLIF / PLIF Spinal Fusion: $5,500–$9,000\n• Discectomy (minimally invasive): $3,000–$5,000\n• Cervical Disc Replacement: $5,000–$8,500\n• Scoliosis Correction: $8,000–$15,000\n• USA comparison: $50,000–$150,000\n\n🏥 **Best Spine Hospitals**\n1. **Fortis Memorial, Gurgaon** — Top 30 globally for technology, spine robotics\n2. **Apollo, Chennai** — Navigation-assisted spine surgery\n3. **Medanta, Gurugram** — Complex spinal deformity specialist\n4. **Aster, Kochi** — Robotic spine surgery, 1,200+ robotic procedures/year\n\n⏱️ Timeline: 14–21 days | Hospital stay: 5–7 days\n\nClick **Book Free Consultation** to get matched with a specialist and receive a free cost estimate! 💬`,
  },
  {
    keywords: ['bone marrow', 'bmt', 'stem cell', 'transplant', 'haematology', 'blood cancer', 'leukaemia', 'leukemia', 'lymphoma'],
    reply: `India is a global leader in bone marrow transplantation with world-class outcomes.\n\n🩸 **Bone Marrow Transplant Costs**\n• Autologous BMT (own cells): $14,000–$20,000\n• Allogeneic BMT (donor cells): $18,000–$35,000\n• USA comparison: $150,000–$300,000 → **save 85–90%**\n\n🏥 **Best BMT Hospitals**\n1. **BLK-Max, Delhi** — Largest private sector BMT programme in India, CyberKnife\n2. **Medanta, Gurugram** — Advanced haematology, 97.8% success\n3. **Fortis FMRI** — Allogenic BMT specialist\n4. **Apollo, Chennai** — Paediatric and adult BMT\n\nFor BMT, please share medical reports early — matching and evaluation takes 2–4 weeks.\n\nClick **Book Free Consultation** for a specialist review — completely free! 💬`,
  },
  {
    keywords: ['hair', 'hair transplant', 'fue', 'prp', 'baldness', 'hair loss', 'alopecia'],
    reply: `India offers excellent hair transplant results at a fraction of UK/USA prices.\n\n💇 **Hair Transplant Costs in India**\n• FUE (2,000 grafts): $1,500–$2,500\n• FUE (3,000+ grafts): $2,500–$3,500\n• PRP Hair Treatment: $300–$600 per session\n• UK/USA comparison: $8,000–$15,000\n\nMost patients only need a 3–5 day stay (outpatient procedure). Results are visible within 6–12 months.\n\n🏥 Our partner hospitals in Delhi, Mumbai, and Bangalore have experienced trichology teams with 98%+ satisfaction.\n\nWant a free personalised quote? Click **Book Free Consultation** or WhatsApp us! 💬`,
  },
  {
    keywords: ['visa', 'medical visa', 'e-visa', 'e-medical visa', 'passport', 'travel document', 'entry'],
    reply: `Getting a Medical Visa for India is straightforward and we handle the entire process for you.\n\n🛂 **India e-Medical Visa — Key Facts**\n• Available for 165+ countries\n• Processing time: **3–5 business days** (online)\n• Cost: ~$25–$80 depending on nationality\n• Valid for 60 days, triple entry\n• Companion visa available for 1 attendant\n\n📋 **Documents Required**\n1. Valid passport (6+ months validity)\n2. Hospital appointment letter (we provide this)\n3. Passport photo\n4. Proof of funds / bank statement\n5. Return flight ticket or itinerary\n\nWe provide the **official hospital invitation letter** and assist with the online application. Most of our patients from Nigeria, Kenya, Egypt, Kuwait, and Russia get their visa within 3 days.\n\nClick **Book Free Consultation** and we'll start the visa process immediately! 💬`,
  },
  {
    keywords: ['cost', 'price', 'how much', 'expensive', 'affordable', 'cheap', 'budget', 'savings', 'save money'],
    reply: `India typically saves patients **70–90% compared to USA, UK, and Australian prices**.\n\n💰 **Cost Comparison (USD)**\n| Treatment | India | USA | Savings |\n|---|---|---|---|\n| Heart Bypass | $6–9k | $80–150k | ~90% |\n| Knee Replacement | $3.5–5.5k | $35–70k | ~87% |\n| Liver Transplant | $28–45k | $300–500k | ~90% |\n| IVF | $2.5–4k | $12–20k | ~75% |\n| Spine Surgery | $5.5–10k | $50–150k | ~85% |\n| Cancer (Chemo) | $800–2.5k/cycle | $10–30k | ~80% |\n\nAll prices include surgery + hospital stay + nursing care. **No hidden fees**.\n\nOur service (consultation, doctor matching, visa support, travel coordination) is **100% free** for patients — we're compensated by hospitals.\n\nWant a personalised cost estimate for your specific condition? Click **Book Free Consultation**! 💬`,
  },
  {
    keywords: ['free', 'your service', 'service free', 'how do you', 'how does it work', 'how it works', 'what do you do', 'your company'],
    reply: `Yes — **Tatavera Health is completely free for patients!** 🎁\n\nHere's how it works:\n\n1. **Submit your case** — Share your medical reports and we review within 24 hours\n2. **Get matched** — We find the best hospital and doctor for your condition and budget\n3. **Plan your trip** — We arrange medical visa, flights, airport transfer, accommodation\n4. **Receive treatment** — Your dedicated case manager is with you every step\n5. **Recovery support** — 6 months of telemedicine follow-up included\n\n**How we're compensated:** Partner hospitals pay us a referral fee. You pay the hospital directly at the same rate as any local patient — no markup, ever.\n\nOur team speaks **English, Arabic, French, and Russian** and operates 7 days a week.\n\nReady to start? Click **Book Free Consultation** or WhatsApp us! 💬`,
  },
  {
    keywords: ['hospital', 'best hospital', 'top hospital', 'which hospital', 'recommend hospital', 'jci', 'accredited', 'accreditation'],
    reply: `All our partner hospitals are internationally accredited — here are our top 8:\n\n🏥 **Tatavera Partner Hospitals**\n\n1. **Apollo, Chennai** — JCI/NABH/NABL | Est. 1983 | 2.5M+ patients from 145 countries | 4.9★\n2. **Medanta, Gurugram** — JCI/NABH | 1,650 beds | Founded by Dr. Naresh Trehan | 4.9★\n3. **Fortis FMRI, Gurgaon** — JCI 5× Gold Seal | Top 30 globally for technology | 4.8★\n4. **Kokilaben, Mumbai** — JCI/NABH | India's largest robotic surgery centre | 4.8★\n5. **BLK-Max, Delhi** — JCI | BMT leader | CyberKnife + TrueBeam | 4.7★\n6. **Aster Medcity, Kochi** — JCI/NABH | 1,200+ robotic procedures/year | 4.8★\n7. **Manipal, Bangalore** — JCI/NABH/CAP | 33 hospitals network | 4.7★\n8. **Artemis, Gurgaon** — JCI | First JCI in Gurgaon | 24/7 interpreter services | 4.7★\n\nAll hospitals have dedicated International Patient Services departments.\n\nWhich specialty are you looking for? I can give you a more specific recommendation! 💬`,
  },
  {
    keywords: ['stay', 'how long', 'duration', 'days', 'weeks', 'time', 'travel', 'when to come'],
    reply: `Here's a typical timeline for medical travel to India:\n\n📅 **Treatment Timelines**\n• Knee/Hip Replacement: **10–14 days** (hospital: 4–5 days)\n• Heart Bypass: **14–21 days** (hospital: 7–10 days)\n• Liver Transplant: **4–8 weeks** (hospital: 3–4 weeks)\n• IVF: **3–4 weeks** (outpatient, no hospitalisation)\n• Spine Surgery: **14–21 days** (hospital: 5–7 days)\n• Hair Transplant: **3–5 days** (outpatient)\n• Cancer (initial consult + first treatment): **2–4 weeks**\n\n✈️ **What We Arrange**\n• Medical visa & invitation letter\n• Airport pickup on arrival\n• Hospital-approved accommodation nearby\n• Daily coordination with hospital\n• Discharge planning & return travel\n\nCan I ask which procedure you're planning? I'll give you an exact timeline! 💬`,
  },
  {
    keywords: ['appointment', 'book', 'consult', 'consultation', 'doctor', 'specialist', 'second opinion'],
    reply: `Booking a free consultation is easy and takes less than 2 minutes!\n\n📋 **How to Book**\n1. Click the **"Book Free Consultation"** button on this page\n2. Fill in your name, country, and medical specialty\n3. Choose your preferred date and time\n4. Our case manager will confirm within 2 hours\n\nAlternatively, **WhatsApp us directly at +919877263279** for an instant response.\n\n💡 **For faster matching**, you can also upload your medical reports (scans, blood tests, doctor letters) — our medical team will review and recommend the best specialist within 24 hours.\n\nThe consultation is **100% free** with no obligation. Ready to get started? 💬`,
  },
  {
    keywords: ['whatsapp', 'contact', 'phone', 'call', 'email', 'reach', 'speak to', 'talk to', 'human', 'agent', 'manager'],
    reply: `You can reach our team through multiple channels:\n\n📞 **Contact Tatavera Health**\n• **WhatsApp**: +919877263279 (fastest, typically replies in < 30 min)\n• **Email**: care@tataverahealth.com\n• **Consultation Form**: Click "Book Free Consultation" on this page\n\n🕐 **Available**: 7 days a week, 8 AM – 10 PM IST\n📍 **Languages**: English, Arabic, French, Russian\n\nFor urgent medical cases, WhatsApp is recommended for the fastest response. Our case managers are medical professionals who can review your case and provide personalised guidance.\n\nWould you like me to help with anything else before you connect with the team? 💬`,
  },
];

function smartReply(userText: string): string | null {
  const lower = userText.toLowerCase();
  // Score each KB entry by number of keyword matches
  let best: { score: number; reply: string } = { score: 0, reply: '' };
  for (const entry of KB) {
    const score = entry.keywords.filter((kw) => lower.includes(kw)).length;
    if (score > best.score) best = { score, reply: entry.reply };
  }
  return best.score > 0 ? best.reply : null;
}

const FALLBACK =
  "I'd be happy to help with that! For the most accurate guidance on your specific case, I recommend speaking directly with our medical team.\n\n📋 **Here's how to get personalised help:**\n• Click **Book Free Consultation** on this page\n• WhatsApp us at **+919877263279** (reply within 30 min)\n• Email: care@tataverahealth.com\n\nOur case managers speak English, Arabic, French, and Russian and are available 7 days a week. **All services are 100% free for patients!** 💬";

// ─── Gemini AI (optional — only used if GEMINI_API_KEY is set) ────────────────
async function askGemini(messages: { role: string; content: string }[]): Promise<string | null> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 20) return null;

  const allMapped = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const firstUser = allMapped.findIndex((m) => m.role === 'user');
  if (firstUser === -1) return null;

  // Enforce strict alternation
  const contents: { role: string; parts: { text: string }[] }[] = [];
  for (const msg of allMapped.slice(firstUser)) {
    if (!contents.length || contents[contents.length - 1].role !== msg.role) {
      contents.push(msg);
    } else {
      contents[contents.length - 1].parts[0].text += '\n' + msg.parts[0].text;
    }
  }

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 600, topP: 0.95 },
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === 'user');
    const userText: string = lastUser?.content || '';

    // 1. Try Gemini AI if key is configured
    const aiReply = await askGemini(messages).catch(() => null);
    if (aiReply) return NextResponse.json({ reply: aiReply });

    // 2. Smart keyword-based response
    const kbReply = smartReply(userText);
    if (kbReply) return NextResponse.json({ reply: kbReply });

    // 3. Generic fallback
    return NextResponse.json({ reply: FALLBACK });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ reply: FALLBACK });
  }
}
