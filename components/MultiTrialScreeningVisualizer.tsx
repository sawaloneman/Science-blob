import React, { useState, useEffect } from 'react';
import { MultiTrialExperiment, ScreeningCandidate, ChemicalCompound } from '../types';
import { CompoundDiagram } from './CompoundDiagram';
import { 
  TestTubes, Play, RotateCcw, ChevronRight, CheckCircle2, 
  XCircle, Award, AlertTriangle, ShieldCheck, Activity, 
  ArrowRight, Sparkles, Filter, Dna, Atom, Layers, 
  TrendingUp, Pill, Zap, Check, Eye, HelpCircle
} from 'lucide-react';

interface MultiTrialScreeningVisualizerProps {
  experiment?: MultiTrialExperiment;
  onSelectCandidateForSimulation?: (candidate: ChemicalCompound) => void;
  standalone?: boolean;
}

// High-fidelity fallback experiment data when none is passed
export const DEFAULT_MULTI_TRIAL_EXPERIMENT: MultiTrialExperiment = {
  id: "TRIAL-EXP-9402",
  targetIndication: "Neurodegenerative Cognitive Restoration & Synaptic Plasticity",
  targetReceptor: "TrkB (BDNF) / GLP-1 Co-Receptor Complex",
  hypothesis: "Iterative screening of 5 structural analogues across 5 sequential discovery trials to identify the single optimized candidate ('The Right One') combining sub-nanomolar affinity, zero hERG cardiotoxicity, protease resistance, and blood-brain barrier penetration.",
  trialStages: [
    {
      stage: 1,
      name: "In Silico Affinity & Binding Free Energy",
      description: "Computational docking into TrkB kinase and GLP-1R extracellular pocket evaluating Gibbs binding free energy.",
      testType: "Lamarckian Genetic Algorithm Molecular Docking",
      criticalFilter: "Binding Free Energy ΔG° ≤ -8.5 kcal/mol & Predicted KD ≤ 10 nM"
    },
    {
      stage: 2,
      name: "Off-Target & hERG Cardiotoxicity Assay",
      description: "Automated patch-clamp assay on hERG K+ channels to exclude QT-prolongation risk, plus HepG2 cytotoxicity.",
      testType: "In Vitro Whole-Cell Patch Clamp & Cell Viability Assay",
      criticalFilter: "hERG IC50 > 30 μM & HepG2 Cell Viability > 90% at 50 μM"
    },
    {
      stage: 3,
      name: "Metabolic Clearance & Protease Resistance",
      description: "Human liver microsome stability (CYP450) and DPP-4 / neprilysin endopeptidase degradation half-life.",
      testType: "Human Liver Microsomes (HLM) & In Vitro Enzyme Degradation",
      criticalFilter: "Metabolic t1/2 > 4.0 Hours & DPP-4 Cleavage Resistance > 85%"
    },
    {
      stage: 4,
      name: "In Vitro Cell Signaling & Intrinsic Efficacy",
      description: "Primary cortical neuron bioassay measuring TrkB tyrosine autophosphorylation and intracellular cAMP accumulation.",
      testType: "Western Blot Phospho-TrkB (Tyr515/816) & FRET cAMP Biosensor",
      criticalFilter: "Intrinsic Efficacy Emax ≥ 85% & Functional EC50 ≤ 5.0 nM"
    },
    {
      stage: 5,
      name: "In Vivo Pharmacokinetics & Blood-Brain Barrier",
      description: "Rodent pharmacokinetic profiling evaluating brain parenchyma accumulation, bioavailability, and synaptogenesis.",
      testType: "In Vivo Microdialysis, LC-MS/MS & Dendritic Spine Quantification",
      criticalFilter: "Brain/Plasma Ratio Kp,brain ≥ 1.2 & Systemic Bioavailability F ≥ 70%"
    }
  ],
  candidates: [
    {
      id: "CAND-01",
      name: "Parent Prototype Scaffold",
      codeName: "SYN-SC-01",
      smiles: "CC1=CC=C(C=C1)CCNCC2=CNC3=C2C=CC=C3",
      isPeptide: false,
      chemicalModifications: ["Unmodified prototype scaffold", "Unprotected amine", "Unsubstituted phenyl ring"],
      status: "eliminated",
      eliminatedAtTrial: 3,
      overallScore: 61,
      radarScores: {
        affinity: 78,
        safety: 82,
        stability: 32,
        efficacy: 75,
        bioavailability: 38
      },
      trials: [
        {
          trialIndex: 1,
          trialName: "In Silico Affinity & Binding Free Energy",
          passed: true,
          score: 84,
          metrics: [
            { name: "Binding Free Energy", value: "-8.9 kcal/mol", threshold: "≤ -8.5 kcal/mol", passed: true },
            { name: "Predicted KD", value: "7.4 nM", threshold: "≤ 10 nM", passed: true }
          ],
          scientificObservation: "Favorable electrostatic interaction with TrkB active loop, satisfactory binding pocket fit."
        },
        {
          trialIndex: 2,
          trialName: "Off-Target & hERG Cardiotoxicity Assay",
          passed: true,
          score: 80,
          metrics: [
            { name: "hERG IC50", value: "34.5 μM", threshold: "> 30 μM", passed: true },
            { name: "HepG2 Viability", value: "93.2%", threshold: "> 90%", passed: true }
          ],
          scientificObservation: "Minimal potassium channel block at physiological concentrations; no acute cytotoxicity."
        },
        {
          trialIndex: 3,
          trialName: "Metabolic Clearance & Protease Resistance",
          passed: false,
          score: 28,
          eliminationReason: "Rapid hepatic microsomal phase-I hydroxylation: in vitro half-life t1/2 = 42 minutes (< 4 hour threshold).",
          metrics: [
            { name: "Microsomal t1/2", value: "42 min", threshold: "> 4.0 Hours", passed: false },
            { name: "Intrinsic Cl_int", value: "148 μL/min/mg", threshold: "< 25 μL/min/mg", passed: false }
          ],
          scientificObservation: "Exposed phenyl 4-position undergoes immediate cytochrome P450 oxidation, causing unacceptable systemic clearance."
        }
      ],
      compoundData: {
        name: "SYN-SC-01 (Parent Prototype)",
        smiles: "CC1=CC=C(C=C1)CCNCC2=CNC3=C2C=CC=C3",
        role: "Initial screening hit from high-throughput campaign",
        formula: "C17H20N2",
        molecularWeight: "252.36 g/mol",
        structureType: "Unmodified Tryptamine Scaffold",
        logP: 2.84,
        tpsa: 27.9,
        hBondDonors: 2,
        hBondAcceptors: 1,
        bbbPermeable: true,
        targetReceptors: ["TrkB Kinase"],
        bindingAffinity: "KD = 7.4 nM"
      }
    },
    {
      id: "CAND-02",
      name: "High-Lipophilicity Derivative",
      codeName: "SYN-LIPO-02",
      smiles: "CC(C)(C)C1=CC=C(C=C1)CCNCC2=CNC3=C2C=C(C=C3)Cl",
      isPeptide: false,
      chemicalModifications: ["Added tert-butyl lipophilic tail", "Chlorine substitution at C6"],
      status: "eliminated",
      eliminatedAtTrial: 2,
      overallScore: 48,
      radarScores: {
        affinity: 92,
        safety: 24,
        stability: 68,
        efficacy: 84,
        bioavailability: 42
      },
      trials: [
        {
          trialIndex: 1,
          trialName: "In Silico Affinity & Binding Free Energy",
          passed: true,
          score: 95,
          metrics: [
            { name: "Binding Free Energy", value: "-10.4 kcal/mol", threshold: "≤ -8.5 kcal/mol", passed: true },
            { name: "Predicted KD", value: "1.2 nM", threshold: "≤ 10 nM", passed: true }
          ],
          scientificObservation: "High hydrophobic packing into TrkB deep cleft creates exceptional theoretical docking affinity."
        },
        {
          trialIndex: 2,
          trialName: "Off-Target & hERG Cardiotoxicity Assay",
          passed: false,
          score: 18,
          eliminationReason: "Potent hERG channel blockage (IC50 = 2.3 μM) presents unacceptable lethal cardiac QT-prolongation risk.",
          metrics: [
            { name: "hERG IC50", value: "2.3 μM", threshold: "> 30 μM", passed: false },
            { name: "CYP3A4 Inhibition", value: "IC50 = 1.1 μM", threshold: "> 10 μM", passed: false }
          ],
          scientificObservation: "Excessive lipophilicity (LogP = 4.62) traps candidate in hERG hydrophobic pore cavity. Disqualified for patient safety."
        }
      ],
      compoundData: {
        name: "SYN-LIPO-02 (Lipophilic Analog)",
        smiles: "CC(C)(C)C1=CC=C(C=C1)CCNCC2=CNC3=C2C=C(C=C3)Cl",
        role: "Affinity-enhanced derivative with lipophilic shielding",
        formula: "C21H27ClN2",
        molecularWeight: "342.91 g/mol",
        structureType: "Chlorinated Heterocycle",
        logP: 4.62,
        tpsa: 27.9,
        hBondDonors: 2,
        hBondAcceptors: 1,
        bbbPermeable: true,
        targetReceptors: ["TrkB Kinase"],
        bindingAffinity: "KD = 1.2 nM"
      }
    },
    {
      id: "CAND-03",
      name: "Polar Hydroxylated Peptide Fragment",
      codeName: "SYN-PEP-03",
      smiles: "N[C@@H](CC1=CNC2=C1C=CC=C2)C(=O)N[C@@H](CO)C(=O)O",
      isPeptide: true,
      peptideSequence: "H-Trp-Ser-OH",
      chemicalModifications: ["Linear dipeptide conjugation", "Added polar serine hydroxyl", "High water solubility"],
      status: "eliminated",
      eliminatedAtTrial: 4,
      overallScore: 66,
      radarScores: {
        affinity: 86,
        safety: 96,
        stability: 81,
        efficacy: 44,
        bioavailability: 25
      },
      trials: [
        {
          trialIndex: 1,
          trialName: "In Silico Affinity & Binding Free Energy",
          passed: true,
          score: 88,
          metrics: [
            { name: "Binding Free Energy", value: "-9.1 kcal/mol", threshold: "≤ -8.5 kcal/mol", passed: true },
            { name: "Predicted KD", value: "4.8 nM", threshold: "≤ 10 nM", passed: true }
          ],
          scientificObservation: "Excellent hydrogen bonding network with Ser478 and Asp482 in extracellular loop."
        },
        {
          trialIndex: 2,
          trialName: "Off-Target & hERG Cardiotoxicity Assay",
          passed: true,
          score: 98,
          metrics: [
            { name: "hERG IC50", value: "> 100 μM", threshold: "> 30 μM", passed: true },
            { name: "HepG2 Viability", value: "99.1%", threshold: "> 90%", passed: true }
          ],
          scientificObservation: "Completely benign cardiac and hepatic safety profile; zero off-target binding."
        },
        {
          trialIndex: 3,
          trialName: "Metabolic Clearance & Protease Resistance",
          passed: true,
          score: 82,
          metrics: [
            { name: "Microsomal t1/2", value: "6.2 Hours", threshold: "> 4.0 Hours", passed: true },
            { name: "DPP-4 Resistance", value: "88.4%", threshold: "> 85%", passed: true }
          ],
          scientificObservation: "Steric crowding around Trp residue provides adequate initial enzymatic stability."
        },
        {
          trialIndex: 4,
          trialName: "In Vitro Cell Signaling & Intrinsic Efficacy",
          passed: false,
          score: 42,
          eliminationReason: "Incomplete TrkB receptor dimerization: Intrinsic agonist efficacy Emax = 48% (failed to achieve ≥ 85% requirement).",
          metrics: [
            { name: "Intrinsic Efficacy Emax", value: "48%", threshold: "≥ 85%", passed: false },
            { name: "Phospho-TrkB (Y816)", value: "+38%", threshold: "> +100%", passed: false }
          ],
          scientificObservation: "Acts as a weak partial agonist. Fails to trigger sufficient downstream Akt/CREB synaptogenesis signaling."
        }
      ],
      compoundData: {
        name: "SYN-PEP-03 (Polar Peptide Fragment)",
        smiles: "N[C@@H](CC1=CNC2=C1C=CC=C2)C(=O)N[C@@H](CO)C(=O)O",
        role: "Water-soluble peptide analog tested for benign toxicity",
        formula: "C14H17N3O4",
        molecularWeight: "291.31 g/mol",
        structureType: "Linear Dipeptide",
        isPeptide: true,
        peptideSequence: "H-Trp-Ser-OH",
        logP: -0.84,
        tpsa: 112.5,
        hBondDonors: 5,
        hBondAcceptors: 4,
        bbbPermeable: false,
        targetReceptors: ["TrkB Kinase", "GLP-1R"],
        bindingAffinity: "KD = 4.8 nM"
      }
    },
    {
      id: "CAND-04",
      name: "Fluorinated Alkyl Intermediate",
      codeName: "SYN-F-04",
      smiles: "CNC1=CNC2=C1C=C(C=C2)F",
      isPeptide: false,
      chemicalModifications: ["Fluorine substitution at C4 metabolic hotspot", "N-methylation of ethylamine branch"],
      status: "eliminated",
      eliminatedAtTrial: 5,
      overallScore: 78,
      radarScores: {
        affinity: 89,
        safety: 90,
        stability: 91,
        efficacy: 88,
        bioavailability: 58
      },
      trials: [
        {
          trialIndex: 1,
          trialName: "In Silico Affinity & Binding Free Energy",
          passed: true,
          score: 91,
          metrics: [
            { name: "Binding Free Energy", value: "-9.3 kcal/mol", threshold: "≤ -8.5 kcal/mol", passed: true },
            { name: "Predicted KD", value: "3.2 nM", threshold: "≤ 10 nM", passed: true }
          ],
          scientificObservation: "Fluorine atom forms strong electrostatic dipole contact with backbone amide."
        },
        {
          trialIndex: 2,
          trialName: "Off-Target & hERG Cardiotoxicity Assay",
          passed: true,
          score: 88,
          metrics: [
            { name: "hERG IC50", value: "48.2 μM", threshold: "> 30 μM", passed: true },
            { name: "HepG2 Viability", value: "94.6%", threshold: "> 90%", passed: true }
          ],
          scientificObservation: "Fluorination successfully reduced basicity (pKa shift), lowering hERG pore affinity."
        },
        {
          trialIndex: 3,
          trialName: "Metabolic Clearance & Protease Resistance",
          passed: true,
          score: 92,
          metrics: [
            { name: "Microsomal t1/2", value: "8.4 Hours", threshold: "> 4.0 Hours", passed: true },
            { name: "Intrinsic Cl_int", value: "11.2 μL/min/mg", threshold: "< 25 μL/min/mg", passed: true }
          ],
          scientificObservation: "C-F bond completely prevents phase-I aromatic hydroxylation."
        },
        {
          trialIndex: 4,
          trialName: "In Vitro Cell Signaling & Intrinsic Efficacy",
          passed: true,
          score: 87,
          metrics: [
            { name: "Intrinsic Efficacy Emax", value: "89%", threshold: "≥ 85%", passed: true },
            { name: "Functional EC50", value: "3.8 nM", threshold: "≤ 5.0 nM", passed: true }
          ],
          scientificObservation: "Triggers robust BDNF-like TrkB phosphorylation and dendritic spine enlargement."
        },
        {
          trialIndex: 5,
          trialName: "In Vivo Pharmacokinetics & Blood-Brain Barrier",
          passed: false,
          score: 52,
          eliminationReason: "High P-glycoprotein (P-gp) efflux substrate recognition: Brain/plasma ratio Kp,brain = 0.42 (< 1.2 threshold).",
          metrics: [
            { name: "Brain/Plasma Ratio Kp", value: "0.42", threshold: "≥ 1.2", passed: false },
            { name: "Oral Bioavailability F", value: "62%", threshold: "≥ 70%", passed: false }
          ],
          scientificObservation: "Compound penetrates systemic circulation but is actively pumped out of cerebral endothelial cells by P-gp."
        }
      ],
      compoundData: {
        name: "SYN-F-04 (Fluorinated Intermediate)",
        smiles: "CNC1=CNC2=C1C=C(C=C2)F",
        role: "Metabolically stabilized lead precursor",
        formula: "C11H13FN2",
        molecularWeight: "192.23 g/mol",
        structureType: "Fluorinated Tryptamine",
        logP: 1.95,
        tpsa: 27.9,
        hBondDonors: 2,
        hBondAcceptors: 1,
        bbbPermeable: false,
        targetReceptors: ["TrkB Kinase"],
        bindingAffinity: "KD = 3.2 nM"
      }
    },
    {
      id: "CAND-05",
      name: "Engineered Co-Agonist Lead (The Right One)",
      codeName: "SYN-LEAD-05",
      smiles: "CNC1=CNC2=C1C=C(C=C2)F.CC(C)CC(C(=O)N)NC(=O)CNC(=O)C",
      isPeptide: true,
      peptideSequence: "H-Tyr-D-Ala-Phe-Gly-Leu-NH2 (Cyclic TrkB/GLP-1 Hybrid)",
      chemicalModifications: [
        "Metabolic block: 4-Fluorine substitution at aromatic ring",
        "Enzymatic shield: D-Alanine at position 2 completely blocks DPP-4 cleavage",
        "P-gp evasion: Lipidated stealth C-terminal carboxamide",
        "Dual Co-Agonist: Synergistic activation of TrkB and GLP-1R"
      ],
      status: "winner",
      overallScore: 97,
      radarScores: {
        affinity: 98,
        safety: 96,
        stability: 97,
        efficacy: 98,
        bioavailability: 96
      },
      trials: [
        {
          trialIndex: 1,
          trialName: "In Silico Affinity & Binding Free Energy",
          passed: true,
          score: 99,
          metrics: [
            { name: "Binding Free Energy", value: "-11.8 kcal/mol", threshold: "≤ -8.5 kcal/mol", passed: true },
            { name: "Predicted KD (TrkB)", value: "0.85 nM", threshold: "≤ 10 nM", passed: true },
            { name: "Predicted KD (GLP-1R)", value: "1.4 nM", threshold: "≤ 10 nM", passed: true }
          ],
          scientificObservation: "Dual binding mode achieves co-docking at both TrkB and GLP-1 receptors with sub-nanomolar affinity."
        },
        {
          trialIndex: 2,
          trialName: "Off-Target & hERG Cardiotoxicity Assay",
          passed: true,
          score: 96,
          metrics: [
            { name: "hERG IC50", value: "> 95 μM", threshold: "> 30 μM", passed: true },
            { name: "HepG2 Viability", value: "98.4%", threshold: "> 90%", passed: true }
          ],
          scientificObservation: "Zero hERG inhibition across all tested voltage clamp steps. Pristine cardiac safety window."
        },
        {
          trialIndex: 3,
          trialName: "Metabolic Clearance & Protease Resistance",
          passed: true,
          score: 98,
          metrics: [
            { name: "Microsomal t1/2", value: "14.2 Hours", threshold: "> 4.0 Hours", passed: true },
            { name: "DPP-4 Resistance", value: "99.4%", threshold: "> 85%", passed: true }
          ],
          scientificObservation: "D-amino acid modification completely prevents enzymatic peptide cleavage. Extended circulating half-life."
        },
        {
          trialIndex: 4,
          trialName: "In Vitro Cell Signaling & Intrinsic Efficacy",
          passed: true,
          score: 98,
          metrics: [
            { name: "Intrinsic Efficacy Emax", value: "97%", threshold: "≥ 85%", passed: true },
            { name: "Functional EC50", value: "0.92 nM", threshold: "≤ 5.0 nM", passed: true },
            { name: "Synaptic Spine Induction", value: "+214%", threshold: "> +100%", passed: true }
          ],
          scientificObservation: "Full agonist activity driving rapid TrkB autophosphorylation and durable hippocampal LTP synaptogenesis."
        },
        {
          trialIndex: 5,
          trialName: "In Vivo Pharmacokinetics & Blood-Brain Barrier",
          passed: true,
          score: 96,
          metrics: [
            { name: "Brain/Plasma Ratio Kp", value: "1.48", threshold: "≥ 1.2", passed: true },
            { name: "Bioavailability F", value: "84%", threshold: "≥ 70%", passed: true },
            { name: "In Vivo Memory Score", value: "+86%", threshold: "> +50%", passed: true }
          ],
          scientificObservation: "Crosses blood-brain barrier via receptor-mediated transcytosis; achieves high parenchymal concentration with sustained memory improvement."
        }
      ],
      compoundData: {
        name: "SYN-LEAD-05 (Co-Agonist Clinical Lead)",
        smiles: "CNC1=CNC2=C1C=C(C=C2)F.CC(C)CC(C(=O)N)NC(=O)CNC(=O)C",
        role: "Optimized Dual TrkB/GLP-1 Co-Agonist Clinical Lead Candidate",
        formula: "C28H37FN6O5",
        molecularWeight: "556.63 g/mol",
        structureType: "Fluorinated Cyclic Bioactive Peptidomimetic",
        isPeptide: true,
        peptideSequence: "H-Tyr-D-Ala-Phe-Gly-Leu-NH2",
        therapeuticIndication: "Neurodegenerative Cognitive Restoration & Synaptic Plasticity",
        logP: 1.62,
        tpsa: 118.4,
        hBondDonors: 6,
        hBondAcceptors: 6,
        bbbPermeable: true,
        targetReceptors: ["TrkB (BDNF)", "GLP-1R", "Sigma-1 Chaperone"],
        bindingAffinity: "KD = 0.85 nM (TrkB) / EC50 = 1.4 nM (GLP-1R)",
        mechanismOfAction: "Dual trophic signal induction: TrkB autophosphorylation & GLP-1 neuroprotective metabolic boost with zero proteolytic degradation.",
        solubility: "32.4 mg/mL",
        halfLife: "14.2 hours",
        deliveryRoute: "Subcutaneous Depot or Intranasal BBB Bypass (84% F)"
      }
    }
  ],
  winningCandidateId: "CAND-05",
  leadOptimizationSummary: "Through 5 successive trials, Candidate #5 (SYN-LEAD-05) emerged as the single winning chemical entity ('The Right One'). By introducing 4-fluorination to block metabolic oxidation, D-alanine substitution to eliminate DPP-4 enzymatic cleavage, and stealth lipidation to evade P-gp blood-brain barrier efflux, SYN-LEAD-05 conquered every liability that eliminated Candidates #1 through #4.",
  molecularEvolutionInsight: "Systematic structure-activity relationship (SAR) mutation: Scaffold Prototype #1 (cleared in Trial 3) ➔ Lipophilic Analog #2 (hERG toxic in Trial 2) ➔ Polar Dipeptide #3 (weak partial agonist in Trial 4) ➔ Fluorinated Alkyl #4 (P-gp effluxed in Trial 5) ➔ Lead #5 (PASSED ALL 5 TRIALS).",
  proofOfEfficacy: {
    kdValue: "0.85 nM",
    ec50Value: "0.92 nM",
    therapeuticIndex: "> 1,200 (Ratio of toxic dose to effective dose)",
    pVal: "p < 0.0001",
    rSquared: "0.9912",
    mathematicalProof: "Verified through multi-state thermodynamic equilibrium: ΔG° = -11.8 kcal/mol, zero off-target cross-reactivity, and 14.2-hour sustained biological residence time."
  }
};

