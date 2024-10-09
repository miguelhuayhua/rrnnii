'use client';
import { Avatar, Box, Divider, Grid, Stack, } from "@mui/material";
import Link from "next/link";
import { Negrita, Normal } from "../Textos";
import { ChipBox } from "../Mostrar";
import Image from 'next/legacy/image';
import { Icon as Iconify } from '@iconify/react';
import { FaBuildingColumns } from "react-icons/fa6";
import { blue, green, grey } from "@mui/material/colors";
import { Carrera, Convenio, ConvenioCarrera, Institucion } from "@prisma/client";
import dayjs from "dayjs";
import { fileDomain } from "@/utils/globals";
import { MdPhone } from "react-icons/md";
import 'dayjs/locale/es';
import plugin from 'dayjs/plugin/customParseFormat';
import { IoMdCalendar } from "react-icons/io";
dayjs.extend(plugin)
dayjs.locale('es');
interface Props {
    value: Convenio & { Institucion: Institucion, ConvenioCarrera: (ConvenioCarrera & { Carrera: Carrera })[] };
}

const ConvenioItem = ({ value }: Props) => {
    return (
        <Box bgcolor='white' borderRadius={4} overflow='hidden' border={`1px solid ${grey[300]}`} position='relative'>
            <Grid container>
                <Grid item xs={12} position='relative'>
                    <Link href={`/convenios/${value.id}`}>
                        <Image style={{ filter: 'brightness(0.4)' }} src={fileDomain + value.imagen} height={90} objectFit="cover" width={100} layout="responsive" />
                    </Link>
                    <Box alignItems='center' zIndex={10} display='flex' position='absolute' left={10} bottom={20}>
                        <Avatar sx={{ background: 'white', height: 70, width: 70 }}
                            src={value.Institucion.logo ? fileDomain + value.Institucion.logo : ''} />
                        <Box ml={2}>
                            <Negrita sx={{ fontSize: 18, color: 'white' }}>
                                {value.Institucion.nombre}
                            </Negrita>

                            <Normal sx={{ color: '#bbb', display: 'flex', alignItems: 'center' }}>
                                <MdPhone style={{ marginRight: 5 }} />
                                {value.Institucion.contacto || 'Sin número'}
                            </Normal>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} p={1}>
                    <Avatar sx={{ bgcolor: value.tipo == 'nacional' ? blue[600] : green[600], borderRadius: 2, position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
                        C{value.tipo.charAt(0).toUpperCase()}
                    </Avatar>
                    <Normal sx={{ color: '#bbb' }}>
                        {dayjs(value.createdAt).format('DD MMMM YYYY')}
                    </Normal>
                    <Normal sx={{
                        display: 'flex',
                        color: '#ddd',
                        alignItems: 'center', position: 'absolute', right: 15, top: 15
                    }}>
                        <Iconify fontSize={30} style={{ marginRight: 5, borderRadius: 10 }} icon={`flag:${value.tipo == 'nacional' ? 'bo' : value.pais.toLowerCase()}-4x3`} />
                        {value.tipo == 'nacional' ? 'BO' : value.pais}
                    </Normal>
                    <Link href={`/convenios/${value.id}`} style={{ textDecoration: 'none' }}>
                        <Negrita mb={2} >
                            {value.titulo}
                        </Negrita>
                    </Link>
                    <Normal sx={{ display: 'flex', alignItems: 'center', color: '#777' }}>
                        <IoMdCalendar style={{ marginRight: 5, fontSize: 22 }} />
                        {dayjs(value.finalizacion, 'DD/MM/YYYY').format('[Finaliza el] DD [de] MMMM [del] YYYY')}
                    </Normal>
                </Grid>
            </Grid>
            <Divider sx={{ borderColor: grey[300], my: 0, py: 0 }} />
            <Stack direction='row' p={0.7} flexWrap='wrap'>
                {
                    value.ConvenioCarrera.map(value =>
                    (<ChipBox
                        key={value.id}
                        label={<Normal
                            sx={{
                                fontSize: 12,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around'
                            }}>
                            {value.Carrera.logo ?
                                <Image src={fileDomain + value.Carrera.logo} width={20} height={20} style={{ borderRadius: 4 }}
                                    layout='fixed' /> : <FaBuildingColumns style={{ marginRight: 5 }} fontSize={15} />}
                            <span style={{ marginLeft: 5 }}>
                                {value.Carrera.nombre}
                            </span>
                        </Normal>} />)
                    )
                }
            </Stack>
        </Box>
    )
}
export default ConvenioItem;