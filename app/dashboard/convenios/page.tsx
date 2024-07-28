'use client';
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import Tabla from "../componentes/Tabla";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Convenio } from "@prisma/client";
import ModalConvenio from "./Modal";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [convenios, setConvenios] = useState<Convenio[]>([]);
    const [convenio, setConvenio] = useState<any>(null);
    const [prevConvenios, setPrevConvenios] = useState<any>([]);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/convenio/todo', { opcion }).then(res => {
            setConvenios(res.data);
            setPrevConvenios(res.data);
        })
    }, [opcion, convenio]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonSimple
                startIcon={<MdArrowLeft fontSize={20} />}
                onClick={() => router.back()}>
                Regresar
            </BotonSimple>
            <Titulo sx={{ mt: 1 }}>
                Convenios
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/convenios">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/convenios">
                    <Normal>Convenios</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} >
                <BotonFilled onClick={() => router.push('/dashboard/convenios/crear')}>
                    Añadir convenio
                </BotonFilled>
            </Stack>
            <Tabs sx={{ mb: 4 }}
                ScrollButtonComponent={(props) =>
                    <BotonSimple  {...props}>
                        {props.direction == 'left' ? <FaAngleLeft fontSize={15} /> : <FaAngleRight fontSize={15} />
                        }
                    </BotonSimple>}
                variant="scrollable"
                allowScrollButtonsMobile
                value={opcion}
                onChange={(_, value) => { setOpcion(value) }} >
                <TabBox label="Todos" value='todo' />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Concluídos" value='concluido' />
            </Tabs>
            <Tabla data={convenios} />
            {
                convenio ?
                    <ModalConvenio
                        Convenio={convenio}
                        setConvenio={setConvenio}
                    />
                    : null
            }
        </Box>
    )
}