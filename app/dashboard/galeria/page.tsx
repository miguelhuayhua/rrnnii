'use client';
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft, MdEdit } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Galeria } from "@prisma/client";
import ModalGaleria from "./Modal";
import { IoReload } from "react-icons/io5";
import GaleriaComponent from "../componentes/items/Galeria";
import { InputBox } from "@/app/componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { filtrarValorEnArray } from "@/utils/data";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { TbReload } from "react-icons/tb";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [galerias, setGalerias] = useState<Galeria[]>([]);
    const [prevGalerias, setPrevGalerias] = useState<any>([]);
    const [galeria, setGaleria] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/galeria/todo', { opcion }).then(res => {
            setGalerias(res.data);
            setPrevGalerias(res.data);
        })
    }, [opcion, galeria]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonSimple
                startIcon={<MdArrowLeft fontSize={20} />}
                onClick={() => router.back()}>
                Regresar
            </BotonSimple>
            <Titulo sx={{ mt: 1 }}>
                Galeria
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/galeria">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/galeria">
                    <Normal>Galeria</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/galeria/crear')}>
                    Añadir galeria
                </BotonFilled>
                <BotonSimple onClick={() => router.refresh()}>
                    <TbReload fontSize={22} />
                </BotonSimple>
            </Stack>
            <Tabs
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
                <TabBox label="Inactivos" value='inactivos' />
            </Tabs>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                    <InputBox sx={{ width: 200 }} placeholder='Buscar'
                        onChange={(ev) => {
                            setGalerias(filtrarValorEnArray(prevGalerias, ev.target.value));
                        }}
                        InputProps={{
                            startAdornment:
                                <BiSearch fontSize={25} />
                        }}
                    />
                </Grid>
                {galerias.map((value) => (
                    <Grid key={value.id} item xs={12} sm={6} md={4} lg={3} xl={2} position='relative'>
                        <GaleriaComponent Galeria={value} />
                        <BotonOutline
                            onClick={() => {
                                setGaleria(value);
                            }}
                            sx={{ position: 'absolute', bottom: 35, left: 42.75, border: 'none', zIndex: 20, borderRadius: "50%" }} >
                            <MdEdit fontSize={18} />
                        </BotonOutline>
                    </Grid>
                ))}
            </Grid>
            {
                galeria ?
                    <ModalGaleria
                        Galeria={galeria}
                        setGaleria={setGaleria}
                    />
                    : null
            }
        </Box>
    )
}