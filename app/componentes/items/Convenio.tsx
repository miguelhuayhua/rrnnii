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
import { Carrera, Convenio, ConvenioCarrera, Institucion } from "@prisma/client";
import dayjs from "dayjs";

interface Props {
    value: Convenio & { Institucion: Institucion, ConvenioCarrera: (ConvenioCarrera & { Carrera: Carrera })[] };
}

const ConvenioItem = ({ value }: Props) => {

    return (
        <Box bgcolor='white' borderRadius={4} overflow='hidden' border={`1px solid ${grey[100]}`} position='relative'>
            <Grid container>
                <Grid item xs={12} lg={6} >
                    <Image src={value.imagen} height={100} objectFit="cover" width={100} layout="responsive" />
                </Grid>
                <Grid item xs={12} lg={6} py={0.5} px={{ xs: 0.5, md: 2 }}>
                    <Avatar sx={{ bgcolor: value.tipo == 'nacional' ? blue[600] : green[600], borderRadius: 2, position: 'absolute', top: 5, left: 5, zIndex: 10 }}>
                        C{value.tipo.charAt(0).toUpperCase()}
                    </Avatar>
                    <Link href='/'>
                        <Negrita>
                            {value.titulo}
                        </Negrita>
                    </Link>
                    <Normal sx={{ mt: 1, fontSize: 11 }}>
                        Termina el: {value.finalizacion}
                    </Normal>
                    <Normal sx={{ fontSize: 11 }}>
                        Publicado el: {dayjs(value.createdAt).format('DD/MM/YYYY')}
                    </Normal>
                    <Negrita sx={{ py: 1, fontWeight: 600, color: green[500], fontSize: 12, display: 'flex', alignItems: 'center' }}>
                        <RiGroup3Fill /> <i style={{ marginLeft: 5 }}>12 candidatos</i>
                    </Negrita>
                    <Normal sx={{ fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center' }}>
                        <FaBuilding style={{ marginRight: 5 }} /> <i>{value.Institucion.nombre}</i>
                    </Normal>
                    <Normal sx={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center' }}>
                        <GiConversation style={{ marginRight: 5 }} /> Convenio {value.tipo}
                    </Normal>
                </Grid>

            </Grid>
            <Divider sx={{ borderColor: '#eee' }}></Divider>
            <Stack direction='row' px={0.5} flexWrap='wrap'>
                {
                    value.ConvenioCarrera.map(value =>
                        (<ChipBox key={value.id} label={value.Carrera.nombre} />)
                    )
                }
            </Stack>
        </Box>
    )
}
export default ConvenioItem;