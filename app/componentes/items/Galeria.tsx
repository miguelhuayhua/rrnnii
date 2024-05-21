

'use client';
import { Avatar, Box, Chip, Divider, Stack, Typography, } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { TbWorld } from "react-icons/tb";
import { BotonFilled, BotonOutline, BotonSimple } from "../Botones";
import { FaLink } from "react-icons/fa6";
import { BsEye } from "react-icons/bs";
import { ChipBox } from "../Mostrar";

const Galeria = () => {

    return (
        <Box bgcolor='white !important' sx={{ overflow: 'hidden', borderRadius: 4, boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px', }}>
            <Box position='relative'>
                <Image layout='responsive' width={100} height={100} src='/eventos.jpg' alt="hola" objectFit="cover" />
                <svg className='dec' fill="none" viewBox="0 0 144 62" xmlns="http://www.w3.org/2000/svg"><path d="m111.34 23.88c-10.62-10.46-18.5-23.88-38.74-23.88h-1.2c-20.24 0-28.12 13.42-38.74 23.88-7.72 9.64-19.44 11.74-32.66 12.12v26h144v-26c-13.22-.38-24.94-2.48-32.66-12.12z" fill="currentColor" fill-rule="evenodd"></path></svg>
            </Box>
            <Box p={1} position='relative'>
                <BotonFilled sx={{ width: 30, height: 30, position: 'absolute', top: -18, left: 28, zIndex: 10, borderRadius: "50%" }}>
                    <BsEye />
                </BotonFilled>
                <Typography color='#212b36' fontSize={11} mt={2} fontWeight={700}>
                    Evento Productivo para becarios de Francia
                </Typography>
                <ChipBox label='hola' sx={{ position: 'absolute', top: 2, right: 2 }} />
            </Box>
        </Box >
    )
}
export default Galeria;