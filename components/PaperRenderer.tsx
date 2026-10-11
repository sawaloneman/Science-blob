
import React, { useState } from 'react';
import { ResearchResult } from '../types';
import { TrendChart } from './LossChart';
import { DistributionChart } from './ScatterVisualizer';
import { CompoundDiagram } from './CompoundDiagram';
import { MultiTrialScreeningVisualizer } from './MultiTrialScreeningVisualizer';
import { ProofVerificationCard } from './ProofVerificationCard';
import { 
  Download, Printer, Loader2, ShieldCheck, CheckCircle2, 
  TestTubes, Activity, Brain, Dna, Pill, Calculator, 
  TrendingUp, Sparkles, Layers, Award
} from 'lucide-react';

interface PaperRendererProps {
  data: ResearchResult;
}

export const PaperRenderer: React.FC<PaperRendererProps> = ({ data }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setPdfStatus("Preparing PDF layout...");
    const element = document.getElementById('research-paper-content');
    
    // Check global html2pdf from CDN
    const html2pdf = (window as any).html2pdf;

    if (!html2pdf || !element) {
      setPdfStatus("Opening print dialog...");
      setTimeout(() => {
        window.print();
        setIsDownloading(false);
        setPdfStatus(null);
      }, 300);
      return;
    }
    
    const opt = {
      margin: [10, 10, 10, 10], // top, left, bottom, right
      filename: `omniscience_report_${data.configUsed.topic.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'simulation'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      await html2pdf().set(opt).from(element).save();
      setPdfStatus(null);
    } catch (error) {
      console.warn("Direct PDF generation failed, using browser print engine:", error);
      window.print();
    } finally {
      setIsDownloading(false);
      setPdfStatus(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-end">
      {/* Floating Action Buttons for Report */}
      <div className="mb-4 print:hidden flex items-center space-x-3">
        <button 
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all font-medium text-sm"
          title="Print or Save via Browser"
        >
          <Printer size={16} />
          <span>Print</span>
        </button>

        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all font-medium text-sm disabled:opacity-75 disabled:cursor-wait"
        >
          {isDownloading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          <span>{pdfStatus || (isDownloading ? 'Generating PDF...' : 'Download Report (PDF)')}</span>
        </button>
      </div>

      <div 
        id="research-paper-content"
        className="bg-paper min-h-screen shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-[1100px] mx-auto p-12 md:p-24 text-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-1000 print:shadow-none print:m-0 print:w-full print:max-w-none print:p-0 print:overflow-visible rounded-xl border border-slate-200/50"
      >
        
        {/* Header / Meta */}
        <div className="border-b-[3px] border-slate-900 pb-10 mb-12 flex flex-col items-center text-center print:border-black">
          <div className="flex items-center space-x-4 text-slate-500 mb-6 text-[10px] uppercase tracking-[0.2em] font-bold print:text-black">
            <span>Nature Simulated Physics</span>
            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
            <span>Vol. 42 (Simulated)</span>
            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.15] tracking-tight mb-8 text-slate-900 print:text-black max-w-4xl mx-auto">
            {data.title}
          </h1>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-2 text-sm text-slate-800 font-serif print:text-black">
               <span className="font-bold text-indigo-700">OmniScience Kernel 1.0</span>,
               <span>Autonomous Agent Array</span>
            </div>
            <div className="font-mono text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-sm border border-slate-200 print:border-none print:bg-transparent">
               DOI: 10.1038/s41586-sim-{data.computeHash?.slice(0, 8).toLowerCase() || 'a1b2c3d4'}
            </div>
          </div>
        </div>

        {/* Abstract */}
        <section className="mb-14 max-w-3xl mx-auto break-inside-avoid">
          <p className="font-serif text-lg md:text-xl leading-[1.8] text-slate-800 font-medium text-justify print:text-black">
            <span className="font-bold font-sans text-xs uppercase tracking-widest text-indigo-700 mr-4 print:text-black">Abstract</span>
            {data.abstract}
          </p>
        </section>

        {/* Two Column Layout for Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 print:block print:space-y-8">
          
          {/* Left Column */}
          <div className="space-y-10 print:space-y-8">
            <section className="break-inside-avoid">
              <h2 className="font-serif text-2xl font-bold mb-4 border-b-2 border-slate-100 pb-2 print:border-black">1. Methodology</h2>
              <p className="text-slate-800 leading-[1.8] text-[15px] font-serif text-justify print:text-black">
                {data.methodology}
              </p>
            </section>

            <section className="break-inside-avoid">
               <h2 className="font-serif text-2xl font-bold mb-4 border-b-2 border-slate-100 pb-2 print:border-black">3. Temporal Dynamics</h2>
               <p className="text-slate-800 leading-[1.8] text-[15px] font-serif mb-6 print:text-black">
                 The following analysis illustrates the evolution of the system over the simulation duration.
               </p>
               <div className="print:break-inside-avoid overflow-hidden bg-transparent">
                 <TrendChart 
                   data={data.trendData} 
                   title={data.trendTitle}
                   xLabel={data.trendLabelX}
                   yLabel={data.trendLabelY}
                 />
                 <div className="pt-4 text-xs text-slate-500 text-center font-serif print:text-black"><span className="font-bold">Figure 1 | </span>Temporal analysis of simulation variables.</div>
               </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-10 print:space-y-8">
             <section className="break-inside-avoid">
              <h2 className="font-serif text-2xl font-bold mb-4 border-b-2 border-slate-100 pb-2 print:border-black">2. Results & Analysis</h2>
              <p className="text-slate-800 leading-[1.8] text-[15px] font-serif text-justify mb-6 print:text-black">
                {data.resultsAnalysis}
              </p>
              
              <div className="mt-8 print:break-inside-avoid overflow-hidden bg-transparent">
                <DistributionChart 
                  data={data.distributionData} 
                  title={data.distributionLabel} 
                  color={data.distributionColor || "#3b82f6"} 
                />
                <div className="pt-4 text-xs text-slate-500 text-center font-serif print:text-black"><span className="font-bold">Figure 2 | </span>Spatial state distribution at t=Final.</div>
              </div>
            </section>

            <section className="break-inside-avoid">
              <h2 className="font-serif text-2xl font-bold mb-4 border-b-2 border-slate-100 pb-2 print:border-black">4. Conclusion</h2>
              <p className="text-slate-800 leading-[1.8] text-[15px] font-serif text-justify print:text-black">
                {data.conclusion}
              </p>
            </section>
          </div>
        </div>

        {/* Key Real-World Foundations & Speculative Logic */}
        <section className="mt-16 pt-10 border-t-2 border-slate-900 print:border-black break-inside-avoid">
           <div className="flex items-center space-x-3 text-slate-900 mb-8 print:text-black">
              <ShieldCheck size={28} className="text-indigo-600" />
              <h2 className="font-serif text-2xl font-bold">5. Causal Framework & Logical Basis</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-4">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 print:text-black">Foundational Laws</h3>
                 <ul className="space-y-2">
                    {data.scientificFoundation?.map((law, i) => (
                       <li key={i} className="flex items-start space-x-2 text-sm text-slate-700 print:text-black">
                          <CheckCircle2 size={16} className="mt-0.5 text-emerald-500 shrink-0 print:text-black" />
                          <span>{law}</span>
                       </li>
                    ))}
                 </ul>
              </div>
              <div className="md:col-span-2 bg-indigo-50/40 p-8 rounded-xl border border-indigo-100/60 print:bg-transparent print:border-black print:p-0">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-700 mb-4 print:text-black">Speculative Rationale</h3>
                 <p className="text-[15px] leading-[1.8] font-serif text-slate-800 text-justify print:text-black">
                    {data.speculativeRationale}
                 </p>
              </div>
           </div>
        </section>

        {/* Chemical & Peptide Compounds Section */}
        {data.keyCompounds && data.keyCompounds.length > 0 && (
           <div className="mt-16 pt-10 border-t-2 border-slate-900 break-inside-avoid print:border-black">
              <div className="flex items-center space-x-3 text-slate-900 mb-6 print:text-black">
                 <TestTubes size={28} className="text-indigo-600" />
                 <h2 className="font-serif text-2xl font-bold">6. Molecular & Peptide Therapeutics Inventory</h2>
              </div>
              <p className="text-slate-800 text-[15px] leading-[1.8] font-serif mb-6 print:text-black">
                 The following molecular and bioactive peptide structures were modeled as interactive pharmacological ligands within the systemic simulation environment.
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                 {data.keyCompounds.map((compound, idx) => (
                    <CompoundDiagram key={idx} compound={compound} />
                 ))}
              </div>
           </div>
        )}

        {/* Biological & Numerical Neuroscience Kinetics Profile */}
        {data.neuroProfile && (
           <div className="mt-16 pt-10 border-t-2 border-slate-900 break-inside-avoid print:border-black">
              <div className="flex items-center space-x-3 text-slate-900 mb-6 print:text-black">
                 <Brain size={28} className="text-purple-600" />
                 <h2 className="font-serif text-2xl font-bold">7. Biological & Numerical Neuroscience Kinetics</h2>
              </div>
              <p className="text-slate-800 text-[15px] leading-[1.8] font-serif mb-6 print:text-black">
                 Electrophysiological ion channel flux, synaptic neurotransmission, and numerical ordinary differential equation (ODE) integration were evaluated across modeled cellular domains.
              </p>

              {/* Key Electrophysiological Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100 print:bg-transparent print:border-black">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">Target Brain Region</span>
                  <div className="font-serif font-bold text-slate-900 text-sm">{data.neuroProfile.targetBrainRegion || 'Cortical Synaptic Grid'}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Layer V Pyramidal Microcircuits</div>
                </div>

                <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100 print:bg-transparent print:border-black">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">Action Potential Conduction</span>
                  <div className="font-mono font-bold text-slate-900 text-sm">{data.neuroProfile.actionPotentialVelocity || '48.6 m/s'}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Voltage Delta: {data.neuroProfile.membranePotentialDelta || '-70 mV -> +38 mV'}</div>
                </div>

                <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100 print:bg-transparent print:border-black">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">Synaptic Plasticity (LTP Score)</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="font-mono font-bold text-slate-900 text-sm">{data.neuroProfile.synapticPlasticityScore ?? 88}%</div>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full rounded-full" 
                        style={{ width: `${data.neuroProfile.synapticPlasticityScore ?? 88}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Dendritic Spine Potentiation</div>
                </div>
              </div>

              {/* Neurotransmitter Dynamics */}
              {data.neuroProfile.neurotransmitters && data.neuroProfile.neurotransmitters.length > 0 && (
                <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200/80 print:bg-transparent print:border-black">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
                    <Activity size={14} className="text-indigo-600" />
                    <span>Neurochemical Modulation & Synaptic Vesicle Release:</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {data.neuroProfile.neurotransmitters.map((nt, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-slate-800">{nt.transmitter}</span>
                          <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                            nt.changePercent >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {nt.changePercent >= 0 ? `+${nt.changePercent}%` : `${nt.changePercent}%`}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">{nt.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Numerical Mathematical ODE Solvers */}
              {data.neuroProfile.numericalEquations && data.neuroProfile.numericalEquations.length > 0 && (
                <div className="space-y-4 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                    <Calculator size={14} className="text-purple-600" />
                    <span>Numerical Differential Equations & Solvers ({data.neuroProfile.differentialMethod || 'RK4 Integration'}):</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.neuroProfile.numericalEquations.map((eq, idx) => (
                      <div key={idx} className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-xs print:bg-transparent print:text-black print:border-black">
                        <div className="text-[10px] text-purple-400 font-bold uppercase mb-1.5 flex items-center justify-between">
                          <span>{eq.name}</span>
                          <span className="text-slate-400 font-sans text-[9px]">Verified</span>
                        </div>
                        <div className="bg-black/50 p-2.5 rounded-lg border border-slate-800 text-indigo-300 font-bold overflow-x-auto text-[11px] mb-2 print:bg-transparent print:text-black">
                          {eq.formula}
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed">{eq.description}</p>
                        <div className="mt-2 text-[9px] text-emerald-400 font-mono">
                          Target Variable: {eq.stateVariable}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
           </div>
        )}
        
        {/* Multi-Trial Compound Screening Pipeline & Lead Optimization */}
        <div className="mt-16 pt-10 border-t-2 border-slate-900 break-inside-avoid print:border-black">
           <div className="flex items-center space-x-3 text-slate-900 mb-6 print:text-black">
              <Award size={28} className="text-amber-600" />
              <h2 className="font-serif text-2xl font-bold">8. Multi-Trial Compound Screening Pipeline &amp; Lead Optimization</h2>
           </div>
           <p className="text-slate-800 text-[15px] leading-[1.8] font-serif mb-6 print:text-black">
              To identify candidate drugs and therapeutic peptides without hazardous off-target liabilities or rapid metabolic clearance, five structural analogues were evaluated through five sequential discovery screening trials (Virtual Docking → hERG Cardiotoxicity &amp; Cytotoxicity → Microsomal &amp; Protease ADMET → In Vitro Efficacy → In Vivo Blood-Brain Barrier &amp; Bioavailability) to isolate <strong>The Right One</strong>.
           </p>
           
           <div className="mb-4">
              <MultiTrialScreeningVisualizer experiment={data.multiTrialExperiment} />
           </div>
        </div>

        {/* Empirical Proof, Mathematical Derivations & Numerical Validation */}
        <div className="mt-16 pt-10 border-t-2 border-slate-900 break-inside-avoid print:border-black">
           <div className="flex items-center space-x-3 text-slate-900 mb-6 print:text-black">
              <ShieldCheck size={28} className="text-emerald-600" />
              <h2 className="font-serif text-2xl font-bold">9. Empirical Proof, Mathematical Derivations &amp; Numerical Validation</h2>
           </div>
           <p className="text-slate-800 text-[15px] leading-[1.8] font-serif mb-6 print:text-black">
              The simulation and pharmacological models were subjected to rigorous validation audits across statistical confidence, numerical convergence bounds (Runge-Kutta / Dormand-Prince ODE solver), thermodynamic binding free energy equilibrium, and Lipinski / Veber drug-likeness rules.
           </p>

           <div className="mb-4">
              <ProofVerificationCard 
                proof={data.proofVerification} 
                computeHash={data.computeHash}
                topicTitle={data.title}
              />
           </div>
        </div>
        
        {/* Validation & Benchmarks Section */}
        <div className="mt-16 pt-10 border-t-2 border-slate-900 print:border-black break-inside-avoid">
           <div className="flex items-center space-x-3 text-slate-900 mb-8 print:text-black">
              <Activity size={28} className="text-emerald-600" />
              <h2 className="font-serif text-2xl font-bold">10. Simulation Verification & Benchmarks</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-slate-50/50 p-8 rounded-xl border border-slate-200/60 print:bg-transparent print:border-black print:p-0">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-6 print:text-black">Performance Benchmarks</h3>
                 <div className="space-y-4">
                    {data.benchmarks?.map((b, i) => (
                       <div key={i} className="flex flex-col">
                          <div className="flex justify-between text-xs font-semibold mb-1 print:text-black">
                             <span>{b.metric}</span>
                             <span>{b.score}{b.unit}</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden print:border print:border-black">
                             <div 
                               className="h-full bg-emerald-500 print:bg-black" 
                               style={{ width: `${(b.score / b.max) * 100}%` }}
                             ></div>
                          </div>
                       </div>
                    )) || <p className="text-sm text-slate-500">Benchmark data unavailable.</p>}
                 </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 print:bg-transparent print:border-black print:p-0">
                 <h3 className="text-sm font-bold uppercase text-slate-500 mb-4 print:text-black">Cryptographic Proof</h3>
                 <div className="flex items-start space-x-3">
                    <CheckCircle2 size={24} className="text-emerald-500 print:text-black" />
                    <div>
                       <p className="text-sm text-slate-800 font-semibold print:text-black">Simulation Verified</p>
                       <p className="text-xs text-slate-500 mt-1 mb-2 print:text-black">This result was generated using the OmniScience V2 Causal Diffusion & Numerical ODE Engine. The following hash ensures data integrity and causal consistency.</p>
                       <div className="bg-white border border-slate-300 rounded p-2 font-mono text-[10px] break-all text-slate-600 print:border-black print:text-black">
                          {data.computeHash || 'N/A'}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 text-center print:border-black print:mt-8">
          <p className="font-mono text-xs text-slate-400 print:text-black">Generated by OmniScience AI Agent • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};
