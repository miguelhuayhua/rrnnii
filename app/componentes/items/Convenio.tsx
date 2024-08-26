'use client';
import { Avatar, Box, Divider, Grid, Stack, Typography, } from "@mui/material";
import Link from "next/link";
import { Negrita, Normal, Titulo } from "../Textos";
import { ChipBox } from "../Mostrar";
import Image from 'next/legacy/image';
import { FaBuilding } from "react-icons/fa6";
import { RiGroup3Fill } from "react-icons/ri";
import { GiConversation } from "react-icons/gi";
import { blue, green, grey } from "@mui/material/colors";
import { Convenio, Institucion } from "@prisma/client";
import dayjs from "dayjs";

interface Props {
    value: Convenio & { Institucion: Institucion };
}

const ConvenioItem = ({ value }: Props) => {

    return (
        <Box bgcolor='white' borderRadius={4} overflow='hidden' border={`1px solid ${grey[100]}`}>
            <Grid container>
                <Grid item xs={6} p={2}>
                    <Avatar sx={{ bgcolor: blue[600], borderRadius: 2 }}>
                        C{value.tipo.charAt(0).toUpperCase()}
                    </Avatar>
                    <Link href='/'>
                        <Negrita sx={{ pt: 2 }}>
                            {value.titulo}
                        </Negrita>
                    </Link>
                    <Normal sx={{ mt: 1, fontSize: 12 }}>
                        Termina el: {value.finalizacion}
                    </Normal>
                    <Normal sx={{ fontSize: 12 }}>
                        Publicado el: {dayjs(value.createdAt).format('DD/MM/YYYY')}
                    </Normal>
                    <Negrita sx={{ py: 1, fontWeight: 600, color: green[500] }}>
                        <RiGroup3Fill /> 12 candidatos
                    </Negrita>
                    <Normal sx={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center' }}>
                        <FaBuilding style={{ marginRight: 5 }} /> {value.Institucion.nombre}
                    </Normal>
                    <Normal sx={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center' }}>
                        <GiConversation style={{ marginRight: 5 }} /> Convenio {value.tipo}
                    </Normal>
                </Grid>
                <Grid item xs={6}>
                    <Image src={value.imagen} height={100} objectFit="cover" width={100} layout="responsive" />
                </Grid>
            </Grid>
            <Divider sx={{ borderColor: '#eee' }}></Divider>
            <Stack p={1} direction='row' flexWrap='wrap'>
                <ChipBox label='Ingeniería de Sistemas'></ChipBox>
                <ChipBox label='Medicina'></ChipBox>
            </Stack>
        </Box>
    )
}
export default ConvenioItem;