import React, { useState, useEffect } from 'react';
import { 
  Microscope, Activity, Play, CheckCircle2, AlertTriangle, 
  Beaker, Dna, Atom, Wifi, Leaf, RotateCcw, 
  Code2, History, X, ChevronRight, Sparkles, Pill, 
  Plus, Trash2, Zap, Brain, TestTubes, Info 
} from 'lucide-react';
import { CodeViewer } from './components/CodeViewer';
import { PaperRenderer } from './components/PaperRenderer';
import { LiveSimulation } from './components/LiveSimulation';
import { CompoundSynthesizerModal } from './components/CompoundSynthesizerModal';
import { MultiTrialScreeningVisualizer, DEFAULT_MULTI_TRIAL_EXPERIMENT } from './components/MultiTrialScreeningVisualizer';
import { generateMultiTrialExperiment } from './services/multiTrialService';
import { runSimulation } from './services/geminiService';
import { AppState, ResearchResult, SimulationMode, ChemicalCompound, MultiTrialExperiment } from './types';

const SUGGESTIONS = [
  "Hodgkin-Huxley numerical action potential and synaptic plasticity under TrkB peptide agonist",
  "Dual GLP-1/GIP co-agonist peptide metabolic clearance and mitochondrial kinetics",
  "Blood-Brain Barrier permeability and NMDA receptor kinetics of synthetic neuroprotectant",
  "Michaelis-Menten enzymatic degradation of synthetic amyloid-beta clearing peptide",
  "Quantum entanglement stability in high-temperature superconductors"
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [mode, setMode] = useState<SimulationMode>(SimulationMode.CLOUD);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [showSynthesizer, setShowSynthesizer] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialExperiment, setTrialExperiment] = useState<MultiTrialExperiment>(DEFAULT_MULTI_TRIAL_EXPERIMENT);
  const [history, setHistory] = useState<ResearchResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [customCompounds, setCustomCompounds] = useState<ChemicalCompound[]>([]);

  // Load history and saved custom compounds from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('omniscience_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedCompounds = localStorage.getItem('omniscience_custom_compounds');
      if (savedCompounds) {
        setCustomCompounds(JSON.parse(savedCompounds));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveToHistory = (newResult: ResearchResult) => {
    setHistory(prev => {
      const updated = [newResult, ...prev.filter(p => p.title !== newResult.title)].slice(0, 8);
      try {
        localStorage.setItem('omniscience_history', JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const handleCompoundCreated = (compound: ChemicalCompound, autoSimulate: boolean = false) => {
    const updated = [compound, ...customCompounds.filter(c => c.name !== compound.name)];
    setCustomCompounds(updated);
    try {
      localStorage.setItem('omniscience_custom_compounds', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }

    if (autoSimulate) {
      const simPrompt = `In vivo pharmacological simulation of ${compound.name} (${compound.isPeptide ? 'Peptide' : 'Medicine'}): evaluate ${compound.role}, receptor binding kinetics (${compound.targetReceptors?.join(', ') || 'target'}), and synaptic/physiological response.`;
      setPrompt(simPrompt);
      // Trigger simulation immediately
      setTimeout(() => {
        executeSimulationWithPrompt(simPrompt, updated);
      }, 100);
    }
  };

  const removeCompound = (name: string) => {
    const updated = customCompounds.filter(c => c.name !== name);
    setCustomCompounds(updated);
    try {
      localStorage.setItem('omniscience_custom_compounds', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleOpenTrialLab = () => {
    const topicToUse = prompt.trim() || "Neurodegenerative Cognitive Restoration & Synaptic Plasticity";
    const exp = generateMultiTrialExperiment(topicToUse, customCompounds[0]);
    setTrialExperiment(exp);
    setShowTrialModal(true);
  };

  const handleLaunchTrialsForCompound = (compound: ChemicalCompound) => {
    const topicToUse = compound.therapeuticIndication || compound.role || compound.name;
    const exp = generateMultiTrialExperiment(topicToUse, compound);
    setTrialExperiment(exp);
    setShowTrialModal(true);
  };

  const handleSelectWinnerForSimulation = (winningCompound: ChemicalCompound) => {
    setShowTrialModal(false);
    // Add winner to library
    const updated = [winningCompound, ...customCompounds.filter(c => c.name !== winningCompound.name)];
    setCustomCompounds(updated);
    try {
      localStorage.setItem('omniscience_custom_compounds', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }

    const simPrompt = `Clinical trial evaluation of optimized lead candidate ${winningCompound.name} (${winningCompound.isPeptide ? 'Peptide' : 'Small Molecule Medicine'}): verify sub-nanomolar affinity (${winningCompound.bindingAffinity || 'KD < 1 nM'}), zero hERG cardiotoxicity, metabolic residence half-life (${winningCompound.halfLife || '14h'}), and blood-brain barrier neuroprotection.`;
    setPrompt(simPrompt);

    setTimeout(() => {
      executeSimulationWithPrompt(simPrompt, updated);
    }, 150);
  };

  const executeSimulationWithPrompt = async (targetPrompt: string, compoundsToUse = customCompounds) => {
    if (!targetPrompt.trim()) return;

    setState(AppState.SIMULATING);
    setErrorMsg('');

    try {
      const data = await runSimulation(targetPrompt, mode, compoundsToUse);
      setResult(data);
      saveToHistory(data);
      setState(AppState.COMPLETE);
    } catch (e: any) {
      console.error("Simulation error:", e);
      setErrorMsg(e?.message || "Simulation execution encountered an unexpected issue.");
      setState(AppState.ERROR);
    }
  };

  const handleSimulate = async () => {
    await executeSimulationWithPrompt(prompt);
  };

  const handleReset = () => {
    setState(AppState.IDLE);
    setResult(null);
    setErrorMsg('');
  };

  const loadPastExperiment = (item: ResearchResult) => {
    setResult(item);
    setPrompt(item.configUsed.topic);
    setState(AppState.COMPLETE);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans print:bg-white relative">
      
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none print:hidden overflow-hidden">
         <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-50/50 to-transparent"></div>
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100/70 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/70 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-40 print:hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div 
            onClick={handleReset}
            className="flex items-center space-x-3 text-indigo-600 cursor-pointer group"
          >
            <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm group-hover:scale-105 transition-transform">
               <Atom size={22} className="animate-spin-slow text-indigo-600" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                OmniScience<span className="text-indigo-600">.AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">
                Neuro & Bio Lab v2.6
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-semibold text-slate-600">
            {/* Multi-Trial Screening Lab Button */}
            <button
              onClick={handleOpenTrialLab}
              className="bg-amber-500 hover:bg-amber-600 text-white px-3 sm:px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 font-bold hover:shadow"
              title="Run 5-stage sequential screening trials to identify the winning lead compound"
            >
              <TestTubes size={14} />
              <span>Multi-Trial Lab</span>
            </button>

            {/* Synthesizer Button */}
            <button
              onClick={() => setShowSynthesizer(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 font-bold hover:shadow"
              title="Design novel medicines, peptides, and chemical compounds"
            >
              <Pill size={14} />
              <span>Synthesize Medicine / Peptide</span>
            </button>

            <button 
              onClick={() => setShowCodeViewer(true)}
              className="hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200"
              title="Inspect Simulation Engine Code"
            >
              <Code2 size={15} />
              <span className="hidden md:inline">Kernel</span>
            </button>

            {history.length > 0 && (
              <button 
                onClick={() => setShowHistory(true)}
                className="hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200"
                title="View Past Simulation Reports"
              >
                <History size={15} />
                <span className="hidden md:inline">History ({history.length})</span>
              </button>
            )}

            {state === AppState.COMPLETE && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold transition-all border border-indigo-200"
              >
                <RotateCcw size={14} />
                <span>New Run</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-8 print:p-0 print:block relative z-10">
        
        {/* Left Panel: Input & Simulation Controls */}
        <div className={`flex flex-col gap-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] print:hidden ${state === AppState.COMPLETE ? 'md:w-1/3' : 'md:w-1/2 mx-auto'}`}>
          
          {/* Input Section */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/70 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
               <h2 className="text-base md:text-lg font-bold flex items-center text-slate-800 tracking-tight">
                 <Activity className="mr-2 text-indigo-500" size={18} />
                 Experiment Setup
               </h2>
               
               {/* Mode Switcher */}
               <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200/60 self-start sm:self-auto">
                 <button 
                   onClick={() => setMode(SimulationMode.LOCAL)}
                   disabled={state === AppState.SIMULATING}
                   className={`flex items-center px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mode === SimulationMode.LOCAL ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   <Leaf size={12} className="mr-1.5" /> Edge
                 </button>
                 <button 
                   onClick={() => setMode(SimulationMode.CLOUD)}
                   disabled={state === AppState.SIMULATING}
                   className={`flex items-center px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mode === SimulationMode.CLOUD ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   <Wifi size={12} className="mr-1.5" /> Cloud AI
                 </button>
               </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Hypothesis / Target Phenomenon
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Simulate action potential firing velocity and synaptogenesis in hippocampal neurons under peptide modulation'"
                    className="relative w-full h-32 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none font-mono text-sm shadow-inner transition-all text-slate-700 disabled:opacity-50 disabled:bg-slate-50"
                    disabled={state === AppState.SIMULATING}
                  />
                </div>
              </div>

              {/* Active Custom Synthesized Compounds / Peptides Tray */}
              {customCompounds.length > 0 && (
                <div className="bg-slate-50 border border-indigo-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                      <TestTubes size={12} className="text-indigo-600" />
                      Active Lab Ligands & Peptides ({customCompounds.length})
                    </span>
                    <button
                      onClick={() => setCustomCompounds([])}
                      className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors"
                      title="Clear custom library"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {customCompounds.map((comp, idx) => (
                      <div 
                        key={idx}
                        className="bg-white p-2 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs group"
                      >
                        <div className="truncate mr-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              comp.isPeptide 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            }`}>
                              {comp.isPeptide ? 'Peptide' : 'Medicine'}
                            </span>
                            <span className="font-bold text-slate-800 truncate">{comp.name}</span>
                          </div>
                          {comp.targetReceptors && comp.targetReceptors.length > 0 && (
                            <span className="text-[10px] text-slate-400 truncate block">
                              Targets: {comp.targetReceptors.join(', ')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              const testP = `Simulate physiological & synaptic transmission of ${comp.name} (${comp.isPeptide ? 'Bioactive peptide' : 'Medicine'}) in cortical and cellular targets`;
                              setPrompt(testP);
                            }}
                            className="text-[10px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-0.5 rounded font-semibold transition-colors"
                            title="Set prompt to test this molecule"
                          >
                            Use
                          </button>
                          <button
                            onClick={() => removeCompound(comp.name)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
                 <span>Compute Pipeline:</span>
                 <span className={`font-mono font-bold px-2 py-0.5 rounded-md text-[11px] ${mode === SimulationMode.LOCAL ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                   {mode === SimulationMode.LOCAL ? 'Zero-Token Edge Diffusion' : 'Gemini 3.8 Flash Causal Engine'}
                 </span>
              </div>

              {/* Suggestions */}
              {state !== AppState.SIMULATING && (
                 <div className="space-y-1.5 pt-1">
                   <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Biological & Neuroscience Topics:</div>
                   <div className="flex flex-wrap gap-1.5">
                     {SUGGESTIONS.map((s, idx) => (
                       <button 
                          key={idx} 
                          onClick={() => setPrompt(s)}
                          className="text-[11px] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 hover:border-indigo-200 text-slate-600 px-2.5 py-1 rounded-lg transition-all text-left truncate max-w-full"
                        >
                          {s}
                       </button>
                     ))}
                   </div>
                 </div>
              )}

              {/* Run Button */}
              <button
                onClick={handleSimulate}
                disabled={state === AppState.SIMULATING || !prompt.trim()}
                className={`relative w-full py-3.5 px-4 rounded-xl font-bold text-white flex items-center justify-center space-x-2 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] overflow-hidden group ${
                  state === AppState.SIMULATING 
                    ? 'bg-slate-800 cursor-not-allowed shadow-none' 
                    : mode === SimulationMode.LOCAL ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {state === AppState.SIMULATING ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                    <span className="tracking-wide text-sm">Simulating Physical & Biological Model...</span>
                  </>
                ) : (
                  <>
                    <Play size={16} fill="currentColor" />
                    <span className="tracking-wide text-sm">Run {mode === SimulationMode.LOCAL ? 'Edge' : 'Cloud'} Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Visualizer during Simulation */}
          {state === AppState.SIMULATING && (
             <LiveSimulation mode={mode} topic={prompt} />
          )}

          {/* Error Message Box if simulation fails */}
          {state === AppState.ERROR && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-900 animate-in fade-in duration-300">
               <div className="flex items-center space-x-2 font-bold mb-2 text-red-700">
                  <AlertTriangle size={18} />
                  <span>Simulation Interrupted</span>
               </div>
               <p className="text-xs text-red-600 mb-4">{errorMsg}</p>
               <button 
                 onClick={handleSimulate}
                 className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors"
               >
                 Retry Experiment
               </button>
            </div>
          )}

        </div>

        {/* Right Panel: Results (Academic Paper Report) */}
        {state === AppState.COMPLETE && result && (
          <div className="md:w-2/3 animate-in fade-in slide-in-from-right-8 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] print:w-full print:animate-none">
            <PaperRenderer data={result} />
          </div>
        )}

        {/* Empty State for Right Panel */}
        {state !== AppState.COMPLETE && (
          <div className={`hidden md:flex ${state === AppState.COMPLETE ? 'w-0 opacity-0' : 'w-1/2 opacity-100'} transition-all duration-700 ease-in-out flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200/80 rounded-2xl m-4 bg-slate-50/50 print:hidden relative overflow-hidden`}>
             <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
             <div className="relative z-10 flex flex-col items-center p-8 text-center max-w-md">
                 <div className="p-5 bg-white rounded-2xl mb-6 shadow-sm border border-slate-100 relative">
                    <div className="absolute -inset-4 bg-indigo-100 rounded-full opacity-20 blur-xl"></div>
                    <Brain size={48} className="text-indigo-400 relative z-10" />
                 </div>
                 <h3 className="text-slate-800 font-bold text-xl mb-2 tracking-tight">Neuroscience & Molecular Lab</h3>
                 <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Enter any scientific hypothesis or synthesize new medicines & therapeutic peptides. The engine calculates Hodgkin-Huxley numerical ODEs, Blood-Brain Barrier kinetics, and generates peer-reviewed research papers.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left">
                    <div 
                      onClick={() => setShowSynthesizer(true)}
                      className="p-3 bg-white hover:bg-indigo-50/50 cursor-pointer rounded-xl border border-slate-200/80 shadow-xs transition-colors group"
                    >
                       <div className="text-[10px] font-bold uppercase text-indigo-600 mb-1 flex items-center gap-1 group-hover:text-indigo-800">
                          <Pill size={11} /> Peptide & Medicine Studio
                       </div>
                       <p className="text-[11px] text-slate-500">Synthesize novel ligands with SMILES, LogP, and BBB permeability.</p>
                    </div>
                    <div 
                      onClick={handleOpenTrialLab}
                      className="p-3 bg-white hover:bg-amber-50/50 cursor-pointer rounded-xl border border-amber-200/80 shadow-xs transition-colors group"
                    >
                       <div className="text-[10px] font-bold uppercase text-amber-600 mb-1 flex items-center gap-1 group-hover:text-amber-800">
                          <TestTubes size={11} /> Multi-Trial Screening
                       </div>
                       <p className="text-[11px] text-slate-500">5 sequential clinical trials to eliminate cardiotoxicity and find The Right One.</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                       <div className="text-[10px] font-bold uppercase text-purple-600 mb-1 flex items-center gap-1">
                          <Activity size={11} /> Numerical Biophysics
                       </div>
                       <p className="text-[11px] text-slate-500">Runge-Kutta 4th Order numerical differential equations.</p>
                    </div>
                 </div>
             </div>
          </div>
        )}

      </main>

      {/* Compound & Peptide Synthesizer Modal */}
      <CompoundSynthesizerModal
        isOpen={showSynthesizer}
        onClose={() => setShowSynthesizer(false)}
        onCompoundCreated={handleCompoundCreated}
        onLaunchTrials={handleLaunchTrialsForCompound}
      />

      {/* Multi-Trial Screening Lab Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] shadow-2xl border border-slate-300 flex flex-col overflow-hidden relative my-auto">
            {/* Modal Header */}
            <div className="p-4 md:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30">
                  <TestTubes size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Multi-Trial Drug &amp; Peptide Optimization Laboratory</h3>
                  <span className="text-[10px] text-slate-400 font-mono">5 Sequential Clinical Trials • Candidate Elimination &amp; Finding The Right One</span>
                </div>
              </div>
              <button 
                onClick={() => setShowTrialModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
              <MultiTrialScreeningVisualizer
                experiment={trialExperiment}
                onSelectCandidateForSimulation={handleSelectWinnerForSimulation}
                standalone={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Code Viewer Modal */}
      {showCodeViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full h-[600px] shadow-2xl border border-slate-800 flex flex-col overflow-hidden relative">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Code2 size={18} className="text-indigo-400" />
                <span className="font-bold text-sm">OmniScience Simulation Kernel v2.6</span>
              </div>
              <button 
                onClick={() => setShowCodeViewer(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-2">
              <CodeViewer />
            </div>
          </div>
        </div>
      )}

      {/* History Drawer Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[500px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <History size={18} className="text-indigo-600" />
                <span>Simulation History ({history.length})</span>
              </div>
              <button 
                onClick={() => setShowHistory(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {history.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => loadPastExperiment(item)}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="truncate mr-3">
                    <h4 className="font-bold text-xs text-slate-800 truncate group-hover:text-indigo-700">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.configUsed.topic}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
