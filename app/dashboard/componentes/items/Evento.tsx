'use client';
import { Avatar, Box, Chip, Stack, Typography, } from "@mui/material";
import Link from "next/link";

import { Evento } from "@prisma/client";
import Image from 'next/legacy/image';
import { BoxSombra } from "../Mostrar";
import dayjs from "dayjs";
import { ChipBox } from "@/app/componentes/Mostrar";

interface Props {
    Evento: Evento;
}
const EventoComponent = ({ Evento }: Props) => {

    return (
        <BoxSombra overflow='hidden' mb={3}>
            <Box position='relative'>
                <Image layout='responsive' width={100} height={60} src={Evento.imagen} />
            </Box>
            <Box px={1}>
                <Typography mt={1} color='#a5afba' fontSize={12}>
                    Inicia el: {Evento.inicio ? dayjs(Evento.inicio, 'DD/MM/YYYY').format('DD/MM/YYYY') : 'Sin definir'}
                </Typography>
                <Link href='/'>
                    <Typography color='#212b36' fontSize={13} fontWeight={700} mt={2} mb={6} >
                        {Evento.titulo}
                    </Typography>
                </Link>
                <ChipBox
                    sx={{ position: 'absolute', right: 5, bottom: 30 }}
                    label={Evento.tipo == 'online' ? 'Evento online' : 'Evento presencial'} />
            </Box>
        </BoxSombra >
    )
}
export default EventoComponent;