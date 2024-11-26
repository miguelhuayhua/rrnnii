'use client';
import { Grid, Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import { Icon } from '@iconify/react';
import ConvenioItem from "../componentes/items/Convenio";
import { Suspense, useEffect, useState } from "react";
import { Convenio } from "@prisma/client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Normal, Negrita } from "../componentes/Textos";
import Image from 'next/legacy/image';
import { Button, Input, InputGroup, SelectPicker } from "rsuite";
import { IoSearch } from "react-icons/io5";
import { grey, red } from "@mui/material/colors";
import { useRouter } from "next/navigation";
import { continentes, fileDomain } from "@/utils/globals";
const Cliente = () => {
    const params = useSearchParams();
    const router = useRouter();
    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [skip, setSkip] = useState(0);
    const [carreras, setCarreras] = useState([]);
    const [load, setLoad] = useState(true);
    const [Convenios, setConvenios] = useState<Convenio[]>([]);
    const [ConveniosMain, setConveniosMain] = useState<Convenio[]>([]);
    useEffect(() => {
        axios.post('/api/convenio/listar',
            {
                tipo: params.get('t') || undefined,
                carrera: params.get('c') || undefined,
                continente: params.get('co') || undefined,
                orden: params.get('s') || undefined,
                skip: 0
            }).then(res => {
                setConvenios(res.data);
                setConveniosMain(res.data);
                setLoad(false);
                setSkip(1);
            });
        axios.post('/api/carrera/listar').then(res => {
            setCarreras(res.data)
        });
    }, [params]);
    return (
        <>

            <InputGroup style={{
                position: 'absolute', top: 170, right: 0, left: 0,
                margin: '0 auto',
                width: "60%", maxWidth: 500
            }} >
                <Input style={{ fontFamily: 'inherit' }}
                    placeholder="Buscar convenios"
                    size="lg"
                    onChange={text => {
                        setConvenios(ConveniosMain.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
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
                        Filtrar Convenios
                    </Negrita>
                    <Button
                        style={{ marginLeft: 10 }}
                        appearance="subtle" onClick={() => {
                            router.push('/convenios')
                        }}>
                        <Icon fontSize={18} icon="ant-design:reload-outlined" />
                    </Button>
                </Stack>
                <Grid container spacing={1} mt={0.5} >
                    <Grid item xs={6} sm={3}>
                        <SelectPicker
                            data={continentes}
                            size={sm ? 'xs' : 'lg'}
                            searchable={false}
                            placeholder='Continente'
                            labelKey="label"
                            valueKey="value"
                            style={{
                                width: "100%",
                                marginBottom: 10
                            }}
                            cleanable={false}
                            value={params.get('co')}
                            onChange={pais => {
                                router.replace(`/convenios?co=${pais}${params.has('s') ? '&s=' + params.get('s') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}${params.has('c') ? '&c=' + params.get('c') : ''}`)
                            }}
                            renderMenuItem={(label, item) => (
                                <div
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    key={label?.toString()} >
                                    <Image
                                        src={item.image} width={30} height={30}
                                        layout="fixed"
                                    />
                                    <span style={{ marginLeft: 15 }}>
                                        {label}
                                    </span>
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
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
                                router.replace(`/convenios?s=${orden}${params.has('t') ? '&t=' + params.get('t') : ''}${params.has('co') ? '&co=' + params.get('co') : ''}${params.has('c') ? '&c=' + params.get('c') : ''}`)
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SelectPicker
                            searchable={false}
                            cleanable={false}
                            value={params.get('t')}
                            data={[{ label: 'Nacionales', value: 'nacional' }, { label: 'Internacionales', value: 'internacional' }]}
                            size={sm ? 'xs' : 'lg'}
                            placeholder='Tipo'
                            labelKey="label"
                            valueKey="value"
                            style={{
                                width: "100%",
                                marginBottom: 10
                            }}
                            onChange={tipo => {
                                router.replace(`/convenios?t=${tipo}${params.has('co') ? '&co=' + params.get('co') : ''}${params.has('s') ? '&s=' + params.get('s') : ''}${params.has('c') ? '&c=' + params.get('c') : ''}`)
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SelectPicker
                            searchable={false}
                            value={params.get('c')}
                            cleanable={false}
                            data={carreras}
                            size={sm ? 'xs' : 'lg'}
                            placeholder='Carrera'
                            labelKey="nombre"
                            valueKey="id"
                            style={{
                                width: "100%",
                                marginBottom: 10
                            }}
                            onChange={carrera => {
                                router.replace(`/convenios?c=${carrera}${params.has('co') ? '&co=' + params.get('co') : ''}${params.has('s') ? '&s=' + params.get('s') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
                            }}
                            renderMenuItem={(label, item) => (
                                <div
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    key={label?.toString()} >
                                    <Image
                                        src={item.logo ? (fileDomain + item.logo) : '/default-image.jpg'} width={30} height={30}
                                        layout="fixed"
                                    />
                                    <span style={{ marginLeft: 15 }}>
                                        {label}
                                    </span>
                                </div>
                            )}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box mt={4}
                px={{ xs: 1, sm: 10, md: 20, lg: 40, xl: 60 }}
                display='flex' flexDirection='column' alignItems='center'>
                {
                    Convenios.length > 0 ?
                        Convenios.map(value => (
                            <ConvenioItem key={value.id} value={value as any} />))
                        : <Normal m={2}>
                            Convenios no encontrados
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
                        axios.post('/api/convenio/listar',
                            {
                                tipo: params.get('t') || undefined,
                                carrera: params.get('c') || undefined,
                                continente: params.get('co') || undefined,
                                take: 12, skip
                            }).then(res => {
                                setConvenios(prev => ([...prev, ...res.data]));
                                setConveniosMain(prev => ([...prev, ...res.data]));
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