"use client";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Stack, Tabs, CircularProgress } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Video } from "@prisma/client";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import { red } from "@mui/material/colors";
import axios from "axios";
import { ChipBox } from "@/app/componentes/Mostrar";
import { Button } from "rsuite";
import ModalVideo from "./Modal";
import Tabla from "../componentes/Tabla";
import dayjs from "dayjs";
import { Icon } from '@iconify/react';
import { SwitchBox } from "@/app/componentes/Datos";
import { useSnackbar } from "@/providers/SnackbarProvider";
import xlsx from 'json-as-xlsx';
import dynamic from "next/dynamic";
const BotonDescargar = dynamic(() => import("./Button"), {
    ssr: false, // Deshabilita la renderización en el servidor
});
import { fileDomain } from "@/utils/globals";
export default function Page() {
    const [opcion, setOpcion] = useState('activo');
    const [videos, setVideos] = useState<Video[]>([]);
    const [prevVideos, setPrevVideos] = useState<Video[]>([]);
    const [video, setVideo] = useState<any>(null);
    const [load, setLoad] = useState(true);
    const router = useRouter();
    const { openSnackbar } = useSnackbar();
    useEffect(() => {
        axios.post('/api/video/todo').then(res => {
            setVideos(res.data);
            setPrevVideos(res.data);
            setLoad(false);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2}>
            <Breadcrumbs sx={{ mt: 2, mb: 1 }} >
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/videos">
                    <Normal>Videos</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo>
                Videos
            </Titulo>
            <Stack direction='row' my={2} spacing={1} >
                <Button size='lg' appearance="primary"
                    onClick={() => router.push('/dashboard/videos/crear')}>
                    Añadir video
                </Button>
                <Button
                    size='lg'
                    appearance="subtle"
                    onClick={() => {
                        setLoad(true);
                        axios.post('/api/video/todo', { opcion }).then(res => {
                            setVideos(res.data);
                            setPrevVideos(res.data);
                            setOpcion('todo');
                            setLoad(false);
                        });
                    }}>
                    <TbReload fontSize={22} />
                </Button>
                <Button appearance='subtle' onClick={() => {
                    let data = [
                        {
                            sheet: "Videos",
                            columns: [
                                { label: "ID", value: "id" },
                                { label: "Título", value: (row: any) => row.titulo },
                                { label: "Creado el", value: (row: any) => row.createdAt },
                                { label: "Estado", value: (row: any) => (row.estado ? "Activo" : "Inactivo") },
                                { label: "Descripción", value: (row: any) => row.descripcion || "No disponible" },
                                { label: "Video", value: (row: any) => fileDomain + row.video || "No disponible" },
                                { label: "Vistas", value: (row: any) => row.conteo },
                            ],
                            content: videos,
                        },
                    ];
                    let settings = {
                        fileName: `listado-de-videos-${dayjs().format("DD-MM-YYYY_HH-mm-ss")}`,
                        writeMode: "writeFile",
                    };
                    xlsx(data, settings);
                }}>
                    <Icon icon='fa-regular:file-excel' fontSize={22} />
                </Button>
                <BotonDescargar Videos={videos} opcion={opcion} />
            </Stack>
            <Tabs
                sx={{ mb: 2, background: 'white', borderRadius: 3, boxShadow: '2px 2px 8px #21212122' }}
                TabIndicatorProps={{ sx: { bgcolor: red[700] } }}
                ScrollButtonComponent={(props) =>
                    <Button
                        size='lg'
                        appearance="subtle"  {...props}>
                        {props.direction == 'left' ? <FaAngleLeft fontSize={15} /> : <FaAngleRight fontSize={15} />}
                    </Button>}
                variant="scrollable"
                allowScrollButtonsMobile
                value={opcion}
                onChange={(_, value) => {
                    setOpcion(value);
                    if (value == 'todo')
                        setVideos(prevVideos);
                    else if (value == 'activo')
                        setVideos(prevVideos.filter(value => value.estado));
                    else if (value == 'inactivo')
                        setVideos(prevVideos.filter(value => !value.estado));
                }}  >
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Todos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, background: '#212121', color: 'white', height: 25 }}
                            label={prevVideos.length} />
                    </Box>}
                    value='todo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Activos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevVideos.filter(value => value.estado).length} />
                    </Box>} value='activo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Inactivos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevVideos.filter(value => !value.estado).length} />
                    </Box>} value='inactivo' />

            </Tabs>
            {
                load ? <CircularProgress color="inherit"
                    sx={{
                        display: 'block', mt: 3,
                        justifyContent: 'center',
                        mx: 'auto'
                    }} />
                    : videos.length > 0 ?
                        <Tabla hasPagination
                            data={videos.map(value => (
                                {
                                    "Título": value.titulo,
                                    "Creado el": (
                                        <Box minWidth={90}>
                                            <Negrita sx={{ fontSize: 14 }}>
                                                {dayjs(value.createdAt).format('DD/MM/YYYY')}
                                            </Negrita>
                                            <Normal sx={{ fontSize: 12 }}>
                                                {dayjs(value.createdAt).format('HH:mm:ss')}
                                            </Normal>
                                        </Box>
                                    ),
                                    "": (<>
                                        <Stack py={1.5} direction='row' spacing={3} alignItems='center'>
                                            <Button
                                                appearance="ghost" size="sm" onClick={() => {
                                                    setVideo(value);
                                                }}>Modificar</Button>

                                            <SwitchBox checked={value.estado} onChange={(ev, checked) => {
                                                axios.post('/api/video/estado', { estado: checked, id: value.id }).then(res => {
                                                    openSnackbar(res.data.mensaje);
                                                    axios.post('/api/video/todo', {}).then(res => {
                                                        setVideos(res.data);
                                                        setPrevVideos(res.data);
                                                        setOpcion('todo');
                                                    });
                                                });
                                            }} />
                                        </Stack>
                                    </>)
                                }
                            ))} /> :
                        <Normal sx={{ textAlign: 'center' }}>
                            Sin vídeos existentes
                        </Normal>
            }

            {
                video ?
                    <ModalVideo
                        video={video}
                        setVideo={setVideo}
                        setVideos={setVideos}
                        setPrevVideos={setPrevVideos}
                    />
                    : null
            }
        </Box>
    )
}