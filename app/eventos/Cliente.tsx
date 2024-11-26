'use client';
import { Box, Grid, Stack, useMediaQuery, useTheme, } from "@mui/material";
import { useEffect, useState } from "react";
import EventoItem from "../componentes/items/Evento";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Evento } from "@prisma/client";
import { Icon } from '@iconify/react';
import { Negrita, Normal } from "../componentes/Textos";
import { Button, Input, InputGroup, SelectPicker } from "rsuite";
import { IoSearch } from "react-icons/io5";
import { grey, red } from "@mui/material/colors";
import plugin from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
dayjs.extend(plugin);
const Cliente = () => {
    const params = useSearchParams();
    const [Eventos, setEventos] = useState<Evento[]>([]);
    const [skip, setSkip] = useState(0);
    const router = useRouter();
    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [load, setLoad] = useState(true);
    const [EventosMain, setEventosMain] = useState<Evento[]>([]);
    useEffect(() => {
        axios.post('/api/evento/listar',
            { tipo: params.get('t'), orden: params.get('s'), skip: 0 }).then(res => {
                setEventos(res.data);
                setEventosMain(res.data);
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
                    placeholder="Buscar eventos"
                    size="lg"
                    onChange={text => {
                        setEventos(EventosMain.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
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
                        Filtrar Eventos
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
                    <Grid item xs={6}>
                        <SelectPicker
                            searchable={false}
                            data={[{ label: 'Más antiguos', value: '1' }, { label: 'Más recientes', value: '0' }]}
                            size={sm ? 'xs' : 'lg'}
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
                                router.replace(`/eventos?s=${orden}${params.has('t') ? '&t=' + params.get('t') : ''}`)
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} >
                        <SelectPicker
                            searchable={false}
                            cleanable={false}
                            value={params.get('d')}
                            data={[{ label: '6 meses', value: '6' },
                            { label: '3 meses', value: '3' },
                            { label: 'Más de 6 meses', value: 'more' }]}
                            size={sm ? 'xs' : 'lg'}
                            placeholder='Duración'
                            labelKey="label"
                            valueKey="value"
                            style={{
                                width: "100%",
                                marginBottom: 10
                            }}
                            onChange={tipo => {
                                router.replace(`/pasantias?t=${tipo}${params.has('s') ? '&s=' + params.get('s') : ''}`)
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box mt={4}
                px={{ xs: 1, sm: 10, md: 20, lg: 40, xl: 60 }}
                display='flex' flexDirection='column' alignItems='center'>
                {
                    Eventos.length > 0 ?
                        Eventos.map(value => (
                            <EventoItem key={value.id} value={value as any} />))
                        : <Normal m={2}>
                            Eventos no encontrados
                        </Normal>
                }
                <Button
                    disabled={load}
                    loading={load}
                    appearance="primary"
                    style={{
                        background: red[700],
                        marginTop: 40
                    }}
                    onClick={() => {
                        setLoad(true);
                        axios.post('/api/evento/listar',
                            {
                                tipo: params.get('t'),
                                orden: params.get('s'),
                                take: 12, skip
                            }).then(res => {
                                setEventos(prev => ([...prev, ...res.data]));
                                setEventosMain(prev => ([...prev, ...res.data]));
                                setLoad(false)
                                setSkip(prev => prev + 1);
                            })
                    }}
                >
                    Cargas más

                </Button>
            </Box>
        </>
    )
}
export default Cliente;