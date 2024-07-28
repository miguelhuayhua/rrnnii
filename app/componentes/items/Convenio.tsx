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
import { green, grey } from "@mui/material/colors";


const Convenio = () => {

    return (
        <Box p={3} bgcolor='white' borderRadius={4} border={`1px solid ${grey[100]}`}>
            <Avatar sx={{ bgcolor: '#0074b7', borderRadius: 2 }}>
                CN
            </Avatar>
            <Link href='/'>
                <Negrita sx={{ pt: 2 }}>
                    Evento Productivo para becarios de Francia
                </Negrita>
            </Link>
            <Normal sx={{ mt: 1, fontSize: 12 }}>
                Termina el: 11 May 2024
            </Normal>
            <Normal sx={{ fontSize: 12 }}>
                Publicado el: 13 Ago 2024
            </Normal>
            <Negrita sx={{ py: 1, fontWeight: 600, color: green[500] }}>
                <RiGroup3Fill /> 12 candidatos
            </Negrita>
            <Normal sx={{ fontWeight: 600, fontSize: 13 }}>
                <FaBuilding /> Cainco
            </Normal>
            <Normal sx={{ fontWeight: 600, fontSize: 13 }}>
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