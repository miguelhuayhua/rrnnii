

'use client';
import { Avatar, Box, Chip, Divider, Stack, Typography, } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { IoMdEye } from "react-icons/io";
import { BoxSombra } from "../Mostrar";

const Actividad = () => {

    return (
        <BoxSombra position='relative' sx={{ borderRadius: 4}}>
            <Box position='absolute' top={0} height={"100%"} width="100%" sx={{ filter: 'brightness(.7)' }}>
                <Image layout="fill" objectFit="cover" src='/eventos.jpg' alt="hola" />
            </Box>
            <Box position='relative' p={2}>
                <Avatar sx={{ bgcolor: '#0072b6' }}>
                    B
                </Avatar>
                <Typography mt={15} color='#c1a7af' fontSize={12} fontWeight={500} >17 May 2024</Typography>
                <Link href='/'>
                    <Typography mt={1} color='#ffffff' fontSize={14} fontWeight={600}>
                        Becas en Rusia
                    </Typography>
                </Link>
                <Stack mt={2} direction='row' spacing={2}>
                    <Typography color='#d0bdc1' fontSize={12} display='flex' alignItems='center'>
                        <IoMdEye fontSize={20} /> 1.95k
                    </Typography>
                    <Chip sx={{ bgcolor: 'transparent', height: 20, borderRadius: 2, fontSize: 11, color: '#a8bdc4', border: '1px solid #a8bdc4', fontWeight: 600 }} label='Beca' />
                </Stack>
            </Box>
        </BoxSombra>
    )
}
export default Actividad;