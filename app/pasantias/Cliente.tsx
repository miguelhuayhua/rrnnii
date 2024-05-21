'use client';
import { Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import { Suspense, useState } from "react";
import Evento from "../componentes/items/Eventos";
import Filtros from "./Filtro";
import Pasantia from "../componentes/items/Pasantia";
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
                <Grid item xs={12} md={6} lg={4} >
                    <Pasantia />
                </Grid>
                <Grid item xs={12} md={6} lg={4} >
                    <Pasantia />
                </Grid>
            </Grid>
            <Suspense>
                <Filtros setOpen={setOpen} open={open} />
            </Suspense>
        </>
    )
}
export default Cliente;