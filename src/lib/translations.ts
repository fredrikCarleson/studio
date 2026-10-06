export type Language = "sv" | "en";

export interface Translations {
  // Navigation & HUD
  nav: {
    chapters: readonly string[];
    keys: string;
    chapterOf: (current: number, total: number) => string;
    session: string;
    betaTag: string;
  };

  // Keyboard Shortcuts Cheatsheet
  keyboard: {
    title: string;
    close: string;
    shortcuts: { key: string; action: string }[];
  };

  // Slide 1 — Prologue
  slide1: {
    h1Line1: string;
    h1Line2: string;
    h1Line3: string;
    h1Line4: string;
    subtitle: string;
  };

  // Slide 2 — The Vision
  slide2: {
    title: string;
    mainP: {
      before: string;
      highlight: string;
      after: string;
    };
    quote: string;
  };

  // Slide 3 — The Swarm (Team Alpha)
  slide3: {
    caseTag: string;
    title: string;
    stat1Number: string;
    stat1Label: string;
    stat2Number: string;
    stat2Label: string;
    stat3Number: string;
    stat3Label: string;
    cards: { title: string; desc: string; accent: boolean }[];
    blueprintButton: string;
    evidence: {
      tag: string;
      headline: string;
      subline: string;
      closeAria: string;
    };
    blueprintModal: {
      tag: string;
      titleLine1: string;
      titleLine2: string;
      phases: { title: string; desc: string }[];
      narrating: string;
      preparing: string;
      speakingPrompt: string;
      idlePrompt: string;
      subPrompt: string;
    };
  };

  // Slide 4 — The Pedagogy (Team Bravo)
  slide4: {
    caseTag: string;
    subtitle: string;
    title: string;
    surpriseLabel: string;
    surpriseQuote: string;
    lessonLabel: string;
    col1Tag: string;
    col1Title: string;
    col1Desc: string;
    col1Badge: string;
    col2Tag: string;
    col2Title: string;
    col2Desc: string;
    col2Badge: string;
  };

  // Slide 5 — The Automation (Team Delta)
  slide5: {
    caseTag: string;
    title: string;
    sources: string[];
    bodyP: {
      before: string;
      highlight: string;
      after: string;
    };
    humanLabel: string;
    humanTime: string;
    swarmLabel: string;
    swarmTime: string;
    footerText: string;
  };

  // Slide 6 — The Verdict
  slide6: {
    title: string;
    subtitle: string;
    cards: {
      team: string;
      anchor: string;
      head: string;
      body: string;
    }[];
    footerQuote: string;
  };

  // Slide 7 — The Wisdom
  slide7: {
    tag: string;
    headline: {
      before: string;
      highlight: string;
      after: string;
    };
    subheading: string;
    cards: {
      title: string;
      desc: string;
    }[];
    footerQuote: string;
  };

  // Slide 8 — The Future
  slide8: {
    preline: string;
    headline: string;
    headlineHighlight: string;
    reflection1Tag: string;
    reflection1Text: {
      before: string;
      highlight: string;
      after: string;
    };
    reflection2Tag: string;
    reflection2Text: {
      before: string;
      highlight: string;
      after: string;
    };
    leadQuote: {
      before: string;
      highlight: string;
    };
    twoDaysNote: string;
    gibsonQuote: string;
    gibsonAuthor: string;
  };

