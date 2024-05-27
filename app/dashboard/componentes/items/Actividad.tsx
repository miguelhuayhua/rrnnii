'use client';
import { Box, Chip, Stack, Typography, } from "@mui/material";
import { Actividad } from "@prisma/client";
import { BoxSombra } from "../Mostrar";
import Image from 'next/legacy/image';

interface Props {
    Actividad: Actividad;
}
const ActividadComponent = ({ Actividad }: Props) => {
    return (
        <BoxSombra >
            <Box position='absolute' top={0} height={"100%"} width="100%" sx={{ filter: 'brightness(.7)', borderRadius: 4, overflow: 'hidden' }}>
                <Image layout="fill" objectFit="cover" src={Actividad.imagen} alt="hola" />
            </Box>
            <Box position='relative' px={2}>
                <Stack mb={4} direction='row' spacing={2}>
                    <Chip sx={{ bgcolor: '#212b36', height: 20, borderRadius: 2, fontSize: 11, color: '#eee', fontWeight: 600 }} label={Actividad.tipo} />
                </Stack>
                <Typography mt={8} mb={6} color='#ffffff' fontSize={14} fontWeight={600}>
                    {Actividad.titulo}
                </Typography>
            </Box>
        </BoxSombra>
    )
}
export default ActividadComponent;