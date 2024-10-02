'use client';
import { Box, Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import ConvenioItem from "../componentes/items/Convenio";
import Filtros from "./Filtros";
import { Suspense, useEffect, useState } from "react";
import { Convenio } from "@prisma/client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Normal } from "../componentes/Textos";
const Cliente = () => {
    const [open, setOpen] = useState(false);
    const params = useSearchParams();
    const [Convenios, setConvenios] = useState<Convenio[]>([]);
    const [ConveniosMain, setConveniosMain] = useState<Convenio[]>([]);
    useEffect(() => {
        axios.post('/api/convenio/listar',
            {
                tipo: params.get('t') || undefined,
                carrera: params.get('c') || undefined
            }).then(res => {
                setConvenios(res.data);
                setConveniosMain(res.data);
            })
    }, [params]);
    return (
        <>
            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <InputBox sx={{ width: 200 }} placeholder='Buscar'
                        InputProps={{
                            size: 'small',
                            startAdornment:
                                <BiSearch fontSize={25} />
                        }}
                        onChange={(ev) => {
                            setConvenios(ConveniosMain.filter(value => value.titulo.toLowerCase().includes(ev.target.value.toLowerCase())))
                        }}
                    />
                    <BotonSimple
                        onClick={() => {
                            setOpen(true);
                        }}
                        sx={{ float: 'right' }} endIcon={<FiFilter />}>
                        Filtros
                    </BotonSimple>
                </Grid>
                {
                    Convenios.length > 0 ?
                        Convenios.map(value => (
                            <Grid key={value.id} item xs={12} sm={8} md={6} lg={4} mx='auto'>
                                <ConvenioItem value={value as any} />
                            </Grid>))
                        : <Normal ml={4} my={4}>
                            Convenios no encontrados
                        </Normal>
                }
            </Grid>
            <Suspense>
                <Filtros open={open} setOpen={setOpen} />
            </Suspense>
        </>
    )
}
export default Cliente;