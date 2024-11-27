'use client';
import { Box, Grid, Stack, } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Video } from "@prisma/client";
import { Negrita, Normal, Titulo } from "../componentes/Textos";
import { Button, Input, InputGroup, SelectPicker } from "rsuite";
import { IoSearch } from "react-icons/io5";
import { Icon } from '@iconify/react';
import VideoItem from "../componentes/items/Video";
import ModalVideo from "./Modal";
import { grey, red } from "@mui/material/colors";
const Cliente = () => {
    const params = useSearchParams();
    const [Videos, setVideos] = useState<Video[]>([]);
    const router = useRouter();
    const [video, setVideo] = useState<any>(null);
    const [skip, setSkip] = useState(0);
    const [load, setLoad] = useState(true);
    const [VideosMain, setVideosMain] = useState<Video[]>([]);
    useEffect(() => {
        axios.post('/api/video/listar',
            { orden: params.get('s'), skip: 0 }).then(res => {
                setVideos(res.data);
                setVideosMain(res.data);
                setLoad(false);
                setSkip(1);
            })
    }, [params]);
    return (
        <>
            <Grid container spacing={2} position='relative' top={-120}>
                <Grid item xs={12} >
                    <Box p={2} display='flex' position='relative' flexDirection='column' alignItems='center' height={500}>
                        <video style={{
                            position: 'absolute', top: 0, left: 0,
                            width: "100%", height: "100%",
                            objectFit: 'cover', filter: 'brightness(.5)'
                        }} autoPlay loop muted>
                            <source src="/fondovideo.mp4" type="video/mp4" />
                        </video>
                        <Titulo sx={{ textAlign: 'center', my: 4, mt: 15, zIndex: 20, fontSize: 30, color: 'white' }}>
                            Videos
                        </Titulo>
                        <Normal sx={{ textAlign: 'center', color: 'white', zIndex: 20, mb: 4 }}>
                            La Unidad de Relaciones Internacionales de la UPEA comparte videos informativos y promocionales sobre eventos, convenios y experiencias estudiantiles, mostrando sus logros y actividades destacadas.
                        </Normal>
                        <InputGroup style={{ maxWidth: 300, marginBottom: 20 }} >
                            <Input style={{ fontFamily: 'inherit' }}
                                placeholder="Buscar videos"
                                onChange={text => {
                                    setVideos(VideosMain.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
                                }} />
                            <InputGroup.Addon style={{ background: 'white' }}>
                                <IoSearch fontSize={28} />
                            </InputGroup.Addon>
                        </InputGroup>
                    </Box>
                </Grid>
                <Grid sx={{ position: 'sticky', top: 65, zIndex: 2 }} item xs={12}>
                    <Box py={{ xs: 1, sm: 2 }}
                        sx={{
                            px: { xs: 1, sm: 5, md: 20, lg: 40, xl: 50 },
                            background: grey[100], zIndex: 10,
                            borderBottom: '1px solid #ddd', position: 'relative',
                            top: -15
                        }}>
                        <Stack direction='row' alignItems='center' >
                            <Negrita fontSize={18}>
                                Filtrar Videos
                            </Negrita>
                            <Button
                                style={{ marginLeft: 10 }}
                                appearance="subtle" onClick={() => {
                                    router.push('/videos')
                                }}>
                                <Icon fontSize={18} icon="ant-design:reload-outlined" />
                            </Button>
                        </Stack>
                        <Grid container spacing={1} >
                            <Grid item xs={6} sm={4} mx='auto'>
                                <SelectPicker
                                    searchable={false}
                                    data={[{ label: 'Más antiguos', value: '1' }, { label: 'Más recientes', value: '0' }]}
                                    size={'lg'}
                                    cleanable={false}
                                    value={params.get('s')}
                                    placeholder='Orden'
                                    labelKey="label"
                                    valueKey="value"
                                    style={{
                                        width: "100%",
                                        marginBottom: 10
                                    }}
                                    onChange={orden => {
                                        router.replace(`/videos?s=${orden}`)
                                    }}
                                />
                            </Grid>


                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} px={2}>
                        {
                            Videos.length > 0 ?
                                Videos.map(value => (
                                    <Grid key={value.id} item xs={6} sm={4} lg={3} mx='auto'>
                                        <VideoItem setVideo={setVideo} value={value as any} />
                                    </Grid>))
                                : <Grid item xs={12}>
                                    <Normal textAlign='center'>
                                        Videos no encontrados
                                    </Normal>
                                </Grid>
                        }

                        <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                disabled={load}
                                loading={load}
                                appearance="primary"
                                style={{
                                    background: red[700],
                                    marginTop: 40
                                }}
                                onClick={() => {
                                    setLoad(true);
                                    axios.post('/api/video/listar',
                                        {
                                            orden: params.get('s'),
                                            take: 12, skip
                                        }).then(res => {
                                            setVideos(prev => ([...prev, ...res.data]));
                                            setVideosMain(prev => ([...prev, ...res.data]));
                                            setLoad(false)
                                            setSkip(prev => prev + 1);
                                        })
                                }}
                            >
                                Cargas más

                            </Button>
                        </Grid>
                    </Grid>
                </Grid>


            </Grid>
            {
                video ? <ModalVideo setVideo={setVideo} video={video} /> : null
            }
        </>
    )
}
export default Cliente;