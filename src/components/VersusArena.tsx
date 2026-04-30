'use client';

import { useState, useEffect, useRef } from "react";
import { Search, Swords, Flame, Battery, Crosshair, Cpu, Trophy, Loader2, AlertTriangle } from "lucide-react";
import { runVersusBenchmark } from "@/actions/versus";

export default function VersusArena() {
  const [deviceA, setDeviceA] = useState("");
  const [deviceB, setDeviceB] = useState("");
  const [priority, setPriority] = useState("Sustained FPS & Gaming");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // Autocomplete State
  const [suggestionsA, setSuggestionsA] = useState<{name: string}[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<{name: string}[]>([]);
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdownA(false);
        setShowDropdownB(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string, setSuggestions: any) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchSuggestions(deviceA, setSuggestionsA), 300);
    return () => clearTimeout(timeoutId);
  }, [deviceA]);

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchSuggestions(deviceB, setSuggestionsB), 300);
    return () => clearTimeout(timeoutId);
  }, [deviceB]);

  const priorities = [
    { label: "Gaming", value: "Sustained FPS & Gaming", icon: <Crosshair size={16} /> },
    { label: "Thermals", value: "Cooling & Thermal Throttling", icon: <Flame size={16} /> },
    { label: "Battery", value: "Battery Drain under Load", icon: <Battery size={16} /> },
    { label: "Speed", value: "Raw Processing Speed", icon: <Cpu size={16} /> },
  ];

  const handleBenchmark = async () => {
    if (!deviceA || !deviceB) {
      setError("Please enter two devices to compare.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await runVersusBenchmark(deviceA, deviceB, priority);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "AI Benchmark failed. Please check your terminal for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-zinc-950 border border-zinc-900 p-6 md:p-12 relative overflow-hidden" ref={wrapperRef}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <Swords className="text-red-500 mx-auto mb-4" size={48} />
        <h2 className="text-3xl md:text-4xl font-black uppercase mb-2">The AI Versus Arena</h2>
        <p className="text-zinc-400 mb-8">Ask our AI to benchmark full spec sheets head-to-head.</p>
        
        {/* Priority Tabs */}
        <div className="flex justify-center gap-2 flex-wrap mb-6">
          {priorities.map((p) => (
            <button
              key={p.label}
              onClick={() => setPriority(p.value)}
              className={`flex items-center gap-2 px-4 py-2 border text-sm font-bold uppercase transition ${
                priority === p.value ? "border-red-500 text-red-500 bg-red-500/10" : "border-zinc-800 text-zinc-500 hover:text-white"
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-zinc-900 p-4 border border-zinc-800 rounded-lg">
          
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              value={deviceA}
              onChange={(e) => {
                setDeviceA(e.target.value);
                setShowDropdownA(true);
              }}
              onFocus={() => setShowDropdownA(true)}
              placeholder="E.g., RedMagic 9 Pro" 
              className="w-full bg-black border border-zinc-800 p-4 pl-12 text-white outline-none focus:border-red-500 transition"
            />
            {showDropdownA && suggestionsA.length > 0 && (
              <ul className="absolute z-20 w-full bg-zinc-900 border border-zinc-800 mt-1 rounded-md shadow-2xl overflow-hidden text-left">
                {suggestionsA.map((item, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => { setDeviceA(item.name); setShowDropdownA(false); }}
                    className="p-3 text-sm text-zinc-300 hover:bg-red-600 hover:text-white cursor-pointer transition"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="w-12 h-12 shrink-0 bg-red-600 rounded-full flex items-center justify-center font-black italic shadow-[0_0_20px_rgba(220,38,38,0.4)] relative z-10">
            VS
          </div>
          
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              value={deviceB}
              onChange={(e) => {
                setDeviceB(e.target.value);
                setShowDropdownB(true);
              }}
              onFocus={() => setShowDropdownB(true)}
              placeholder="E.g., iPhone 15 Pro Max" 
              className="w-full bg-black border border-zinc-800 p-4 pl-12 text-white outline-none focus:border-red-500 transition"
            />
            {showDropdownB && suggestionsB.length > 0 && (
              <ul className="absolute z-20 w-full bg-zinc-900 border border-zinc-800 mt-1 rounded-md shadow-2xl overflow-hidden text-left">
                {suggestionsB.map((item, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => { setDeviceB(item.name); setShowDropdownB(false); }}
                    className="p-3 text-sm text-zinc-300 hover:bg-red-600 hover:text-white cursor-pointer transition"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* --- ERROR MESSAGE DISPLAY --- */}
        {error && (
          <div className="mt-6 flex items-center justify-center gap-2 text-red-500 font-bold bg-red-500/10 p-4 rounded border border-red-500/30">
            <AlertTriangle size={20} /> {error}
          </div>
        )}
        
        <button 
          onClick={handleBenchmark}
          disabled={loading}
          className="mt-6 bg-white text-black px-8 py-3 font-bold uppercase tracking-wider hover:bg-zinc-200 transition flex items-center justify-center mx-auto gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <><Loader2 className="animate-spin" size={20} /> Benchmarking...</> : "Run Benchmark"}
        </button>

        {/* AI Results Display */}
        {result && (
          <div className="mt-12 text-left bg-black border border-zinc-800 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-yellow-500" size={28} />
              <h3 className="text-2xl font-black uppercase text-yellow-500">Winner: {result.winner}</h3>
            </div>
            <p className="text-lg text-white font-medium mb-8 border-b border-zinc-800 pb-6">{result.shortVerdict}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-bold text-red-400 mb-4 border-l-2 border-red-500 pl-3">{deviceA || "Device A"} Pros</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  {result.deviceA_Pros?.map((pro: string, i: number) => <li key={i}>• {pro}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-400 mb-4 border-l-2 border-red-500 pl-3">{deviceB || "Device B"} Pros</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  {result.deviceB_Pros?.map((pro: string, i: number) => <li key={i}>• {pro}</li>)}
                </ul>
              </div>
            </div>

            <div className="space-y-6 text-sm">
              <div className="bg-zinc-900 p-4 border border-zinc-800">
                <span className="font-bold text-white block mb-1">Thermal Performance:</span>
                <span className="text-zinc-400">{result.thermalPerformance}</span>
              </div>
              <div className="bg-zinc-900 p-4 border border-zinc-800">
                <span className="font-bold text-white block mb-1">Gaming Performance:</span>
                <span className="text-zinc-400">{result.gamingPerformance}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}