'use client';
import { Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import ConvenioItem from "../componentes/items/Convenio";
import Filtros from "./Filtros";
import { Suspense, useEffect, useState } from "react";
import { Convenio } from "@prisma/client";
import axios from "axios";
const Cliente = () => {
    const [open, setOpen] = useState(false);
    const [Convenios, setConvenios] = useState<Convenio[]>([]);
    useEffect(() => {
        axios.post('/api/convenio/todo', { take: 10 }).then(res => {
            setConvenios(res.data);
        })
    }, []);
    return (
        <>
            <Grid container px={3} spacing={2}>
                <Grid item xs={12}>
                    <InputBox sx={{ width: 200 }} placeholder='Buscar'
                        InputProps={{
                            startAdornment:
                                <BiSearch fontSize={25} />
                        }}
                    />
                    <BotonSimple
                        onClick={() => {
                            setOpen(true);
                        }}
                        sx={{ height: 52.5, float: 'right' }} endIcon={<FiFilter></FiFilter>}>Filtros</BotonSimple>
                </Grid>
                {Convenios.map(value => (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <ConvenioItem value={value as any} />
                    </Grid>))}
            </Grid>
            <Suspense>
                <Filtros open={open} setOpen={setOpen} />
            </Suspense>
        </>
    )
}
export default Cliente;