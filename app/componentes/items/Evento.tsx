'use client';
import { Avatar, Box } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { TbWorld } from "react-icons/tb";
import { BotonSimple } from "../Botones";
import { FaLink } from "react-icons/fa6";
import { ChipBox } from "../Mostrar";
import { Negrita, Normal } from "../Textos";
import { green, grey } from "@mui/material/colors";
import { Evento } from "@prisma/client";
import dayjs from "dayjs";

interface Props {
    value: Evento;
}

import 'dayjs/locale/es';
import { fileDomain } from "@/utils/globals";
dayjs.locale('es');
const EventoItem = ({ value }: Props) => {

    return (
        <Box bgcolor='white !important' sx={{ overflow: 'hidden', borderRadius: 4, boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px', }}>
            <Box position='relative'>
                <Link href={`/eventos/${value.id}`}>
                    <Image layout='responsive' objectFit="cover" width={100} height={70}
                        src={fileDomain + value.imagen} alt={`Imagen de: ${value.titulo}`} />
                </Link>
                <svg className='dec' fill="none" viewBox="0 0 144 62" xmlns="http://www.w3.org/2000/svg"><path d="m111.34 23.88c-10.62-10.46-18.5-23.88-38.74-23.88h-1.2c-20.24 0-28.12 13.42-38.74 23.88-7.72 9.64-19.44 11.74-32.66 12.12v26h144v-26c-13.22-.38-24.94-2.48-32.66-12.12z" fill="currentColor" fill-rule="evenodd"></path></svg>
            </Box>
            <Box p={2} position='relative'>
                <Avatar sx={{ bgcolor: green[500], position: 'absolute', top: -18, left: 24, zIndex: 10 }}>
                    <TbWorld />
                </Avatar>
                <Normal sx={{ fontSize: 12, pt: 2, color: grey[600] }}>
                    Inicia el: {value.inicio}
                </Normal>
                <Link href={`/eventos/${value.id}`} style={{ textDecoration: 'none' }}>
                    <Negrita py={2}>
                        {value.titulo}
                    </Negrita>
                </Link>
                <ChipBox label={`Evento ${value.tipo}`} />
            </Box>
        </Box >
    )
}
export default EventoItem;