import React, { useState } from 'react';
import { ChemicalCompound } from '../types';
import { synthesizeCompound } from '../services/geminiService';
import { 
  Sparkles, Dna, Atom, Pill, TestTubes, Plus, 
  Check, ArrowRight, Loader2, X, Shield, Activity, 
  Zap, HeartPulse, Brain, Info
} from 'lucide-react';

interface CompoundSynthesizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompoundCreated: (compound: ChemicalCompound, autoSimulate?: boolean) => void;
  onLaunchTrials?: (compound: ChemicalCompound) => void;
}

const PRESET_INDICATIONS = [
  {
    title: "Dual GLP-1/TrkB Neurotrophic Peptide",
    type: "peptide",
    desc: "Long-acting incretin & neurotrophic receptor co-agonist for cognitive enhancement & metabolic health",
    scaffold: "Peptide Backbone (Linear/Cyclic)",
    target: "Targeting GLP-1R and TrkB (BDNF) receptors with endopeptidase resistance"
  },
  {
    title: "Selective NMDA NR2B Modulator (Neuroprotection)",
    type: "medicine",
    desc: "Subunit-selective negative allosteric modulator preventing glutamate excitotoxicity without dissociative side effects",
    scaffold: "Adamantane-Indole Hybrid",
    target: "NR2B GluN2B allosteric site to reduce post-ischemic neuronal death"
  },
  {
    title: "Angiogenic Repair Peptide (BPC-Analog)",
    type: "peptide",
    desc: "15-amino acid stable gastric pentadecapeptide analog for rapid tendon and vascular micro-repair",
    scaffold: "Pentadecapeptide (GEPPPGKPADDAGLV)",
    target: "VEGFR2 phosphorylation & focal adhesion kinase upregulation"
  },
  {
    title: "GABA-A Alpha-2/3 Anxiolytic & Soporific",
    type: "medicine",
    desc: "Non-sedating cognitive anxiolytic sparing alpha-1 motor receptors to avoid ataxia and addiction",
    scaffold: "Imidazopyridine Core",
    target: "GABA-A alpha-2 and alpha-3 high-affinity positive allosteric site"
  }
];