  // Slide 9 — Operating Model
  slide9: {
    title: {
      before: string;
      highlight: string;
    };
    subtitle: string;
    pills: string[];
    step0: {
      track1Tag: string;
      track1Nodes: string[];
      track1BottleneckTag: string;
      track2Tag: string;
      track2Nodes: { label: string; sub?: string }[];
      quote: {
        before: string;
        highlight: string;
        after: string;
      };
    };
    step1: {
      windowTitle: string;
      windowSub: string;
      stages: { num: string; title: string; desc: string }[];
      inflectionLeft: string;
      inflectionRight: string;
      goodEnoughTitle: string;
      goodEnoughDesc: string;
      killTitle: string;
      killDesc: string;
    };
    step2: {
      windowTitle: string;
      punchline: string;
      stages: {
        num: string;
        title: string;
        sub: string;
        reqTag: string;
        reqTitle: string;
      }[];
      gradientLeft: string;
      gradientRight: string;
    };
    step3: {
      tag: string;
      quote: {
        before: string;
        highlight: string;
        after: string;
      };
      card1: string;
      card2: string;
    };
    step4: {
      windowTitle: string;
      quote: string;
      topSwarm: string;
      topPortfolio: string;
      stages: {
        num: string;
        title: string;
        sub: string;
        reqTag: string;
        reqTitle: string;
      }[];
      platformTitle: string;
      platformMotto: string;
      platformBoxes: string[];
    };
  };

  // Slide 10 — Ending
  slide10: {
    headline: string;
    prefix: string;
    highlight: string;
  };
}

