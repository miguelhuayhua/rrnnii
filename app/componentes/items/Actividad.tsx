'use client';
import { Avatar, Box, Stack, } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { BoxSombra, ChipBox } from "../Mostrar";
import { Negrita, Normal } from "../Textos";
import { blue, grey } from "@mui/material/colors";
import { Actividad } from "@prisma/client";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { fileDomain } from "@/utils/globals";
dayjs.locale('es');
interface Props {
    value: Actividad;
}

const ActividadItem = ({ value }: Props) => {

    return (
        <BoxSombra position='relative' sx={{ borderRadius: 4, py: 2, border: '1px solid #eee' }}>
            <Box position='absolute' top={0} height={"100%"} width="100%" sx={{ filter: 'brightness(.5)' }}>
                <Link href={`/actividades/${value.id}`} style={{ textDecoration: 'none' }}>
                    <Image layout="fill" objectFit="cover" src={fileDomain + value.imagen} alt={`Imagen de ${value.titulo}`} />
                </Link>
            </Box>
            <Box position='relative' p={2}>
                <Avatar sx={{ bgcolor: blue[600] }}>
                    {value.tipo.charAt(0).toUpperCase()}
                </Avatar>
                <Normal sx={{ color: grey[100], py: 2, fontSize: 12 }}>
                    {dayjs(value.createdAt).format('DD MMMM YYYY')}
                </Normal>
                <Link href={`/actividades/${value.id}`} style={{ textDecoration: 'none' }}>
                    <Negrita sx={{ color: grey[50], py: 1, fontSize: 16 }}>
                        {value.titulo}
                    </Negrita>
                </Link>
                <Stack mt={2} direction='row' spacing={2}>
                    <ChipBox label={value.tipo.toUpperCase()} />
                </Stack>
            </Box>
        </BoxSombra>
    )
}
export default ActividadItem;