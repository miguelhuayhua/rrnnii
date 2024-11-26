'use client';
import { Avatar, Box, Divider, Grid, Stack, } from "@mui/material";
import Link from "next/link";
import { Negrita, Normal } from "../Textos";
import { BoxSombra, ChipBox } from "../Mostrar";
import Image from 'next/legacy/image';
import { Icon } from '@iconify/react';
import { FaBuildingColumns } from "react-icons/fa6";
import { grey } from "@mui/material/colors";
import { Carrera, Convenio, ConvenioCarrera, Institucion } from "@prisma/client";
import dayjs from "dayjs";
import { fileDomain } from "@/utils/globals";
import { MdPhone } from "react-icons/md";
import 'dayjs/locale/es';
import plugin from 'dayjs/plugin/customParseFormat';
import { IoMdCalendar } from "react-icons/io";
import { Button } from "rsuite";
import { useRouter } from "next/navigation";
dayjs.extend(plugin)
dayjs.locale('es');
interface Props {
    value: Convenio & { Institucion: Institucion, ConvenioCarrera: (ConvenioCarrera & { Carrera: Carrera })[] };
}

const ConvenioItem = ({ value }: Props) => {
    const router = useRouter();
    return (
        <BoxSombra width={"100%"}
            display='flex' position='relative' mb={5}>
            <Negrita sx={{
                display: 'flex', alignItems: 'center', color: grey[50],
                position: 'absolute', top: 10, right: 10, zIndex: 2
            }}>
                {value.conteo}
                <Icon style={{ marginLeft: 4, fontSize: 16 }} icon="solar:eye-bold" />
            </Negrita>
            <Grid container>
                <Grid item xs={8} p={1}>
                    <Link href={`/convenios/${value.id}`} style={{ textDecoration: 'none' }}>
                        <Negrita py={1} mb={2}>
                            {value.titulo}
                        </Negrita>
                    </Link>

                    <Normal sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Icon icon="iconamoon:category-thin" fontSize={22} style={{ marginRight: 10 }} />
                        {value.tipo == 'nacional' ? 'Convenio nacional' : 'Convenio internacional'}
                    </Normal>
                    <Normal sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Icon icon="lets-icons:calendar-light" fontSize={22} style={{ marginRight: 10 }} />
                        {dayjs(value.finalizacion, 'DD/MM/YYYY').format('[Finaliza el] DD [de] MMMM [del] YYYY')}
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
                    <Link href={`/convenios/${value.id}`}>
                        <Image style={{ filter: 'brightness(0.4)', aspectRatio: 1 }}
                            objectFit="cover" layout='fill' width={100} height={100}
                            src={fileDomain + value.imagen} alt={`Imagen de: ${value.titulo}`} />
                    </Link>
                    <Button
                        onClick={() => {
                            router.push(`/convenios/${value.id}`)
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
export default ConvenioItem;