export const CompoundSynthesizerModal: React.FC<CompoundSynthesizerModalProps> = ({
  isOpen,
  onClose,
  onCompoundCreated,
  onLaunchTrials
}) => {
  const [activeTab, setActiveTab] = useState<'AI' | 'PEPTIDE' | 'MANUAL'>('AI');
  const [prompt, setPrompt] = useState('');
  const [compoundType, setCompoundType] = useState<'medicine' | 'peptide'>('peptide');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCompound, setGeneratedCompound] = useState<ChemicalCompound | null>(null);
  const [error, setError] = useState('');

  // Manual builder state
  const [manualName, setManualName] = useState('');
  const [manualFormula, setManualFormula] = useState('C14H18N2O2');
  const [manualSmiles, setManualSmiles] = useState('CNC1=CNC2=C1C=C(C=C2)F');
  const [manualRole, setManualRole] = useState('Novel selective neurotrophin mimetic');
  const [manualPeptideSeq, setManualPeptideSeq] = useState('H-Tyr-D-Ala-Gly-Phe-Leu-NH2');
  const [manualIndication, setManualIndication] = useState('Cortical neurodegeneration and synaptic loss');

  if (!isOpen) return null;

  const handleSynthesize = async (targetDesc?: string) => {
    const textToUse = targetDesc || prompt;
    if (!textToUse.trim()) return;

    setIsLoading(true);
    setError('');
    setGeneratedCompound(null);

    try {
      const res = await synthesizeCompound(textToUse, undefined, {
        isPeptide: compoundType === 'peptide',
        category: compoundType
      });
      setGeneratedCompound(res);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Synthesis failed. Please try a different molecular description.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_INDICATIONS[0]) => {
    setCompoundType(preset.type as 'medicine' | 'peptide');
    setPrompt(preset.target);
    handleSynthesize(preset.target);
  };

  const handleCreateManual = () => {
    if (!manualName.trim()) {
      setError('Please provide a name for your novel compound.');
      return;
    }
    const isPep = compoundType === 'peptide';
    const compound: ChemicalCompound = {
      name: manualName,
      smiles: manualSmiles,
      formula: manualFormula,
      role: manualRole,
      molecularWeight: isPep ? '564.7 g/mol' : '234.3 g/mol',
      structureType: isPep ? 'Synthetic Bioactive Peptide' : 'Targeted Heterocyclic Small Molecule',
      logP: isPep ? 0.45 : 2.15,
      tpsa: isPep ? 142.0 : 45.3,
      hBondDonors: isPep ? 6 : 2,
      hBondAcceptors: isPep ? 7 : 3,
      bbbPermeable: !isPep,
      targetReceptors: isPep ? ['TrkB Receptor', 'GLP-1R'] : ['5-HT2A', 'D2 Subtype'],
      bindingAffinity: 'Ki = 6.4 nM',
      mechanismOfAction: 'Selective agonist promoting synaptogenesis with rapid cell penetration',
      isPeptide: isPep,
      peptideSequence: isPep ? manualPeptideSeq : undefined,
      therapeuticIndication: manualIndication,
      deliveryRoute: isPep ? 'Subcutaneous / Intranasal' : 'Oral Solid Tablet'
    };
    onCompoundCreated(compound, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
              <Pill size={22} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
                Medicine & Peptide Synthesizer
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  De Novo Studio
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Design custom chemical compounds, bioactive peptides, and neuroprotective medicines
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('AI')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'AI' 
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs' 
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Sparkles size={14} />
            <span>AI Discovery & Synthesis</span>
          </button>

          <button
            onClick={() => { setActiveTab('PEPTIDE'); setCompoundType('peptide'); }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'PEPTIDE' 
                ? 'bg-white text-emerald-600 border-emerald-600 shadow-xs' 
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Dna size={14} />
            <span>Therapeutic Peptides</span>
          </button>

          <button
            onClick={() => setActiveTab('MANUAL')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'MANUAL' 
                ? 'bg-white text-slate-800 border-slate-800 shadow-xs' 
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <TestTubes size={14} />
            <span>Custom Assembler</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {activeTab === 'AI' && (
            <div className="space-y-4">
              {/* Type Switcher */}
              <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl border border-slate-200/80">
                <button
                  onClick={() => setCompoundType('medicine')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    compoundType === 'medicine' 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Pill size={14} />
                  <span>Small-Molecule Medicine</span>
                </button>
                <button
                  onClick={() => setCompoundType('peptide')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    compoundType === 'peptide' 
                      ? 'bg-white text-emerald-700 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Dna size={14} />
                  <span>Bioactive Peptide</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Target Therapeutic Indication / Biological Mechanism
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={compoundType === 'peptide' 
                    ? "e.g., 'Design an intranasal neuroprotective peptide targeting hippocampal BDNF/TrkB with cyclic enzymatic stability'" 
                    : "e.g., 'Synthesize a selective BBB-permeable NMDA NR2B negative allosteric modulator for stroke neuroprotection'"}
                  className="w-full h-24 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-sans resize-none text-slate-800"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 block">
                  Quick Therapeutic Templates:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_INDICATIONS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyPreset(preset)}
                      className="text-left p-2.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 truncate">
                          {preset.title}
                        </span>
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                          preset.type === 'peptide' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                            : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        }`}>
                          {preset.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">
                        {preset.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Synthesize Button */}
              <button
                onClick={() => handleSynthesize()}
                disabled={isLoading || !prompt.trim()}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Synthesizing Molecular Structure & Pharmacophore...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Synthesize {compoundType === 'peptide' ? 'Peptide Candidate' : 'Medicine Candidate'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'PEPTIDE' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
                <Dna size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 mb-0.5">Therapeutic Peptide Engineering</h4>
                  <p className="text-emerald-700 leading-relaxed text-[11px]">
                    Peptides offer high receptor selectivity with low off-target toxicity. Our engine predicts proteolytic half-life, secondary structures (alpha-helices, beta-turns), and Blood-Brain Barrier delivery methods.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Peptide Sequence / Core Pharmacophore
                </label>
                <input
                  type="text"
                  value={manualPeptideSeq}
                  onChange={(e) => setManualPeptideSeq(e.target.value)}
                  placeholder="e.g. H-Tyr-D-Ala-Phe-Gly-Tyr-Pro-Ser-NH2"
                  className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Peptide Name</label>
                  <input
                    type="text"
                    value={manualName || "Neuropet-42 (Synthetic Enkephalin Analog)"}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Pathology</label>
                  <input
                    type="text"
                    value={manualIndication}
                    onChange={(e) => setManualIndication(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateManual}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} />
                <span>Add Peptide to Laboratory Chamber</span>
              </button>
            </div>
          )}

          {activeTab === 'MANUAL' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Compound Name</label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g., Citalo-Synth-9"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Molecular Formula</label>
                  <input
                    type="text"
                    value={manualFormula}
                    onChange={(e) => setManualFormula(e.target.value)}
                    placeholder="e.g., C14H18N2O"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">SMILES Notation</label>
                <input
                  type="text"
                  value={manualSmiles}
                  onChange={(e) => setManualSmiles(e.target.value)}
                  placeholder="e.g. CNC1=CNC2=C1C=C(C=C2)F"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-indigo-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Biochemical Mechanism / Role</label>
                <input
                  type="text"
                  value={manualRole}
                  onChange={(e) => setManualRole(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <button
                onClick={handleCreateManual}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} />
                <span>Register Custom Molecule in Laboratory</span>
              </button>
            </div>
          )}

          {/* Generated Result Card */}
          {generatedCompound && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      generatedCompound.isPeptide 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                        : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                    }`}>
                      {generatedCompound.isPeptide ? 'Synthesized Peptide' : 'Synthesized Medicine'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      MW: {generatedCompound.molecularWeight || 'Calculated'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mt-1">
                    {generatedCompound.name}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Affinity</span>
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {generatedCompound.bindingAffinity || 'Ki < 10 nM'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {generatedCompound.mechanismOfAction || generatedCompound.role}
              </p>

              {/* Structural / Pharmacological Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-[11px]">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">LogP Lipophilicity</span>
                  <span className="font-bold text-slate-800 font-mono">{generatedCompound.logP ?? 1.8}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Polar Surface (TPSA)</span>
                  <span className="font-bold text-slate-800 font-mono">{generatedCompound.tpsa ?? 45.2} Å²</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">BBB Crossing</span>
                  <span className={`font-bold ${generatedCompound.bbbPermeable ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {generatedCompound.bbbPermeable ? 'Permeable (CNS Active)' : 'Peripheral / Needs Carrier'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Half-Life (t1/2)</span>
                  <span className="font-bold text-slate-800 font-mono">{generatedCompound.halfLife || '5.4 hours'}</span>
                </div>
              </div>

              {/* Peptide sequence display if present */}
              {generatedCompound.peptideSequence && generatedCompound.peptideSequence !== 'N/A' && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 mb-4">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    Amino Acid Sequence:
                  </span>
                  <div className="font-mono text-xs font-bold text-emerald-950 break-all select-all">
                    {generatedCompound.peptideSequence}
                  </div>
                </div>
              )}

              {/* Target Receptors */}
              {generatedCompound.targetReceptors && generatedCompound.targetReceptors.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Receptor Targets:</span>
                  {generatedCompound.targetReceptors.map((r, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md">
                      {r}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200/70">
                <button
                  onClick={() => {
                    onCompoundCreated(generatedCompound, false);
                    onClose();
                  }}
                  className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Add to Lab</span>
                </button>

                {onLaunchTrials && (
                  <button
                    onClick={() => {
                      onCompoundCreated(generatedCompound, false);
                      onLaunchTrials(generatedCompound);
                      onClose();
                    }}
                    className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <TestTubes size={14} />
                    <span>Run 5-Stage Multi-Trial Screening</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onCompoundCreated(generatedCompound, true);
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap size={14} />
                  <span>Launch Simulation</span>
                </button>
              </div>

            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
              {error}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
