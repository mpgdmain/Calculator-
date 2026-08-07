'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { RotateCcw, Copy, Check, Search, Link2, X, Mail, Info, Code2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import fuelPumpIcon from '@/src/assets/images/vintage_gas_pump_1785431240431.jpg';

export default function MpgConverterPage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [mode, setMode] = useState<'mpgToL100' | 'l100ToMpg'>('mpgToL100');
  const [decimals, setDecimals] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showEmbedModal, setShowEmbedModal] = useState<boolean>(false);
  const [copiedEmbed, setCopiedEmbed] = useState<boolean>(false);
  const contactModalOpenTime = useRef<number>(0);
  const aboutModalOpenTime = useRef<number>(0);
  const embedModalOpenTime = useRef<number>(0);

  const openContactModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    contactModalOpenTime.current = Date.now();
    setShowContactModal(true);
  };

  const openAboutModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    aboutModalOpenTime.current = Date.now();
    setShowAboutModal(true);
  };

  const openEmbedModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    embedModalOpenTime.current = Date.now();
    setShowEmbedModal(true);
  };

  const handleCopyEmbed = () => {
    const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://fuelwise.app';
    const snippet = `<iframe src="${originUrl}" width="100%" height="460" frameborder="0" style="border:0; border-radius:12px; max-width:480px; width:100%; min-height:460px;" title="FuelWise MPG to L/100km Converter"></iframe>\n<p style="font-size:11px; text-align:center; font-family:sans-serif; margin-top:4px;"><a href="${originUrl}" target="_blank" rel="noopener">Powered by FuelWise MPG Converter</a></p>`;
    navigator.clipboard.writeText(snippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const tableInputRef = useRef<HTMLInputElement>(null);
  const celebrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tableCelebrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constant factor for US MPG to L/100km conversion
  // 1 US Gallon = 3.785411784 L, 1 Mile = 1.609344 km
  // (100 * 3.785411784) / 1.609344 = 235.214583
  const CONVERSION_FACTOR = 235.214583;

  // Compute conversion result directly on render
  const numValue = parseFloat(inputValue);
  const isValidNumber = !isNaN(numValue) && numValue > 0;
  const convertedResult = isValidNumber ? (CONVERSION_FACTOR / numValue).toFixed(decimals) : '—';

  const inputUnit = mode === 'mpgToL100' ? 'MPG (US)' : 'L/100km';

  const triggerCelebration = (targetElement?: HTMLElement | null) => {
    let originX = 0.5;
    let originY = 0.45;

    const el = targetElement || inputRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = (rect.top + rect.height / 2) / window.innerHeight;
    }

    try {
      const flower1 = confetti.shapeFromText({ text: '🌸', scalar: 2.2 });
      const flower2 = confetti.shapeFromText({ text: '🌺', scalar: 2.2 });
      const flower3 = confetti.shapeFromText({ text: '🌼', scalar: 2.2 });
      const star1 = confetti.shapeFromText({ text: '⭐', scalar: 2.2 });
      const sparkle = confetti.shapeFromText({ text: '✨', scalar: 2.2 });

      // Flower petals & stars burst directly out of input box across the screen
      confetti({
        particleCount: 35,
        spread: 140,
        startVelocity: 45,
        origin: { x: originX, y: originY },
        shapes: [flower1, flower2, flower3, star1, sparkle],
        scalar: 1.8,
        ticks: 200,
        gravity: 0.6,
        drift: 0,
      });

      // Full screen confetti burst left & right
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 90,
        origin: { x: Math.max(0.1, originX - 0.2), y: Math.min(0.85, originY + 0.05) },
        colors: ['#ec4899', '#fbbf24', '#a855f7', '#34d399', '#f43f5e', '#3b82f6'],
        startVelocity: 40,
        ticks: 160,
      });

      confetti({
        particleCount: 40,
        angle: 120,
        spread: 90,
        origin: { x: Math.min(0.9, originX + 0.2), y: Math.min(0.85, originY + 0.05) },
        colors: ['#ec4899', '#fbbf24', '#a855f7', '#34d399', '#f43f5e', '#3b82f6'],
        startVelocity: 40,
        ticks: 160,
      });
    } catch {
      // Fallback
      confetti({
        particleCount: 60,
        spread: 120,
        origin: { x: originX, y: originY },
        colors: ['#ec4899', '#fbbf24', '#a855f7', '#34d399', '#f43f5e'],
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (!hasInteracted && val.trim() !== '') {
      setHasInteracted(true);
    }

    const parsed = parseFloat(val);
    if (val.trim() !== '' && !isNaN(parsed) && parsed > 0) {
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }
      celebrationTimeoutRef.current = setTimeout(() => {
        triggerCelebration(inputRef.current);
      }, 300);
    }
  };

  const handleTableSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTableSearch(val);

    if (val.trim() !== '') {
      if (tableCelebrationTimeoutRef.current) {
        clearTimeout(tableCelebrationTimeoutRef.current);
      }
      tableCelebrationTimeoutRef.current = setTimeout(() => {
        triggerCelebration(tableInputRef.current);
      }, 250);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setDecimals(2);
    setHasInteracted(false);
  };

  const handleCopyExplanation = () => {
    const formattedMpg = isValidNumber ? numValue.toFixed(decimals) : '1.00';
    const textToCopy = `What Does This Result Mean?\nYour car needs about ${convertedResult} liters of fuel to travel 100 kilometers. This is equal to ${formattedMpg} Miles Per Gallon (US).\n\nA lower Liters Per 100 Kilometers value means your car uses less fuel.\n\nA higher Miles Per Gallon value means your car can travel more miles using one gallon of fuel.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-start">
      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-50 w-full flex justify-center py-2 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/40 shadow-sm">
        <header className="max-w-2xl md:max-w-4xl lg:max-w-5xl w-[calc(100%-1.5rem)] rounded-xl bg-slate-950 text-white py-1.5 px-4 shadow-md border border-slate-800">
          <div className="flex items-center justify-center sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 relative overflow-hidden rounded-lg border border-emerald-700/60 bg-emerald-950 flex items-center justify-center shrink-0 shadow-sm">
                <Image
                  src={fuelPumpIcon}
                  alt="Fuel Pump"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="font-serif tracking-[0.15em] uppercase text-white flex items-baseline gap-1 select-none">
                  <span className="flex items-baseline">
                    <span className="text-lg font-extrabold text-white">F</span>
                    <span className="text-xs font-bold text-white tracking-[0.18em]">UEL</span>
                  </span>
                  <span className="flex items-baseline text-white ml-0.5">
                    <span className="text-lg font-black text-white">W</span>
                    <span className="text-xs font-bold italic text-white tracking-[0.2em]">ISE</span>
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Subtitle below header */}
      <p className="text-center text-sm font-bold text-slate-700 tracking-wide mt-2.5 px-4 select-none">
        MPG to L/100km Converter Fast Calculator
      </p>

      {/* Description text */}
      <p className="text-center text-xs sm:text-sm text-slate-500 max-w-lg md:max-w-2xl mt-2 px-4 leading-relaxed">
        Free and easy-to-use MPG to L/100km converter. Instantly convert US Miles Per Gallon to Liters per 100km. Includes conversion tables and formulas.
      </p>

      {/* Main Tool Container */}
      <main className="w-full max-w-2xl md:max-w-3xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 md:pt-5 pb-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 py-3.5 px-5 sm:py-4 sm:px-6 md:py-4.5 md:px-7">
          
          {/* Direct Controls */}
          <div className="space-y-3.5">
            {/* Primary Input & Decimal Controls */}
            <div className="flex flex-nowrap items-start gap-1.5 sm:gap-4">
              <div className="space-y-1.5 min-w-0 flex-1">
                <label htmlFor="fuel-input" className="block text-xs sm:text-sm md:text-base font-semibold text-slate-700 truncate">
                  Enter {inputUnit}:
                </label>
                <div className="relative rounded-xl shadow-sm w-full">
                  <input
                    ref={inputRef}
                    id="fuel-input"
                    type="number"
                    step="any"
                    min="0"
                    placeholder={mode === 'mpgToL100' ? 'e.g. 1' : 'e.g. 7.84'}
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full min-w-0 text-base sm:text-xl md:text-2xl font-bold pl-2.5 sm:pl-4 py-1 sm:py-2 bg-slate-50 border-2 border-emerald-950/70 rounded-xl focus:outline-none focus:border-emerald-900 focus:bg-white text-slate-900 transition-all pr-[80px] sm:pr-28"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 sm:pr-4 flex items-center pointer-events-none text-[11px] sm:text-sm font-semibold text-slate-400">
                    {inputUnit}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 shrink-0">
                <label htmlFor="decimal-select" className="block text-xs sm:text-sm md:text-base font-semibold text-slate-700">
                  Digit
                </label>
                <select
                  id="decimal-select"
                  value={decimals}
                  onChange={(e) => setDecimals(Number(e.target.value))}
                  className="px-1.5 sm:px-4 py-1.5 sm:py-2 bg-slate-50 border-2 border-emerald-950/70 rounded-xl text-xs sm:text-sm md:text-base font-semibold text-slate-700 shadow-sm focus:outline-none focus:border-emerald-900 focus:bg-white cursor-pointer h-[38px] sm:h-[46px] md:h-[50px]"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Decimal' : 'Decimals'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 shrink-0">
                <span className="block text-xs sm:text-sm md:text-base font-semibold text-transparent select-none">
                  &nbsp;
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 sm:p-2.5 bg-slate-50 border-2 border-emerald-950/70 hover:border-emerald-900 hover:bg-emerald-50 text-slate-600 hover:text-emerald-900 rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer h-[38px] sm:h-[46px] md:h-[50px] w-[38px] sm:w-[46px] md:w-[50px]"
                  title="Reset to default"
                  aria-label="Reset values"
                >
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Formula / Dynamic Result Reference Banner matching Header Color */}
            <div className="flex justify-center pt-1">
              <div className="bg-emerald-950 text-white rounded-xl py-2 px-5 text-center font-bold text-sm sm:text-base border border-emerald-800/80 shadow-md">
                {isValidNumber ? `${numValue} MPG = ${convertedResult} L/100KM` : '1 MPG = 235.22 L/100KM'}
              </div>
            </div>

            {/* Dynamic Result Meaning / Explanation Section (Shown only when user enters/types MPG value) */}
            {hasInteracted && inputValue.trim() !== '' && isValidNumber && (
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 sm:p-4 space-y-2.5 text-left shadow-sm transition-all mt-2">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                    What Does This Result Mean?
                  </h3>
                  <button
                    type="button"
                    onClick={handleCopyExplanation}
                    className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/80 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 shrink-0"
                    title="Copy explanation"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span className="text-emerald-300 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <p>
                    Your car needs about <strong className="text-slate-900 font-bold">{convertedResult} liters of fuel</strong> to travel <strong className="text-slate-900 font-bold">100 kilometers</strong>. This is equal to <strong className="text-slate-900 font-bold">{numValue.toFixed(decimals)} Miles Per Gallon (US)</strong>.
                  </p>
                  <p>
                    A lower <strong className="text-slate-900 font-bold">Liters Per 100 Kilometers</strong> value means your car uses less fuel.
                  </p>
                  <p>
                    A higher <strong className="text-slate-900 font-bold">Miles Per Gallon</strong> value means your car can travel more miles using one gallon of fuel.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How to Convert Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 py-3.5 px-5 sm:py-4 sm:px-6 md:py-4.5 md:px-7 mt-3.5 sm:mt-4 text-left">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 border-b border-slate-200/80 pb-2 mb-2.5">
            How to Convert MPG to L/100KM?
          </h3>
          <div className="text-xs sm:text-sm text-slate-600 space-y-1.5 leading-relaxed">
            <p className="font-semibold text-slate-700">Conversion Factors:</p>
            <ul className="space-y-1 pl-1">
              <li className="flex items-center gap-2 text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span>1 mile = 1.609344 kilometers</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span>1 US gallon = 3.78541178 liters</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Formula Derivation Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 py-3.5 px-5 sm:py-4 sm:px-6 md:py-4.5 md:px-7 mt-3.5 sm:mt-4 text-left">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 border-b border-slate-200/80 pb-2 mb-2.5">
            Formula Derivation:
          </h3>
          <div className="text-xs sm:text-sm text-slate-600 space-y-1.5 leading-relaxed">
            <ul className="space-y-1 pl-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span><strong className="text-slate-700 font-semibold">Start with:</strong> MPG = Miles ÷ Gallon</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span><strong className="text-slate-700 font-semibold">Convert miles:</strong> 1.609344 km ÷ Gallon</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span><strong className="text-slate-700 font-semibold">Convert gallon:</strong> 1.609344 km ÷ 3.78541178 liters</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span><strong className="text-slate-700 font-semibold">Simplify:</strong> 2.35214583 liters/km</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span><strong className="text-slate-700 font-semibold">For 100km:</strong> 235.214583 liters/100km</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-slate-100 mt-2">
              <p className="font-semibold text-slate-800">Final Formula:</p>
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg py-1.5 px-3 mt-1 inline-block font-mono text-xs sm:text-sm font-bold text-emerald-950">
                L/100KM = 235.214583 ÷ MPG
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Examples Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 py-3.5 px-5 sm:py-4 sm:px-6 md:py-4.5 md:px-7 mt-3.5 sm:mt-4 text-left">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 border-b border-slate-200/80 pb-2 mb-3">
            Conversion Examples
          </h3>
          <div className="space-y-3 text-xs sm:text-sm">
            {/* Example 1 */}
            <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3 sm:p-3.5 space-y-1">
              <div className="font-bold text-slate-800">
                Example 1: 35 MPG Car
              </div>
              <div className="font-mono text-emerald-950 font-semibold bg-white border border-slate-200/60 rounded px-2 py-0.5 inline-block text-xs">
                Formula: 235.214583 ÷ 35 = 6.72 L/100KM
              </div>
              <div className="text-slate-600 pt-0.5">
                <strong className="text-slate-700">Meaning:</strong> This car will use 6.72 liters of fuel per 100km
              </div>
            </div>

            {/* Example 2 */}
            <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3 sm:p-3.5 space-y-1">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>Example 2: 50 MPG Car (Hybrid)</span>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Good Economy</span>
              </div>
              <div className="font-mono text-emerald-950 font-semibold bg-white border border-slate-200/60 rounded px-2 py-0.5 inline-block text-xs">
                Formula: 235.214583 ÷ 50 = 4.7 L/100KM
              </div>
              <div className="text-slate-600 pt-0.5">
                <strong className="text-slate-700">Meaning:</strong> Very good fuel economy!
              </div>
            </div>

            {/* Example 3 */}
            <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3 sm:p-3.5 space-y-1">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>Example 3: 20 MPG Car (SUV/Truck)</span>
                <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">High Consumption</span>
              </div>
              <div className="font-mono text-emerald-950 font-semibold bg-white border border-slate-200/60 rounded px-2 py-0.5 inline-block text-xs">
                Formula: 235.214583 ÷ 20 = 11.8 L/100KM
              </div>
              <div className="text-slate-600 pt-0.5">
                <strong className="text-slate-700">Meaning:</strong> Excessive fuel consumption
              </div>
            </div>
          </div>
        </div>

        {/* Miles Per Gallon (US) to L/100km Conversion Table (1 to 120) */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 py-3.5 px-5 sm:py-4 sm:px-6 md:py-4.5 md:px-7 mt-3.5 sm:mt-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-2.5 mb-3 gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              Miles Per Gallon (US) to L/100km Conversion Table
            </h3>
            <div className="relative w-full sm:w-48">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                ref={tableInputRef}
                type="text"
                placeholder="Search MPG..."
                value={tableSearch}
                onChange={handleTableSearchChange}
                className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto border border-slate-200/80 rounded-xl shadow-inner scrollbar-thin">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold border-b border-slate-200 shadow-sm z-10">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4">MPG</th>
                  <th className="py-2.5 px-3 sm:px-4">L/100KM</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(() => {
                  const query = tableSearch.trim();
                  const allMpgs = Array.from({ length: 120 }, (_, i) => i + 1);
                  let filteredMpgs = allMpgs;
                  
                  if (query) {
                    const exactMatch = allMpgs.filter((mpg) => mpg.toString() === query);
                    filteredMpgs = exactMatch.length > 0
                      ? exactMatch
                      : allMpgs.filter((mpg) => mpg.toString().includes(query));
                  }

                  if (filteredMpgs.length === 0) {
                    return (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-slate-400 text-xs sm:text-sm italic">
                          No matching MPG found for &quot;{tableSearch}&quot;
                        </td>
                      </tr>
                    );
                  }

                  return filteredMpgs.map((mpg) => {
                    const l100 = (235.214583 / mpg).toFixed(2);
                    let meaningText = 'Hybrid Class';
                    let meaningColor = 'bg-emerald-100 text-emerald-800 border border-emerald-200';

                    if (mpg <= 2) {
                      meaningText = 'Extremely Poor';
                      meaningColor = 'bg-rose-100 text-rose-800 border border-rose-200';
                    } else if (mpg <= 10) {
                      meaningText = 'Very Poor';
                      meaningColor = 'bg-red-100 text-red-800 border border-red-200';
                    } else if (mpg <= 15) {
                      meaningText = 'Poor';
                      meaningColor = 'bg-amber-100 text-amber-800 border border-amber-200';
                    } else if (mpg <= 20) {
                      meaningText = 'Average';
                      meaningColor = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
                    } else if (mpg <= 27) {
                      meaningText = 'Good';
                      meaningColor = 'bg-blue-100 text-blue-800 border border-blue-200';
                    } else if (mpg <= 33) {
                      meaningText = 'Very Good';
                      meaningColor = 'bg-teal-100 text-teal-800 border border-teal-200';
                    } else if (mpg <= 41) {
                      meaningText = 'Excellent';
                      meaningColor = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
                    } else if (mpg <= 46) {
                      meaningText = 'Very Good';
                      meaningColor = 'bg-teal-100 text-teal-800 border border-teal-200';
                    }

                    const isSearching = query !== '';

                    return (
                      <tr
                        key={mpg}
                        className={`transition-colors ${
                          isSearching
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className={`py-2.5 px-3 sm:px-4 font-bold ${isSearching ? 'text-white' : 'text-slate-900'}`}>{mpg}</td>
                        <td className={`py-2.5 px-3 sm:px-4 font-mono font-semibold ${isSearching ? 'text-emerald-50' : 'text-emerald-950'}`}>{l100} L/100KM</td>
                        <td className="py-2.5 px-3 sm:px-4 text-right">
                          <span className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full ${isSearching ? 'bg-white text-emerald-900 font-bold shadow-xs' : meaningColor}`}>
                            {meaningText}
                          </span>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Improve Your MPG Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 py-4 px-5 sm:py-4.5 sm:px-6 md:py-5 md:px-7 mt-3.5 sm:mt-4 text-left">
          <div className="border-b border-slate-200/80 pb-2.5 mb-3.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                ✓
              </span>
              How to Improve Your MPG?
            </h3>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
            {[
              'Regular maintenance',
              'Proper tire pressure',
              'Reduce excess weight',
              'Smooth acceleration',
              'Highway driving (better than city)',
              'Avoid idling',
              'Use cruise control',
            ].map((tip, index) => (
              <li
                key={index}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/60 hover:border-emerald-200/60 transition-colors"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold shrink-0 shadow-xs">
                  ✓
                </span>
                <span className="text-slate-800">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Other Fuel Converters Card (Static) */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 py-4 px-5 sm:py-4.5 sm:px-6 md:py-5 md:px-7 mt-3.5 sm:mt-4 text-left">
          <div className="border-b border-slate-200/80 pb-2.5 mb-3.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                🔗
              </span>
              Other Fuel Converters
            </h3>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold select-none cursor-default">
              <Link2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>L/100KM to MPG US</span>
            </div>
          </div>
        </div>

        {/* Helpful Resources Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 py-4 px-5 sm:py-4.5 sm:px-6 md:py-5 md:px-7 mt-3.5 sm:mt-4 text-left">
          <div className="border-b border-slate-200/80 pb-2.5 mb-3.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                📚
              </span>
              Helpful Resources
            </h3>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
            {[
              'EPA Fuel Economy Information',
              'FuelEconomy.gov - US Government',
              'Car Fuel Economy Ratings',
              'Green Driving Tips',
            ].map((resource, index) => (
              <li
                key={index}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/60 hover:border-emerald-200/60 transition-colors cursor-default"
              >
                <span className="text-base shrink-0">📚</span>
                <span className="text-slate-800 font-medium">{resource}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Compact 2-Column Desktop FAQ Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 py-4 px-5 sm:py-4.5 sm:px-6 md:py-5 md:px-7 mt-3.5 sm:mt-4 text-left">
          <div className="border-b border-slate-200/80 pb-2.5 mb-3.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">
                ❓
              </span>
              <span>MPG (US) to L/100km Frequently Asked Questions</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {[
              {
                q: 'What is MPG (US)?',
                a: 'MPG (US) stands for Miles Per Gallon (US). It shows how many miles a vehicle can travel using one US gallon of fuel.',
              },
              {
                q: 'What is L/100km?',
                a: 'L/100km stands for Liters Per 100 Kilometers. It shows how many liters of fuel a vehicle uses to travel 100 kilometers.',
              },
              {
                q: 'How do I convert MPG (US) to L/100km?',
                a: 'Use the following formula: L/100km = 235.214583 ÷ MPG (US)',
              },
              {
                q: 'What is considered a good MPG (US)?',
                a: 'For most vehicles, 25–30 MPG is considered average. A fuel economy of 40 MPG or higher is generally considered excellent.',
              },
              {
                q: 'Why do many countries use L/100km instead of MPG?',
                a: 'Most countries use the metric system, so fuel consumption is measured in Liters Per 100 Kilometers (L/100km) instead of miles per gallon.',
              },
              {
                q: 'Is this MPG (US) to L/100km converter accurate?',
                a: 'Yes. This converter uses the official conversion factor of 235.214583, providing accurate and reliable results.',
              },
              {
                q: 'What is the difference between MPG (US) and MPG (UK)?',
                a: 'A US gallon equals 3.785 liters, while a UK (Imperial) gallon equals 4.546 liters. Because the UK gallon is larger, the same vehicle will have a higher MPG (UK) value than MPG (US).',
              },
              {
                q: 'Does a lower L/100km value mean better fuel efficiency?',
                a: 'Yes. A lower L/100km value means the vehicle uses less fuel to travel 100 kilometers, resulting in better fuel efficiency and lower fuel costs.',
              },
              {
                q: 'Can I use this converter for petrol, diesel, and hybrid vehicles?',
                a: 'Yes. This converter works for petrol, diesel, hybrid, and other fuel-powered vehicles because it converts measurement units, not fuel types.',
              },
              {
                q: 'Can I enter decimal values in this converter?',
                a: 'Yes. You can enter both whole numbers and decimal values. The converter instantly calculates the result using your selected decimal precision.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300/80 transition-colors flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-xs md:text-xs lg:text-sm mb-1 flex items-start gap-1.5 leading-snug">
                    <span className="text-emerald-700 font-extrabold text-[10px] shrink-0 bg-emerald-100 px-1.5 py-0.5 rounded mt-0.5">
                      Q
                    </span>
                    <span>{item.q}</span>
                  </h4>
                  <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed pl-5">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Footer */}
        <footer className="mt-6 pt-6 border-t border-slate-200/80 text-center text-xs text-slate-500 pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-slate-200">
              <Image
                src={fuelPumpIcon}
                alt="Fuel Pump"
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-slate-700 text-sm">FuelWise</span>
          </div>

          <p className="mb-3">© 2026 FuelWise. All rights reserved.</p>

          <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1.5 text-slate-600 font-medium text-xs">
            <span className="hover:text-emerald-700 transition-colors cursor-pointer">Privacy Policy and Cookies</span>
            <span>•</span>
            <span
              onClick={openAboutModal}
              className="hover:text-emerald-700 transition-colors cursor-pointer text-slate-700 font-semibold"
            >
              About Us
            </span>
            <span>•</span>
            <span
              onClick={openContactModal}
              className="hover:text-emerald-700 transition-colors cursor-pointer text-emerald-600 font-semibold underline underline-offset-2"
            >
              Contact Us
            </span>
            <span>•</span>
            <button
              onClick={openEmbedModal}
              className="hover:text-emerald-800 transition-all cursor-pointer text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200/80 active:scale-95"
            >
              <Code2 className="w-3.5 h-3.5" />
              Embed Widget
            </button>
            <span>•</span>
            <span className="hover:text-emerald-700 transition-colors cursor-pointer">Sitemap</span>
          </div>
        </footer>
      </main>

      {/* Contact Us Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-start sm:items-center p-3 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget && Date.now() - contactModalOpenTime.current > 350) {
              setShowContactModal(false);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 sm:p-6 text-left relative animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Contact Us</h3>
                  <p className="text-xs text-slate-500">We&apos;d love to hear your thoughts</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed overflow-y-auto pr-1">
              <p>
                We are listening to you. Your feedbacks are very important for us to improve our mpg converter.
              </p>
              <p>
                We like to hear from you, please send your feedbacks and contact us at{' '}
                <a
                  href="mailto:infofuelwise@gmail.com"
                  className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800 transition-colors"
                >
                  infofuelwise@gmail.com
                </a>
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-end shrink-0 pt-2">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Us Modal */}
      {showAboutModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-start sm:items-center p-3 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget && Date.now() - aboutModalOpenTime.current > 350) {
              setShowAboutModal(false);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 sm:p-6 text-left relative animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">About Us</h3>
                  <p className="text-xs text-slate-500">Learn more about FuelWise</p>
                </div>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed overflow-y-auto pr-1">
              <p>
                <strong>FuelWise</strong> is a focused, high-precision fuel economy conversion utility engineered for instant conversion between US MPG (Miles Per Gallon) and L/100km (Liters Per 100 Kilometers).
              </p>
              <p>
                Our tool empowers drivers, automotive enthusiasts, and international commuters to calculate fuel efficiency with instant precision, customizable decimal display, and real-time comparison metrics.
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-end shrink-0 pt-2">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embed Widget Modal */}
      {showEmbedModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-start sm:items-center p-3 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget && Date.now() - embedModalOpenTime.current > 350) {
              setShowEmbedModal(false);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 text-left relative animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Embed Calculator Widget</h3>
                  <p className="text-xs text-slate-500">Add FuelWise converter to your site or blog</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed overflow-y-auto pr-1">
              <p>
                Here is a live preview of how the widget will appear on external websites, followed by the HTML embed code:
              </p>

              {/* Live Preview Window */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                <div className="bg-slate-200 px-3 py-1.5 flex items-center justify-between border-b border-slate-300/70">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                    <span className="text-[11px] font-semibold text-slate-600 ml-1.5">Live Widget Preview</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">fuelwise.app</span>
                </div>
                <div className="p-2 sm:p-3 bg-slate-50 flex justify-center max-h-[280px] overflow-y-auto">
                  <div className="w-full max-w-[420px] bg-white rounded-xl shadow border border-slate-200/90 p-3.5">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                      <div className="w-6 h-6 rounded bg-emerald-950 text-white flex items-center justify-center font-bold text-xs">
                        ⛽
                      </div>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">FuelWise MPG Converter</span>
                    </div>
                    <div className="bg-emerald-950 text-white p-3 rounded-lg text-center mb-2">
                      <div className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">Live Conversion</div>
                      <div className="text-xl font-bold font-mono text-emerald-100 my-0.5">25 MPG = 9.41 L/100km</div>
                      <div className="text-[10px] text-emerald-400">Rating: Efficient</div>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 mt-2">
                      Powered by <span className="text-emerald-700 font-semibold underline">FuelWise</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">HTML Embed Code:</label>
                <div className="relative bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner group">
                  <pre className="whitespace-pre-wrap break-all pr-12 text-emerald-300">
                    {`<iframe src="${typeof window !== 'undefined' ? window.location.origin : 'https://fuelwise.app'}" width="100%" height="460" frameborder="0" style="border:0; border-radius:12px; max-width:480px; width:100%; min-height:460px;" title="FuelWise MPG to L/100km Converter"></iframe>\n<p style="font-size:11px; text-align:center; font-family:sans-serif; margin-top:4px;"><a href="${typeof window !== 'undefined' ? window.location.origin : 'https://fuelwise.app'}" target="_blank" rel="noopener">Powered by FuelWise MPG Converter</a></p>`}
                  </pre>
                  <button
                    onClick={handleCopyEmbed}
                    className={`absolute top-2.5 right-2.5 px-2.5 py-1.5 rounded-lg font-sans font-semibold text-xs transition-all flex items-center gap-1 shadow-sm ${
                      copiedEmbed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-700 hover:bg-emerald-600 text-white active:scale-95'
                    }`}
                  >
                    {copiedEmbed ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-emerald-900 text-xs flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ✓
                </div>
                <span>
                  <strong>SEO Benefit:</strong> This widget automatically includes a clean powered-by backlink to FuelWise for your reference.
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-5 flex justify-between items-center shrink-0 pt-2 border-t border-slate-100">
              <button
                onClick={handleCopyEmbed}
                className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm ${
                  copiedEmbed
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95'
                }`}
              >
                {copiedEmbed ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Embed Code
                  </>
                )}
              </button>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
