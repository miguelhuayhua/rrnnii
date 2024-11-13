"use client";
import { BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Stack } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Acciones, Usuario } from "@prisma/client";
import { TbReload } from "react-icons/tb";
import axios from "axios";
import Tabla from "../componentes/Tabla";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { Button } from "rsuite";
dayjs.locale('es');
export default function Page() {
    const [acciones, setAccions] = useState<(Acciones & { Usuario: Usuario })[]>([]);
    useEffect(() => {
        axios.post('/api/acciones/todo', {}).then(res => {
            setAccions(res.data);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2}>
            <Breadcrumbs sx={{ my: 2 }} >
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/acciones">
                    <Normal>Acciones</Normal>
                </Link>
                <Negrita>Revisar</Negrita>
            </Breadcrumbs>
            <Titulo >
                Acciones
            </Titulo>
            <Stack direction='row' mt={1} mb={2} spacing={2} >
                <Button appearance='subtle'
                    size='lg' onClick={() => {
                        axios.post('/api/acciones/todo', {}).then(res => {
                            setAccions(res.data);
                        });
                    }}>
                    <TbReload fontSize={22} />
                </Button>
            </Stack>

            <Tabla hasSearch hasPagination data={acciones.map(value => (
                {
                    Usuario: (<Box>
                        <Negrita>
                            {value.Usuario.usuario}

                        </Negrita>
                        <Normal>
                            {value.Usuario.rol}
                        </Normal>
                    </Box>),
                    Tabla: value.tabla,
                    Tipo: value.tipo,
                    Fecha: dayjs(value.createdAt).format('DD [de] MMMM [del] YYYY')
                }
            ))} />


        </Box>
    )
}