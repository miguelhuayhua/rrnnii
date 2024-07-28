"use client";
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Pasantia } from "@prisma/client";
import { RiEditFill } from "react-icons/ri";
import PasantiaComponent from "../componentes/items/Pasantia";
import ModalPasantia from "./Modal";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Tabla from "../componentes/Tabla";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [Pasantias, setPasantias] = useState<Pasantia[]>([]);
    const [prevPasantias, setPrevPasantias] = useState<any>([]);
    const [Pasantia, setPasantia] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/pasantia/todo', { opcion }).then(res => {
            setPasantias(res.data);
            setPrevPasantias(res.data);
        })
    }, [opcion, Pasantia]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonSimple
                startIcon={<MdArrowLeft fontSize={20} />}
                onClick={() => router.back()}>
                Regresar
            </BotonSimple>
            <Titulo sx={{ mt: 1 }}>
                Pasantías
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/pasantias">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/Pasantias">
                    <Normal>Pasantias</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} >
                <BotonFilled onClick={() => router.push('/dashboard/pasantias/crear')}>
                    Añadir Pasantia
                </BotonFilled>
            </Stack>
            <Tabs
                sx={{ mb: 4 }}
                ScrollButtonComponent={(props) =>
                    <BotonSimple  {...props}>
                        {props.direction == 'left' ? <FaAngleLeft fontSize={15} /> : <FaAngleRight fontSize={15} />}
                    </BotonSimple>}
                variant="scrollable"
                allowScrollButtonsMobile
                value={opcion}
                onChange={(_, value) => { setOpcion(value) }} >
                <TabBox label="Todos" value='todo' />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Concluídos" value='concluido' />
            </Tabs>
            <Tabla data={Pasantias} />
            {
                Pasantia ?
                    <ModalPasantia
                        Pasantia={Pasantia}
                        setPasantia={setPasantia}
                    />
                    : null
            }
        </Box>
    )
}