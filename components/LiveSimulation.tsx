
import React, { useEffect, useState, useRef } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Terminal, Cpu, Scan, User, Dna, Zap, ArrowRight, BarChart3, ShieldCheck, FileCheck, Waves, Box, Lock } from 'lucide-react';
import { Point, SimulationMode } from '../types';

interface LiveSimulationProps {
  mode: SimulationMode;
  topic: string;
}

interface AgentStats {
  id: string;
  genome: string;
  energy: number;
  state: string;
  velocity: number;
}

const generateInitialParticles = (count: number): Point[] => {
  return Array.from({ length: count }).map((_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    id: `AG-${1000 + i}`,
    meta: Math.random() > 0.5 ? 'Active' : 'Dormant'
  }));
};

const getRandomHash = () => "0x" + Math.floor(Math.random() * 16777215).toString(16).padEnd(6, '0');

export const LiveSimulation: React.FC<LiveSimulationProps> = ({ mode, topic }) => {
  const [particles, setParticles] = useState<Point[]>(generateInitialParticles(50));
  const [logs, setLogs] = useState<{time: string, hash: string, msg: string}[]>([]);
  const [trackedAgent, setTrackedAgent] = useState<AgentStats | null>(null);
  const [activeTab, setActiveTab] = useState<'logs' | 'benchmarks'>('logs');
  const [viewMode, setViewMode] = useState<'AGENTS' | 'QUBIT'>('AGENTS');
  const [qubitPhase, setQubitPhase] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Particle Diffusion Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: Math.max(0, Math.min(100, p.x + (Math.random() - 0.5) * 5)),
        y: Math.max(0, Math.min(100, p.y + (Math.random() - 0.5) * 5)),
      })));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Qubit Phase Animation
  useEffect(() => {
    let frameId: number;
    const animate = () => {
        setQubitPhase(p => p + 0.05);
        frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Agent Tracking & Stats Update
  useEffect(() => {
    if (!trackedAgent && particles.length > 0) {
      setTrackedAgent({
        id: particles[0].id || 'AG-000',
        genome: 'AAT-GCG-TTA',
        energy: 85,
        state: 'IDLE',
        velocity: 0.5
      });
    }

    const interval = setInterval(() => {
      setTrackedAgent(prev => {
        if (!prev) return null;
        return {
          ...prev,
          energy: Math.max(0, Math.min(100, prev.energy + (Math.random() - 0.6) * 5)),
          velocity: Math.abs(prev.velocity + (Math.random() - 0.5) * 0.1).toFixed(2) as unknown as number,
          state: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'METABOLIZING' : 'MOVING') : prev.state
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [particles]);

  // Agent Logs Effect with RECEIPTS
  useEffect(() => {
    const actions = [
      "metabolizing nutrient packet",
      "replicating sequence",
      "emitting signal",
      "colliding with barrier",
      "updating weight matrix",
      "diffusion step complete",
      "calculating gradient",
      "optimizing trajectory",
      "entangling qubit pair",
      "collapsing wave function",
      "verifying zero-knowledge proof",
      "generating diffusion token"
    ];

    const interval = setInterval(() => {
      const randomParticle = particles[Math.floor(Math.random() * particles.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const log = {
          time: new Date().toLocaleTimeString().split(' ')[0],
          hash: getRandomHash(),
          msg: `Kernel ${randomParticle.id.split('-')[1]}: ${randomAction}`
      };
      
      setLogs(prev => {
        const newLogs = [...prev, log];
        if (newLogs.length > 20) return newLogs.slice(newLogs.length - 20);
        return newLogs;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [particles]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, activeTab]);

  return (
    <div className="bg-[#0f172a] rounded-2xl overflow-hidden border border-slate-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row h-[500px] animate-in fade-in zoom-in-95 duration-500">
      
      {/* Visualizer Panel */}
      <div className="flex-1 p-6 flex flex-col border-r border-slate-800 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Activity className="animate-pulse" size={20} />
            <span className="font-mono text-sm font-bold tracking-widest text-emerald-300">LIVE SIMULATION ENV</span>
          </div>

          {/* View Toggle */}
          <div className="flex bg-slate-800/80 rounded-lg p-1 border border-slate-700 z-10 shadow-inner backdrop-blur-md">
                <button 
                  onClick={() => setViewMode('AGENTS')}
                  className={`flex items-center px-3 py-1 rounded text-[10px] font-bold tracking-wider transition-all ${viewMode === 'AGENTS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm' : 'text-slate-400 hover:text-white border border-transparent'}`}
                >
                  <Scan size={12} className="mr-1.5" /> AGENTS
                </button>
                <button 
                  onClick={() => setViewMode('QUBIT')}
                  className={`flex items-center px-3 py-1 rounded text-[10px] font-bold tracking-wider transition-all ${viewMode === 'QUBIT' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm' : 'text-slate-400 hover:text-white border border-transparent'}`}
                >
                  <Waves size={12} className="mr-1.5" /> QUBIT PROOF
                </button>
            </div>

          <div className="text-[10px] font-mono font-bold text-slate-500 hidden md:block px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700/50">
            {mode === SimulationMode.LOCAL ? 'LOCAL_KERNEL::ACTIVE' : 'CLOUD_CLUSTER::CONNECTED'}
          </div>
        </div>

        <div className="flex-1 bg-black/40 rounded-xl border border-slate-700/50 relative overflow-hidden group shadow-inner">
          <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(rgba(16,185,129,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.3)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
          
          {viewMode === 'AGENTS' ? (
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="number" dataKey="x" domain={[0, 100]} hide />
                <YAxis type="number" dataKey="y" domain={[0, 100]} hide />
                <Scatter name="Agents" data={particles} fill="#34d399">
                    {particles.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={entry.id === trackedAgent?.id ? '#f472b6' : (index % 2 === 0 ? '#10b981' : '#3b82f6')} 
                        stroke={entry.id === trackedAgent?.id ? '#fff' : 'none'}
                        strokeWidth={2}
                        className="transition-all duration-300 ease-in-out"
                    />
                    ))}
                </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
          ) : (
             // QUBIT PROOF VISUALIZATION
             <div className="relative w-full h-full p-4 flex items-center justify-center overflow-hidden">
                {/* Background Grid Interference */}
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0.5 opacity-30 pointer-events-none">
                   {Array.from({length: 144}).map((_, i) => {
                      const x = i % 12;
                      const y = Math.floor(i / 12);
                      const val = Math.sin(x * 0.4 + qubitPhase) * Math.cos(y * 0.4 + qubitPhase * 0.7);
                      return <div key={i} className="rounded-full transition-colors duration-1000" style={{backgroundColor: val > 0 ? '#6366f1' : '#ec4899', opacity: Math.abs(val)}} />
                   })}
                </div>
                
                {/* Central "Proof" Object */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                   <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                      <Box size={64} className="text-white/90 relative z-10 animate-[spin_10s_linear_infinite]" strokeWidth={1} />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899] animate-ping"></div>
                      </div>
                   </div>
                   <div className="mt-8 bg-slate-900/90 backdrop-blur px-4 py-2 rounded-full border border-indigo-500/30 flex items-center shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                      <Lock size={12} className="text-emerald-400 mr-2" />
                      <span className="font-mono text-[10px] text-indigo-200 tracking-wider">
                        ZK-PROOF: 0x{Math.floor(Math.abs(Math.sin(qubitPhase) * 10000000)).toString(16).toUpperCase()}...
                      </span>
                   </div>
                </div>
             </div>
          )}

          {/* Overlay Stats */}
          <div className="absolute bottom-4 left-4 font-mono text-[10px] text-emerald-500/80 pointer-events-none">
            {viewMode === 'AGENTS' ? (
                <>
                    <div>AGENTS: {particles.length}</div>
                    <div>T_STEP: {(performance.now() / 1000).toFixed(2)}s</div>
                    <div>ENTROPY: {(Math.random()).toFixed(4)}</div>
                </>
            ) : (
                <>
                    <div>QUBITS: 128 (Superposition)</div>
                    <div>COHERENCE: {(0.98 + Math.sin(qubitPhase) * 0.01).toFixed(6)}</div>
                    <div>DIFFUSION_RATE: 99.4%</div>
                </>
            )}
          </div>
        </div>

        {/* Individual Inspector Overlay (Only in Agents mode) */}
        {viewMode === 'AGENTS' && trackedAgent && (
           <div className="absolute top-20 right-8 w-48 bg-slate-800/90 backdrop-blur border border-slate-600 rounded-lg p-3 shadow-xl transform transition-all hover:scale-105 z-10">
              <div className="flex items-center text-xs font-bold text-pink-400 mb-2 pb-1 border-b border-slate-600">
                <Scan size={12} className="mr-1" /> TARGET: {trackedAgent.id}
              </div>
              <div className="space-y-2 font-mono text-[10px] text-slate-300">
                 <div className="flex justify-between">
                    <span className="flex items-center"><Dna size={10} className="mr-1 text-slate-500"/> GENOME</span>
                    <span className="text-pink-200">{trackedAgent.genome}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="flex items-center"><Zap size={10} className="mr-1 text-yellow-500"/> ENERGY</span>
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full mt-1">
                       <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${trackedAgent.energy}%`}}></div>
                    </div>
                 </div>
                 <div className="flex justify-between">
                    <span className="flex items-center"><Activity size={10} className="mr-1 text-blue-400"/> STATE</span>
                    <span>{trackedAgent.state}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="flex items-center"><ArrowRight size={10} className="mr-1 text-emerald-400"/> VELOCITY</span>
                    <span>{trackedAgent.velocity} m/s</span>
                 </div>
              </div>
           </div>
        )}
        
        <div className="mt-4 text-xs text-slate-400 font-mono text-center">
          Conducting experiment: "{topic.slice(0, 30)}..."
        </div>
      </div>

      {/* Terminal / Benchmarks Panel */}
      <div className="w-full md:w-80 bg-[#0d1117] flex flex-col font-mono text-xs border-l border-slate-800">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950">
          <button 
            onClick={() => setActiveTab('logs')}
            className={`flex-1 p-3 flex items-center justify-center space-x-2 transition-colors ${activeTab === 'logs' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Terminal size={14} />
            <span>TERMINAL</span>
          </button>
          <button 
            onClick={() => setActiveTab('benchmarks')}
            className={`flex-1 p-3 flex items-center justify-center space-x-2 transition-colors ${activeTab === 'benchmarks' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <BarChart3 size={14} />
            <span>BENCHMARK</span>
          </button>
        </div>

        {/* Content Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 text-slate-300 custom-scrollbar"
        >
          {activeTab === 'logs' ? (
            <>
               {logs.map((log, i) => (
                <div key={i} className="break-all border-l-2 border-slate-700 pl-2 opacity-90 hover:opacity-100 hover:bg-white/5 transition-colors group">
                  <div className="text-[9px] text-slate-500 flex items-center gap-2">
                    <span>{log.time}</span>
                    <span className="text-slate-600 group-hover:text-emerald-500 transition-colors">TX: {log.hash}</span>
                  </div>
                  <span className={log.msg.includes('Kernel') ? 'text-emerald-300' : (log.msg.includes('qubit') ? 'text-pink-300' : 'text-slate-300')}>
                    {log.msg}
                  </span>
                </div>
              ))}
              <div className="animate-pulse text-emerald-500">_</div>
            </>
          ) : (
            <div className="space-y-4 pt-2">
               {/* Live Validation Graphs */}
               <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-slate-400 flex items-center"><ShieldCheck size={12} className="mr-1 text-indigo-400"/> Model Fidelity</span>
                     <span className="text-emerald-400">99.2%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 animate-[width_2s_ease-in-out]" style={{width: '99%'}}></div>
                  </div>
               </div>

               <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-slate-400 flex items-center"><Cpu size={12} className="mr-1 text-blue-400"/> Compute Effic.</span>
                     <span className="text-blue-400">98%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 animate-[width_2s_ease-in-out]" style={{width: '98%'}}></div>
                  </div>
               </div>

               <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-slate-400 flex items-center"><Waves size={12} className="mr-1 text-purple-400"/> Qubit Coherence</span>
                     <span className="text-purple-400">99.9%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                     <div className="h-full bg-purple-500 animate-[width_2s_ease-in-out]" style={{width: '99.9%'}}></div>
                  </div>
               </div>

               <div className="mt-4 border-t border-slate-800 pt-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold mb-2">Verified Receipts</h4>
                  <div className="text-[9px] font-mono text-slate-600 bg-black p-2 rounded break-all">
                     0x{Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}
                  </div>
                  <div className="flex items-center text-[10px] text-emerald-600 mt-1">
                     <ShieldCheck size={10} className="mr-1" /> Signature Valid
                  </div>
               </div>
            </div>
          )}
        </div>

        {activeTab === 'logs' && (
          <div className="p-2 border-t border-slate-800 text-[10px] text-slate-600 bg-slate-950 flex justify-between">
            <span className="flex items-center"><Cpu size={10} className="mr-1"/> THREADS: 8</span>
            <span>MEM: 24MB</span>
          </div>
        )}
      </div>
    </div>
  );
};
