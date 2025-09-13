import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import IndicatorNode from './nodes/IndicatorNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';
import useStrategyStore from '@/stores/strategyStore';

const StrategyCanvas = () => {
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    setSelectedNode,
    deleteNode 
  } = useStrategyStore();

  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges);

  // Sync local state with store
  React.useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes, setLocalNodes]);

  React.useEffect(() => {
    setLocalEdges(edges);
  }, [edges, setLocalEdges]);

  // Custom node types
  const nodeTypes = useMemo(() => ({
    indicator: (props) => <IndicatorNode {...props} data={{ ...props.data, onDelete: deleteNode }} />,
    condition: (props) => <ConditionNode {...props} data={{ ...props.data, onDelete: deleteNode }} />,
    action: (props) => <ActionNode {...props} data={{ ...props.data, onDelete: deleteNode }} />
  }), [deleteNode]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: '#6366f1', strokeWidth: 2 }
      };
      
      const updatedEdges = addEdge(newEdge, localEdges);
      setLocalEdges(updatedEdges);
      setEdges(updatedEdges);
    },
    [localEdges, setLocalEdges, setEdges]
  );

  const onNodesChangeHandler = useCallback(
    (changes) => {
      onNodesChange(changes);
      // Update store after a delay to avoid too many updates
      setTimeout(() => {
        const updatedNodes = localNodes.map(node => {
          const change = changes.find(c => c.id === node.id);
          if (change && change.type === 'position' && change.position) {
            return { ...node, position: change.position };
          }
          return node;
        });
        setNodes(updatedNodes);
      }, 100);
    },
    [onNodesChange, localNodes, setNodes]
  );

  const onEdgesChangeHandler = useCallback(
    (changes) => {
      onEdgesChange(changes);
      // Update store after a delay
      setTimeout(() => {
        setEdges(localEdges);
      }, 100);
    },
    [onEdgesChange, localEdges, setEdges]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const defaultEdgeOptions = {
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: { stroke: '#6366f1', strokeWidth: 2 }
  };

  return (
    <div className="h-96 border-2 border-dashed border-gray-300 rounded-lg">
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChangeHandler}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.type === 'indicator') return '#3b82f6';
            if (n.type === 'condition') return '#8b5cf6';
            if (n.type === 'action') return '#10b981';
            return '#6b7280';
          }}
          nodeColor={(n) => {
            if (n.type === 'indicator') return '#dbeafe';
            if (n.type === 'condition') return '#e9d5ff';
            if (n.type === 'action') return '#d1fae5';
            return '#f3f4f6';
          }}
          nodeBorderRadius={8}
        />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default StrategyCanvas;
