'use client';
import { Avatar, Box, Grid, Stack } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { FaBuildingColumns } from "react-icons/fa6";
import { Negrita, Normal } from "../Textos";
import { BoxSombra, ChipBox } from "../Mostrar";
import { blue, green, grey, red } from "@mui/material/colors";
import { Carrera, Institucion, Pasantia, PasantiaCarrera } from "@prisma/client";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { Icon } from '@iconify/react';
import { fileDomain } from "@/utils/globals";
import { MdPhone } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Button } from "rsuite";
dayjs.locale('es');
dayjs.extend(require('dayjs/plugin/customParseFormat'));
interface Props {
    value: Pasantia & { PasantiaCarrera: (PasantiaCarrera & { Carrera: Carrera })[], Institucion: Institucion };
}
const PasantiaItem = ({ value }: Props) => {
    const router = useRouter();
    return (
        <BoxSombra width={"100%"} position='relative'>
            <Negrita sx={{
                display: 'flex', alignItems: 'center', color: grey[50],
                position: 'absolute', top: 10, right: 10, zIndex: 2
            }}>
                {value.conteo}
                <Icon style={{ marginLeft: 4, fontSize: 16 }} icon="solar:eye-bold" />
            </Negrita>
            <Grid container>
                <Grid item xs={8} p={1}>
                    <Link href={`/pasantias/${value.id}`} style={{ textDecoration: 'none' }}>
                        <Negrita py={1} mb={2}>
                            {value.titulo}
                        </Negrita>
                    </Link>
                    <Normal sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Icon icon="lets-icons:calendar-light" fontSize={22} style={{ marginRight: 10 }} />
                        {dayjs(value.finalizacion, 'DD/MM/YYYY').format('[Finaliza el] DD [de] MMMM [del] YYYY')}
                    </Normal>
                    <Normal sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Icon icon="iconamoon:category-thin" fontSize={22} style={{ marginRight: 10 }} />
                        {value.modalidad == 'more' ? 'Más de 6 meses' :
                            value.modalidad + ' Meses'}
                    </Normal>
                    <Normal sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Image
                            width={22} height={22} layout="fixed"
                            style={{ borderRadius: "50%", border: '1px solid #eee' }}
                            src={value.Institucion.logo ? (fileDomain + value.Institucion.logo) : '/default-image.jpg'} />
                        <span style={{ marginLeft: 10 }}>
                            Institución {`"${value.Institucion.nombre}"`}
                        </span>
                    </Normal>
                </Grid>

                <Grid item xs={4} position='relative'>
                    <Link href={`/pasantias/${value.id}`}>
                        <Image style={{ filter: 'brightness(0.4)', aspectRatio: 1 }}
                            objectFit="cover" layout='fill' width={100} height={100}
                            src={fileDomain + value.imagen} alt={`Imagen de: ${value.titulo}`} />
                    </Link>
                    <Button
                        onClick={() => {
                            router.push(`/pasantias/${value.id}`)
                        }}
                        style={{
                            position: 'absolute',
                            borderRadius: 0,
                            bottom: 0, width: "100%"
                        }}
                        appearance='primary'>
                        <Icon icon="ep:right" fontSize={18} />
                    </Button>
                </Grid>
            </Grid>
        </BoxSombra >

    )
}
export default PasantiaItem;