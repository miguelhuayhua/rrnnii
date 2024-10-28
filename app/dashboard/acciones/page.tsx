"use client";
import { BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Stack } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Acciones } from "@prisma/client";
import { TbReload } from "react-icons/tb";
import axios from "axios";
import Tabla from "../componentes/Tabla";

export default function Page() {
    const [acciones, setAccions] = useState<Acciones[]>([]);
    useEffect(() => {
        axios.post('/api/acciones/todo', {}).then(res => {
            setAccions(res.data);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2}>
            <Breadcrumbs >
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/acciones">
                    <Normal>Acciones</Normal>
                </Link>
                <Negrita>Revisar</Negrita>
            </Breadcrumbs>
            <Titulo sx={{ mt: 1 }}>
                Acciones
            </Titulo>
            <Stack direction='row' my={2} spacing={2} >

                <BotonSimple onClick={() => {
                    axios.post('/api/acciones/todo', {}).then(res => {
                        setAccions(res.data);
                    });
                }}>
                    <TbReload fontSize={22} />
                </BotonSimple>
            </Stack>

            <Tabla hasSearch hasPagination data={acciones} />


        </Box>
    )
}