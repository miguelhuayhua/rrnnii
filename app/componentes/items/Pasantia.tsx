'use client';
import { Avatar, Box, Button, Chip, Divider, Grid, Stack, Typography, } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { TbWorld } from "react-icons/tb";
import { FaBuilding, FaLink } from "react-icons/fa6";
import { Negrita, Normal } from "../Textos";
import { ChipBox } from "../Mostrar";
import { IoIosHeart } from "react-icons/io";
import { blue, grey } from "@mui/material/colors";

const Pasantia = () => {
    return (
        <Grid container bgcolor='white' sx={{ overflow: 'hidden', borderRadius: 4, boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px', }}>
            <Grid xs={6} p={1}>
                <ChipBox sx={{ margin: 0, bgcolor: blue[600], color: grey[50] }} label='3 meses'></ChipBox>
                <Link href='/'>
                    <Negrita mt={2}>
                        Pasantia Productivo para becarios de Francia
                    </Negrita>
                </Link>
                <Normal py={2}>
                    Vea la última pasantía del siglo
                </Normal>
                <Normal sx={{ fontSize: 12, color: grey[700] }}>
                    Válido hasta: 21 feb 2024
                </Normal>
                <Normal sx={{ fontSize: 12, color: grey[700] }}>
                    Publicado el: 23 de Marzo de 2023
                </Normal>
                <Normal sx={{ fontSize: 12, color: grey[700], display: 'flex', alignItems: 'center' }}>
                    <FaBuilding style={{ marginRight: 10 }} /> Cainco
                </Normal>
                <Divider sx={{ py: 1 }} />
                <Stack pt={1} direction='row' flexWrap='wrap'>
                    <ChipBox label='Ingeniería de Sistemas'></ChipBox>
                    <ChipBox label='Medicina'></ChipBox>
                </Stack>
            </Grid>
            <Grid xs={6} py={2} px={1}>
                <Box position='relative' borderRadius={2} height={"100%"} overflow='hidden'>
                    <Image objectFit="cover" layout='fill' src='/eventos.jpg' alt="hola" />
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
export default Pasantia;