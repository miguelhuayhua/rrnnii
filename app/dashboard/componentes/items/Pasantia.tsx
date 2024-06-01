'use client';
import { Box, Grid, } from "@mui/material";
import Link from "next/link";
import { FaBuilding } from "react-icons/fa6";
import { Negrita, Normal } from "@/app/componentes/Textos";
import { ChipBox } from "@/app/componentes/Mostrar";
import { Institucion, Pasantia } from "@prisma/client";
import Image from 'next/legacy/image';
interface Props {
    Pasantia: Pasantia & { Institucion: Institucion };
}
const PasantiaComponent = ({ Pasantia }: Props) => {
    return (
        <Grid container bgcolor='white' sx={{ overflow: 'hidden', pb: 3, borderRadius: 4, boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px', }}>
            <Grid xs={7} py={3} px={2}>
                <ChipBox sx={{ margin: 0, bgcolor: '#0073b7', color: 'white' }} label={Pasantia.modalidad + " meses"}></ChipBox>
                <Link href='/'>
                    <Negrita sx={{ color: '#212b36' }} mt={2}>
                        {Pasantia.titulo}
                    </Negrita>
                </Link>
                <Normal sx={{ fontWeight: 400, fontSize: 12, color: '#999' }}>
                    Válido hasta: {Pasantia.finalizacion != 'undefined' ? Pasantia.finalizacion : ' Sin definir'}
                </Normal>
                <Normal sx={{ fontWeight: 400, fontSize: 12, color: '#999', py: 1 }}>
                    <FaBuilding /> {Pasantia.Institucion.nombre}
                </Normal>
            </Grid>
            <Grid xs={5} p={2}>
                <Box position='relative' borderRadius={2} height={"100%"} overflow='hidden'>
                    <Image objectFit="cover" layout='fill' src={Pasantia.imagen} />
                </Box>
            </Grid>
        </Grid >
    )
}
export default PasantiaComponent;