export const translations: Record<Language, Translations> = {
  sv: {
    nav: {
      chapters: [
        "Prolog",
        "Visionen",
        "Svärmen",
        "Pedagogiken",
        "Automatiseringen",
        "Lärdomarna",
        "Insikten",
        "Framtiden",
        "Arbetssätt & Styrning",
        "Tack",
      ],
      keys: "[?] Tangenter",
      chapterOf: (current, total) => `Kapitel ${current} av ${total}`,
      session: "Session",
      betaTag: "BETA 1.0",
    },
    keyboard: {
      title: "Kortkommandon",
      close: "Stäng (Esc)",
      shortcuts: [
        { key: "→ / Mellanslag", action: "Nästa slide / delsteg" },
        { key: "←", action: "Föregående slide / delsteg" },
        { key: "L", action: "Växla språk (SV / EN)" },
        { key: "B", action: "Blueprint-arkitektur (Slide 3)" },
        { key: "H", action: "Visa/dölj HUD & timer" },
        { key: "F", action: "Helskärm" },
        { key: "Esc", action: "Stäng modaler" },
        { key: "?", action: "Denna hjälpruta" },
      ],
    },
    slide1: {
      h1Line1: "Hackathon.",
      h1Line2: "Två dagar.",
      h1Line3: "Tre team.",
      h1Line4: "Femton hjärnor.",
      subtitle: "Agentisk AI · Skatteverket · Google",
    },
    slide2: {
      title: "Det Djärva Uppdraget",
      mainP: {
        before: "Kunde vi bygga lösningar där ",
        highlight: "flera AI-agenter samarbetar",
        after: " för att lösa verkliga problem — på bara två dagar, utan förberedelser?",
      },
      quote: "Vi byggde inte för perfektion. Vi byggde för att förstå.",
    },
    slide3: {
      caseTag: "Fallstudie · Team Alpha",
      title: "Influencer-Svärmen",
      stat1Number: "10 000+",
      stat1Label: "Influencers i Sverige",
      stat2Number: "48h",
      stat2Label: "Byggtid",
      stat3Number: "5",
      stat3Label: "Agenter i Svärmen",
      cards: [
        {
          title: "Social Media Scanner",
          desc: "Söker av publika flöden över plattformar för att identifiera samarbeten och gåvor.",
          accent: true,
        },
        {
          title: "Värderingsagent",
          desc: "Identifierar synliga lyxprodukter och uppskattar deras marknadsvärde.",
          accent: false,
        },
        {
          title: "Riskprofilerare",
          desc: "Omvandlar bevisen till en riskrapport med rekommenderade åtgärder.",
          accent: false,
        },
      ],
      blueprintButton: "Teknisk Blueprint",
      evidence: {
        tag: "Verkligt Fall",
        headline: "Han dömdes till fängelse.",
        subline: "Vår svärm kunde ha varnat honom månader tidigare.",
        closeAria: "Stäng beviskort (Esc)",
      },
      blueprintModal: {
        tag: "Svärm-Arkitektur",
        titleLine1: "Femfas-",
        titleLine2: "Exekvering",
        phases: [
          { title: "Datainsamling", desc: "Kanalanalys & scraping av sociala medier" },
          { title: "Parallell Research", desc: "Priser, affiliates, byteshandel — parallellt" },
          { title: "Riskbedömning", desc: "Syntetiserar alla fynd, noll sökverktyg" },
          { title: "Uppföljande Undersökning", desc: "Dynamisk JSON-uppgiftsplan skapar N agenter" },
          { title: "Revisionsrapport", desc: "Svensk rapport med verifierade källhänvisningar" },
        ],
        narrating: "AI berättar…",
        preparing: "Assistenten förbereder svar…",
        speakingPrompt: "Talar…",
        idlePrompt: "Håll intryckt — tilltala assistenten",
        subPrompt: "Släpp för att skicka. Agenten svarar efter en kort paus.",
      },
    },
    slide4: {
      caseTag: "Fallstudie — Team Bravo",
      subtitle: "Skatti 2.0 · Skatteinformationstjänst",
      title: "Kunskapsdelningen",
      surpriseLabel: "Vår Överraskning",
      surpriseQuote: "Specialisering misslyckades. Agenten tränad på officiell data var mindre träffsäker än basmodellen.",
      lessonLabel: "Lärdomen: AI förstår mönster, inte sanning",
      col1Tag: "Det Fyrkantiga ”Vad”",
      col1Title: "Officiella Kanaler.",
      col1Desc: "Officiella data definierar reglerna men saknar ”hur-sammanhanget” som krävs för att AI ska ge expertsvar med precision.",
      col1Badge: "Regelbaserad Kunskap",
      col2Tag: "Det Spretiga ”Hur”",
      col2Title: "Vägledning & Tillämpning.",
      col2Desc: "Praktiska resonemang kommer från det spretiga ”hur” som finns på webben. Utan denna pedagogiska data uteblir juridisk precision.",
      col2Badge: "Kräver Alltid Verifiering",
    },
    slide5: {
      caseTag: "Fallstudie · Team Delta",
      title: "Riskanalys-Svärmen",
      sources: ["Årsredovisningar", "SCB-statistik", "Publika register"],
      bodyP: {
        before: "Idag lägger specialister enorm tid på att samla in data, vilket gör att få företag kan djupgranskas. Med svärmen kan vi köra en ",
        highlight: "första riskanalys i stor skala",
        after: " över betydligt fler bolag.",
      },
      humanLabel: "Mänsklig Utredare",
      humanTime: "Dagar av manuellt arbete",
      swarmLabel: "Agent-Svärm",
      swarmTime: "Minuter av AI-analys",
      footerText: "Seriell + parallell agentexekvering — callback-orkestrering",
    },
    slide6: {
      title: "Vad vi lärde oss",
      subtitle: "Två dagar. Tre team.",
      cards: [
        {
          team: "Team Alpha",
          anchor: "Influencer Risk Swarm",
          head: "Agenter skapar ordning i ostrukturerad data.",
          body: "En svärm söker igenom enorma mängder ostrukturerad social media-data i hög hastighet, gör komplexa signaler begripliga och synliggör potentiella skatterisker.",
        },
        {
          team: "Team Bravo",
          anchor: "Skatti 2.0",
          head: "Juridisk precision kräver både ”vad” och ”hur”.",
          body: "Vi lärde oss att sammanhang och struktur avgör. Det officiella ”vad” räckte inte. LLM:er känner igen mönster, inte sanning, så juridiska svar kräver också det pedagogiska ”hur”.",
        },
        {
          team: "Team Delta",
          anchor: "Företagsriskanalys",
          head: "Från datainsamling till djupanalys.",
          body: "Svärmen samlar in stora datamängder blixtsnabbt och befriar experterna från grovjobbet så att de kan fokusera på kvalificerad analys.",
        },
      ],
      footerQuote: "Kod är inte längre flaskhalsen...",
    },
    slide7: {
      tag: "Kärninsikten",
      headline: {
        before: "”Agenter är ",
        highlight: "allvetande praktikanter med superkrafter",
        after: " — snabba och kapabla, men utan omdöme.”",
      },
      subheading: "VAD FLERA AGENTER BEHÖVER",
      cards: [
        {
          title: "Tydliga Gränser",
          desc: "Definiera vad varje agent får och inte får besluta på egen hand.",
        },
        {
          title: "Orkestrering",
          desc: "Vem skickar vad till vem — och när i flödet.",
        },
        {
          title: "Riktning",
          desc: "Sätt målet. Ha sedan tålamodet att låta dem lära sig.",
        },
      ],
      footerQuote: "Mindre mjukvarutänk · mer designteam-tänk.",
    },
    slide8: {
      preline: "Vi klev in med frågor.",
      headline: "Vi klev ut med ",
      headlineHighlight: "svar.",
      reflection1Tag: "Reflektion 01",
      reflection1Text: {
        before: "Hastighet är inte längre begränsningen. Att veta vad som är ",
        highlight: "värdefullt",
        after: " är det.",
      },
      reflection2Tag: "Reflektion 02",
      reflection2Text: {
        before: "Avståndet mellan en idé och färdig mjukvara har ",
        highlight: "kollapsat",
        after: ".",
      },
      leadQuote: {
        before: "Det vinnande teamet är inte det som producerar mest kod. ",
        highlight: "Det är det som lär sig snabbast.",
      },
      twoDaysNote: "Två dagar. Ett rum. Några nyfikna människor. Det var allt som krävdes.",
      gibsonQuote: "”Framtiden är redan här — den är bara inte jämnt fördelad.”",
      gibsonAuthor: "— William Gibson",
    },
    slide9: {
      title: {
        before: "Flaskhalsen har ",
        highlight: "flyttats",
      },
      subtitle: "Ekonomin bakom utveckling har förändrats",
      pills: [
        "1. Paradigmskiftet",
        "2. De 4 Stadierna",
        "3. Gradvis Styrning",
        "4. Portföljens nya roll",
        "5. Helhetsbilden",
      ],
      step0: {
        track1Tag: "NÄR UTVECKLING ÄR DYRT",
        track1Nodes: [
          "20 IDÉER",
          "BUSINESS CASE",
          "PRIORITERING",
          "VÄLJER 2",
          "BYGGER",
          "VERIFIERA ROI",
        ],
        track1BottleneckTag: "FLASKHALS",
        track2Tag: "NÄR AI GÖR PROTOTYPING SNABB OCH BILLIG",
        track2Nodes: [
          { label: "20 IDÉER" },
          { label: "PROTOTYPER" },
          { label: "TEST MED", sub: "Verksamheten" },
          { label: "SORTERA BORT 18" },
          { label: "SKALA DE 2", sub: "Som gjort nytta" },
        ],
        quote: {
          before: "”Värdet ligger inte längre i att välja rätt från början — ",
          highlight: "utan i hur snabbt vi lär vad som faktiskt fungerar.",
          after: "”",
        },
      },
      step1: {
        windowTitle: "De 4 Stadierna: Från idé till förvaltning",
        windowSub: "”Allt måste inte skalas – en AI-lösning kan stanna i PoC och skapa stort värde.”",
        stages: [
          { num: "01", title: "Labb", desc: "Kreativitet & hypoteser" },
          { num: "02", title: "PoC", desc: "Fungerar i praktiken?" },
          { num: "03", title: "Pilot", desc: "Fungerar i arbetssättet?" },
          { num: "04", title: "Fullskala", desc: "Förvaltat för alla" },
        ],
        inflectionLeft: "◄ Labb & PoC: Billigt att bygga & testa snabbt",
        inflectionRight: "Pilot & Fullskala: Kräver IT-stöd, säkerhet & kapital ►",
        goodEnoughTitle: "Allt måste inte skalas – ”Good Enough”",
        goodEnoughDesc: "Kan stanna i PoC och skapa stort värde",
        killTitle: "Dödas direkt om det inte ger nytta",
        killDesc: "Avbryt tidigt utan prestige eller förlust",
      },
      step2: {
        windowTitle: "Styrningen som ökar i takt med risk och användning",
        punchline: "”Det spelar ingen roll att prototypen tar 3 timmar om tillståndet tar 4 veckor.”",
        stages: [
          {
            num: "01",
            title: "Labb",
            sub: "Kreativitet & hypoteser",
            reqTag: "Checklista",
            reqTitle: "Enkla regler",
          },
          {
            num: "02",
            title: "PoC",
            sub: "Fungerar i praktiken?",
            reqTag: "Informationsklass",
            reqTitle: "Koll på data",
          },
          {
            num: "03",
            title: "Pilot",
            sub: "Fungerar i arbetssättet?",
            reqTag: "Säkerhet & Juridik",
            reqTitle: "Arkitekturkrav",
          },
          {
            num: "04",
            title: "Fullskala",
            sub: "Förvaltat för alla",
            reqTag: "Förvaltning",
            reqTitle: "Drift & SLA",
          },
        ],
        gradientLeft: "◄ Mer Verksamhet (driver idéer och bygger i liten skala)",
        gradientRight: "Mer IT, Juridik & Specialister (kopplas in vid risk & skalning) ►",
      },
      step3: {
        tag: "Portföljens nya roll",
        quote: {
          before: "”Portföljen avgör inte vilka idéer som testas — ",
          highlight: "utan vilka som ska skalas.",
          after: "”",
        },
        card1: "1. Fångar upp lovande PoC:er",
        card2: "2. Allokerar skalningskapital & specialister",
      },
      step4: {
        windowTitle: "Helhetsmodellen: Hur allt hänger ihop",
        quote: "”Värdet ligger i att snabbt lära vad som fungerar.”",
        topSwarm: "Idéer & Hypoteser — Verksamheten provar brett",
        topPortfolio: "Portfölj: Allokerar resurser & lyfter till skala",
        stages: [
          {
            num: "01",
            title: "Labb",
            sub: "Hypoteser & pretotyper",
            reqTag: "Checklista",
            reqTitle: "Enkla regler",
          },
          {
            num: "02",
            title: "PoC",
            sub: "Praktisk nytta",
            reqTag: "Informationsklass",
            reqTitle: "Koll på data",
          },
          {
            num: "03",
            title: "Pilot",
            sub: "I arbetssättet",
            reqTag: "Säkerhet & Juridik",
            reqTitle: "Arkitekturkrav",
          },
          {
            num: "04",
            title: "Fullskala",
            sub: "Förvaltat för alla",
            reqTag: "Förvaltning",
            reqTitle: "Drift & SLA",
          },
        ],
        platformTitle: "Möjliggörande plattform & infrastruktur",
        platformMotto: "”Det ska vara lätt att göra rätt”",
        platformBoxes: [
          "Labb-miljöer & sandlådor",
          "Enterprise AI-gateways",
          "Säkra API:er & mallar",
          "GPU-kraft & drift",
        ],
      },
    },
    slide10: {
      headline: "Två dagar. Ett rum. Några nyfikna människor. Det var allt som krävdes.",
      prefix: "Två dagar. Ett rum. Några nyfikna människor.",
      highlight: "Det var allt som krävdes.",
    },
  },

  en: {
    nav: {
      chapters: [
        "Prologue",
        "The Vision",
        "The Swarm",
        "The Pedagogy",
        "The Automation",
        "The Verdict",
        "The Wisdom",
        "The Future",
        "Operating Model & Governance",
        "Thank You",
      ],
      keys: "[?] Keys",
      chapterOf: (current, total) => `Chapter ${current} of ${total}`,
      session: "Session",
      betaTag: "BETA 1.0",
    },
    keyboard: {
      title: "Keyboard Shortcuts",
      close: "Close (Esc)",
      shortcuts: [
        { key: "→ / Space", action: "Next slide / sub-step" },
        { key: "←", action: "Previous slide / sub-step" },
        { key: "L", action: "Toggle Language (SV / EN)" },
        { key: "B", action: "Blueprint Architecture (Slide 3)" },
        { key: "H", action: "Toggle HUD & Timer" },
        { key: "F", action: "Fullscreen" },
        { key: "Esc", action: "Close Overlays" },
        { key: "?", action: "Keyboard Shortcuts Help" },
      ],
    },
    slide1: {
      h1Line1: "Hackathon.",
      h1Line2: "Two days.",
      h1Line3: "Three teams.",
      h1Line4: "Fifteen brains.",
      subtitle: "Agentic AI · Swedish Tax Agency · Google",
    },
    slide2: {
      title: "The Bold Mission",
      mainP: {
        before: "Could we build solutions where ",
        highlight: "multiple AI agents collaborate",
        after: " to solve real problems — in just two days, without prior preparation?",
      },
      quote: "We weren’t building for perfection. We were building to understand.",
    },
    slide3: {
      caseTag: "Case Study · Team Alpha",
      title: "The Influencer Swarm",
      stat1Number: "10,000+",
      stat1Label: "Influencers in Sweden",
      stat2Number: "48h",
      stat2Label: "Build Time",
      stat3Number: "5",
      stat3Label: "Agents in the Swarm",
      cards: [
        {
          title: "Social Media Scanner",
          desc: "Scans public social feeds across platforms to surface possible collaborations and gifted products.",
          accent: true,
        },
        {
          title: "Valuation Agent",
          desc: "Identifies visible luxury items and estimates their fair market value.",
          accent: false,
        },
        {
          title: "Risk Profiler",
          desc: "Turns evidence into an actionable risk report with recommended compliance actions.",
          accent: false,
        },
      ],
      blueprintButton: "Technical Blueprint",
      evidence: {
        tag: "Real Case",
        headline: "He went to jail.",
        subline: "Our swarm could have nudged him months earlier.",
        closeAria: "Close evidence card (Esc)",
      },
      blueprintModal: {
        tag: "Swarm Architecture",
        titleLine1: "Five-Phase",
        titleLine2: "Execution",
        phases: [
          { title: "Data Gathering", desc: "Channel mapping & social feed scraping" },
          { title: "Parallel Research", desc: "Pricing, affiliates, barter, gifts — concurrently" },
          { title: "Risk Assessment", desc: "Reason over findings, zero blind search tools" },
          { title: "Follow-up Investigation", desc: "JSON task plan spawns dynamic worker agents" },
          { title: "Compliance Report", desc: "Swedish tax report with verified citations" },
        ],
        narrating: "AI narrating…",
        preparing: "Assistant preparing response…",
        speakingPrompt: "Speaking…",
        idlePrompt: "Hold — address the assistant",
        subPrompt: "Release to send. The agent replies after a short pause.",
      },
    },
    slide4: {
      caseTag: "Case Study — Team Bravo",
      subtitle: "Skatti 2.0 · Tax Information Service",
      title: "The Knowledge Split",
      surpriseLabel: "Our Surprise",
      surpriseQuote: "Specialization failed. The agent trained on official legal data was less accurate than the general base model.",
      lessonLabel: "The Lesson: AI understands patterns, not truth",
      col1Tag: "The Rigid “What”",
      col1Title: "Official Channels.",
      col1Desc: "Official documentation defines the statutes but lacks the practical “how-to” context needed for the model to reason precisely.",
      col1Badge: "Rule-Based Knowledge",
      col2Tag: "The Messy “How”",
      col2Title: "Guidance & Application.",
      col2Desc: "Practical reasoning comes from the messy, real-world guidance across the web. Without this pedagogical data, legal precision remains out of reach.",
      col2Badge: "Always Needs Verification",
    },
    slide5: {
      caseTag: "Case Study · Team Delta",
      title: "Risk Analysis Swarm",
      sources: ["Annual Reports", "Statistics Sweden (SCB)", "Public Registries"],
      bodyP: {
        before: "Today, specialists spend substantial time gathering data, so only a small fraction of companies can be reviewed. With the swarm, we run a ",
        highlight: "first-pass risk analysis at scale",
        after: " across vastly more organizations.",
      },
      humanLabel: "Human Auditor",
      humanTime: "Days of manual work",
      swarmLabel: "Agent Swarm",
      swarmTime: "Minutes of AI reasoning",
      footerText: "Serial + parallel agent execution — callback orchestration",
    },
    slide6: {
      title: "What we learned",
      subtitle: "Two days. Three teams.",
      cards: [
        {
          team: "Team Alpha",
          anchor: "Influencer Risk Swarm",
          head: "Agents bring order to unstructured data.",
          body: "A swarm of agents searches massive amounts of unstructured social media data at high speed, making complex signals understandable and surfacing possible tax risks.",
        },
        {
          team: "Team Bravo",
          anchor: "Skatti 2.0",
          head: "Legal precision needs both “what” and “how”.",
          body: "Context and structure matter. The official “what” was not enough. LLMs recognize patterns, not truth, so legal answers also require pedagogical “how-to” context.",
        },
        {
          team: "Team Delta",
          anchor: "Company Risk Swarm",
          head: "From gathering data to analysing it.",
          body: "A swarm gathers large amounts of data fast, freeing experts from collecting information so they can focus on high-value analysis.",
        },
      ],
      footerQuote: "Code is no longer the bottleneck...",
    },
    slide7: {
      tag: "The Core Insight",
      headline: {
        before: "“Agents are ",
        highlight: "all-knowing trainees with superpowers",
        after: " — fast and capable, but without judgment.”",
      },
      subheading: "WHAT MULTIPLE AGENTS NEED",
      cards: [
        {
          title: "Boundaries",
          desc: "Define what each agent is authorized to decide autonomously.",
        },
        {
          title: "Orchestration",
          desc: "Who passes what data to whom — and when in the pipeline.",
        },
        {
          title: "Direction",
          desc: "Set the objective. Then have the patience to let them learn.",
        },
      ],
      footerQuote: "Less software thinking · more design team thinking.",
    },
    slide8: {
      preline: "We walked in with questions.",
      headline: "We walked out with ",
      headlineHighlight: "answers.",
      reflection1Tag: "Reflection 01",
      reflection1Text: {
        before: "Speed is no longer the limit. Knowing what is ",
        highlight: "valuable",
        after: " is.",
      },
      reflection2Tag: "Reflection 02",
      reflection2Text: {
        before: "The distance between an idea and the software has ",
        highlight: "collapsed",
        after: ".",
      },
      leadQuote: {
        before: "The winning team isn’t the one that writes the most code. ",
        highlight: "It’s the one that learns fastest.",
      },
      twoDaysNote: "Two days. One room. A few curious people. That was all it took.",
      gibsonQuote: "“The future is already here — it’s just not evenly distributed.”",
      gibsonAuthor: "— William Gibson",
    },
    slide9: {
      title: {
        before: "The Bottleneck has ",
        highlight: "shifted",
      },
      subtitle: "The economics of software development have fundamentally changed",
      pills: [
        "1. Paradigm Shift",
        "2. The 4 Stages",
        "3. Proportional Governance",
        "4. The Portfolio's Role",
        "5. The Complete Model",
      ],
      step0: {
        track1Tag: "WHEN DEVELOPMENT IS EXPENSIVE",
        track1Nodes: [
          "20 IDEAS",
          "BUSINESS CASE",
          "PRIORITIZATION",
          "SELECT 2",
          "BUILD",
          "VERIFY ROI",
        ],
        track1BottleneckTag: "BOTTLENECK",
        track2Tag: "WHEN AI MAKES PROTOTYPING FAST & CHEAP",
        track2Nodes: [
          { label: "20 IDEAS" },
          { label: "PROTOTYPES" },
          { label: "TEST WITH", sub: "The Business" },
          { label: "DISCARD 18" },
          { label: "SCALE THE 2", sub: "Delivering Value" },
        ],
        quote: {
          before: "“Value is no longer in picking the right winner upfront — ",
          highlight: "but in learning what actually works faster than anyone else.",
          after: "”",
        },
      },
      step1: {
        windowTitle: "The 4 Stages: From Idea to Operations",
        windowSub: "“Not everything must scale — an AI solution can stay in PoC and deliver massive value.”",
        stages: [
          { num: "01", title: "Lab", desc: "Hypotheses & pretotypes" },
          { num: "02", title: "PoC", desc: "Practical utility" },
          { num: "03", title: "Pilot", desc: "Operational fit" },
          { num: "04", title: "Full Scale", desc: "Enterprise production" },
        ],
        inflectionLeft: "◄ Lab & PoC: Cheap to build & test quickly",
        inflectionRight: "Pilot & Full Scale: Demands IT support, security & capital ►",
        goodEnoughTitle: "Not everything must scale – “Good Enough”",
        goodEnoughDesc: "Can stay in PoC and deliver massive business value",
        killTitle: "Killed immediately if no value",
        killDesc: "Cancel early without prestige or wasted budget",
      },
      step2: {
        windowTitle: "Governance that scales in lockstep with risk and adoption",
        punchline: "“It doesn’t matter if the prototype takes 3 hours if permission takes 4 weeks.”",
        stages: [
          {
            num: "01",
            title: "Lab",
            sub: "Hypotheses & pretotypes",
            reqTag: "Checklist",
            reqTitle: "Simple rules",
          },
          {
            num: "02",
            title: "PoC",
            sub: "Practical utility",
            reqTag: "Classification",
            reqTitle: "Guard your data",
          },
          {
            num: "03",
            title: "Pilot",
            sub: "Operational fit",
            reqTag: "Security & Legal",
            reqTitle: "Architecture requirements",
          },
          {
            num: "04",
            title: "Full Scale",
            sub: "Enterprise production",
            reqTag: "Operations",
            reqTitle: "Uptime & SLA",
          },
        ],
        gradientLeft: "◄ Business Teams (driving ideas and building small-scale)",
        gradientRight: "IT, Legal & Specialists (engage as risk & scale increase) ►",
      },
      step3: {
        tag: "The Portfolio's New Role",
        quote: {
          before: "“The portfolio does not decide which ideas get tested — ",
          highlight: "but which ones get scaled.",
          after: "”",
        },
        card1: "1. Spots promising PoCs",
        card2: "2. Allocates scaling budget & specialists",
      },
      step4: {
        windowTitle: "The Operating Model: How everything connects",
        quote: "“Value lies in learning what works at maximum velocity.”",
        topSwarm: "Ideas & Hypotheses — Business teams explore broadly",
        topPortfolio: "Portfolio: Allocates resources & lifts to enterprise scale",
        stages: [
          {
            num: "01",
            title: "Lab",
            sub: "Hypotheses & pretotypes",
            reqTag: "Checklist",
            reqTitle: "Simple rules",
          },
          {
            num: "02",
            title: "PoC",
            sub: "Practical utility",
            reqTag: "Classification",
            reqTitle: "Guard your data",
          },
          {
            num: "03",
            title: "Pilot",
            sub: "Operational fit",
            reqTag: "Security & Legal",
            reqTitle: "Architecture requirements",
          },
          {
            num: "04",
            title: "Full Scale",
            sub: "Enterprise production",
            reqTag: "Operations",
            reqTitle: "Uptime & SLA",
          },
        ],
        platformTitle: "Enabling Platform & Infrastructure",
        platformMotto: "“Make the right path the easiest path”",
        platformBoxes: [
          "Lab environments & sandboxes",
          "Enterprise AI gateways",
          "Secure APIs & templates",
          "GPU compute & operations",
        ],
      },
    },
    slide10: {
      headline: "Two days. One room. A few curious people. That was all it took.",
      prefix: "Two days. One room. A few curious people.",
      highlight: "That was all it took.",
    },
  },
};
