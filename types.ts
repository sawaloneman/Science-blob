
export interface Point {
  x: number;
  y: number;
  id?: string;
  meta?: string;
}

export interface DataPoint {
  label: string | number;
  value: number;
}

export interface SimulationConfig {
  topic: string;
  duration: string;
  variable: string;
}

export interface BenchmarkMetric {
  metric: string;
  score: number;
  max: number;
  unit: string;
}

export interface ChemicalCompound {
  name: string;
  smiles: string;
  role: string;
  formula?: string;
  structureType?: string;
  molecularWeight?: string;
  logP?: number;
  tpsa?: number;
  hBondDonors?: number;
  hBondAcceptors?: number;
  bbbPermeable?: boolean;
  targetReceptors?: string[];
  bindingAffinity?: string;
  mechanismOfAction?: string;
  solubility?: string;
  halfLife?: string;
  // Peptide & Medicine Discovery Fields
  isPeptide?: boolean;
  peptideSequence?: string;
  therapeuticIndication?: string;
  deliveryRoute?: string;
  stabilityProfile?: string;
}

export interface NeurotransmitterDelta {
  transmitter: string;
  changePercent: number;
  role: string;
}

export interface NumericalEquation {
  name: string;
  formula: string;
  description: string;
  stateVariable: string;
}

export interface NeuroBiochemicalProfile {
  targetBrainRegion?: string;
  actionPotentialVelocity?: string;
  membranePotentialDelta?: string;
  synapticPlasticityScore?: number; // 0-100 LTP scale
  neurotransmitters?: NeurotransmitterDelta[];
  numericalEquations?: NumericalEquation[];
  differentialMethod?: string; // e.g. "Runge-Kutta 4th Order (RK4)"
  convergenceRate?: string;
}

export interface ResearchResult {
  title: string;
  abstract: string;
  methodology: string;
  resultsAnalysis: string;
  conclusion: string;
  
  // Generic graph data
  trendData: DataPoint[]; // For line charts
  trendLabelX: string;
  trendLabelY: string;
  trendTitle: string;

  // Generic spatial/distribution data
  distributionData: Point[]; // For scatter plots
  distributionLabel: string;
  distributionColor: string;
  
  configUsed: SimulationConfig;
  
  // Validation Proofs
  benchmarks?: BenchmarkMetric[];
  computeHash?: string;

  // Anti-hallucination & Speculative logic
  scientificFoundation?: string[];
  speculativeRationale?: string;
  
  // Key chemical compounds
  keyCompounds?: ChemicalCompound[];

  // Advanced Biological & Neuroscience Numerical Systems
  neuroProfile?: NeuroBiochemicalProfile;

  // Multi-Trial Compound Screening Pipeline & Lead Optimization
  multiTrialExperiment?: MultiTrialExperiment;

  // Empirical Proofs & Rigorous Verification
  proofVerification?: ProofVerificationData;
}

export interface TrialStageMetric {
  name: string;
  value: string | number;
  unit?: string;
  threshold: string;
  passed: boolean;
}

export interface CandidateTrialResult {
  trialIndex: number;
  trialName: string;
  passed: boolean;
  score: number; // 0-100
  eliminationReason?: string;
  metrics: TrialStageMetric[];
  scientificObservation: string;
}

export interface ScreeningCandidate {
  id: string;
  name: string;
  codeName: string;
  smiles: string;
  isPeptide?: boolean;
  peptideSequence?: string;
  chemicalModifications: string[];
  status: 'passed' | 'eliminated' | 'winner';
  eliminatedAtTrial?: number;
  overallScore: number;
  radarScores: {
    affinity: number; // 0-100
    safety: number;
    stability: number;
    efficacy: number;
    bioavailability: number;
  };
  trials: CandidateTrialResult[];
  compoundData: ChemicalCompound;
}

export interface MultiTrialExperiment {
  id: string;
  targetIndication: string;
  targetReceptor: string;
  hypothesis: string;
  trialStages: {
    stage: number;
    name: string;
    description: string;
    testType: string;
    criticalFilter: string;
  }[];
  candidates: ScreeningCandidate[];
  winningCandidateId: string;
  leadOptimizationSummary: string;
  molecularEvolutionInsight: string;
  proofOfEfficacy: {
    kdValue: string;
    ec50Value: string;
    therapeuticIndex: string;
    pVal: string;
    rSquared: string;
    mathematicalProof: string;
  };
}

export interface ProofVerificationData {
  pVal: string;
  rSquared: string;
  confidenceInterval: string;
  statisticalPower: string;
  cohensD: string;
  dockingAffinityScore: string;
  bindingFreeEnergy: string;
  lipinskiCompliance: string;
  veberRuleCompliance: string;
  odeConvergenceProof: string;
  reproducibilityScore: string;
  validationChecklist: {
    check: string;
    status: 'passed' | 'warning' | 'verified';
    detail: string;
  }[];
}

export enum AppState {
  IDLE = 'IDLE',
  SIMULATING = 'SIMULATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export enum SimulationMode {
  CLOUD = 'CLOUD',
  LOCAL = 'LOCAL'
}
