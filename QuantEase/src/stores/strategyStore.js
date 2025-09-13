import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useStrategyStore = create((set, get) => ({
  // Strategy data
  currentStrategy: {
    id: null,
    name: '',
    description: '',
    config_json: {
      nodes: [],
      edges: [],
      indicators: [],
      conditions: [],
      parameters: {}
    }
  },
  
  // React Flow state
  nodes: [],
  edges: [],
  
  // UI state
  isDialogOpen: false,
  selectedNode: null,
  isDirty: false,
  
  // Strategy list
  strategies: [],
  
  // Actions
  setDialogOpen: (open) => set({ isDialogOpen: open }),
  
  setSelectedNode: (node) => set({ selectedNode: node }),
  
  setNodes: (nodes) => {
    set({ nodes, isDirty: true });
    // Update config_json
    const state = get();
    set({
      currentStrategy: {
        ...state.currentStrategy,
        config_json: {
          ...state.currentStrategy.config_json,
          nodes: nodes
        }
      }
    });
  },
  
  setEdges: (edges) => {
    set({ edges, isDirty: true });
    // Update config_json
    const state = get();
    set({
      currentStrategy: {
        ...state.currentStrategy,
        config_json: {
          ...state.currentStrategy.config_json,
          edges: edges
        }
      }
    });
  },
  
  addNode: (type, position, data = {}) => {
    const newNode = {
      id: uuidv4(),
      type,
      position,
      data: {
        label: `${type} ${get().nodes.filter(n => n.type === type).length + 1}`,
        ...data
      }
    };
    
    const currentNodes = get().nodes;
    set({ 
      nodes: [...currentNodes, newNode],
      isDirty: true 
    });
    
    return newNode;
  },
  
  updateNode: (nodeId, data) => {
    const state = get();
    const updatedNodes = state.nodes.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...data } }
        : node
    );
    
    set({ 
      nodes: updatedNodes,
      isDirty: true,
      currentStrategy: {
        ...state.currentStrategy,
        config_json: {
          ...state.currentStrategy.config_json,
          nodes: updatedNodes
        }
      }
    });
  },
  
  deleteNode: (nodeId) => {
    const state = get();
    const updatedNodes = state.nodes.filter(node => node.id !== nodeId);
    const updatedEdges = state.edges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    );
    
    set({ 
      nodes: updatedNodes,
      edges: updatedEdges,
      isDirty: true,
      currentStrategy: {
        ...state.currentStrategy,
        config_json: {
          ...state.currentStrategy.config_json,
          nodes: updatedNodes,
          edges: updatedEdges
        }
      }
    });
  },
  
  updateStrategy: (updates) => {
    const state = get();
    set({
      currentStrategy: {
        ...state.currentStrategy,
        ...updates
      },
      isDirty: true
    });
  },
  
  resetStrategy: () => {
    set({
      currentStrategy: {
        id: null,
        name: '',
        description: '',
        config_json: {
          nodes: [],
          edges: [],
          indicators: [],
          conditions: [],
          parameters: {}
        }
      },
      nodes: [],
      edges: [],
      isDirty: false,
      selectedNode: null
    });
  },
  
  loadStrategy: (strategy) => {
    set({
      currentStrategy: strategy,
      nodes: strategy.config_json?.nodes || [],
      edges: strategy.config_json?.edges || [],
      isDirty: false,
      selectedNode: null
    });
  },
  
  setStrategies: (strategies) => set({ strategies }),
  
  addStrategy: (strategy) => {
    const state = get();
    set({ strategies: [strategy, ...state.strategies] });
  },
  
  // Generate config for backend
  generateConfig: () => {
    const state = get();
    const indicators = [];
    const conditions = [];
    
    // Process nodes to extract indicators and conditions
    state.nodes.forEach(node => {
      if (node.type === 'indicator') {
        indicators.push({
          type: node.data.indicatorType || 'SMA',
          window: node.data.window || 14,
          ...node.data.parameters
        });
      } else if (node.type === 'condition') {
        conditions.push({
          type: node.data.conditionType || 'greater_than',
          value: node.data.value || 0,
          ...node.data.parameters
        });
      }
    });
    
    return {
      ...state.currentStrategy.config_json,
      indicators,
      conditions,
      nodes: state.nodes,
      edges: state.edges
    };
  }
}));

export default useStrategyStore;
