'use client';
import { Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonSimple } from "../componentes/Botones";
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
    useEffect(() => {
        axios.post('/api/evento/listar',
            { tipo: params.get('t') || undefined }).then(res => {
                setEventos(res.data);
            })
    }, [params]);
    return (
        <>
            <Grid container px={3} spacing={2}>
                <Grid item xs={12}>
                    <InputBox size='small' sx={{ width: 200 }} placeholder='Buscar'
                        InputProps={{
                            startAdornment:
                                <BiSearch fontSize={25} />
                        }}
                    />
                    <BotonSimple
                        onClick={() => {
                            setOpen(true);
                        }}
                        sx={{ float: 'right' }} endIcon={<FiFilter />}>Filtros</BotonSimple>
                </Grid>
                {
                    Eventos.length > 0 ?
                        Eventos.map(value => (
                            <Grid key={value.id} item xs={10} sm={6} md={4} lg={3} xl={2} mx='auto'>
                                <EventoItem value={value as any} />
                            </Grid>))
                        : <Normal ml={4} my={4}>
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