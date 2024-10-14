'use client';
import { CircularProgress, Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonFilled, BotonOutline, BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import { Suspense, useEffect, useState } from "react";
import EventoItem from "../componentes/items/Evento";
import Filtros from "./Filtro";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Evento } from "@prisma/client";
import { Normal } from "../componentes/Textos";
const Cliente = () => {
    const [open, setOpen] = useState(false);
    const params = useSearchParams();
    const [Eventos, setEventos] = useState<Evento[]>([]);
    const [skip, setSkip] = useState(0);
    const [load, setLoad] = useState(true);
    const [EventosMain, setEventosMain] = useState<Evento[]>([]);
    useEffect(() => {
        axios.post('/api/evento/listar',
            { tipo: params.get('t'), orden: params.get('s'), skip: 0 }).then(res => {
                setEventos(res.data);
                setEventosMain(res.data);
                setLoad(false);
                setSkip(1);
            })
    }, [params]);
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} display='flex' justifyContent='space-between'>
                    <InputBox sx={{ width: 200 }}
                        placeholder='Buscar'
                        InputProps={{
                            startAdornment:
                                <BiSearch fontSize={28} style={{ marginRight: 10 }} color='#aaa' />
                        }}
                        onChange={ev => {
                            setEventos(EventosMain.filter(value => value.titulo.toLowerCase().includes(ev.target.value.toLowerCase())))
                        }}
                    />
                    <BotonFilled
                        onClick={() => {
                            setOpen(true);
                        }} >
                        Filtros <FiFilter fontSize={22} style={{ marginLeft: 10 }} />
                    </BotonFilled>
                </Grid>

                {
                    Eventos.length > 0 ?
                        Eventos.map(value => (
                            <Grid key={value.id} item xs={12} sm={6} lg={4} mx='auto'>
                                <EventoItem value={value as any} />
                            </Grid>))
                        : <Normal m={2}>
                            Eventos no encontrados
                        </Normal>
                }
                <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <BotonOutline
                        disabled={load}
                        onClick={() => {
                            setLoad(true);
                            axios.post('/api/evento/listar',
                                {
                                    tipo: params.get('t'),
                                    orden: params.get('s'),
                                    take: 12, skip
                                }).then(res => {
                                    setEventos(prev => ([...prev, ...res.data]));
                                    setEventosMain(res.data);
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