export const MultiTrialScreeningVisualizer: React.FC<MultiTrialScreeningVisualizerProps> = ({
  experiment = DEFAULT_MULTI_TRIAL_EXPERIMENT,
  onSelectCandidateForSimulation,
  standalone = false
}) => {
  // Current active trial stage filter (0 = all, 1 to 5 = specific trial)
  const [currentTrialStep, setCurrentTrialStep] = useState<number>(5);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(experiment.winningCandidateId);
  const [isPlayingTrials, setIsPlayingTrials] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'CANDIDATES' | 'MATRIX' | 'EVOLUTION' | 'PROOF'>('CANDIDATES');

  const winningCandidate = experiment.candidates.find(c => c.id === experiment.winningCandidateId) || experiment.candidates[experiment.candidates.length - 1];
  const selectedCandidate = experiment.candidates.find(c => c.id === selectedCandidateId) || winningCandidate;

  // Auto-play through trials effect
  useEffect(() => {
    let timer: any;
    if (isPlayingTrials) {
      if (currentTrialStep < 5) {
        timer = setTimeout(() => {
          setCurrentTrialStep(prev => prev + 1);
        }, 1200);
      } else {
        setIsPlayingTrials(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlayingTrials, currentTrialStep]);

  const handleStartAutoPlay = () => {
    setCurrentTrialStep(1);
    setIsPlayingTrials(true);
  };

  const handleReset = () => {
    setIsPlayingTrials(false);
    setCurrentTrialStep(1);
  };

  // Helper to determine candidate status at the current trial stage
  const getCandidateStatusAtStep = (cand: ScreeningCandidate, step: number) => {
    if (cand.status === 'winner' && step === 5) return 'winner';
    if (cand.eliminatedAtTrial && cand.eliminatedAtTrial <= step) return 'eliminated';
    if (cand.eliminatedAtTrial && cand.eliminatedAtTrial > step) return 'passed';
    if (!cand.eliminatedAtTrial) return 'passed';
    return 'evaluating';
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-xl overflow-hidden print:border-black print:shadow-none">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 md:p-8 border-b border-indigo-900/60 print:bg-none print:text-black">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-400/30">
                <TestTubes size={18} className="text-amber-400" />
              </span>
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-300">
                High-Throughput Candidate Screening Pipeline
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-400/30 font-bold">
                5-STAGE PROGRESSION
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
              Chemical &amp; Peptide Multi-Trial Optimization
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Screening candidate chemical entities and peptide analogues through 5 sequential clinical trials to eliminate molecular liabilities and identify <strong className="text-amber-300">The Right One</strong>.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono">
              <span className="bg-indigo-900/60 text-indigo-200 px-2.5 py-1 rounded-md border border-indigo-700/50">
                Target: {experiment.targetReceptor}
              </span>
              <span className="bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                Indication: {experiment.targetIndication}
              </span>
            </div>
          </div>

          {/* Interactive Stepper Player */}
          <div className="flex flex-col items-end gap-3 bg-slate-900/80 p-4 rounded-xl border border-indigo-900/70 shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">
              Interactive Trial Controls:
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-lg border border-slate-700 transition-all font-medium"
                title="Reset to Trial 1"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>

              <button
                onClick={handleStartAutoPlay}
                disabled={isPlayingTrials}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
              >
                <Play size={14} className={isPlayingTrials ? 'animate-pulse' : ''} />
                <span>{isPlayingTrials ? 'Testing...' : 'Auto-Run All 5 Trials'}</span>
              </button>
            </div>
            <span className="text-[10px] text-slate-400">
              Stage {currentTrialStep} of 5 Active
            </span>
          </div>
        </div>

        {/* 5-Stage Stepper Ribbon */}
        <div className="mt-8 pt-6 border-t border-indigo-900/50">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {experiment.trialStages.map(stage => {
              const isActive = currentTrialStep === stage.stage;
              const isPast = currentTrialStep > stage.stage;
              return (
                <button
                  key={stage.stage}
                  onClick={() => {
                    setIsPlayingTrials(false);
                    setCurrentTrialStep(stage.stage);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg scale-[1.02]' 
                      : isPast
                        ? 'bg-slate-900/90 text-slate-200 border-indigo-900/80 hover:bg-slate-800'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                      Trial 0{stage.stage}
                    </span>
                    {isPast ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : isActive ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    ) : null}
                  </div>
                  <div className="text-xs font-bold truncate">
                    {stage.name.split('&')[0]}
                  </div>
                  <div className="text-[10px] opacity-75 truncate mt-0.5">
                    {stage.criticalFilter.split('&')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs for View */}
      <div className="bg-slate-100/80 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('CANDIDATES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'CANDIDATES'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Candidate Attrition Funnel ({experiment.candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('MATRIX')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'MATRIX'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5-Trial Comparative Matrix
          </button>
          <button
            onClick={() => setActiveTab('EVOLUTION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'EVOLUTION'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Structural SAR Evolution
          </button>
          <button
            onClick={() => setActiveTab('PROOF')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'PROOF'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Empirical Efficacy Proof
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-500" />
          <span>Showing results through: <strong>Stage {currentTrialStep}</strong></span>
        </div>
      </div>

      {/* Active Tab View */}
      <div className="p-6 md:p-8 space-y-8">
        
        {/* TAB 1: CANDIDATES ATTRITION FUNNEL */}
        {activeTab === 'CANDIDATES' && (
          <div className="space-y-6">
            
            {/* The Right One Spotlight Card */}
            {currentTrialStep === 5 && (
              <div className="bg-gradient-to-r from-amber-50 via-indigo-50 to-emerald-50 rounded-2xl p-6 md:p-8 border-2 border-amber-300 shadow-md">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center space-x-2">
                      <span className="p-1.5 bg-amber-400 text-amber-950 rounded-lg">
                        <Award size={20} />
                      </span>
                      <span className="text-xs uppercase font-extrabold tracking-widest text-amber-800">
                        The Right One Identified • Winning Lead Candidate
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-slate-950">
                      {winningCandidate.name} ({winningCandidate.codeName})
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {experiment.leadOptimizationSummary}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs font-mono">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md font-bold border border-emerald-300">
                        KD: {experiment.proofOfEfficacy.kdValue}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md font-bold border border-emerald-300">
                        EC50: {experiment.proofOfEfficacy.ec50Value}
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md font-bold border border-indigo-300">
                        Therapeutic Index: {experiment.proofOfEfficacy.therapeuticIndex}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-md font-bold border border-purple-300">
                        Significance: {experiment.proofOfEfficacy.pVal}
                      </span>
                    </div>
                  </div>

                  {onSelectCandidateForSimulation && (
                    <button
                      onClick={() => onSelectCandidateForSimulation(winningCandidate.compoundData)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center space-x-2 shrink-0"
                    >
                      <span>Simulate Research Paper with Winner</span>
                      <ArrowRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiment.candidates.map(cand => {
                const status = getCandidateStatusAtStep(cand, currentTrialStep);
                const isSelected = selectedCandidateId === cand.id;
                const isWinner = status === 'winner';
                const isEliminated = status === 'eliminated';
                const eliminationTrial = cand.trials.find(t => !t.passed);

                return (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedCandidateId(cand.id)}
                    className={`rounded-2xl border-2 transition-all cursor-pointer p-5 flex flex-col justify-between relative ${
                      isWinner
                        ? 'border-amber-400 bg-amber-50/30 shadow-lg ring-2 ring-amber-300/40'
                        : isEliminated
                          ? 'border-rose-200 bg-rose-50/20 opacity-85 hover:opacity-100'
                          : 'border-slate-200 bg-white hover:border-indigo-300 shadow-sm hover:shadow-md'
                    } ${isSelected ? 'scale-[1.01] ring-2 ring-indigo-500' : ''}`}
                  >
                    {/* Top status header */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {cand.codeName}
                        </span>

                        {isWinner ? (
                          <span className="flex items-center space-x-1 text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                            <Award size={12} />
                            <span>THE RIGHT ONE</span>
                          </span>
                        ) : isEliminated ? (
                          <span className="flex items-center space-x-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                            <XCircle size={12} />
                            <span>ELIMINATED: TRIAL 0{cand.eliminatedAtTrial}</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 size={12} />
                            <span>PASSED TRIAL 0{currentTrialStep}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-base text-slate-900 mb-1">
                        {cand.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mb-3">
                        {cand.compoundData.formula} • {cand.compoundData.molecularWeight}
                      </p>

                      {/* Chemical modifications list */}
                      <div className="mb-4 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Chemical Engineering / SAR Tweaks:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {cand.chemicalModifications.map((mod, i) => (
                            <span 
                              key={i} 
                              className={`text-[10px] px-2 py-0.5 rounded border ${
                                isWinner 
                                  ? 'bg-amber-100/70 border-amber-300 text-amber-900 font-medium' 
                                  : 'bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              {mod}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Failure reason if eliminated */}
                      {isEliminated && eliminationTrial && (
                        <div className="bg-rose-50 p-3 rounded-xl border border-rose-200/80 text-rose-800 text-xs mb-4">
                          <span className="font-bold text-[10px] uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                            <AlertTriangle size={12} className="text-rose-600" />
                            <span>Elimination Cause ({eliminationTrial.trialName}):</span>
                          </span>
                          <p className="text-[11px] leading-relaxed">{eliminationTrial.eliminationReason}</p>
                        </div>
                      )}

                      {/* Peptide sequence preview if applicable */}
                      {cand.isPeptide && cand.peptideSequence && (
                        <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-200/80 font-mono text-[10px] text-purple-900 mb-4 break-all">
                          <span className="font-bold uppercase text-[9px] block text-purple-600 mb-0.5">Sequence:</span>
                          {cand.peptideSequence}
                        </div>
                      )}
                    </div>

                    {/* Bottom radar/metrics score preview */}
                    <div className="border-t border-slate-100 pt-3 mt-2">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="font-medium text-slate-500">Overall Viability Score:</span>
                        <span className={`font-mono font-bold ${
                          isWinner ? 'text-amber-700 text-sm' : isEliminated ? 'text-rose-600' : 'text-emerald-700'
                        }`}>
                          {cand.overallScore} / 100
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWinner ? 'bg-amber-500' : isEliminated ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${cand.overallScore}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center mt-3 text-[11px] text-indigo-600 font-semibold">
                        <span>Inspect Full Dossier</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Candidate Detailed Inspector Drawer */}
            {selectedCandidate && (
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border-2 border-indigo-200 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase font-bold text-indigo-700">Detailed Candidate Dossier</span>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mt-0.5">
                      {selectedCandidate.name} ({selectedCandidate.codeName})
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-800">
                      Score: {selectedCandidate.overallScore}/100
                    </span>
                    {onSelectCandidateForSimulation && (
                      <button
                        onClick={() => onSelectCandidateForSimulation(selectedCandidate.compoundData)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-bold shadow-sm transition-all"
                      >
                        Simulate This Candidate
                      </button>
                    )}
                  </div>
                </div>

                {/* Candidate Diagram & Radar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <CompoundDiagram compound={selectedCandidate.compoundData} />
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Multi-Trial Progression History:
                    </h4>
                    <div className="space-y-3">
                      {selectedCandidate.trials.map(trial => (
                        <div
                          key={trial.trialIndex}
                          className={`p-4 rounded-xl border ${
                            trial.passed 
                              ? 'bg-white border-emerald-200' 
                              : 'bg-rose-50/50 border-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {trial.passed ? (
                                <CheckCircle2 size={16} className="text-emerald-500" />
                              ) : (
                                <XCircle size={16} className="text-rose-500" />
                              )}
                              <span className="font-bold text-xs text-slate-800">
                                Trial 0{trial.trialIndex}: {trial.trialName}
                              </span>
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              trial.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {trial.passed ? 'PASSED' : 'FAILED'} (Score: {trial.score})
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                            {trial.metrics.map((m, mi) => (
                              <div key={mi} className="bg-slate-50 p-2 rounded border border-slate-100 text-[11px]">
                                <span className="text-slate-500 block text-[10px]">{m.name}</span>
                                <div className="font-mono font-bold text-slate-800">{m.value}</div>
                                <span className="text-[9px] text-slate-400">Required: {m.threshold}</span>
                              </div>
                            ))}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            {trial.scientificObservation}
                          </p>
                          {trial.eliminationReason && (
                            <p className="text-xs font-bold text-rose-700 mt-1">
                              Elimination Reason: {trial.eliminationReason}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPARATIVE MATRIX TABLE */}
        {activeTab === 'MATRIX' && (
          <div className="space-y-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-slate-900 text-slate-100 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3.5 border-r border-slate-800">Candidate Molecule</th>
                  <th className="p-3.5 border-r border-slate-800">Trial 1: Binding ΔG°</th>
                  <th className="p-3.5 border-r border-slate-800">Trial 2: hERG Tox</th>
                  <th className="p-3.5 border-r border-slate-800">Trial 3: ADMET t1/2</th>
                  <th className="p-3.5 border-r border-slate-800">Trial 4: Efficacy Emax</th>
                  <th className="p-3.5 border-r border-slate-800">Trial 5: BBB Kp / F</th>
                  <th className="p-3.5">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {experiment.candidates.map(cand => {
                  const t1 = cand.trials.find(t => t.trialIndex === 1);
                  const t2 = cand.trials.find(t => t.trialIndex === 2);
                  const t3 = cand.trials.find(t => t.trialIndex === 3);
                  const t4 = cand.trials.find(t => t.trialIndex === 4);
                  const t5 = cand.trials.find(t => t.trialIndex === 5);
                  const isWinner = cand.status === 'winner';

                  return (
                    <tr key={cand.id} className={isWinner ? 'bg-amber-50/50 font-medium' : 'hover:bg-slate-50'}>
                      <td className="p-3.5 border-r border-slate-200 font-bold text-slate-900">
                        <div className="flex items-center space-x-2">
                          {isWinner && <Award size={14} className="text-amber-500 shrink-0" />}
                          <div>
                            <div>{cand.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{cand.codeName}</div>
                          </div>
                        </div>
                      </td>

                      {/* Trial 1 */}
                      <td className="p-3.5 border-r border-slate-200 font-mono">
                        {t1 ? (
                          <div className={t1.passed ? 'text-emerald-700' : 'text-rose-600'}>
                            {t1.passed ? '✓ ' : '✗ '}{t1.metrics[0]?.value || 'Pass'}
                          </div>
                        ) : <span className="text-slate-400">—</span>}
                      </td>

                      {/* Trial 2 */}
                      <td className="p-3.5 border-r border-slate-200 font-mono">
                        {t2 ? (
                          <div className={t2.passed ? 'text-emerald-700' : 'text-rose-600'}>
                            {t2.passed ? '✓ ' : '✗ '}{t2.metrics[0]?.value || 'Pass'}
                          </div>
                        ) : <span className="text-slate-400">—</span>}
                      </td>

                      {/* Trial 3 */}
                      <td className="p-3.5 border-r border-slate-200 font-mono">
                        {t3 ? (
                          <div className={t3.passed ? 'text-emerald-700' : 'text-rose-600'}>
                            {t3.passed ? '✓ ' : '✗ '}{t3.metrics[0]?.value || 'Pass'}
                          </div>
                        ) : <span className="text-slate-400">—</span>}
                      </td>

                      {/* Trial 4 */}
                      <td className="p-3.5 border-r border-slate-200 font-mono">
                        {t4 ? (
                          <div className={t4.passed ? 'text-emerald-700' : 'text-rose-600'}>
                            {t4.passed ? '✓ ' : '✗ '}{t4.metrics[0]?.value || 'Pass'}
                          </div>
                        ) : <span className="text-slate-400">—</span>}
                      </td>

                      {/* Trial 5 */}
                      <td className="p-3.5 border-r border-slate-200 font-mono">
                        {t5 ? (
                          <div className={t5.passed ? 'text-emerald-700' : 'text-rose-600'}>
                            {t5.passed ? '✓ ' : '✗ '}{t5.metrics[0]?.value || 'Pass'}
                          </div>
                        ) : <span className="text-slate-400">—</span>}
                      </td>

                      {/* Outcome */}
                      <td className="p-3.5 font-bold">
                        {isWinner ? (
                          <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px] uppercase">
                            The Right One
                          </span>
                        ) : (
                          <span className="text-rose-600 text-[10px]">
                            Failed Trial {cand.eliminatedAtTrial}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: STRUCTURAL SAR EVOLUTION */}
        {activeTab === 'EVOLUTION' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">
                Structure-Activity Relationship (SAR) Molecular Evolution
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-sans mb-6">
                {experiment.molecularEvolutionInsight}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {experiment.candidates.map((cand, i) => (
                  <div key={cand.id} className="relative">
                    <div className={`p-4 rounded-xl border-2 h-full flex flex-col justify-between ${
                      cand.status === 'winner' 
                        ? 'border-amber-400 bg-amber-50/70 shadow-md' 
                        : 'border-slate-200 bg-white'
                    }`}>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                          Iteration 0{i + 1}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 mb-1">{cand.name}</h4>
                        <span className="text-[10px] font-mono text-slate-500 block mb-2">{cand.codeName}</span>
                        <div className="text-[10px] text-slate-600 space-y-1">
                          {cand.chemicalModifications.map((m, idx) => (
                            <div key={idx} className="bg-slate-100 p-1 rounded font-sans leading-tight">
                              • {m}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] font-bold">
                        {cand.status === 'winner' ? (
                          <span className="text-amber-800">★ Optimal Lead</span>
                        ) : (
                          <span className="text-rose-600">Eliminated Trial {cand.eliminatedAtTrial}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EMPIRICAL EFFICACY PROOF */}
        {activeTab === 'PROOF' && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-slate-100 p-8 rounded-2xl border border-slate-800 font-sans">
              <div className="flex items-center space-x-2 text-indigo-400 mb-2">
                <ShieldCheck size={20} className="text-emerald-400" />
                <span className="text-xs uppercase font-mono font-bold tracking-wider">
                  Mathematical Proof of Superiority
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">
                Thermodynamic Equilibrium &amp; Statistical Confidence
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl mb-6">
                {experiment.proofOfEfficacy.mathematicalProof}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div className="bg-black/50 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Equilibrium Affinity (KD)</span>
                  <div className="text-xl font-mono font-bold text-emerald-400">{experiment.proofOfEfficacy.kdValue}</div>
                  <span className="text-[10px] text-slate-500">Sub-nanomolar potency</span>
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Functional EC50</span>
                  <div className="text-xl font-mono font-bold text-indigo-400">{experiment.proofOfEfficacy.ec50Value}</div>
                  <span className="text-[10px] text-slate-500">Maximal signal trigger</span>
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Therapeutic Index (TI)</span>
                  <div className="text-xl font-mono font-bold text-amber-400">{experiment.proofOfEfficacy.therapeuticIndex.split(' ')[0]}</div>
                  <span className="text-[10px] text-slate-500">Wide clinical safety margin</span>
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">P-Value Significance</span>
                  <div className="text-xl font-mono font-bold text-purple-400">{experiment.proofOfEfficacy.pVal}</div>
                  <span className="text-[10px] text-slate-500">R² = {experiment.proofOfEfficacy.rSquared}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
