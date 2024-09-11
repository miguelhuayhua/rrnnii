"use client";
import { Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import { useEffect, useState } from "react";
import ActividadItem from "../componentes/items/Actividad";
import dynamic from "next/dynamic";
import FiltroSkeleton from "../skeletons/FiltroSkeleton";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Actividad } from "@prisma/client";
import { Normal } from "../componentes/Textos";
const Filtros = dynamic(() => import('./Filtro'), { ssr: false, loading: () => (<FiltroSkeleton />) });

const Cliente = () => {

    const [open, setOpen] = useState(false);
    const params = useSearchParams();
    const [Actividades, setActividades] = useState<Actividad[]>([]);
    useEffect(() => {
        let t = params.get('t');
        let d = params.get('d');
        axios.post('/api/actividad/listar', { tipo: t, duracion: d }).then(res => {
            setActividades(res.data);
        });
    }, [params])
    return (
        <>
            <Grid container px={3} spacing={2}>
                <Grid item xs={12}>
                    <InputBox size="small" sx={{ width: 200 }} placeholder='Buscar'
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
                    Actividades.length > 0 ?
                        Actividades.map(value => (
                            <Grid key={value.id} item xs={12} sm={6} md={4} lg={3} mx='auto'>
                                <ActividadItem value={value as any} />
                            </Grid>))
                        : <Normal ml={4} my={4}>
                            Actividades no encontrados
                        </Normal>
                }
            </Grid>
            <Filtros setOpen={setOpen} open={open} />
        </>
    )
}
export default Cliente;