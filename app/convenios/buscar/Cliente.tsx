'use client';
import { Badge, CircularProgress, Grid } from "@mui/material";
import { InputBox } from "../../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonFilled, BotonOutline } from "../../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import ConvenioItem from "../../componentes/items/Convenio";
import { Suspense, useEffect, useState } from "react";
import { Convenio } from "@prisma/client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Normal } from "../../componentes/Textos";
import Filtros from "./Filtros";
import { Button, Input, InputGroup } from "rsuite";
import { IoSearch } from "react-icons/io5";
const Cliente = () => {
    const [open, setOpen] = useState(false);
    const params = useSearchParams();
    const [skip, setSkip] = useState(0);
    const [load, setLoad] = useState(true);
    const [Convenios, setConvenios] = useState<Convenio[]>([]);
    const [ConveniosMain, setConveniosMain] = useState<Convenio[]>([]);
    useEffect(() => {
        axios.post('/api/convenio/listar',
            {
                tipo: params.get('t') || undefined,
                carrera: params.get('c') || undefined,
                continente: params.get('co') || undefined,
                skip: 0
            }).then(res => {
                setConvenios(res.data);
                setConveniosMain(res.data);
                setLoad(false);
                setSkip(1);
            })
    }, [params]);
    return (
        <>
            <div className="gradient-wrap">
                <div className="meshgradient">
                    <div className="color c1"></div>
                    <div className="color c2"></div>
                    <div className="color c3"></div>
                    <div className="color c4"></div>
                </div>
            </div>
            <Grid container spacing={2} >
                <Grid item xs={12} display='flex' justifyContent='space-between'>
                    <InputGroup style={{ maxWidth: 300, marginBottom: 20 }} >
                        <Input style={{ fontFamily: 'inherit' }}
                            placeholder="Buscar convenios"
                            onChange={text => {
                                setConvenios(ConveniosMain.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
                            }} />
                        <InputGroup.Addon style={{ background: 'white' }}>
                            <IoSearch fontSize={28} />
                        </InputGroup.Addon>
                    </InputGroup>
                    <Badge invisible={!(
                        params.has('t') || params.has('co') || params.has('c'))}
                        color="primary"
                        variant="dot">
                        <Button appearance='primary' style={{ background: '#212121', height: 48 }} size='sm'
                            onClick={() => { setOpen(true); }} >
                            Filtros <FiFilter fontSize={22} style={{ marginLeft: 10 }} />
                        </Button>
                    </Badge>
                </Grid>

                {
                    Convenios.length > 0 ?
                        Convenios.map(value => (
                            <Grid key={value.id} item xs={12} sm={6} md={6} lg={4} mx='auto'>
                                <ConvenioItem value={value as any} />
                            </Grid>))
                        : <Normal ml={4} my={4}>
                            Convenios no encontrados
                        </Normal>
                }
                <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <BotonOutline
                        disabled={load}
                        onClick={() => {
                            setLoad(true);
                            axios.post('/api/convenio/listar',
                                {
                                    tipo: params.get('t') || undefined,
                                    carrera: params.get('c') || undefined,
                                    continente: params.get('co') || undefined,
                                    take: 12, skip: skip
                                }).then(res => {
                                    setConvenios(prev => ([...prev, ...res.data]));
                                    setConveniosMain(res.data);
                                    setLoad(false)
                                    setSkip(prev => prev + 1);
                                })
                        }}
                        sx={{ mt: 4, fontSize: 13 }}>
                        Cargas más
                        {
                            load ? <CircularProgress
                                size='20px' sx={{ ml: 1 }} /> : null
                        }
                    </BotonOutline>
                </Grid>
            </Grid>
            <Suspense>
                <Filtros open={open} setOpen={setOpen} />
            </Suspense>
        </>
    )
}
export default Cliente;