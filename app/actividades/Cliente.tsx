"use client";
import { Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import { useState } from "react";
import Actividad from "../componentes/items/Actividad";
import dynamic from "next/dynamic";
import FiltroSkeleton from "../skeletons/FiltroSkeleton";
const Filtros = dynamic(() => import('./Filtro'), { ssr: false, loading: () => (<FiltroSkeleton />) });

const Cliente = () => {
    const [open, setOpen] = useState(false);

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
                <Grid item xs={12} sm={6} md={4} lg={3}>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                </Grid>
            </Grid>
            <Filtros setOpen={setOpen} open={open} />
        </>
    )
}
export default Cliente;