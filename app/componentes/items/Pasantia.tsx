'use client';
import { Avatar, Box, Grid, Stack } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { FaBuildingColumns } from "react-icons/fa6";
import { Negrita, Normal } from "../Textos";
import { ChipBox } from "../Mostrar";
import { blue, green, grey, red } from "@mui/material/colors";
import { Carrera, Institucion, Pasantia, PasantiaCarrera } from "@prisma/client";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { fileDomain } from "@/utils/globals";
import { MdPhone } from "react-icons/md";
dayjs.locale('es');
dayjs.extend(require('dayjs/plugin/customParseFormat'));
interface Props {
    value: Pasantia & { PasantiaCarrera: (PasantiaCarrera & { Carrera: Carrera })[], Institucion: Institucion };
}
const PasantiaItem = ({ value }: Props) => {
    return (
        <Grid container bgcolor='white' sx={{
            overflow: 'hidden', borderRadius: 4, boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px',
            border: `1px solid ${grey[300]}`
        }}>
            <Grid xs={7} p={1}>
                <ChipBox sx={{ margin: 0, bgcolor: blue[600], borderRadius: 1.5, color: grey[50] }}
                    label={`${value.modalidad} meses`} />

                <Link href={`/pasantias/${value.id}`} style={{ textDecoration: 'none' }}>
                    <Negrita my={2}>
                        {value.titulo}
                    </Negrita>
                </Link>
                <Box my={2} alignItems='center' zIndex={10} display='flex' >
                    <Avatar sx={{ background: 'white', height: 50, width: 50 }}
                        src={value.Institucion.logo ? fileDomain + value.Institucion.logo : ''} />
                    <Box ml={2} >
                        <Negrita>
                            {value.Institucion.nombre}
                        </Negrita>

                        <Normal sx={{ color: '#777', display: 'flex', alignItems: 'center' }}>
                            <MdPhone style={{ marginRight: 5 }} />
                            {value.Institucion.contacto || 'Sin número'}
                        </Normal>
                    </Box>
                </Box>
            </Grid>
            <Grid xs={5} p={1}>
                <Box position='relative' sx={{ aspectRatio: 1 }}>
                    <ChipBox
                        sx={{ height: 30, position: 'absolute', top: -7, right: 0, background: dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0 ? green[500] : red[500], color: 'white', zIndex: 10 }}
                        label={dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0 ? 'Vigente' : 'Concluído'} />
                    <Link href={`/pasantias/${value.id}`}>
                        <Image objectFit="cover" layout='fill'
                            src={fileDomain + value.imagen} alt='' />
                    </Link>
                </Box>
            </Grid>
            <Grid item xs={12} borderTop='1px solid #ddd'>
                <Stack direction='row' p={0.7} flexWrap='wrap'>
                    {
                        value.PasantiaCarrera.map(value =>
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
            </Grid>
        </Grid >
    )
}
export default PasantiaItem;