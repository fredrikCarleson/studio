# Proposal: Scene 9 — The Decentralized AI Operating Model & Governance

> **Target Venue:** SoftwareOne — *The Pains and Gains of AI* (30-minute keynote slot)  
> **Speaker:** Fredrik Carleson  
> **Source Material:** [arbetssätt.pptx](file:///c:/Antigravity/studio/docs/arbetssätt.pptx) + Gartner Research on Adaptive AI Governance, Decentralized Innovation, and Platform Engineering.

---

## 1. Executive Summary & Pedagogical Narrative Arc

In traditional IT, governance and portfolio management was **command-and-control (Top-Down)**:
- Leadership guessed which 2 problems were worth solving.
- Roadmaps were mandated from above.
- Teams spent months writing business cases before writing a line of code.

### The New Pedagogical Sequence
To explain this clearly to an executive and technical audience, the narrative unfolds in a natural cause-and-effect progression:

1. **The Economic Shift (Förr vs. Nu):** Prototyping has gone from expensive and slow to practically free. We can now test 20 ideas simultaneously, kill 18, and keep the 2 that work.
2. **The 4-Stage Lifecycle & The "Right to Kill" (Labb $\rightarrow$ PoC $\rightarrow$ Pilot $\rightarrow$ Fullskala):** First explain *how* ideas move through stages, why short-lived AI experiments in the Lab are cheap and disposable, and how each step to the right requires exponentially more effort, security, and capital.
3. **Where Portfolio Management Fits (The Two-Way Alignment):** Once the audience understands that moving from PoC to Pilot and Fullscale suddenly becomes expensive and high-effort again, the role of the Portfolio becomes immediately obvious:
   - It does *not* micromanage the cheap Lab experiments.
   - It provides **Top-Down Strategic Intent** (so tiny teams know what business problems matter).
   - It acts as an **Active Radar** that receives **Bottom-Up Evidence** from promising PoCs, prioritizing and funding *only* those that justify the heavy scaling investment.
4. **Proportional Governance & The Enabling Infrastructure:** How to make this safe without bureaucracy: graduated governance that matches risk, built on top of a governed foundation (controlled LLMs, shared APIs, enterprise identity).

---

## 2. Visual Architecture & Layout on Screen

Scene 9 will be rendered as a cohesive, dark-mode glassmorphic dashboard (`bg-black/60 backdrop-blur-md`) with 4 distinct vertical layers:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CHAPTER 09: THE OPERATING MODEL                                                     [ 25:00 / 30:00 ]  │
│                                                                                                        │
│   From Ideation to Scale: Managing the Gains, Governing the Pains                                      │
│                                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 1. THE STRATEGIC PARADIGM SHIFT ("FÖRR vs. NU")                                                    │ │
│ │  FÖRR: 20 idéer ──> Analyser & business cases ──> Prioritering ──> Väljer 2 ──> Bygger länge ──> ?  │ │
│ │  NU:   20 idéer ──> Snabba prototyper ──> Test med verksamhet ──> DÖDA 18 ──> SKALA 2 (Real Value)  │ │
│ │  Axiom: "Värdet ligger inte i att välja rätt från början — utan i att snabbt lära vad som fungerar"  │ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 2. THE 4-STAGE PIPELINE & THE TWO-WAY PORTFOLIO                                                    │ │
│ │                                                                                                    │ │
│ │  [ TOP-DOWN STRATEGIC INTENT: Övergripande mål & problemområden ]                                 │ │
│ │    │                                                                                               │ │
│ │    ▼                                                                                               │ │
│ │ ┌────────────────────────────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ PORTFÖLJ: "Fångar upp initiativ som ska skalas · Prioriterar PoC/Pilot · Säkrar rätt investering" │ │ │
│ │ └──▲───────────────────────────────────────▲───────────────────────────────────▲────────────────┘ │ │
│ │    │ (Lovande Labb fångas upp)             │ (Validerad PoC)                   │ (Kräver kapital) │ │
│ │                                                                                                    │ │
│ │ ┌──────────────┐         ┌─────────────────┐         ┌─────────────────────────┐   ┌─────────────┐ │ │
│ │ │ 1. LABB      │ ──────> │ 2. PoC          │ ──────> │ 3. PILOT                │──>│4. FULLSKALA │ │ │
│ │ │ Testa hypotes│         │ Fungerar det?   │         │ Fungerar i verksamheten?│   │Skalbar drift│ │ │
│ │ │ Billigt/Fritt│         │ Riktiga brukare │         │ Blir ett arbetssätt     │   │Integrationer│ │ │
│ │ └──────┬───────┘         └────────┬────────┘         └────────────┬────────────┘   └─────────────┘ │ │
│ │        ▼                          ▼                               ▼                                │ │
│ │ [Dödas löpande]           [Dödas löpande]             [Dödas om ej lönsamt]      [Skapar värde]    │ │
│ │ (Kortlivade = OK)         (Good enough = OK)          (Kräver mer styrning)      (Över tid)        │ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 3. PROPORTIONAL GOVERNANCE (Gartner Adaptive Governance)                                           │ │
│ │   [ 1. Checklista & Ägare ] ──> [ 2. InfoKlassning ] ──> [ 3. Säkerhet & Juridik ] ──> [ 4. Drift ] │ │
│ │   "Styrning ökar i takt med risk, data och användning — noll byråkrati i Labb, full rigor i drift"   │ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 4. ROLES & THE ENABLING INFRASTRUCTURE (The Bedrock)                                               │ │
│ │   ◄── Mer Verksamhet (Driver idéer & bygger i liten skala)  │  Mer IT / Specialister (Säkerhet) ──► │ │
│ │   FOUNDATION: Säkra & kontrollerade API:er, Enterprise LLM-gateways & sandlådemiljöer                │ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Revised Pedagogical Step-by-Step Delivery (Keyboard Space / Arrow)

This sequence places the **Stages first**, establishing the cost and effort inflection point before introducing the Portfolio:

---

### **Step 0: The Economic Shift ("Förr vs. Nu")**
- **Visual:** The top contrast card illuminates.
- **Narrative & Stage Delivery:**
  - *"In traditional IT, development was slow and costly. We spent 6 months writing feasibility studies, business cases, and ROI calculations before writing a line of code. We picked two initiatives, built them for a year, and simply hoped they would create value."*
  - *"With generative AI and swarms, prototyping has become virtually free and instantaneous. We can test 20 hypotheses simultaneously directly with end users, ruthlessly kill 18, and scale the two that actually deliver."*
  - **Axiom:** *"Value is no longer in picking the right winner upfront; it is in learning what actually works faster than anyone else."*

---

### **Step 1: The 4-Stage Lifecycle & The "Right to Kill"**
- **Visual:** The 4 stage boxes (`Labb` $\rightarrow$ `PoC` $\rightarrow$ `Pilot` $\rightarrow$ `Fullskalig`) illuminate horizontally, with the downward exit arrows ("Dödas på löpande band") glowing underneath.
- **Narrative & Stage Delivery:**
  - *"So how does an idea actually travel? It moves through 4 distinct stages:"*
  - **1. Labb (Testa hypotes snabbt):** *"Exploring and building fast (a mini-app, an agent). 1–2 users, insensitive data. Here, short-lived, disposable AI prototypes are celebrated. Killing ideas on the assembly line is cheap and expected."*
  - **2. PoC (Fungerar det?):** *"Testing if the solution works in practice and delivers utility to real users. Often a 'good enough' proof."*
  - **3. Pilot (Fungerar i verksamheten?):** *"More users. It begins to become part of daily operations. Suddenly, things get serious."*
  - **4. Fullskala (Skalbar drift):** *"Many users, sensitive enterprise data, deep systems integration, high availability, uptime SLAs, and support."*
  - **The Pivot to Step 2:** *"Notice the inflection point: In the Lab and PoC, building is cheap. But as soon as you step into Pilot and Fullscale, it requires heavy engineering, integration, compliance, and real money again!"*

---

### **Step 2: Proportional Governance ("Det ska inte ta 4 veckor att få labba")**
- **Visual:** The unified governance window illuminates:
  - Punchline: *"Det spelar ingen roll att prototypen tar 3 timmar om tillståndet tar 4 veckor."*
  - 4 vertical pillars directly connected to requirements:
    - `01 Labb` $\rightarrow$ `Checklista: Enkla regler`
    - `02 PoC` $\rightarrow$ `Informationsklass: Koll på data`
    - `03 Pilot` $\rightarrow$ `Säkerhet & Juridik: Arkitekturkrav`
    - `04 Fullskala` $\rightarrow$ `Förvaltning: Drift & SLA`
  - Responsibilities gradient: Verksamhet $\leftrightarrow$ IT & Specialister.
- **Narrative & Stage Delivery:**
  - *"If testing an idea in the Lab requires the same 4-week compliance approval as a core ERP rollout, innovation is dead on arrival. We solve this by scaling governance in lockstep with risk and users: zero bureaucracy in the Lab, rigorous controls in Fullscale."*

---

### **Step 3: Enter the Portfolio (Funding & Enabling the Scale)**
- **Visual:** The glowing amber hero card illuminates:
  - Quote: *"Portföljen avgör inte vilka idéer som testas — utan vilka som ska skalas."*
  - 1. Fångar upp lovande PoC:er
  - 2. Allokerar skalningskapital & specialister
  - Transition bridge: PoC $\rightarrow$ Portföljen möjliggör & lyfter $\rightarrow$ Pilot/Fullscale (IT-arkitektur, juridik, GPU & drift).
- **Narrative & Stage Delivery:**
  - *"When a PoC empirically proves its value with users, the team hits the real corporate wall: legal, IT architecture, GPU reservation, and training. The portfolio's modern role is to step in as a booster rocket, providing the capital, specialists, and resources to take that winning idea to the whole enterprise."*

---

### **Step 4: Helhetsmodellen (The Integrated Map)**
- **Visual:** The complete, unified architecture illuminates on a single screen:
  - Top: The idea swarm feeding into `01 Labb` $\rightarrow$ `02 PoC`, bridged to `Portföljen` which allocates resources & scales into `03 Pilot` $\rightarrow$ `04 Fullskala`.
  - 4 Pillars: The 4 stages docked directly above their 4 governance requirements (`Checklista` $\rightarrow$ `Informationsklass` $\rightarrow$ `Säkerhet & Juridik` $\rightarrow$ `Förvaltning`).
  - Bedrock: **Möjliggörande plattform & infrastruktur** (*"Det ska vara lätt att göra rätt"*): 4 aligned capability boxes directly under each pillar: Labb-miljöer & sandlådor, Enterprise AI-gateways, säkra API:er & mallar samt GPU-kraft & drift.
- **Narrative & Stage Delivery:**
  - *"Here is the complete operating model in one single picture. When we move fast in the lab, verify empirical value in PoC, let the portfolio fund only the proven initiatives, scale governance proportionally, and ground it on an enabling platform, AI stops being an expensive gamble and becomes an unstoppable engine of real business value."*

---

## 4. Alignment with SoftwareOne's *"The Pains and Gains of AI"*

| The Pain Addressed | The Operating Model Solution |
| :--- | :--- |
| **"We waste budget on AI projects that fail in production."** | **Labb/PoC Funnel:** Spend pocket change to kill 18 unviable ideas in the Lab before committing major budget. |
| **"Scaling AI requires too much IT effort and money."** | **Two-Way Portfolio:** Scale *only* those initiatives that have already empirically proven business value in PoC. |
| **"Business teams are building uncontrolled shadow AI."** | **Controlled Infrastructure:** Provide governed enterprise LLM sandboxes and reusable APIs so the right way is the easiest way. |
| **"Compliance and legal block everything."** | **Proportional Governance:** Lightweight checklist in the Lab; formal security and legal gatekeepers engage only when entering Pilot/Scale. |

---

## 5. Summary of Benefits of the Reordered Sequence

1. **Pedagogically Intuitive:** Explaining the 4 stages first creates a clear problem: *"Moving right gets expensive."* The audience immediately feels the need for a solution.
2. **Elevates the Portfolio's Value:** When you reveal the Portfolio *after* the stages, it doesn't look like overhead—it looks like the smart investment committee that saves millions by only funding validated winners.
3. **Connects Flawlessly to the Hackathon Story:** You started the presentation with 15 brains in a room hacking (Labb/PoC), and you conclude by showing the exact enterprise highway that takes those hackathon sparks into production safely.
