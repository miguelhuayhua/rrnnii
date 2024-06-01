'use client';
import { Box, Chip, Stack, Typography, } from "@mui/material";
import { Actividad } from "@prisma/client";
import { BoxSombra } from "../Mostrar";
import Image from 'next/legacy/image';
import dayjs from "dayjs";
import { ChipBox } from "@/app/componentes/Mostrar";

interface Props {
    Actividad: Actividad;
}
const ActividadComponent = ({ Actividad }: Props) => {
    return (

        <BoxSombra overflow='hidden' mb={3} >
            <Image layout='responsive' width={100} height={100} src={Actividad.imagen} objectFit="cover" />
            <Box px={1}>
                <Typography mt={1} color='#a5afba' fontSize={12}>
                    Publicado el: {dayjs(Actividad.createdAt).format('DD/MM/YYYY - HH:mm:ss')}
                </Typography>
                <Typography color='#212b36' fontSize={13} fontWeight={700} mt={2} mb={6} >
                    {Actividad.titulo}
                </Typography>
                <ChipBox
                    sx={{ position: 'absolute', right: 5, bottom: 30 }}
                    label={Actividad.tipo} />
            </Box>
        </BoxSombra >
    )
}
export default ActividadComponent;