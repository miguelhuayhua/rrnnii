'use client';
import { Avatar, Box, Divider, Grid, Stack, Typography, } from "@mui/material";
import Link from "next/link";
import { GrGroup } from "react-icons/gr";
import { BiEdit, BiHome } from "react-icons/bi";
import { FaBuilding } from "react-icons/fa6";
import { RiEditFill, RiGroup3Fill } from "react-icons/ri";
import { RxDotFilled } from "react-icons/rx";
import { GiConversation } from "react-icons/gi";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { ChipBox } from "@/app/componentes/Mostrar";
import { Galeria } from "@prisma/client";
import { BoxSombra } from "../Mostrar";
import Image from 'next/legacy/image';
import dayjs from "dayjs";
import { BotonFilled } from "@/app/componentes/Botones";

interface Props {
    Galeria: Galeria;
}
const GaleriaComponent = ({ Galeria }: Props) => {

    return (
        <Box bgcolor='white !important' sx={{ overflow: 'hidden', borderRadius: 4, boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px' }}>
            <Box position='relative'>
                <Image style={{ filter: 'brightness(.75)' }} layout='responsive' width={100} height={100} src={Galeria.imagen} objectFit="cover" />
                <svg className='dec' fill="none" viewBox="0 0 144 62" xmlns="http://www.w3.org/2000/svg"><path d="m111.34 23.88c-10.62-10.46-18.5-23.88-38.74-23.88h-1.2c-20.24 0-28.12 13.42-38.74 23.88-7.72 9.64-19.44 11.74-32.66 12.12v26h144v-26c-13.22-.38-24.94-2.48-32.66-12.12z" fill="currentColor" fill-rule="evenodd"></path></svg>
            </Box>
            <Box p={1} position='relative'>
                <Typography color='#212b36' fontSize={11} mt={2} fontWeight={700}>
                    {Galeria.titulo}
                </Typography>
            </Box>
        </Box >
    )
}
export default GaleriaComponent;