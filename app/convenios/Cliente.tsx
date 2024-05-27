'use client';
import { Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import Convenio from "../componentes/items/Convenio";
import Filtros from "./Filtros";
import { Suspense, useState } from "react";
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
                    <Convenio />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Convenio />
                </Grid>
            </Grid>
            <Suspense>
                <Filtros open={open} setOpen={setOpen} />
            </Suspense>
        </>
    )
}
export default Cliente;