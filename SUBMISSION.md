# Groww Start — Product Submission

- **Live Product Demo:** [https://groww-start.onrender.com/](https://groww-start.onrender.com/)
- **Source Code Repository:** [https://github.com/abishekak18/Groww-Product-Intern.git](https://github.com/abishekak18/Groww-Product-Intern.git)

---

## 1. One-Page Product Analysis

### The Reality on the Ground
If you sit down with a 21-year-old college student in Bengaluru or an intern in Pune who just got their first ₹12,000 stipend, you quickly realize why traditional investment apps intimidate them. 

The barrier isn't a lack of interest—Gen Z talks about money constantly. The real barrier is **fear, jargon, and misplaced expectations**:
1. **The Language Barrier:** Opening a typical demat or mutual fund app hits a beginner with NAV, CAGR, expense ratios, trailing P/E, and sector allocations. It feels like an exam paper, not a tool for growth.
2. **Fear of Ruining a Tight Budget:** When you only have ₹2,000 to spare each month, the fear of "clicking the wrong button and losing it" is paralyzing.
3. **The Quick-Money Mirage:** Social media algorithms push flashy 30-second reels about options trading and Telegram tips. SEBI’s data tells a sobering story—over 9 out of 10 retail traders lose money in F&O—yet beginners get sucked in because nobody shows them what boring, steady wealth building looks like.
4. **Blurring Savings with Investments:** Beginners often dump their only emergency savings into a volatile equity fund. The moment their laptop screen cracks or an exam fee is due, they are forced to withdraw at a 15% market dip.

### The Hypothesis
If we give young Indians a **safe, zero-risk sandbox** where they can:
- Learn core ideas through relatable Indian situations (chai money, rent splits, buying a laptop),
- Practice buying and selling fictional assets with **₹10,000 in virtual cash** to build muscle memory, and
- Set up and watch **savings goals grow separately from their investments**,

they build genuine financial confidence long before risking a single real rupee.

### Product Decisions That Matter
- **Education First, Never Transactions First:** We deliberately steer users toward quick, 3-minute lessons before encouraging simulated trades.
- **Strict Separation of Savings and Equities:** Emergency funds and short-term targets (under 1–2 years) are placed in a dedicated Goals section. We make it crystal clear: volatile stock markets are not the place for next semester's tuition.
- **Accurate Financial Math:** Under the hood, everything runs on an integer **Paise engine** (1 INR = 100 Paise). That completely avoids floating-point rounding quirks. Average cost basis, realized profits, and unrealized returns match standard portfolio accounting.
- **No Gamification Traps:** No spinning wheels, no countdown timers urging you to trade, no artificial dopamine hits. Investing should be calm and intentional.
- **Privacy by Default:** Zero bank logins, PAN cards, or Aadhaar numbers. Everything runs client-side in the browser.

---

## 2. Prompts Used During Development

Rather than a single massive dump, the application was built through deliberate, phased engineering prompts:

### Architecture & Product Scaffolding
> *"Act as a senior product engineer and fintech designer building 'Groww Start' — an educational investing companion for Indian Gen Z (aged 20–26). Create a clean Next.js App Router project with TypeScript, Tailwind CSS, and Recharts. Set up responsive navigation (mobile bottom bar + desktop topbar), an onboarding wizard tailored to students and interns, a dashboard overview, an 8-lesson learning track, a virtual simulator with ₹10,000 fictional cash, and savings goal tracking. Zero paid APIs, zero live market keys, completely local and self-contained."*

### Financial Math & Order Execution Engine
> *"Implement pure, fully testable TypeScript domain modules in `money.ts` and `portfolio-math.ts`. Store all currency in integer paise to avoid IEEE-754 floating-point errors. Use an average cost basis model for purchases and sales. Accurately calculate realized P&L on sales, unrealized P&L on open positions, and total portfolio value. Add strict validation rejecting zero/negative values, purchases exceeding virtual cash, and sales exceeding owned holdings."*

### Authentic Indian-Context Educational Content
> *"Draft 8 beginner lessons addressing real Indian Gen Z dilemmas: (1) Saving vs Investing, (2) What is a Stock, (3) What is a Mutual Fund, (4) What is a SIP, (5) Risk and Return, (6) Diversification, (7) Inflation and Compounding, and (8) Common Beginner Mistakes. Ground each lesson in concrete rupee examples (e.g. ₹500 SIPs, ₹50,000 laptop goals, compounding at 21 vs 31, SEBI's 90%+ F&O retail losses). Add an interactive single-choice quiz to every lesson with constructive feedback."*

---

## 3. Evaluations & Testing

### What We Tested
To ensure the math and user experience wouldn't break, we wrote **23 automated tests** with Vitest and React Testing Library:

1. **Financial Integrity:**
   - Starts with exactly ₹10,000 in virtual cash (1,000,000 paise).
   - Cost basis recalculates correctly across multiple purchases at different prices.
   - Selling correctly credits virtual cash, reduces unit holdings, and tracks realized P&L.
   - Out-of-bounds orders (e.g., spending ₹12,000 when you only have ₹10,000, or selling units you don't own) are blocked with clear error messages.
2. **Resilience to Bad Data:**
   - Handled corrupt JSON or missing keys in `localStorage` by automatically resetting to clean defaults rather than crashing.
3. **Core UX Workflows:**
   - Onboarding modal can be completed or skipped smoothly.
   - Lesson quizzes evaluate answers instantly and explain why an option was right or wrong.
   - Buy modal previews total costs and requires an explicit confirmation step.

### Build Verification
- **Production Bundle:** Next.js static build compiled with zero errors or warnings (`npm run build` exits 0).
- **Responsive Layout:** Tested seamlessly on mobile touch viewports (375px) up to wide desktop monitors.

---

## 4. Quick Links & Running Locally

- **Live URL:** [https://groww-start.onrender.com/](https://groww-start.onrender.com/)
- **GitHub:** [https://github.com/abishekak18/Groww-Product-Intern.git](https://github.com/abishekak18/Groww-Product-Intern.git)

```bash
# Clone and run locally
git clone https://github.com/abishekak18/Groww-Product-Intern.git
cd Groww-Product-Intern
npm install
npm run dev      # Local server at http://localhost:3000
npm run test     # Run all 23 automated tests
```
