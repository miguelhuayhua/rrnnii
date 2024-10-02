'use client';
import { Box, Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import { Suspense, useEffect, useState } from "react";
import Filtros from "./Filtros";
import PasantiaItem from "../componentes/items/Pasantia";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Pasantia } from "@prisma/client";
import { Normal } from "../componentes/Textos";
const Cliente = () => {
    const [open, setOpen] = useState(false);
    const [Pasantias, setPasantias] = useState<Pasantia[]>([]);
    const [PasantiasMain, setPasantiasMain] = useState<Pasantia[]>([]);
    const params = useSearchParams();
    useEffect(() => {
        const duracion = params.get('d') || '';
        const carrera = params.get('carrera') || '';
        const orden = params.get('s');
        axios.post('/api/pasantia/listar',
            { duracion, carrera, orden }).then(res => {
                setPasantias(res.data);
                setPasantiasMain(res.data);
            })
    }, [params]);
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <InputBox sx={{ width: 200 }} placeholder='Buscar'
                        InputProps={{
                            size: 'small',
                            startAdornment:
                                <BiSearch fontSize={25} />
                        }}
                        onChange={ev => {
                            setPasantias(PasantiasMain.filter(value => value.titulo.toLowerCase().includes(ev.target.value.toLowerCase())))
                        }}
                    />
                    <BotonSimple
                        onClick={() => { setOpen(true) }}
                        sx={{ float: 'right' }}
                        endIcon={<FiFilter />}>
                        Filtros
                    </BotonSimple>
                </Grid>
                {
                    Pasantias.length > 0 ?
                        Pasantias.map(value => (
                            <Grid key={value.id} item xs={12} sm={8} md={6} lg={4} mx='auto'>
                                <PasantiaItem value={value as any} />
                            </Grid>))
                        : <Normal ml={2}>
                            Pasantias no encontradas
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