'use client';
import { Grid, } from "@mui/material";
import { BiSearch } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Beca } from "@prisma/client";
import { InputBox } from "@/app/componentes/Datos";
import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import BecaItem from "@/app/componentes/items/Beca";
import { Normal } from "@/app/componentes/Textos";
import Filtros from "./Filtros";
const Cliente = () => {
    const [open, setOpen] = useState(false);
    const [Becas, setBecas] = useState<Beca[]>([]);
    const [BecasMain, setBecasMain] = useState<Beca[]>([]);
    const params = useSearchParams();
    useEffect(() => {
        const duracion = params.get('d') || '';
        const carrera = params.get('carrera') || '';
        const orden = params.get('s');
        const continente = params.get('co');
        const tipo = params.get('t');
        axios.post('/api/beca/listar',
            { duracion, carrera, orden, continente, tipo }).then(res => {
                setBecas(res.data);
                setBecasMain(res.data);
            })
    }, [params]);
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} display='flex' justifyContent='space-between'>
                    <InputBox sx={{ width: 200 }}

                        placeholder='Buscar'
                        InputProps={{
                            startAdornment:
                                <BiSearch fontSize={28} style={{ marginRight: 10 }} color='#aaa' />
                        }}
                        onChange={ev => {
                            setBecas(BecasMain.filter(value => value.titulo.toLowerCase().includes(ev.target.value.toLowerCase())))
                        }}
                    />
                    <BotonFilled
                        onClick={() => {
                            setOpen(true);
                        }} >
                        Filtros <FiFilter fontSize={22} style={{ marginLeft: 10 }} />
                    </BotonFilled>
                </Grid>
                {
                    Becas.length > 0 ?
                        Becas.map(value => (
                            <Grid key={value.id} item xs={12} sm={6} lg={4} mx='auto'>
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