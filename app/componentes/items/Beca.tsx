'use client';
import { Grid } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { BoxSombra } from "../Mostrar";
import { Negrita, Normal } from "../Textos";
import { Beca, Institucion, ParticipanteBeca } from "@prisma/client";
import dayjs from "dayjs";
interface Props { value: Beca & { Participantes: ParticipanteBeca[], Institucion: Institucion } }
import 'dayjs/locale/es';
import { Icon } from '@iconify/react';
import { fileDomain } from "@/utils/globals";
import plugin from 'dayjs/plugin/customParseFormat';
import { grey } from "@mui/material/colors";
import { Button, Panel } from "rsuite";
import { useRouter } from "next/navigation";
dayjs.extend(plugin);
dayjs.locale('es');
const BecaItem = ({ value }: Props) => {
    const router = useRouter();
    return (
        <BoxSombra width={"100%"} position='relative'>
            <Negrita sx={{
                display: 'flex', alignItems: 'center', color: grey[50],
                position: 'absolute', top: 10, right: 10, zIndex: 120
            }}>
                {value.conteo}
                <Icon style={{ marginLeft: 4, fontSize: 16 }} icon="solar:eye-bold" />
            </Negrita>
            <Grid container>
                <Grid item xs={8} p={1}>
                    <Link href={`/becas/${value.id}`} style={{ textDecoration: 'none' }}>
                        <Negrita py={1} mb={2}>
                            {value.titulo}
                        </Negrita>
                    </Link>
                    <Normal sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Icon icon="lets-icons:calendar-light" fontSize={22} style={{ marginRight: 10 }} />
                        {dayjs(value.termina, 'DD/MM/YYYY').format('[Finaliza el] DD [de] MMMM [del] YYYY')}
                    </Normal>
                    <Normal sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Icon icon="iconamoon:category-thin" fontSize={22} style={{ marginRight: 10 }} />
                        {value.tipo == 'nacional' ? 'Beca nacional' : 'Beca internacional'}
                    </Normal>
                    <Normal sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Icon icon="fluent:people-community-20-regular" fontSize={22} style={{ marginRight: 10 }} />
                        {value.Participantes.length} participantes
                    </Normal>
                </Grid>

                <Grid item xs={4} position='relative'>
                    <Link href={`/becas/${value.id}`}>
                        <Image style={{ filter: 'brightness(0.4)', aspectRatio: 1 }}
                            objectFit="cover" layout='fill' width={100} height={100}
                            src={fileDomain + value.imagen} alt={`Imagen de: ${value.titulo}`} />
                    </Link>
                    <Button
                        onClick={() => {
                            router.push(`/becas/${value.id}`)
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
export default BecaItem;