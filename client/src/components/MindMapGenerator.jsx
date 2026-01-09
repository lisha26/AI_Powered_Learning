import React, { useEffect, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState
} from 'react-flow-renderer';
import { generateMindMap } from '../services/api';

const MindMapGenerator = ({ topic, onGenerate }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!topic) return;
        setLoading(true);
        setNodes([]);
        setEdges([]);

        generateMindMap(topic)
            .then(data => {
                if (data && data.nodes) {
                    const spacedNodes = data.nodes.map((node, i) => ({
                        ...node,
                        position: node.position || { x: (i % 3) * 250, y: Math.floor(i / 3) * 150 },
                        style: {
                            background: '#1e293b',
                            color: '#fff',
                            border: '1px solid #6366f1',
                            borderRadius: '8px',
                            padding: '10px'
                        }
                    }));
                    setNodes(spacedNodes);
                    setEdges(data.edges || []);
                    onGenerate();
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [topic]);

    if (loading) return (
        <div className="section" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loader"></div>
            <p>Structuring mind map...</p>
        </div>
    );

    return (
        <div style={{ height: '600px', width: '100%', border: '1px solid var(--glass-border)', borderRadius: '12px', background: '#020617', overflow: 'hidden' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
            >
                <MiniMap nodeColor="#6366f1" maskColor="rgba(0,0,0,0.6)" />
                <Controls style={{ background: '#1e293b', color: '#fff', border: 'none' }} />
                <Background color="#334155" gap={16} />
            </ReactFlow>
        </div>
    );
};

export default MindMapGenerator;
