'use client';
import { Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonFilled, BotonSimple } from "../componentes/Botones";
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
    const [EventosMain, setEventosMain] = useState<Evento[]>([]);
    useEffect(() => {
        axios.post('/api/evento/listar',
            { tipo: params.get('t') || undefined }).then(res => {
                setEventos(res.data);
                setEventosMain(res.data);
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
            </Grid>
            <Suspense>
                <Filtros setOpen={setOpen} open={open} />
            </Suspense>
        </>
    )
}
export default Cliente;