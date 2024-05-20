'use client';
import { Avatar, Box, Button, Chip, Divider, Grid, Stack, Typography, } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { TbWorld } from "react-icons/tb";
import { FaBuilding, FaLink } from "react-icons/fa6";
import { Negrita, Normal } from "../Textos";
import { ChipBox } from "../Mostrar";
import { IoIosHeart } from "react-icons/io";

const Pasantia = () => {

    return (
        <Grid container bgcolor='white' sx={{ overflow: 'hidden', borderRadius: 4, boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px', }}>
            <Grid xs={7} py={3} px={2}>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <ChipBox sx={{ margin: 0, bgcolor: '#0073b7', color: 'white' }} label='3 meses'></ChipBox>
                    <Normal sx={{ fontSize: 12 }}>11 May 2024</Normal>
                </Box>
                <Link href='/'>
                    <Negrita sx={{ color: '#212b36' }} mt={2}>
                        Pasantia Productivo para becarios de Francia
                    </Negrita>
                </Link>
                <Normal py={2}>
                    Vea la última pasantía del siglo
                </Normal>

                <Normal sx={{ fontWeight: 400, fontSize: 12, color: '#999' }}>
                    Publicado el: 23 de Marzo de 2023
                </Normal>
                <Normal sx={{ fontWeight: 400, fontSize: 12, color: '#999', pb: 2 }}>
                    <FaBuilding /> Cainco
                </Normal>
                <Divider sx={{ borderColor: '#eee' }} />
                <Stack pt={1} direction='row' flexWrap='wrap'>
                    <ChipBox label='Ingeniería de Sistemas'></ChipBox>
                    <ChipBox label='Medicina'></ChipBox>
                </Stack>
            </Grid>
            <Grid xs={5} p={2}>
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