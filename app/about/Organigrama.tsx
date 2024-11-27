import { addEdge, Background, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import Nodo from './Nodo';
import '@xyflow/react/dist/style.css';
import { Persona } from '@prisma/client';
import { useEffect } from 'react';
const nodeTypes = {
    Nodo: Nodo
}
interface Props {
    personal: Persona[]
}
export default function Organigrama({ personal }: Props) {

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    useEffect(() => {
        if (personal) {
            let director = personal.find(value => value.cargo == 'jefe');
            let secre = personal.find(value => value.cargo == 'secretario');
            let tecnico = personal.find(value => value.cargo == 'tecnico');
            setNodes([
                {
                    id: '0',
                    data: {
                        nombre: 'UPEA',
                        cargo: 'upea'
                    },
                    type: 'Nodo',
                    position: { x: 150, y: 0 },
                    className: 'custom-node',
                    draggable: true,

                },
                {
                    id: 'jefe',
                    data: {
                        nombre: `${director?.nombre || ''} ${director?.paterno || ''} ${director?.materno || ''}`,
                        cargo: 'jefe'
                    },
                    type: 'Nodo',
                    position: { x: 150, y: 160 },
                },
                {
                    id: 'tecnico',
                    data: { nombre: `${tecnico?.nombre || ''} ${tecnico?.paterno || ''} ${tecnico?.materno || ''}`, cargo: 'tecnico' },
                    type: 'Nodo',
                    position: { x: 50, y: 340 }, // Alineado en x, sólo cambia en y
                },
                {
                    id: 'secretario',
                    data: { nombre: `${secre?.nombre || ''} ${secre?.paterno || ''} ${secre?.materno || ''}`, cargo: 'secretario' },
                    type: 'Nodo',
                    position: { x: 250, y: 340 }, // Continúa en línea recta hacia abajo
                }
            ] as any);
            setEdges([
                {
                    id: 'edge0',
                    source: '0',
                    target: 'jefe',
                    type: 'smoothstep', // Puedes experimentar con otros tipos como 'straight' o 'default'
                    animated: true,
                },
                {
                    id: 'edge1',
                    source: 'jefe',
                    target: 'tecnico',
                    type: 'smoothstep', // Puedes experimentar con otros tipos como 'straight' o 'default'
                    animated: true,
                },
                {
                    id: 'edge2',
                    source: 'jefe',
                    target: 'secretario',
                    type: 'smoothstep',
                    animated: true,
                }
            ] as any)
        }
    }, [personal])

    if (personal) {
        return (
            <>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes as any}
                    defaultEdgeOptions={{ animated: true, style: { stroke: '#666' } }}
                    attributionPosition="bottom-center"
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    zoomOnDoubleClick={false}
                    panOnScroll={false}
                    maxZoom={1}
                >
                    <Background />
                </ReactFlow>
            </>
        );
    }
    else return null;
}
