'use client';
import { Badge, Box, CircularProgress, Grid, Stack, } from "@mui/material";
import { BotonFilled, BotonOutline, BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Noticia } from "@prisma/client";
import { Negrita, Normal } from "../componentes/Textos";
import NoticiaItem from "../componentes/items/Noticia";
import { Icon } from '@iconify/react';
import Filtros from "./Filtros";
import { Button, Input, InputGroup, SelectPicker } from "rsuite";
import { IoSearch } from "react-icons/io5";
import { grey, red } from "@mui/material/colors";
const Cliente = () => {
    const [skip, setSkip] = useState(0);
    const [load, setLoad] = useState(true);
    const router = useRouter();
    const params = useSearchParams();
    const [Noticias, setNoticias] = useState<Noticia[]>([]);
    const [NoticiasMain, setNoticiasMain] = useState<Noticia[]>([]);
    const orden = params.get('s');
    useEffect(() => {
        axios.post('/api/noticia/listar',
            { skip: 0, orden }).then(res => {
                setNoticias(res.data);
                setNoticiasMain(res.data);
                setLoad(false);
                setSkip(1);
            })
    }, [params]);
    return (
        <>
            <InputGroup style={{
                position: 'absolute', top: 170, right: 0, left: 0,
                margin: '0 auto',
                width: "60%", maxWidth: 500
            }} >
                <Input style={{ fontFamily: 'inherit' }}
                    placeholder="Buscar noticias"
                    size="lg"
                    onChange={text => {
                        setNoticias(NoticiasMain.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
                    }} />
                <InputGroup.Addon>
                    <IoSearch fontSize={20} />
                </InputGroup.Addon>
            </InputGroup>
            <Box py={{ xs: 1, sm: 2 }}
                sx={{
                    px: { xs: 1, sm: 5, md: 20, lg: 40, xl: 50 },
                    background: grey[100],
                    position: 'sticky',
                    top: 65, zIndex: 1,
                    borderBottom: '1px solid #ddd'
                }}>
                <Stack direction='row' alignItems='center' >
                    <Negrita fontSize={18}>
                        Filtrar Noticias
                    </Negrita>
                    <Button
                        style={{ marginLeft: 10 }}
                        appearance="subtle" onClick={() => {
                            router.push('/pasantias')
                        }}>
                        <Icon fontSize={18} icon="ant-design:reload-outlined" />
                    </Button>
                </Stack>
                <Grid container spacing={1} mt={0.5} >
                    <Grid item xs={6} mx='auto'>
                        <SelectPicker
                            searchable={false}
                            data={[{ label: 'Más antiguos', value: '1' }, { label: 'Más recientes', value: '0' }]}
                            size={'lg'}
                            cleanable={false}
                            value={params.get('s')}
                            placeholder='Orden'
                            labelKey="label"
                            valueKey="value"
                            style={{
                                width: "100%",
                                marginBottom: 10
                            }}
                            onChange={orden => {
                                router.replace(`/noticias?s=${orden}`)
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={2}
                my={4}>
                {
                    Noticias.length > 0 ?
                        Noticias.map(value => (
                            <Grid key={value.id} item xs={11}
                                sm={10} md={9} lg={8} xl={7} mx='auto'>
                                <NoticiaItem value={value as any} />
                            </Grid>))
                        : <Normal m={2}>
                            Noticias no encontradas
                        </Normal>
                }

            </Grid>
            <Button
                disabled={load}
                loading={load}
                appearance="primary"
                style={{
                    background: red[700],
                    display: 'block',
                    margin: '40px auto'
                }}
                onClick={() => {
                    setLoad(true);
                    axios.post('/api/noticia/listar',
                        {
                            skip, orden
                        }).then(res => {
                            setNoticias(prev => ([...prev, ...res.data]));
                            setNoticiasMain(prev => ([...prev, ...res.data]));
                            setLoad(false)
                            setSkip(prev => prev + 1);
                        })
                }}
            >
                Cargas más

            </Button>
        </>
    )
}
export default Cliente;