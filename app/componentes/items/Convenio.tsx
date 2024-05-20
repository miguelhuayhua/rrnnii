'use client';
import { Avatar, Box, Divider, Stack, Typography, } from "@mui/material";
import Link from "next/link";
import { Negrita, Normal, Titulo } from "../Textos";
import { GrGroup } from "react-icons/gr";
import { ChipBox } from "../Mostrar";
import { BiHome } from "react-icons/bi";
import { FaBuilding } from "react-icons/fa6";
import { RiGroup3Fill } from "react-icons/ri";
import { RxDotFilled } from "react-icons/rx";
import { GiConversation } from "react-icons/gi";


const Convenio = () => {

    return (
        <Box p={3} bgcolor='white' borderRadius={4}>
            <Avatar sx={{ bgcolor: '#0074b7', borderRadius: 2 }}>
                CN
            </Avatar>
            <Link href='/'>
                <Titulo sx={{ fontSize: 15, pt: 3, fontWeight: 600 }}>
                    Evento Productivo para becarios de Francia
                </Titulo>
            </Link>
            <Normal sx={{ mt: 1, color: '#929fac', fontSize: 12 }}>
                Termina el: 11 May 2024
            </Normal>
            <Normal sx={{ color: '#929fac', fontSize: 12 }}>
                Publicado el: 13 Ago 2024
            </Normal>
            <Negrita sx={{ color: '#36b98d', py: 1, fontWeight: 600 }}>
                <RiGroup3Fill /> 12 candidatos
            </Negrita>
            <Normal sx={{ fontWeight: 600, fontSize: 12 }}>
                <FaBuilding /> Cainco
            </Normal>
            <Normal sx={{ fontWeight: 600, fontSize: 12 }}>
                <GiConversation /> Convenio Nacional
            </Normal>
            <Divider sx={{ borderColor: '#eee' }}></Divider>
            <Stack pt={3} direction='row' flexWrap='wrap'>
                <ChipBox label='Ingeniería de Sistemas'></ChipBox>
                <ChipBox label='Medicina'></ChipBox>
            </Stack>
        </Box>
    )
}
export default Convenio;