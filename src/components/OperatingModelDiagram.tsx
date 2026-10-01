"use client";

import React, { memo } from "react";
import {
  TrendingDown,
  Sparkles,
  ShieldCheck,
  Server,
  ArrowRight,
  ArrowDown,
  Compass,
  AlertOctagon,
  CheckCircle2,
  Layers,
  Flame,
  Radio,
  Lightbulb,
  FileText,
  Filter,
  Star,
  Clock,
  Target,
  Rocket,
  Users,
  Trash2,
  FlaskConical,
  Search,
  Building2,
  ClipboardCheck,
  Lock,
  Scale,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OperatingModelDiagramProps {
  subStep: number; // 0: Paradigmskiftet, 1: 4 Stadier, 2: Gradvis Styrning, 3: Portföljens roll, 4: Helhetsbilden
}

export const OperatingModelDiagram = memo(({ subStep }: OperatingModelDiagramProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-start select-none text-center">
      {/* Content wrapper with fixed min-height so header and starting line never jump */}
      <div className="w-full flex flex-col items-center justify-start min-h-[50vh] md:min-h-[54vh]">
        {/* ═══════════════════════════════════════════════════════════════════════════════
            STEG 0: PARADIGMSKIFTET (När utveckling är dyrt vs När AI gör prototyping snabb och billig)
            Massiv typografi & ikoner. Läsbart från rad 15 på projektor.
        ═══════════════════════════════════════════════════════════════════════════════ */}
        {subStep === 0 && (
        <div className="w-full max-w-7xl space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {/* TRACK 1: NÄR UTVECKLING ÄR DYRT */}
          <div className="rounded-3xl border border-white/20 bg-black/75 p-6 md:p-8 backdrop-blur-md shadow-[0_16px_50px_rgba(0,0,0,0.6)] text-left space-y-5">
            <div className="border-b border-white/10 pb-3">
              <span className="font-mono text-sm md:text-base uppercase tracking-[0.16em] text-white/85 font-bold flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-amber-400/80" />
                När utveckling är dyrt
              </span>
            </div>

            {/* Flödeskedja: När utveckling är dyrt */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 pt-1">
              {/* 1. 20 Idéer */}
              <div className="flex flex-col items-center text-center w-28 md:w-36 shrink-0">
                <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-amber-400/15 border border-amber-400/35 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                  <Lightbulb className="h-8 w-8 text-amber-400" />
                </div>
                <span className="font-mono text-sm md:text-base font-black text-white uppercase tracking-tight">20 idéer</span>
              </div>

              <ArrowRight className="h-6 w-6 text-white/30 shrink-0 hidden md:block" />

              {/* 2. Business case */}
              <div className="flex flex-col items-center text-center w-32 md:w-36 shrink-0">
                <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-sky-500/15 border border-sky-400/35 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
                  <FileText className="h-8 w-8 text-sky-400" />
                </div>
                <span className="font-mono text-sm md:text-base font-black text-white uppercase tracking-tight">Business case</span>
              </div>

              <ArrowRight className="h-6 w-6 text-white/30 shrink-0 hidden md:block" />

              {/* 3. Prioritering */}
              <div className="flex flex-col items-center text-center w-32 md:w-36 shrink-0">
                <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-indigo-500/15 border border-indigo-400/35 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(129,140,248,0.15)]">
                  <Filter className="h-8 w-8 text-indigo-400" />
                </div>
                <span className="font-mono text-sm md:text-base font-black text-white uppercase tracking-tight">Prioritering</span>
              </div>

              <ArrowRight className="h-6 w-6 text-white/30 shrink-0 hidden md:block" />

              {/* 4. Väljer 2 */}
              <div className="flex flex-col items-center text-center w-28 md:w-36 shrink-0">
                <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(251,191,36,0.22)]">
                  <div className="flex gap-1.5 text-amber-300">
                    <Star className="h-6 w-6 fill-amber-300" />
                    <Star className="h-6 w-6 fill-amber-300" />
                  </div>
                </div>
                <span className="font-mono text-sm md:text-base font-black text-amber-300 uppercase tracking-tight">Väljer 2</span>
              </div>

              <ArrowRight className="h-6 w-6 text-white/30 shrink-0 hidden md:block" />

              {/* 5. Bygger länge */}
              <div className="flex flex-col items-center text-center w-32 md:w-36 shrink-0">
                <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-orange-500/15 border border-orange-400/35 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(251,146,60,0.15)]">
                  <Clock className="h-8 w-8 text-orange-400" />
                </div>
                <span className="font-mono text-sm md:text-base font-black text-white uppercase tracking-tight">Bygger länge</span>
              </div>

              <ArrowRight className="h-6 w-6 text-white/30 shrink-0 hidden md:block" />

              {/* 6. Verifiera ROI */}
              <div className="flex flex-col items-center text-center w-32 md:w-36 shrink-0">
                <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                  <Target className="h-8 w-8 text-emerald-400" />
                </div>
                <span className="font-mono text-sm md:text-base font-black text-white uppercase tracking-tight">Verifiera ROI</span>
              </div>
            </div>
          </div>

          {/* TRACK 2: NÄR AI GÖR PROTOTYPING SNABB OCH BILLIG */}
          <div className="rounded-3xl border-2 border-accent/70 bg-black/85 p-6 md:p-8 backdrop-blur-md shadow-[0_0_55px_rgba(0,180,216,0.28)] text-left space-y-5 ring-2 ring-accent/30">
            <div className="border-b border-white/10 pb-3">
              <span className="font-mono text-sm md:text-base uppercase tracking-[0.16em] text-accent font-bold flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-accent" />
                När AI gör prototyping snabb och billig
              </span>
            </div>

            {/* Flödeskedja: Snabb prototyping */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 pt-1">
              {/* 1. 20 Idéer */}
              <div className="flex flex-col items-center text-center w-28 md:w-36 shrink-0">
                <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-amber-400/15 border border-amber-400/35 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                  <Lightbulb className="h-8 w-8 text-amber-400" />
                </div>
                <span className="font-mono text-sm md:text-base font-black text-white uppercase tracking-tight">20 idéer</span>
              </div>

              <ArrowRight className="h-6 w-6 text-accent/60 shrink-0 hidden md:block" />

              {/* 2. Prototyper */}
              <div className="flex flex-col items-center text-center w-32 md:w-36 shrink-0">
                <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-accent/25 border-2 border-accent flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(0,180,216,0.4)]">
                  <Rocket className="h-8 w-8 text-accent" />
                </div>
                <span className="font-mono text-sm md:text-base font-black text-accent uppercase tracking-tight">Prototyper</span>
              </div>

              <ArrowRight className="h-6 w-6 text-accent/60 shrink-0 hidden md:block" />

              {/* 3. Test med verksamheten (Samma färg) */}
              <div className="flex flex-col items-center text-center w-36 md:w-44 shrink-0">
                <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(45,212,191,0.25)]">
                  <Users className="h-8 w-8 text-teal-300" />
                </div>
                <span className="font-mono text-sm md:text-base font-black text-teal-300 uppercase tracking-tight">Test med</span>
                <span className="text-xs md:text-sm text-teal-300 font-semibold mt-0.5">Verksamheten</span>
              </div>

              <ArrowRight className="h-6 w-6 text-accent/60 shrink-0 hidden md:block" />

              {/* 4. Sortera bort 18 */}
              <div className="flex flex-col items-center text-center w-36 md:w-44 shrink-0">
                <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-rose-950/50 border border-rose-500/50 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(244,63,94,0.2)]">
                  <Trash2 className="h-8 w-8 text-rose-400" />
                </div>
                <span className="font-mono text-sm md:text-base font-black text-rose-400 uppercase tracking-tight">Sortera bort 18</span>
              </div>

              <ArrowRight className="h-6 w-6 text-accent/60 shrink-0 hidden md:block" />

              {/* 5. Skala de 2 som gjort nytta (Samma färg) */}
              <div className="flex flex-col items-center text-center w-36 md:w-44 shrink-0">
                <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-emerald-500/25 border-2 border-emerald-400 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                  <div className="flex gap-1.5 text-emerald-300">
                    <Star className="h-6 w-6 fill-emerald-300" />
                    <Star className="h-6 w-6 fill-emerald-300" />
                  </div>
                </div>
                <span className="font-mono text-sm md:text-base font-black text-emerald-300 uppercase tracking-tight">Skala de 2</span>
                <span className="text-xs md:text-sm text-emerald-300 font-semibold mt-0.5">Som gjort nytta</span>
              </div>
            </div>
          </div>

          {/* KÄRNINSIKTEN - Stor, läsbar, majestätisk som Slide 8 */}
          <div className="rounded-2xl border border-white/20 bg-black/80 p-6 md:p-8 backdrop-blur-md shadow-2xl">
            <p className="text-xl md:text-3xl font-light text-white leading-relaxed">
              &ldquo;Värdet ligger inte längre i att välja rätt från början &mdash;{" "}
              <span className="text-accent font-semibold not-italic">
                utan i hur snabbt vi lär vad som faktiskt fungerar.
              </span>
              &rdquo;
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════════
          STEG 1: DE 4 STADIERNA (ORIENTERINGSTAVLAN)
          Inga små punktlistor. Enorm läsbarhet, tydliga ikoner och två utfall.
      ═══════════════════════════════════════════════════════════════════════════════ */}
      {subStep === 1 && (
        <div className="w-full max-w-7xl space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {/* DE 4 PILLAR-KORTEN */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
            {/* 1. Labb */}
            <div className="rounded-3xl border border-sky-400/40 bg-black/75 p-6 md:p-8 backdrop-blur-md shadow-[0_14px_45px_rgba(0,0,0,0.55)] flex flex-col justify-between text-left h-56 md:h-60">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-sky-400/15 border border-sky-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                  <FlaskConical className="h-7 w-7 text-sky-400" />
                </div>
                <span className="font-mono text-3xl font-black text-sky-400">01</span>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Labb</h3>
                <p className="text-base md:text-lg font-semibold text-sky-300 mt-1">
                  Kreativitet &amp; hypoteser
                </p>
              </div>
            </div>

            {/* 2. PoC */}
            <div className="rounded-3xl border-2 border-teal-400/60 bg-black/80 p-6 md:p-8 backdrop-blur-md shadow-[0_0_40px_rgba(45,212,191,0.2)] flex flex-col justify-between text-left h-56 md:h-60 ring-1 ring-teal-400/30">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.2)]">
                  <Search className="h-7 w-7 text-teal-400" />
                </div>
                <span className="font-mono text-3xl font-black text-teal-400">02</span>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">PoC</h3>
                <p className="text-base md:text-lg font-semibold text-teal-300 mt-1">
                  Fungerar det i praktiken?
                </p>
              </div>
            </div>

            {/* 3. Pilot */}
            <div className="rounded-3xl border-2 border-amber-400/70 bg-black/80 p-6 md:p-8 backdrop-blur-md shadow-[0_0_40px_rgba(251,191,36,0.2)] flex flex-col justify-between text-left h-56 md:h-60 ring-1 ring-amber-400/40">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                  <Users className="h-7 w-7 text-amber-400" />
                </div>
                <span className="font-mono text-3xl font-black text-amber-400">03</span>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Pilot</h3>
                <p className="text-base md:text-lg font-semibold text-amber-300 mt-1">
                  Fungerar i arbetssättet?
                </p>
              </div>
            </div>

            {/* 4. Fullskala */}
            <div className="rounded-3xl border-2 border-emerald-400/80 bg-black/85 p-6 md:p-8 backdrop-blur-md shadow-[0_0_50px_rgba(52,211,153,0.25)] flex flex-col justify-between text-left h-56 md:h-60 ring-2 ring-emerald-400/40">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                  <Building2 className="h-7 w-7 text-emerald-400" />
                </div>
                <span className="font-mono text-3xl font-black text-emerald-400">04</span>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Fullskala</h3>
                <p className="text-base md:text-lg font-semibold text-emerald-300 mt-1">
                  Förvaltat för alla
                </p>
              </div>
            </div>
          </div>

          {/* DE TVÅ UTFALLEN / SPÅREN (Good Enough vs Dödas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            {/* UTFALL 1: ALLT MÅSTE INTE SKALAS (GOOD ENOUGH I POC) */}
            <div className="rounded-2xl border border-teal-400/40 bg-teal-950/25 p-5 md:p-6 flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-teal-400/20 border border-teal-400/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(45,212,191,0.25)]">
                <Star className="h-7 w-7 fill-teal-400 text-teal-400" />
              </div>
              <div>
                <div className="text-lg md:text-2xl font-black text-white tracking-tight">
                  Allt måste inte skalas &ndash; &ldquo;Good Enough&rdquo;
                </div>
                <div className="font-mono text-xs md:text-sm uppercase tracking-wider text-teal-300 font-semibold mt-1">
                  Kan stanna i PoC och skapa stort värde
                </div>
              </div>
            </div>

            {/* UTFALL 2: DÖDAS DIREKT OM DET INTE BÄR */}
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/25 p-5 md:p-6 flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                <Trash2 className="h-7 w-7 text-rose-400" />
              </div>
              <div>
                <div className="text-lg md:text-2xl font-black text-white tracking-tight">
                  Dödas direkt om det inte ger nytta
                </div>
                <div className="font-mono text-xs md:text-sm uppercase tracking-wider text-rose-300 font-semibold mt-1">
                  Avbryt tidigt utan prestige eller förlust
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════════
          STEG 2: GRADVIS STYRNING (LÖSNINGEN PÅ TILLSTÅNDS-FLASKHALSEN)
          Noll byråkrati i Labbet. Kraven ökar i takt med risk och användning.
      ═══════════════════════════════════════════════════════════════════════════════ */}
      {subStep === 2 && (
        <div className="w-full max-w-7xl animate-in fade-in zoom-in-95 duration-500">
          <div className="rounded-3xl border-2 border-accent/60 bg-black/85 p-7 md:p-9 backdrop-blur-md shadow-[0_0_55px_rgba(0,180,216,0.22)] text-left space-y-7 ring-1 ring-accent/30">
            {/* HUVUDRUBRIK I FÖNSTRET MED PUNCHLINE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,180,216,0.25)]">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    Styrningen som ökar i takt med risk och användning
                  </h3>
                  <p className="text-base md:text-lg text-accent font-semibold mt-1">
                    &ldquo;Det spelar ingen roll att prototypen tar 3 timmar om tillståndet tar 4 veckor.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* 4 VERTIKALA PELARE: STEG HÖGST UPP, KRAV DIREKT UNDER */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* KOLUMN 1: LABB */}
              <div className="flex flex-col gap-3">
                {/* Steg-ruta: Labb */}
                <div className="rounded-2xl border border-sky-400/40 bg-sky-950/20 p-5 md:p-6 flex flex-col justify-between h-40 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-sky-400/15 border border-sky-400/30 flex items-center justify-center">
                      <FlaskConical className="h-6 w-6 text-sky-400" />
                    </div>
                    <span className="font-mono text-3xl font-black text-sky-400">01</span>
                  </div>
                  <div>
                    <h4 className="text-2xl md:text-3xl font-black text-white">Labb</h4>
                    <p className="text-sm md:text-base font-semibold text-sky-300 mt-0.5">Kreativitet &amp; hypoteser</p>
                  </div>
                </div>

                {/* Pil nedåt */}
                <div className="flex justify-center -my-1">
                  <ArrowDown className="h-5 w-5 text-sky-400/70" />
                </div>

                {/* Krav-ruta: Enkla regler direkt under */}
                <div className="rounded-2xl border border-sky-400/30 bg-black/60 p-5 text-left shadow-lg">
                  <div className="flex items-center gap-2 font-mono text-xs md:text-sm font-bold text-sky-300 uppercase tracking-wider mb-1.5">
                    <ClipboardCheck className="h-4 w-4 text-sky-400 shrink-0" />
                    Checklista
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white tracking-tight">
                    Enkla regler
                  </div>
                </div>
              </div>

              {/* KOLUMN 2: POC */}
              <div className="flex flex-col gap-3">
                {/* Steg-ruta: PoC */}
                <div className="rounded-2xl border-2 border-teal-400/50 bg-teal-950/25 p-5 md:p-6 flex flex-col justify-between h-40 ring-1 ring-teal-400/30 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center">
                      <Search className="h-6 w-6 text-teal-400" />
                    </div>
                    <span className="font-mono text-3xl font-black text-teal-400">02</span>
                  </div>
                  <div>
                    <h4 className="text-2xl md:text-3xl font-black text-white">PoC</h4>
                    <p className="text-sm md:text-base font-semibold text-teal-300 mt-0.5">Fungerar i praktiken?</p>
                  </div>
                </div>

                {/* Pil nedåt */}
                <div className="flex justify-center -my-1">
                  <ArrowDown className="h-5 w-5 text-teal-400/70" />
                </div>

                {/* Krav-ruta: Koll på data direkt under */}
                <div className="rounded-2xl border border-teal-400/30 bg-black/60 p-5 text-left shadow-lg">
                  <div className="flex items-center gap-2 font-mono text-xs md:text-sm font-bold text-teal-300 uppercase tracking-wider mb-1.5">
                    <Lock className="h-4 w-4 text-teal-400 shrink-0" />
                    Informationsklass
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white tracking-tight">
                    Koll på data
                  </div>
                </div>
              </div>

              {/* KOLUMN 3: PILOT */}
              <div className="flex flex-col gap-3">
                {/* Steg-ruta: Pilot */}
                <div className="rounded-2xl border-2 border-amber-400/60 bg-amber-950/25 p-5 md:p-6 flex flex-col justify-between h-40 ring-1 ring-amber-400/35 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                      <Users className="h-6 w-6 text-amber-400" />
                    </div>
                    <span className="font-mono text-3xl font-black text-amber-400">03</span>
                  </div>
                  <div>
                    <h4 className="text-2xl md:text-3xl font-black text-white">Pilot</h4>
                    <p className="text-sm md:text-base font-semibold text-amber-300 mt-0.5">Fungerar i arbetssättet?</p>
                  </div>
                </div>

                {/* Pil nedåt */}
                <div className="flex justify-center -my-1">
                  <ArrowDown className="h-5 w-5 text-amber-400/70" />
                </div>

                {/* Krav-ruta: Arkitekturkrav direkt under */}
                <div className="rounded-2xl border border-amber-400/40 bg-black/60 p-5 text-left shadow-lg">
                  <div className="flex items-center gap-2 font-mono text-xs md:text-sm font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                    <Scale className="h-4 w-4 text-amber-400 shrink-0" />
                    Säkerhet &amp; Juridik
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white tracking-tight">
                    Arkitekturkrav
                  </div>
                </div>
              </div>

              {/* KOLUMN 4: FULLSKALA */}
              <div className="flex flex-col gap-3">
                {/* Steg-ruta: Fullskala */}
                <div className="rounded-2xl border-2 border-emerald-400/70 bg-emerald-950/30 p-5 md:p-6 flex flex-col justify-between h-40 ring-2 ring-emerald-400/40 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-emerald-400" />
                    </div>
                    <span className="font-mono text-3xl font-black text-emerald-400">04</span>
                  </div>
                  <div>
                    <h4 className="text-2xl md:text-3xl font-black text-white">Fullskala</h4>
                    <p className="text-sm md:text-base font-semibold text-emerald-300 mt-0.5">Förvaltat för alla</p>
                  </div>
                </div>

                {/* Pil nedåt */}
                <div className="flex justify-center -my-1">
                  <ArrowDown className="h-5 w-5 text-emerald-400/70" />
                </div>

                {/* Krav-ruta: Drift & SLA direkt under */}
                <div className="rounded-2xl border border-emerald-400/50 bg-black/60 p-5 text-left shadow-lg">
                  <div className="flex items-center gap-2 font-mono text-xs md:text-sm font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                    <Landmark className="h-4 w-4 text-emerald-400 shrink-0" />
                    Förvaltning
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white tracking-tight">
                    Drift &amp; SLA
                  </div>
                </div>
              </div>
            </div>

            {/* ROLLER OCH ANSVAR: GRADIENTBALK */}
            <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs md:text-sm font-mono text-white/80 gap-3">
              <span className="text-sky-300 font-bold flex items-center gap-2">
                ◄ Mer Verksamhet (driver idéer och bygger i liten skala)
              </span>
              <span className="text-emerald-300 font-bold flex items-center gap-2">
                Mer IT, Juridik &amp; Specialister (kopplas in vid risk &amp; skalning) ►
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════════
          STEG 3: PORTFÖLJENS NYA ROLL (SKALNINGSMOTORN)
          Rent, massivt kärnbudskap utan störande brus.
      ═══════════════════════════════════════════════════════════════════════════════ */}
      {subStep === 3 && (
        <div className="w-full max-w-5xl space-y-6 animate-in fade-in zoom-in-95 duration-500 pt-3">
          {/* DEN GULA HUVUDRUTAN: PORTFÖLJENS ROLL */}
          <div className="rounded-3xl border-2 border-amber-400/80 bg-black/85 p-8 md:p-14 backdrop-blur-md shadow-[0_0_65px_rgba(251,191,36,0.25)] space-y-8 ring-2 ring-amber-400/30">
            <div className="flex items-center justify-center gap-2.5">
              <Radio className="h-7 w-7 text-amber-400 animate-pulse" />
              <span className="font-mono text-sm md:text-base uppercase tracking-[0.3em] text-amber-300 font-bold">
                Portföljens nya roll
              </span>
            </div>

            <div className="text-3xl md:text-5xl font-black text-white leading-tight [text-wrap:balance]">
              &ldquo;Portföljen avgör inte vilka idéer som testas &mdash;{" "}
              <span className="text-amber-300 underline decoration-amber-400 underline-offset-8">
                utan vilka som ska skalas.
              </span>
              &rdquo;
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 text-center max-w-4xl mx-auto">
              <div className="rounded-2xl bg-black/60 border border-amber-400/30 p-5 md:p-6 flex items-center justify-center gap-3 shadow-md">
                <Search className="h-6 w-6 text-amber-300 shrink-0" />
                <span className="text-lg md:text-xl font-bold text-white tracking-tight">
                  1. Fångar upp lovande PoC:er
                </span>
              </div>
              <div className="rounded-2xl bg-black/60 border border-amber-400/30 p-5 md:p-6 flex items-center justify-center gap-3 shadow-md">
                <Sparkles className="h-6 w-6 text-amber-300 shrink-0" />
                <span className="text-lg md:text-xl font-bold text-white tracking-tight">
                  2. Allokerar skalningskapital &amp; specialister
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════════
          STEG 4: HELHETSMODELLEN (DEN INTEGRERADE KARTAN)
          Knyter ihop alla delar: Idésvärm -> Labb -> PoC -> Portfölj -> Pilot -> Fullskala,
          med Governance, Roller och Plattform under. Minimal text, maximal överblick.
      ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════════════════════
          STEG 4: HELHETSMODELLEN (DEN INTEGRERADE KARTAN)
          4 harmoniska pelare, perfekt vertikal linjering, portfölj-bro och plattforms-grund.
      ═══════════════════════════════════════════════════════════════════════════════ */}
      {subStep === 4 && (
        <div className="w-full max-w-7xl animate-in fade-in zoom-in-95 duration-500">
          <div className="rounded-3xl border-2 border-accent/60 bg-black/85 p-6 md:p-7 backdrop-blur-md shadow-[0_0_65px_rgba(0,180,216,0.25)] text-left space-y-4 ring-1 ring-accent/30">
            {/* HUVUDRUBRIK & KÄRNBALANS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                  <Layers className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    Helhetsmodellen: Hur allt hänger ihop
                  </h3>
                </div>
              </div>
              <div className="text-xs md:text-sm font-light text-white/90 bg-white/[0.05] border border-white/10 px-4 py-1 rounded-full">
                &ldquo;Värdet ligger i att snabbt lära vad som fungerar.&rdquo;
              </div>
            </div>

            {/* TOPP-BALK: IDÉ-SVÄRM TILL VÄNSTER, PORTFÖLJEN SOM SKALNINGSBRO ÖVER PILOT & FULLSKALA TILL HÖGER */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Vänster: Idé-svärmen som matar Labb & PoC */}
              <div className="md:col-span-2 flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="h-6 w-6 rounded-md bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-amber-300 font-bold">
                  Idéer &amp; Hypoteser
                </span>
                <span className="text-xs text-white/70 hidden sm:inline">&mdash; Verksamheten provar brett</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400 ml-auto" />
              </div>

              {/* Höger: Portföljen som spänner över Pilot & Fullskala */}
              <div className="md:col-span-2 rounded-xl border border-amber-400/80 bg-amber-950/40 px-4 py-2 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.2)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Radio className="h-4 w-4 text-amber-400 animate-pulse shrink-0" />
                  <span className="font-mono text-xs uppercase tracking-wider text-amber-300 font-black">
                    Portfölj:
                  </span>
                  <span className="text-xs md:text-sm font-bold text-white">
                    Allokerar resurser &amp; lyfter till skala
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-amber-400 hidden sm:block" />
              </div>
            </div>

            {/* DE 4 HARMONISKA PELARNA: STADIUM + STYRNINGSKRAV DIREKT UNDER */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* PELARE 1: LABB */}
              <div className="flex flex-col gap-2.5">
                <div className="rounded-2xl border border-sky-400/40 bg-sky-950/20 p-5 flex flex-col justify-between h-36 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-sky-400/15 border border-sky-400/30 flex items-center justify-center">
                      <FlaskConical className="h-5 w-5 text-sky-400" />
                    </div>
                    <span className="font-mono text-2xl font-black text-sky-400">01</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white">Labb</h4>
                    <p className="text-xs md:text-sm font-semibold text-sky-300 mt-0.5">Hypoteser &amp; pretotyper</p>
                  </div>
                </div>

                <div className="flex justify-center -my-1">
                  <ArrowDown className="h-4 w-4 text-sky-400/60" />
                </div>

                <div className="rounded-2xl border border-sky-400/30 bg-black/60 p-4 text-left shadow-sm">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1">
                    <ClipboardCheck className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    Checklista
                  </div>
                  <div className="text-xl font-black text-white tracking-tight">
                    Enkla regler
                  </div>
                </div>
              </div>

              {/* PELARE 2: POC */}
              <div className="flex flex-col gap-2.5">
                <div className="rounded-2xl border-2 border-teal-400/50 bg-teal-950/25 p-5 flex flex-col justify-between h-36 ring-1 ring-teal-400/30 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center">
                      <Search className="h-5 w-5 text-teal-400" />
                    </div>
                    <span className="font-mono text-2xl font-black text-teal-400">02</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white">PoC</h4>
                    <p className="text-xs md:text-sm font-semibold text-teal-300 mt-0.5">Praktisk nytta</p>
                  </div>
                </div>

                <div className="flex justify-center -my-1">
                  <ArrowDown className="h-4 w-4 text-teal-400/60" />
                </div>

                <div className="rounded-2xl border border-teal-400/30 bg-black/60 p-4 text-left shadow-sm">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1">
                    <Lock className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                    Informationsklass
                  </div>
                  <div className="text-xl font-black text-white tracking-tight">
                    Koll på data
                  </div>
                </div>
              </div>

              {/* PELARE 3: PILOT */}
              <div className="flex flex-col gap-2.5">
                <div className="rounded-2xl border-2 border-amber-400/60 bg-amber-950/25 p-5 flex flex-col justify-between h-36 ring-1 ring-amber-400/35 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                      <Users className="h-5 w-5 text-amber-400" />
                    </div>
                    <span className="font-mono text-2xl font-black text-amber-400">03</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white">Pilot</h4>
                    <p className="text-xs md:text-sm font-semibold text-amber-300 mt-0.5">I arbetssättet</p>
                  </div>
                </div>

                <div className="flex justify-center -my-1">
                  <ArrowDown className="h-4 w-4 text-amber-400/60" />
                </div>

                <div className="rounded-2xl border border-amber-400/40 bg-black/60 p-4 text-left shadow-sm">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                    <Scale className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    Säkerhet &amp; Juridik
                  </div>
                  <div className="text-xl font-black text-white tracking-tight">
                    Arkitekturkrav
                  </div>
                </div>
              </div>

              {/* PELARE 4: FULLSKALA */}
              <div className="flex flex-col gap-2.5">
                <div className="rounded-2xl border-2 border-emerald-400/70 bg-emerald-950/30 p-5 flex flex-col justify-between h-36 ring-2 ring-emerald-400/40 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="font-mono text-2xl font-black text-emerald-400">04</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white">Fullskala</h4>
                    <p className="text-xs md:text-sm font-semibold text-emerald-300 mt-0.5">Förvaltat för alla</p>
                  </div>
                </div>

                <div className="flex justify-center -my-1">
                  <ArrowDown className="h-4 w-4 text-emerald-400/60" />
                </div>

                <div className="rounded-2xl border border-emerald-400/50 bg-black/60 p-4 text-left shadow-sm">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                    <Landmark className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    Förvaltning
                  </div>
                  <div className="text-xl font-black text-white tracking-tight">
                    Drift &amp; SLA
                  </div>
                </div>
              </div>
            </div>

            {/* GRUNDPLATTAN: MÖJLIGGÖRANDE PLATTFORM & INFRASTRUKTUR (4 LINJERADE BYGGSTENAR) */}
            <div className="rounded-2xl border-2 border-accent/40 bg-gradient-to-r from-accent/[0.08] via-black/70 to-emerald-500/[0.08] p-5 backdrop-blur-md shadow-[0_0_30px_rgba(0,180,216,0.15)] space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                    <Server className="h-4 w-4 text-accent" />
                  </div>
                  <span className="font-mono text-xs md:text-sm uppercase tracking-wider text-accent font-bold">
                    Möjliggörande plattform &amp; infrastruktur
                  </span>
                </div>
                <div className="text-xs font-mono text-white/90 font-bold bg-white/[0.06] px-3.5 py-1 rounded-full border border-white/10">
                  &ldquo;Det ska vara lätt att göra rätt&rdquo;
                </div>
              </div>

              {/* 4 Byggstenar i plattformen - perfekt linjerade med pelarna ovanför! */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm font-mono">
                <div className="rounded-xl bg-black/60 border border-sky-400/20 p-3 flex items-center gap-2.5 shadow-sm">
                  <FlaskConical className="h-4 w-4 text-sky-400 shrink-0" />
                  <span className="text-white/90 font-bold">Labb-miljöer &amp; sandlådor</span>
                </div>
                <div className="rounded-xl bg-black/60 border border-teal-400/20 p-3 flex items-center gap-2.5 shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
                  <span className="text-white/90 font-bold">Enterprise AI-gateways</span>
                </div>
                <div className="rounded-xl bg-black/60 border border-amber-400/20 p-3 flex items-center gap-2.5 shadow-sm">
                  <Layers className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="text-white/90 font-bold">Säkra API:er &amp; mallar</span>
                </div>
                <div className="rounded-xl bg-black/60 border border-emerald-400/20 p-3 flex items-center gap-2.5 shadow-sm">
                  <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-white/90 font-bold">GPU-kraft &amp; drift</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          KONTROLLREMSA: Tydliga 5 steg-indikatorer
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {[
          { label: "1. Paradigmskiftet" },
          { label: "2. De 4 Stadierna" },
          { label: "3. Gradvis Styrning" },
          { label: "4. Portföljens nya roll" },
          { label: "5. Helhetsbilden" },
        ].map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "px-4 py-1.5 rounded-full font-mono text-xs md:text-sm transition-all duration-300",
              subStep === idx
                ? "bg-accent text-black font-black shadow-[0_0_20px_rgba(0,180,216,0.65)] scale-105"
                : "bg-white/10 text-white/50 font-medium"
            )}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
});

OperatingModelDiagram.displayName = "OperatingModelDiagram";
