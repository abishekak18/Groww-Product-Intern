import { Lesson } from '@/types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    slug: 'saving-vs-investing',
    order: 1,
    title: 'Saving versus Investing',
    shortDescription: 'Why keeping all your money in a savings bank account slowly reduces what it can buy.',
    readTimeMinutes: 3,
    badge: 'Foundations',
    contentSections: [
      {
        title: 'The Core Difference',
        body: 'Saving is setting aside money safely for short-term needs and emergencies. It offers high safety and instant liquidity. Investing is putting your money into assets (like businesses, mutual funds, or gold) so that it grows over time and preserves your purchasing power.',
        indianExampleRupees: {
          scenario: 'Rahul (22) keeps ₹50,000 in a savings account earning 3% per year. Ananya (22) puts ₹50,000 into a diversified index fund expected to grow ~11% over 7 years.',
          calculation: 'At 6% inflation, a ₹50,000 laptop will cost ~₹75,000 in 7 years. Rahul’s savings will only grow to ~₹61,500 (falling short). Ananya’s investment could grow to ~₹1,03,000 (preserving purchasing power).',
          keyTakeaway: 'Saving preserves nominal cash; investing defends purchasing power against inflation.',
        },
        riskOrLimitation:
          'Investments can fluctuate downwards in the short term. Money needed in the next 6 to 12 months belongs in a bank account or liquid fund, never volatile assets.',
      },
      {
        title: 'When to Save vs When to Invest',
        body: 'Always build an emergency buffer of 3-6 months of living expenses first. Once that shield is intact, every additional rupee should be deployed into investments aligned with your horizon.',
      },
    ],
    quiz: {
      question: 'You need ₹15,000 for your college semester exam fee due in 3 months. Where should this money be?',
      options: [
        'In a high-growth tech stock for quick gains',
        'In a safe savings account or liquid deposit',
        'In a high-risk crypto coin or crypto token',
        'Split equally among 5 equity mutual funds',
      ],
      correctIndex: 1,
      explanation:
        'Correct! Short-term money needed within months should never be exposed to market volatility. Safety and liquidity take priority over returns for near-term obligations.',
    },
  },
  {
    id: 'lesson-2',
    slug: 'what-is-a-stock',
    order: 2,
    title: 'What is a Stock?',
    shortDescription: 'Demystifying shares: owning a genuine fractional slice of a real business.',
    readTimeMinutes: 4,
    badge: 'Equities',
    contentSections: [
      {
        title: 'A Stock is a Fractional Ownership',
        body: 'When you buy 1 share of a company listed on the National Stock Exchange (NSE) or Bombay Stock Exchange (BSE), you are not buying a lottery ticket. You become a fractional co-owner of that business. If the company sells more goods and earns healthy profits, the value of your share typically grows.',
        indianExampleRupees: {
          scenario: 'Imagine your neighbourhood bakery, Chai & Crust, needs ₹10,00,000 to buy ovens. They issue 10,000 shares worth ₹100 each. You buy 10 shares for ₹1,000.',
          calculation: 'You now own 0.1% of Chai & Crust. If the bakery earns ₹2,00,000 in annual profit and distributes half as dividends, you receive ₹100 directly into your bank account, and your shares can also appreciate if the bakery expands to other cities.',
          keyTakeaway: 'Stock price movements over the long haul track the business earnings and cash flows, not random noise.',
        },
        riskOrLimitation:
          'Single company risk: If the company makes poor decisions, loses customers, or fails, the share price can tumble permanently.',
      },
    ],
    quiz: {
      question: 'What actually gives a company’s stock its real long-term value?',
      options: [
        'Hype and trending recommendations on social media',
        'The company’s ability to generate growing profits and cash flows over time',
        'The number of people trading the stock every single minute',
        'Guaranteed price increases set by SEBI regulators',
      ],
      correctIndex: 1,
      explanation:
        'Correct! Long-term stock value is driven by the company’s underlying business performance, sales, and profits—not social media hype.',
    },
  },
  {
    id: 'lesson-3',
    slug: 'what-is-a-mutual-fund',
    order: 3,
    title: 'What is a Mutual Fund?',
    shortDescription: 'The buffet approach: pooling small contributions to own a basket of hundreds of companies.',
    readTimeMinutes: 4,
    badge: 'Funds',
    contentSections: [
      {
        title: 'Pooling Money for Diversification',
        body: 'Buying shares in 50 top Indian companies individually could cost lakhs of rupees. A mutual fund pools small amounts (even ₹500) from lakhs of investors. A SEBI-registered Asset Management Company (AMC) then buys a diversified basket of stocks or bonds based on the fund objective.',
        indianExampleRupees: {
          scenario: 'You have ₹500 to invest this month. Buying 1 share of an MRF or top IT firm might be impossible or disproportionate.',
          calculation: 'By putting ₹500 into an index mutual fund, your ₹500 is split across Infosys, TCS, HDFC Bank, Reliance, Tata Motors, and 45 other giants proportional to their index weight.',
          keyTakeaway: 'You get institutional-grade diversification with as little as a few hundred rupees.',
        },
        riskOrLimitation:
          'Expense ratio: Fund houses charge an annual management fee (e.g. 0.1% to 1.5%). Also, mutual funds are still subject to market risk and do not guarantee returns.',
      },
    ],
    quiz: {
      question: 'What is the biggest advantage of a mutual fund for a first-time investor with ₹1,000?',
      options: [
        'It guarantees a fixed 15% return every year',
        'Instant diversification across dozens of companies with a small amount of money',
        'You can trade it 50 times a day without any charges',
        'You never have to pay any fund management fees',
      ],
      correctIndex: 1,
      explanation:
        'Spot on! Mutual funds make diversification accessible to everyone, reducing the risk of relying on a single company.',
    },
  },
  {
    id: 'lesson-4',
    slug: 'what-is-a-sip',
    order: 4,
    title: 'What is a SIP (Systematic Investment Plan)?',
    shortDescription: 'Disciplined automated investing that turns market ups and downs into your friend.',
    readTimeMinutes: 4,
    badge: 'Habits',
    contentSections: [
      {
        title: 'Investing on Autopilot',
        body: 'A SIP is not a product itself—it is an automated method of investing. On a fixed date every month (e.g., the 5th, right after stipend/salary day), a predetermined sum is debited from your bank account and invested into your chosen mutual fund.',
        indianExampleRupees: {
          scenario: 'Priya sets up a ₹1,000 monthly SIP into a fund. In Month 1, the fund NAV is ₹100 (she gets 10 units). In Month 2, the market crashes and NAV drops to ₹80. In Month 3, it rebounds to ₹110.',
          calculation: 'In Month 2, her ₹1,000 automatically buys 12.5 units! Over 3 months, she spent ₹3,000 for 31.6 units (average cost ~₹94.90/unit). At Month 3 price of ₹110, her portfolio is worth ₹3,476.',
          keyTakeaway: 'Rupee Cost Averaging: You automatically buy more units when prices are down, and fewer when prices are high, without trying to time the market.',
        },
        riskOrLimitation:
          'A SIP does not eliminate market risk. If markets stay depressed for an extended period, portfolio value will remain low until a recovery.',
      },
    ],
    quiz: {
      question: 'What happens in a SIP when the market experiences a temporary dip or crash?',
      options: [
        'You lose all your previously accumulated units permanently',
        'Your fixed monthly amount automatically purchases MORE units at lower prices',
        'Your bank account is penalized with extra charges',
        'You must immediately pause your SIP and sell your units',
      ],
      correctIndex: 1,
      explanation:
        'Correct! This is rupee-cost averaging in action: lower prices allow your monthly investment to acquire more units, boosting long-term compounding.',
    },
  },
  {
    id: 'lesson-5',
    slug: 'risk-and-return',
    order: 5,
    title: 'Understanding Risk and Return',
    shortDescription: 'The unbreakable financial seesaw: why free high returns do not exist.',
    readTimeMinutes: 4,
    badge: 'Mindset',
    contentSections: [
      {
        title: 'The Inseparable Twin',
        body: 'In finance, higher expected return is compensation for bearing higher uncertainty and volatility. Anyone promising "25% guaranteed returns with zero risk" is running a scam. Real wealth building requires matching your investment choice with your stomach for volatility and time horizon.',
        indianExampleRupees: {
          scenario: 'Comparing 3 common instruments for a ₹10,000 investment over 5 years.',
          calculation: 'Bank FD: ~6.5% predictable return, zero capital loss. Debt Funds: ~7% return with low fluctuations. Equity Index Fund: ~10-12% historically over 7+ years, but could drop 20% in any bad year.',
          keyTakeaway: 'Choose your risk level based on when you will need the money, not greed for fast profits.',
        },
        riskOrLimitation:
          'Taking zero risk is also a risk: Bank savings accounts losing value to inflation guarantee a loss in real purchasing power over a 10-year period.',
      },
    ],
    quiz: {
      question: 'If an online influencer promises a scheme that "guarantees 30% annual profit with zero chance of losing money", what is the reality?',
      options: [
        'They have discovered a secret SEBI loophole',
        'It is a misleading, high-risk, or fraudulent claim; no investment can guarantee high returns with zero risk',
        'It is just a normal government bond in disguise',
        'You should invest your entire emergency fund right away',
      ],
      correctIndex: 1,
      explanation:
        'Exactly! The risk-return relationship is fundamental. Guarantees of unusually high returns with zero risk are the hallmark of financial scams.',
    },
  },
  {
    id: 'lesson-6',
    slug: 'diversification',
    order: 6,
    title: 'The Magic of Diversification',
    shortDescription: 'Never put all your eggs in one basket: building an all-weather portfolio.',
    readTimeMinutes: 4,
    badge: 'Strategy',
    contentSections: [
      {
        title: 'The Only "Free Lunch" in Finance',
        body: 'Nobel laureate Harry Markowitz called diversification the only free lunch in finance. By spreading your money across different asset classes (equities, debt/bonds, and gold) and across different industries, a bad year in one sector is cushioned by stability in another.',
        indianExampleRupees: {
          scenario: 'Vikram puts ₹1,00,000 entirely into one trendy IT stock. Sneha divides ₹1,00,000 into: ₹60,000 broad index fund, ₹25,000 government debt fund, and ₹15,000 digital gold.',
          calculation: 'The IT sector faces a global hiring freeze and crashes 40%. Vikram loses ₹40,000 overnight. Sneha’s portfolio drops by only ~8% because gold and debt cushioned the blow.',
          keyTakeaway: 'Diversification reduces portfolio volatility without necessarily slashing your long-term growth.',
        },
        riskOrLimitation:
          'Over-diversification: Owning 30 different mutual funds that all hold the exact same Indian stocks just creates clutter and extra paperwork without extra safety.',
      },
    ],
    quiz: {
      question: 'Why does holding both equity and gold/debt help an Indian investor?',
      options: [
        'Because all asset classes always move up at the exact same speed',
        'Different assets react differently to economic events, reducing total portfolio swings',
        'It is mandatory by Indian tax law to hold gold',
        'It prevents you from ever paying income tax',
      ],
      correctIndex: 1,
      explanation:
        'Correct! When stock markets undergo a correction, safe assets like debt and gold often remain stable or rise, smoothing your overall financial journey.',
    },
  },
  {
    id: 'lesson-7',
    slug: 'inflation-and-compounding',
    order: 7,
    title: 'Inflation and Compounding',
    shortDescription: 'Beat the silent tax of inflation and harness the exponential snowball of compounding.',
    readTimeMinutes: 5,
    badge: 'Math',
    contentSections: [
      {
        title: 'Inflation: The Silent Wealth Thief',
        body: 'Inflation in India typically averages 5% to 7% per year. That means prices of milk, rent, fuel, and cinema tickets double roughly every 10 to 12 years. If your money grows slower than inflation, you are getting poorer in real terms.',
        indianExampleRupees: {
          scenario: 'Starting a ₹2,000/month SIP at age 21 vs age 31 with an assumed 12% average annual growth till age 50.',
          calculation: 'Age 21 start (29 years of compounding): Invested ₹6.96 Lakhs, portfolio grows to ~₹59.8 Lakhs! Age 31 start (19 years): Invested ₹4.56 Lakhs, portfolio grows to only ~₹16.4 Lakhs.',
          keyTakeaway: 'Starting 10 years earlier produces nearly 3.6x more wealth because compounding acts exponentially in the final decade.',
        },
        riskOrLimitation:
          'Compounding requires uninterrupted patience. Withdrawing or pausing your investments every few months breaks the compounding chain.',
      },
    ],
    quiz: {
      question: 'What is the most critical variable that supercharges compound interest?',
      options: [
        'Finding secret penny stocks with 100x gains',
        'Time in the market: starting early and staying invested consistently',
        'Checking stock market prices 10 times every day',
        'Switching mutual funds every 2 months',
      ],
      correctIndex: 1,
      explanation:
        'Spot on! Time is the greatest multiplier in compounding. Even modest monthly amounts grow into substantial sums when given 10-20 years.',
    },
  },
  {
    id: 'lesson-8',
    slug: 'common-investing-mistakes',
    order: 8,
    title: 'Common Beginner Mistakes to Avoid',
    shortDescription: 'The psychological traps that cause Gen Z first-time investors to lose money.',
    readTimeMinutes: 5,
    badge: 'Protection',
    contentSections: [
      {
        title: 'The Top 4 Traps',
        body: '1. FOMO & Social Media Tips: Buying stocks promoted on Instagram Reels or Telegram groups.\n2. Treating the Market like a Casino: Trying Options & Futures (F&O) where SEBI data reveals 93% of retail traders lose money.\n3. Panic Selling: Dumping solid funds the moment a normal 5-10% correction occurs.\n4. Investing without an Emergency Fund: Being forced to liquidate equity at a loss to pay unexpected hospital or job bills.',
        indianExampleRupees: {
          scenario: 'Karan (23) starts with ₹20,000 saved from his internship. A WhatsApp tip promises "quick double in 2 weeks in F&O options".',
          calculation: 'Within 3 days of expiry, the option contract expires worthless (₹0). Karan lost 100% of his hard-earned stipend.',
          keyTakeaway: 'Wealth creation is slow and predictable; trying to get rich quick is the fastest way to get poor fast.',
        },
        riskOrLimitation:
          'Investing requires emotional discipline. Volatility is the price of admission for inflation-beating returns.',
      },
    ],
    quiz: {
      question: 'According to official SEBI studies, what percentage of individual retail traders lose money in Futures & Options (F&O)?',
      options: [
        'Less than 10%',
        'Around 25%',
        'Over 90% (9 out of 10 traders lose money)',
        'Nobody loses money in regulated derivatives',
      ],
      correctIndex: 2,
      explanation:
        'Correct! SEBI reports consistently show that over 90% of individual traders lose money in F&O trading. For long-term wealth, disciplined investing in diversified funds is the proven path.',
    },
  },
];
