'use client';
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Avatar, Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Institucion } from "@prisma/client";
import ModalInstitucion from "./Modal";
import { RiEditFill } from "react-icons/ri";
import { BoxSombra } from "@/app/componentes/Mostrar";
import { InputBox } from "@/app/componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { filtrarValorEnArray } from "@/utils/data";
import dayjs from "dayjs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Tabla from "../componentes/Tabla";
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [prevInstituciones, setPrevInstituciones] = useState<any>([]);
    const [institucion, setInstitucion] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/institucion/todo', { opcion }).then(res => {
            setInstituciones(res.data);
            setPrevInstituciones(res.data);
        })
    }, [opcion, institucion]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonSimple
                startIcon={<MdArrowLeft fontSize={20} />}
                onClick={() => router.back()}>
                Regresar
            </BotonSimple>
            <Titulo sx={{ mt: 1 }}>
                Instituciones
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/instituciones">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/instituciones">
                    <Normal>Instituciones</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} >
                <BotonFilled onClick={() => router.push('/dashboard/instituciones/crear')}>
                    Añadir institución
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
                <TabBox label="Todos" value='todo' sx={{ ml: 2 }} />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Concluídos" value='concluido' />
            </Tabs>
            <Tabla data={instituciones} />
            {
                institucion ?
                    <ModalInstitucion
                        Institucion={institucion}
                        setInstitucion={setInstitucion}
                    />
                    : null
            }
        </Box>
    )
}