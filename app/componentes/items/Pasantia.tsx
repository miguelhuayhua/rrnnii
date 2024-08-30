'use client';
import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { FaBuilding, FaLink } from "react-icons/fa6";
import { Negrita, Normal } from "../Textos";
import { ChipBox } from "../Mostrar";
import { IoIosHeart } from "react-icons/io";
import { blue, grey } from "@mui/material/colors";
import { Carrera, Institucion, Pasantia, PasantiaCarrera } from "@prisma/client";
import dayjs from "dayjs";
import 'dayjs/locale/es';
dayjs.locale('es');
dayjs.extend(require('dayjs/plugin/customParseFormat'));
interface Props {
    value: Pasantia & { PasantiaCarrera: (PasantiaCarrera & { Carrera: Carrera })[], Institucion: Institucion };
}
const PasantiaItem = ({ value }: Props) => {
    return (
        <Grid container bgcolor='white' sx={{ overflow: 'hidden', borderRadius: 4, boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px', }}>
            <Grid xs={6} p={1}>
                <ChipBox sx={{ margin: 0, bgcolor: blue[600], borderRadius: 1.5, color: grey[50] }}
                    label={`${value.modalidad} meses`} />
                <Link href='/'>
                    <Negrita mt={2}>
                        {value.titulo}
                    </Negrita>
                </Link>
                <Normal sx={{ fontSize: 11, color: grey[700] }}>
                    Válido hasta: {dayjs(value.finalizacion, 'DD/MM/YYYY').format('DD [de] MMMM [del] YYYY')}
                </Normal>
                <Normal sx={{ fontSize: 11, color: grey[700] }}>
                    Publicado el: {dayjs(value.createdAt).format('DD [de] MMMM [del] YYYY')}
                </Normal>
                <Negrita sx={{ fontSize: 11, mt: 1, color: grey[700], display: 'flex', alignItems: 'center' }}>
                    <FaBuilding style={{ marginRight: 5 }} /> {value.Institucion.nombre}
                </Negrita>
                <Divider />
                <Stack direction='row' px={0.5} py={1} flexWrap='wrap'>
                    {
                        value.PasantiaCarrera.map(value =>
                        (<ChipBox key={value.id} avatar={<Image src={value.Carrera.logo} width={20} height={20} style={{ borderRadius: 4 }}
                            layout='fixed' />} label={<Normal sx={{ fontSize: 10 }}>{value.Carrera.nombre}</Normal>} />)
                        )
                    }
                </Stack>
            </Grid>
            <Grid xs={6} py={1} px={1}>
                <Box position='relative' borderRadius={2} height={"100%"} overflow='hidden'>
                    <Image objectFit="contain" layout='fill' src={value.imagen} alt='' />
                    <Button
                        onClick={() => {
                        }}
                        sx={{ color: 'white', bgcolor: '#00000066', borderRadius: "50%", width: 30, height: 30, position: 'absolute', top: 5, right: 5, zIndex: 20, minWidth: 0 }}>
                        <IoIosHeart />
                    </Button>
                </Box>
            </Grid>
        </Grid >
    )
}
export default PasantiaItem;