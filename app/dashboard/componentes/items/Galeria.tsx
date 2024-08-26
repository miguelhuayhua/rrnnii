'use client';
import { Box, Typography } from "@mui/material";
import { Galeria } from "@prisma/client";
import Image from 'next/legacy/image';

interface Props {
    Galeria: Galeria;
}
const GaleriaComponent = ({ Galeria }: Props) => {

    return (
        <Box bgcolor='white !important' sx={{ overflow: 'hidden', borderRadius: 4, boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px' }}>
            <Box position='relative'>
                <Image style={{ filter: 'brightness(.75)' }} layout='responsive' width={100} height={100} src={Galeria.imagen} objectFit="cover" />
            </Box>
            <Box p={1} position='relative'>
                <Typography color='#212b36' fontSize={13} fontWeight={700}>
                    {Galeria.titulo}
                </Typography>
            </Box>
        </Box >
    )
}
export default GaleriaComponent;