'use client';
import { Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Beca } from "@prisma/client";
import { Normal } from "../componentes/Textos";
import Filtros from "./Filtros";
import BecaItem from "../componentes/items/Beca";
const Cliente = () => {
    const [open, setOpen] = useState(false);
    const [Becas, setBecas] = useState<Beca[]>([]);
    const [BecasMain, setBecasMain] = useState<Beca[]>([]);
    const params = useSearchParams();
    useEffect(() => {
        const duracion = params.get('d') || '';
        const carrera = params.get('carrera') || '';
        const orden = params.get('s');
        axios.post('/api/beca/listar',
            { duracion, carrera, orden }).then(res => {
                setBecas(res.data);
                setBecasMain(res.data);
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
                            setBecas(BecasMain.filter(value => value.titulo.toLowerCase().includes(ev.target.value.toLowerCase())))
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
                    Becas.length > 0 ?
                        Becas.map(value => (
                            <Grid key={value.id} item xs={12} sm={8} md={6} lg={4} mx='auto'>
                                <BecaItem value={value as any} />
                            </Grid>))
                        : <Normal ml={2}>
                            Becas no encontradas
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