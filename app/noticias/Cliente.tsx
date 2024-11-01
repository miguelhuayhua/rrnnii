'use client';
import { Badge, CircularProgress, Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonFilled, BotonOutline, BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Noticia } from "@prisma/client";
import { Normal } from "../componentes/Textos";
import NoticiaItem from "../componentes/items/Noticia";
import Filtros from "./Filtros";
const Cliente = () => {
    const [open, setOpen] = useState(false);
    const [skip, setSkip] = useState(0);
    const [load, setLoad] = useState(true);
    const params = useSearchParams();
    const [Noticias, setNoticias] = useState<Noticia[]>([]);
    const [NoticiasMain, setNoticiasMain] = useState<Noticia[]>([]);
    const orden = params.get('s');
    useEffect(() => {
        axios.post('/api/noticia/listar',
            { skip: 0, orden }).then(res => {
                setNoticias(res.data);
                setNoticiasMain(res.data);
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
                    <InputBox
                        sx={{
                            width: 200,
                            'fieldset': { border: '1px solid #aaa !important' },
                        }}
                        placeholder='Buscar'
                        InputProps={{
                            startAdornment:
                                <BiSearch fontSize={28} style={{ marginRight: 10 }} />
                        }}
                        onChange={ev => {
                            setNoticias(NoticiasMain.filter(value => value.titulo.toLowerCase().includes(ev.target.value.toLowerCase())))
                        }}
                    />


                    <Badge invisible={!params.has('s')}
                        color="primary"
                        variant="dot">
                        <BotonFilled
                            onClick={() => {
                                setOpen(true);
                            }} >
                            Filtros <FiFilter fontSize={22} style={{ marginLeft: 10 }} />
                        </BotonFilled>
                    </Badge>
                </Grid>
                {
                    Noticias.length > 0 ?
                        Noticias.map(value => (
                            <Grid key={value.id} item xs={12} mx='auto'>
                                <NoticiaItem value={value as any} />
                            </Grid>))
                        : <Normal m={2}>
                            Noticias no encontrados
                        </Normal>
                }
                <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <BotonOutline
                        disabled={load}
                        onClick={() => {
                            setLoad(true);
                            axios.post('/api/noticias/listar',
                                {
                                    skip
                                }).then(res => {
                                    setNoticias(prev => ([...prev, ...res.data]));
                                    setNoticiasMain(res.data);
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
        </>
    )
}
export default Cliente;