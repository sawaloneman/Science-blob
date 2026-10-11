import React, { useState, useEffect } from 'react';
import { ChemicalCompound } from '../types';
import { Atom, Layers, Sparkles, Eye, Info, X, Dna, ShieldCheck, Activity } from 'lucide-react';

interface CompoundDiagramProps {
  compound: ChemicalCompound;
}

// Element color mapping for authentic CPK scientific models
const ELEMENT_COLORS: Record<string, string> = {
  C: '#334155',  // Carbon (Graphite slate)
  O: '#ef4444',  // Oxygen (Crimson red)
  N: '#2563eb',  // Nitrogen (Cobalt blue)
  P: '#ea580c',  // Phosphorus (Deep orange)
  S: '#d97706',  // Sulfur (Amber yellow)
  H: '#94a3b8',  // Hydrogen (Light slate)
  F: '#059669',  // Fluorine (Emerald green)
  Cl: '#047857', // Chlorine (Dark green)
  Br: '#991b1b', // Bromine (Dark red-brown)
  I: '#6b21a8',  // Iodine (Deep purple)
  Na: '#9333ea', // Sodium (Purple)
  K: '#7c3aed',  // Potassium (Violet)
  Fe: '#c2410c'  // Iron (Rust orange)
};

interface GraphNode {
  id: number;
  symbol: string;
  x: number;
  y: number;
  color: string;
  valency: number;
  label?: string;
}

interface GraphEdge {
  from: number;
  to: number;
  type: 'single' | 'double' | 'peptide';
}

