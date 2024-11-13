'use client';
import { Badge, CircularProgress, Grid, } from "@mui/material";
import { BotonOutline } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Video } from "@prisma/client";
import { Normal } from "../componentes/Textos";
import { Button, Input, InputGroup } from "rsuite";
import { IoSearch } from "react-icons/io5";
import Filtros from "./Filtro";
import VideoItem from "../componentes/items/Video";
import ModalVideo from "./Modal";
const Cliente = () => {
    const [open, setOpen] = useState(false);
    const params = useSearchParams();
    const [Videos, setVideos] = useState<Video[]>([]);
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
            <div className="gradient-wrap">
                <div className="meshgradient">
                    <div className="color c1"></div>
                    <div className="color c2"></div>
                    <div className="color c3"></div>
                    <div className="color c4"></div>
                </div>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={12} display='flex' justifyContent='space-between'>
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
                    <Badge invisible={!(
                        params.has('s'))}
                        color="primary"
                        variant="dot">
                        <Button appearance='primary' style={{ background: '#212121', height: 48 }} size='sm'
                            onClick={() => { setOpen(true); }} >
                            Filtros <FiFilter fontSize={22} style={{ marginLeft: 10 }} />
                        </Button>
                    </Badge>
                </Grid>

                {
                    Videos.length > 0 ?
                        Videos.map(value => (
                            <Grid key={value.id} item xs={12} sm={6} lg={4} mx='auto'>
                                <VideoItem setVideo={setVideo} value={value as any} />
                            </Grid>))
                        : <Normal m={2}>
                            Videos no encontrados
                        </Normal>
                }
                <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <BotonOutline
                        disabled={load}
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
                        sx={{ mt: 4, fontSize: 13 }}>
                        Cargas más
                        {
                            load ? <CircularProgress
                                size='20px' sx={{ ml: 1 }} /> : null
                        }
                    </BotonOutline>
                </Grid>
            </Grid>
            <Suspense>
                <Filtros setOpen={setOpen} open={open} />
            </Suspense>
            {
                video ? <ModalVideo setVideo={setVideo} video={video} /> : null
            }
        </>
    )
}
export default Cliente;