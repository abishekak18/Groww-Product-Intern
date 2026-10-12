# Groww Start — Educational Investing Companion for Indian Gen Z

> **Independent Educational Product Prototype**  
> *Built for young Indians aged 20–26 (college students, interns, and first-time earners) to build financial clarity, practice with ₹10,000 in virtual cash, and track financial goals without risking real capital.*  
> **Important Notice:** Groww Start is an independent learning demo and educational sandbox. It is not affiliated with, endorsed by, or operated by Groww (Nextbillion Technology Pvt. Ltd.) or any registered brokerage. All assets, prices, and orders are 100% fictional.

---

## 1. Product Overview & Hypothesis

### The Problem
Young Indians opening their first investment application encounter:
- Intimidating financial terminology (NAV, expense ratio, Sensex, CAGR, F&O).
- Paralyzing fear of losing hard-earned stipends or savings.
- Difficulty distinguishing disciplined long-term investing from short-term speculation.
- Social media misinformation promoting risky options trading or "get rich quick" schemes.

### Product Hypothesis
By introducing a mobile-first, zero-risk educational companion combining **bite-sized lessons with Indian context (₹)**, a **deterministic ₹10,000 virtual trading simulator**, and **savings goal tracking with non-judgmental feedback**, first-time investors develop sustainable habits and confidence before ever risking real money.

---

## 2. Core Features

### A. Personalized Onboarding
- **Persona Alignment:** Identifies if the user is a college student, intern/first-time earner, or early professional.
- **Goal Mapping:** Targets emergency funds, tech gadgets, higher education, or index fund mastery.
- **Familiarity Calibration:** Adapts pace from complete beginner to intermediate.
- **Skip Capability:** Allows exploring immediately with zero friction.

### B. High-Clarity Dashboard
- **5-Second Clarity:** Displays virtual portfolio value, learning progress, and goals progress at a single glance.
- **Next Recommended Action:** Contextual prompt directing the user to their next unread lesson or first simulated trade.
- **Gen Z Tip of the Day:** Actionable advice on budgeting, beating inflation, and emergency buffers.

### C. Learn Center (8 Interactive Lessons)
1. **Saving versus Investing:** The chai & savings account dilemma vs long-term purchasing power.
2. **What is a Stock?** Fractional business ownership with real Indian examples.
3. **What is a Mutual Fund?** The buffet analogy and pooling funds for broad diversification.
4. **What is a SIP?** Automated rupee-cost averaging and why market dips buy more units.
5. **Understanding Risk & Return:** The unbreakable seesaw; debunking "guaranteed 30% returns".
6. **The Magic of Diversification:** Balancing equities, debt, and digital gold.
7. **Inflation & Compounding:** The silent wealth eroder and the exponential math of starting at age 21 vs 31.
8. **Common Beginner Mistakes:** Avoiding FOMO, Telegram tips, and options trading traps (highlighting SEBI's 90%+ retail loss data).

*Each lesson includes:*
- Simple, jargon-free explanations.
- Practical Indian-context examples with real rupee figures.
- Clear callouts of risks and limitations.
- Interactive understanding quiz with instant feedback and explanations.

### D. Virtual Investing Simulator
- **Initial Capital:** ₹10,000 in fictional virtual cash.
- **6 Diverse Fictional Assets:**
  - *Nifty 50 Fictional Index Fund (NIFTY50-F)* — Index Mutual Fund
  - *Bharat Titans Bluechip Fictional Fund (BTITAN-F)* — Large-Cap Equity
  - *Apex Multi-Cap Fictional Fund (APEXFLEX-F)* — Flexi-Cap Equity
  - *Indus Cloud & AI Tech Fictional Stock (INNOTECH-F)* — Individual Equity
  - *Digital Gold 24K Fictional Trust (DGOLD-F)* — Commodity
  - *Sovereign Green Bond Fictional Trust (SGRNBOND-F)* — Government Debt
- **Interactive Price History Charts:** 7D, 1M, 6M, and 1Y views powered by Recharts.
- **Simulated Order Execution:** Input by units or rupee amount, real-time cost previews, and two-step confirmation explicitly reinforcing the simulated nature.
- **Holdings & Transaction Log:** Average buy price, current market value, unrealized P&L (₹ and %), realized P&L, and complete audit trail.
- **Strict Validations:** Rejection of zero, negative, non-finite amounts, insufficient virtual cash, or insufficient holdings.

### E. Financial Goals
- **Savings vs. Investment Distinction:** Explicit guidance that near-term goals (under 1–2 years) belong in safe savings accounts or liquid funds, not volatile stocks.
- **Goal Management:** Create, edit, and delete goals (Emergency Fund, Gadget, Higher Studies, Travel).
- **Progress Tracking:** Rupee amounts, percentage indicators, remaining amounts needed, and non-judgmental encouraging feedback.
- **Simulated Quick Deposits:** +₹500, +₹1,000, and +₹2,500 buttons to practice disciplined saving.

### F. Profile, Privacy & Safety
- **100% Client-Side:** All demo state is stored strictly in browser `localStorage`.
- **Zero Sensitive Data:** Never collects bank details, PAN numbers, Aadhaar, debit/credit cards, or brokerage logins.
- **Two-Step Demo Reset:** Restores virtual cash to ₹10,000, clears test holdings, and resets lesson progress safely.

---

## 3. Technology Stack & Architecture

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS with custom fintech design tokens
- **Icons:** Lucide React
- **Visualizations:** Recharts (responsive area charts)
- **State & Persistence:** React Context + Schema-versioned LocalStorage with automatic corrupt-data recovery
- **Testing:** Vitest + React Testing Library + JSDOM

### Accounting Model
- **Decimal Safety:** All monetary figures are stored as integer **Paise** (1 Rupee = 100 Paise) to completely eliminate IEEE-754 floating-point rounding bugs.
- **Average Cost Basis:**
  - On **BUY**: Cost basis increases by transaction cost; average price recalculates proportionally.
  - On **SELL**: Realized profit/loss is calculated against the average cost basis; remaining holdings decrease cleanly.
  - **Unrealized P&L**: `Current Holdings Market Value - Total Cost Basis`.
  - **Total Portfolio Value**: `Virtual Cash + Current Holdings Market Value`.

---

## 4. Getting Started

### Prerequisites
- Node.js 18.x or 20.x or 22.x
- npm 9+ or pnpm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/groww-start.git
cd groww-start

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Tests
```bash
# Run Vitest unit & component test suite
npm run test
```

### Building for Production
```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

---

## 5. Deployment Guide

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Next.js**.
4. Build Command: `npm run build`.
5. Output Directory: `.next`.
6. Deploy! Zero environment variables or API keys are required.

### Deploying with Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 6. Disclaimers & Regulatory Transparency

1. **Simulated Nature:** All market data, securities, and trade confirmations within this app are fictional and purely educational.
2. **No Financial Advice:** Groww Start does not provide personalized investment advice, stock recommendations, or tax consulting.
3. **Market Risks:** Mutual funds and stock investments are subject to market risks. Past simulated performance is no indicator of real market returns.
4. **Independent Sandbox:** This project is an independent demo and is not affiliated with Groww (Nextbillion Technology Pvt. Ltd.).