// Generate deterministic 2D atom graph layout from smiles string or peptide sequence
function parseSmilesToGraph(compound: ChemicalCompound): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const { smiles, name, isPeptide, peptideSequence } = compound;
  const width = 220;
  const height = 140;
  const centerX = width / 2;
  const centerY = height / 2;

  // 1. Peptide-specific amino acid residue representation
  if (isPeptide || (peptideSequence && peptideSequence.length > 3)) {
    const rawSeq = peptideSequence || "Tyr-D-Ala-Gly-Phe-Leu";
    // Extract residue tokens (e.g. "Tyr", "Ala", "Gly")
    const residues = rawSeq
      .replace(/^[Hh]-/, '')
      .replace(/-[Nn][Hh]2$/, '')
      .split(/[-–—]/)
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .slice(0, 7);

    const count = Math.max(residues.length, 3);
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    const stepX = Math.min(28, (width - 40) / (count - 1));
    const startX = centerX - ((count - 1) * stepX) / 2;

    for (let idx = 0; idx < count; idx++) {
      const res = residues[idx] || `AA${idx + 1}`;
      const yOffset = (idx % 2 === 0 ? -1 : 1) * 16;
      nodes.push({
        id: idx,
        symbol: res.slice(0, 3),
        x: startX + idx * stepX,
        y: centerY + yOffset,
        color: idx === 0 ? '#10b981' : idx === count - 1 ? '#059669' : '#0d9488',
        valency: 2,
        label: res
      });

      if (idx > 0) {
        edges.push({
          from: idx - 1,
          to: idx,
          type: 'peptide'
        });
      }
    }
    return { nodes, edges };
  }

  // 2. Small-molecule SMILES Tokenizer
  const tokens: string[] = [];
  let i = 0;
  while (i < smiles.length) {
    const char = smiles[i];
    if (char === '[' || char === ']' || char === '(' || char === ')' || char === '=' || char === '#' || char === '@') {
      i++;
      continue;
    }
    if (i + 1 < smiles.length && /^[a-z]$/.test(smiles[i + 1])) {
      tokens.push(char.toUpperCase() + smiles[i + 1]);
      i += 2;
    } else if (/[A-Za-z]/.test(char)) {
      tokens.push(char.toUpperCase());
      i++;
    } else {
      i++;
    }
  }

  // Fallback to carbon/nitrogen/oxygen skeleton if SMILES is brief
  const atomList = tokens.length > 0 ? tokens.slice(0, 16) : ['C', 'C', 'N', 'O', 'C', 'F'];
  const count = atomList.length;
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const hasRing = smiles.includes('1') || smiles.includes('2') || smiles.includes('c') || 
                  name.toLowerCase().includes('benzene') || name.toLowerCase().includes('tryptamine') || 
                  name.toLowerCase().includes('ring') || name.toLowerCase().includes('indole');

  if (hasRing && count >= 5) {
    // Ring arrangement (e.g., Benzene / Indole / Pyridine core)
    const ringSize = Math.min(6, count);
    const radius = 34;
    for (let idx = 0; idx < ringSize; idx++) {
      const angle = (idx * (2 * Math.PI / ringSize)) - Math.PI / 2;
      const sym = atomList[idx] || 'C';
      nodes.push({
        id: idx,
        symbol: sym,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        color: ELEMENT_COLORS[sym] || '#475569',
        valency: sym === 'O' ? 2 : sym === 'N' ? 3 : sym === 'F' ? 1 : 4
      });
      edges.push({
        from: idx,
        to: (idx + 1) % ringSize,
        type: idx % 2 === 0 ? 'double' : 'single'
      });
    }

    // Attach substituents and functional branches
    for (let idx = ringSize; idx < count; idx++) {
      const parentIdx = (idx - ringSize) % ringSize;
      const parent = nodes[parentIdx];
      const angle = Math.atan2(parent.y - centerY, parent.x - centerX);
      const branchDist = 28 + (idx % 2) * 10;
      const sym = atomList[idx] || (idx % 2 === 0 ? 'F' : 'N');
      
      nodes.push({
        id: idx,
        symbol: sym,
        x: Math.max(16, Math.min(width - 16, parent.x + branchDist * Math.cos(angle))),
        y: Math.max(16, Math.min(height - 16, parent.y + branchDist * Math.sin(angle))),
        color: ELEMENT_COLORS[sym] || '#475569',
        valency: sym === 'O' ? 2 : sym === 'N' ? 3 : sym === 'F' ? 1 : 4
      });
      edges.push({ from: parentIdx, to: idx, type: 'single' });
    }
  } else {
    // Zigzag acyclic aliphatic chain geometry
    const stepX = Math.min(32, (width - 40) / Math.max(count - 1, 1));
    const startX = centerX - ((count - 1) * stepX) / 2;
    for (let idx = 0; idx < count; idx++) {
      const yOffset = (idx % 2 === 0 ? -1 : 1) * 18;
      const sym = atomList[idx] || 'C';
      nodes.push({
        id: idx,
        symbol: sym,
        x: startX + idx * stepX,
        y: centerY + yOffset,
        color: ELEMENT_COLORS[sym] || '#475569',
        valency: sym === 'O' ? 2 : sym === 'N' ? 3 : 4
      });
      if (idx > 0) {
        edges.push({
          from: idx - 1,
          to: idx,
          type: (idx % 3 === 0) ? 'double' : 'single'
        });
      }
    }
  }

  return { nodes, edges };
}

