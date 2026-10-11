
import React, { useState } from 'react';
import { FileCode, FolderOpen, Box } from 'lucide-react';

const FILES = {
  'simulation_engine.py': `import torch
import omniscience.physics as phys
from omniscience.agents import BioAgent

class SimulationEnvironment:
    def __init__(self, dimension='3d', gravity=9.81, temp=298):
        self.world = phys.World(dim=dimension)
        self.world.set_constants(g=gravity, T=temp)
        self.diffusion_solver = phys.DiffusionSolver(method='stochastic')

    def step(self, agents, dt=0.01):
        # Solve thermodynamics
        energy_matrix = self.diffusion_solver.solve(self.world.grid)
        
        # Update agent states based on local gradients
        for agent in agents:
            local_energy = energy_matrix[agent.pos]
            agent.update_state(local_energy, dt)
            
        return self.world.get_state()`,

  'agent.py': `class BioAgent(torch.nn.Module):
    def __init__(self, genome_code, species='generic'):
        super().__init__()
        self.genome = self.decode_genome(genome_code)
        self.metabolism = self.genome['metabolic_rate']
        self.pos = torch.randn(3) # Initial 3D position
        
    def forward(self, environment_state):
        # AI-driven decision making
        perception = self.sensors(environment_state)
        action = self.brain(perception)
        
        # Apply diffusion-based movement
        noise = torch.randn_like(self.pos) * 0.1
        self.pos += action * self.metabolism + noise
        
        return self.pos`,

  'experiment.py': `def run_experiment(config):
    # Initialize Virtual Lab
    env = SimulationEnvironment(dimension='3d')
    population = [BioAgent(species=config['species']) for _ in range(1000)]
    
    data_logger = []
    
    # Time-loop simulation
    for t in range(config['timesteps']):
        state = env.step(population)
        
        # Collect Metrics
        avg_health = torch.mean([a.health for a in population])
        clustering = phys.analyze_spatial_distribution(population)
        
        data_logger.append({
            'time': t,
            'health': avg_health,
            'spatial': clustering
        })
        
    return generate_research_paper(data_logger)`,
    
  'config.yaml': `experiment:
  name: "Targeted Drug Delivery Simulation"
  type: "biological"
  parameters:
    agent_count: 5000
    environment: "vascular_system"
    drug_concentration: 0.05
    duration_steps: 10000
  output:
    format: "pdf_academic"
    include_charts: true`
};

export const CodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<keyof typeof FILES>('experiment.py');

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 rounded-lg overflow-hidden font-mono text-sm shadow-xl border border-slate-800">
      <div className="flex items-center bg-slate-950 p-3 border-b border-slate-800 justify-between">
        <div className="flex items-center">
            <Box size={16} className="mr-2 text-indigo-400" />
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Simulation Kernel</span>
        </div>
        <span className="text-[10px] bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full">v2.4.0-alpha</span>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-slate-950 border-r border-slate-800 flex flex-col pt-2">
          {Object.keys(FILES).map((fileName) => (
            <button
              key={fileName}
              onClick={() => setActiveFile(fileName as keyof typeof FILES)}
              className={`flex items-center px-4 py-2.5 text-xs hover:bg-slate-900 transition-all border-l-2 ${
                activeFile === fileName 
                    ? 'text-indigo-400 bg-slate-900 border-indigo-500' 
                    : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              <FileCode size={14} className="mr-2 opacity-70" />
              {fileName}
            </button>
          ))}
        </div>
        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-[#0d1117]">
          <pre className="font-mono text-xs leading-relaxed text-slate-300">
            <code>{FILES[activeFile]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
