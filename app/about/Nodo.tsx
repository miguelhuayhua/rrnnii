import React from 'react';
import { Box, Divider } from '@mui/material';
import { Negrita, Normal } from '../componentes/Textos';
import { Handle, Position } from '@xyflow/react';
import { grey } from '@mui/material/colors';
import { Persona } from '@prisma/client';

const Nodo = (({ data }: any) => {
    return (
        <Box width={180} className='nodrag'>
            <Handle
                type="source"

                position={Position.Bottom}
                style={{ opacity: (data.cargo == 'tecnico' || data.cargo == 'secre') ? 0 : 1 }} // Ajusta el tamaño a 0 para ocultar
                id="bottom"
            />
            <Handle
                type="target"
                position={Position.Top}
                style={{ opacity: 0 }} // Ajusta el tamaño a 0 para ocultar
                id="top"
            />
            <Box sx={{ borderRadius: 2, bgcolor: grey[200] }} >
                <Box p={1} sx={{ background: data.cargo == 'upea' ? 'linear-gradient(135deg, rgba(147,54,63,1) 0%, rgba(72,72,194,1) 99%)' : grey[800] }}>
                    <Negrita sx={{
                        fontSize: 15,
                        color: 'white',
                        textAlign: 'center', fontWeight: 800
                    }}>
                        {data.cargo == 'secre' ? 'Secretario(a)' : data.cargo == 'tecnico' ? 'Técnico' : data.cargo == 'jefe' ? 'Jefe de Unidad' : 'Rectorado'}
                    </Negrita>
                </Box>
                <Divider />
                <Box bgcolor='white' p={1.5}
                    border='1px solid #ccc' sx={{
                        borderBottomRightRadius: 2,
                        borderBottomLeftRadius: 2
                    }}>
                    <Normal sx={{ fontSize: 14, textAlign: 'center' }}>
                        {data.nombre}
                    </Normal>
                </Box>
            </Box>
        </Box>
    );
});

export default Nodo;