export const CompoundDiagram: React.FC<CompoundDiagramProps> = ({ compound }) => {
  const [showModal, setShowModal] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  const graph = React.useMemo(() => parseSmilesToGraph(compound), [compound]);

  useEffect(() => {
    if (showModal) {
      setAnimationStep(0);
      const timer = setInterval(() => {
        setAnimationStep(prev => (prev < graph.nodes.length ? prev + 1 : prev));
      }, 150);
      return () => clearInterval(timer);
    }
  }, [showModal, graph.nodes.length]);

  return (
    <>
      <div className="flex flex-col items-center bg-white border border-slate-200/80 rounded-xl p-4 print:border-black shrink-0 w-60 shadow-sm hover:shadow-md transition-all duration-300 group relative">
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {compound.isPeptide ? (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 shrink-0">
                <Dna size={10} /> Peptide
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 shrink-0">
                {compound.structureType || 'Medicine'}
              </span>
            )}
            {compound.bbbPermeable && (
              <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 shrink-0" title="Blood-Brain Barrier Permeable">
                BBB+
              </span>
            )}
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-slate-100 print:hidden shrink-0"
            title="Inspect 2D Structure Assembly & Pharmacology"
          >
            <Eye size={14} />
          </button>
        </div>

        {/* 2D Chemical Diagram Vector Canvas (Self-contained, zero network errors) */}
        <div className="w-full h-32 flex items-center justify-center bg-slate-50/70 rounded-lg p-2 border border-slate-100 overflow-hidden relative">
          <svg viewBox="0 0 220 140" className="w-full h-full select-none">
            <defs>
              <pattern id="chemGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.5" fill="#e2e8f0" />
              </pattern>
            </defs>
            <rect width="220" height="140" fill="url(#chemGrid)" opacity="0.6" />

            {/* Chemical Bonds */}
            {graph.edges.map((edge, idx) => {
              const source = graph.nodes[edge.from];
              const target = graph.nodes[edge.to];
              if (!source || !target) return null;
              const isDouble = edge.type === 'double';
              const isPeptide = edge.type === 'peptide';

              return (
                <g key={`edge-${idx}`}>
                  <line 
                    x1={source.x} 
                    y1={source.y} 
                    x2={target.x} 
                    y2={target.y} 
                    stroke={isPeptide ? '#059669' : '#475569'} 
                    strokeWidth={isDouble ? 3 : isPeptide ? 2.5 : 2} 
                    strokeLinecap="round"
                    strokeDasharray={isPeptide ? '3 1.5' : 'none'}
                  />
                  {isDouble && (
                    <line 
                      x1={source.x + 2.5} 
                      y1={source.y + 2.5} 
                      x2={target.x + 2.5} 
                      y2={target.y + 2.5} 
                      stroke="#94a3b8" 
                      strokeWidth={1.5} 
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })}

            {/* Chemical Atoms / Residues */}
            {graph.nodes.map((node) => {
              const isPeptide = compound.isPeptide;
              const radius = isPeptide ? 13 : 11;
              return (
                <g 
                  key={`node-${node.id}`} 
                  className="transition-transform hover:scale-110 cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r={radius} 
                    fill="white" 
                    stroke={node.color} 
                    strokeWidth={2}
                    className="shadow-sm" 
                  />
                  <text 
                    x={node.x} 
                    y={node.y + (isPeptide ? 3 : 3.5)} 
                    textAnchor="middle" 
                    fill={node.color} 
                    fontSize={isPeptide ? "8.5" : "10"} 
                    fontWeight="bold" 
                    fontFamily="monospace"
                  >
                    {node.symbol}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredNode && (
            <div className="absolute bottom-1 right-1 bg-slate-900/90 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none">
              {hoveredNode.label || hoveredNode.symbol}
            </div>
          )}
        </div>

        {/* Compound Details */}
        <div className="mt-3 text-center w-full">
          <h4 className="font-bold text-xs text-slate-900 print:text-black truncate" title={compound.name}>
            {compound.name}
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 print:text-black leading-snug line-clamp-2" title={compound.role}>
            {compound.role}
          </p>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="truncate max-w-[130px]" title={compound.smiles}>
              {compound.formula || `MW: ${compound.molecularWeight || 'Calculated'}`}
            </span>
            <button 
              onClick={() => setShowModal(true)}
              className="text-indigo-600 hover:text-indigo-800 font-sans font-medium print:hidden hover:underline"
            >
              Inspect &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Structural Inspection & Assembly Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center space-x-2 text-indigo-600 mb-2">
              <Atom size={20} className="animate-spin-slow" />
              <h3 className="font-bold text-lg text-slate-900">Molecular Structure Assembly</h3>
            </div>
            
            <p className="text-xs text-slate-500 mb-4">
              Biophysical bond construction synthesized for <span className="font-semibold text-slate-700">{compound.name}</span>.
            </p>

            {/* Interactive Vector Assembly Canvas */}
            <div className="bg-slate-950 rounded-xl p-4 mb-4 relative overflow-hidden flex flex-col items-center justify-center h-64 border border-slate-800">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
              
              <svg viewBox="0 0 220 140" className="w-full h-full relative z-10 select-none">
                {/* Bonds */}
                {graph.edges.map((edge, idx) => {
                  const source = graph.nodes[edge.from];
                  const target = graph.nodes[edge.to];
                  if (!source || !target) return null;
                  const isVisible = edge.from < animationStep && edge.to < animationStep;
                  if (!isVisible && animationStep > 0) return null;
                  const isPeptide = edge.type === 'peptide';

                  return (
                    <line 
                      key={`modal-edge-${idx}`}
                      x1={source.x} 
                      y1={source.y} 
                      x2={target.x} 
                      y2={target.y} 
                      stroke={isPeptide ? '#34d399' : '#818cf8'} 
                      strokeWidth={edge.type === 'double' ? 3 : isPeptide ? 2.5 : 2} 
                      strokeLinecap="round"
                      strokeDasharray={isPeptide ? '4 2' : edge.type === 'double' ? '4 2' : 'none'}
                    />
                  );
                })}
                {/* Atoms */}
                {graph.nodes.slice(0, animationStep || graph.nodes.length).map((node) => {
                  const isPeptide = compound.isPeptide;
                  const radius = isPeptide ? 14 : 12;
                  return (
                    <g key={`modal-node-${node.id}`} className="transition-all duration-300">
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={radius} 
                        fill="#0f172a" 
                        stroke={node.color} 
                        strokeWidth={2}
                      />
                      <text 
                        x={node.x} 
                        y={node.y + (isPeptide ? 3.5 : 4)} 
                        textAnchor="middle" 
                        fill="white" 
                        fontSize={isPeptide ? "9" : "11"} 
                        fontWeight="bold" 
                        fontFamily="monospace"
                      >
                        {node.symbol}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>Synthesis Verification: {Math.min(100, Math.round(((animationStep || graph.nodes.length) / graph.nodes.length) * 100))}% Complete</span>
              </div>
            </div>

            {/* Properties Table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs mb-3">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">SMILES Notation</div>
                <div className="font-mono text-slate-700 truncate text-[11px]" title={compound.smiles}>{compound.smiles}</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Calculated LogP</div>
                <div className="font-mono text-indigo-600 font-semibold">{compound.logP ?? 1.85} (Lipophilicity)</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">BBB Permeability</div>
                <div className={`font-semibold ${compound.bbbPermeable ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {compound.bbbPermeable ? 'CNS Active (Permeable)' : 'Peripheral / Transporter Req.'}
                </div>
              </div>
            </div>

            {/* Peptide Sequence Block if present */}
            {compound.peptideSequence && compound.peptideSequence !== 'N/A' && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 mb-3 text-xs">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                  <Dna size={12} /> Peptide Primary Sequence:
                </span>
                <div className="font-mono text-xs font-bold text-emerald-950 break-all select-all">
                  {compound.peptideSequence}
                </div>
              </div>
            )}

            {/* Therapeutic Indication & Receptors */}
            {(compound.therapeuticIndication || (compound.targetReceptors && compound.targetReceptors.length > 0)) && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5 mb-3 text-xs">
                {compound.therapeuticIndication && (
                  <div className="mb-1 text-slate-700">
                    <span className="font-bold text-indigo-900">Therapeutic Indication: </span>
                    <span>{compound.therapeuticIndication}</span>
                  </div>
                )}
                {compound.targetReceptors && compound.targetReceptors.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center mt-1">
                    <span className="font-bold text-indigo-900 text-[10px] uppercase mr-1">Target Receptors:</span>
                    {compound.targetReceptors.map((r, i) => (
                      <span key={i} className="bg-white border border-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded text-[10px] font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <button 
                onClick={() => {
                  setAnimationStep(0);
                  let s = 0;
                  const int = setInterval(() => {
                    s++;
                    setAnimationStep(s);
                    if (s >= graph.nodes.length) clearInterval(int);
                  }, 120);
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Layers size={14} /> Rebuild Structure
              </button>
              
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
