

'use client';
import { Avatar, Box, Chip, Divider, Stack, } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { IoMdEye } from "react-icons/io";
import { BoxSombra, ChipBox } from "../Mostrar";
import { Negrita, Normal } from "../Textos";
import { blue, grey } from "@mui/material/colors";

const Actividad = () => {

    return (
        <BoxSombra position='relative' sx={{ borderRadius: 4 }}>
            <Box position='absolute' top={0} height={"100%"} width="100%" sx={{ filter: 'brightness(.7)' }}>
                <Image layout="fill" objectFit="cover" src='/eventos.jpg' alt="hola" />
            </Box>
            <Box position='relative' p={2}>
                <Avatar sx={{ bgcolor: '#0072b6' }}>
                    B
                </Avatar>
                <Normal sx={{ color: grey[100], py: 2, fontSize: 12 }}>17 May 2024</Normal>
                <Link href='/'>
                    <Negrita sx={{ color: grey[50], py: 1 }}>
                        Becas en Rusia
                    </Negrita>
                </Link>
                <Stack mt={2} direction='row' spacing={2}>
                    <Normal sx={{ fontSize: 12, color: blue[50] }} display='flex' alignItems='center'>
                        <IoMdEye fontSize={20} /> 1.95k
                    </Normal>
                    <ChipBox label='Beca' />
                </Stack>
            </Box>
        </BoxSombra>
    )
}
export default Actividad;