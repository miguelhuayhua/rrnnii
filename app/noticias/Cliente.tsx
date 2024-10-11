'use client';
import { Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonFilled, BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Evento } from "@prisma/client";
import { Normal } from "../componentes/Textos";
import NoticiaItem from "../componentes/items/Noticia";
const Cliente = () => {
    const [open, setOpen] = useState(false);
    const params = useSearchParams();
    const [Noticias, setNoticias] = useState<Evento[]>([]);
    const [NoticiasMain, setNoticiasMain] = useState<Evento[]>([]);
    useEffect(() => {
        axios.post('/api/noticia/listar',
            { skip: 0 }).then(res => {
                setNoticias(res.data);
                setNoticiasMain(res.data);
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
                            setNoticias(NoticiasMain.filter(value => value.titulo.toLowerCase().includes(ev.target.value.toLowerCase())))
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
                    Noticias.length > 0 ?
                        Noticias.map(value => (
                            <Grid key={value.id} item xs={12} mx='auto'>
                                <NoticiaItem value={value as any} />
                            </Grid>))
                        : <Normal m={2}>
                            Noticias no encontrados
                        </Normal>
                }
            </Grid>
        </>
    )
}
export default Cliente;