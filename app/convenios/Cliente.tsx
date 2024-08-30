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
    useEffect(() => {
        axios.post('/api/convenio/listar',
            {
                tipo: params.get('tipo') || undefined,
                carrera: params.get('carrera') || undefined
            }).then(res => {
                setConvenios(res.data);
            })
    }, [params]);
    return (
        <>
            <Grid container p={2} spacing={2} >
                <Grid item xs={12}>
                    <Box px={2}>
                        <InputBox sx={{ width: 200 }} placeholder='Buscar'
                            InputProps={{
                                size: 'small',
                                startAdornment:
                                    <BiSearch fontSize={25} />
                            }}
                        />
                        <BotonSimple
                            onClick={() => {
                                setOpen(true);
                            }}
                            sx={{ float: 'right' }} endIcon={<FiFilter></FiFilter>}>Filtros</BotonSimple>
                    </Box>
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