'use client';
import { Box, Grid, Stack, useMediaQuery, useTheme, } from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import PasantiaItem from "../componentes/items/Pasantia";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Pasantia } from "@prisma/client";
import Image from 'next/legacy/image';
import { Icon } from '@iconify/react';
import { Negrita, Normal } from "../componentes/Textos";
import { Button, Input, InputGroup, SelectPicker } from "rsuite";
import { IoSearch } from "react-icons/io5";
import { grey, red } from "@mui/material/colors";
import { fileDomain } from "@/utils/globals";
const Cliente = () => {
    const [Pasantias, setPasantias] = useState<Pasantia[]>([]);
    const [PasantiasMain, setPasantiasMain] = useState<Pasantia[]>([]);
    const [load, setLoad] = useState(true);
    const [skip, setSkip] = useState(0);
    const router = useRouter();
    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.down('sm'));
    const params = useSearchParams();
    const duracion = params.get('d') || '';
    const carrera = params.get('c') || '';
    const orden = params.get('s');
    const [carreras, setCarreras] = useState([]);
    useEffect(() => {
        axios.post('/api/pasantia/listar',
            { duracion, carrera, orden, skip: 0 }).then(res => {
                setPasantias(res.data);
                setPasantiasMain(res.data);
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
                position: 'absolute', top: 220, right: 0, left: 0,
                margin: '0 auto',
                width: "60%", maxWidth: 500
            }} >
                <Input style={{ fontFamily: 'inherit' }}
                    placeholder="Buscar pasantias"
                    size="lg"
                    onChange={text => {
                        setPasantias(PasantiasMain.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
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
                        Filtrar Pasantías
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
                    <Grid item xs={6} sm={4}>
                        <SelectPicker
                            searchable={false}
                            data={[{ label: 'Más antiguos', value: '1' }, { label: 'Más recientes', value: '0' }]}
                            size={sm ? 'sm' : 'lg'}
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
                                router.replace(`/pasantias?s=${orden}${params.has('d') ? '&d=' + params.get('d') : ''}${params.has('co') ? '&co=' + params.get('co') : ''}${params.has('c') ? '&c=' + params.get('c') : ''}`)
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <SelectPicker
                            searchable={false}
                            cleanable={false}
                            value={params.get('d')}
                            data={[{ label: '6 meses', value: '6' },
                            { label: '3 meses', value: '3' },
                            { label: 'Más de 6 meses', value: 'more' }]}
                            size={sm ? 'sm' : 'lg'}
                            placeholder='Duración'
                            labelKey="label"
                            valueKey="value"
                            style={{
                                width: "100%",
                                marginBottom: 10
                            }}
                            onChange={duracion => {
                                router.replace(`/pasantias?d=${duracion}${params.has('c') ? '&c=' + params.get('c') : ''}${params.has('s') ? '&s=' + params.get('s') : ''}`)
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={4} mx='auto'>
                        <SelectPicker
                            searchable={false}
                            value={params.get('c')}
                            cleanable={false}
                            data={carreras}
                            size={sm ? 'sm' : 'lg'}
                            placeholder='Carrera'
                            labelKey="nombre"
                            valueKey="id"
                            style={{
                                width: "100%",
                                marginBottom: 10
                            }}
                            onChange={carrera => {
                                router.replace(`/pasantias?c=${carrera}${params.has('d') ? '&d=' + params.get('d') : ''}${params.has('s') ? '&s=' + params.get('s') : ''}`)
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
                    Pasantias.length > 0 ?
                        Pasantias.map(value => (
                            <PasantiaItem key={value.id} value={value as any} />))
                        :
                        <Normal m={2}>
                            Pasantías no encontradas
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
                        axios.post('/api/pasantia/listar',
                            { duracion, carrera, orden, skip }).then(res => {
                                setPasantias(prev => ([...prev, ...res.data]));
                                setPasantiasMain(prev => ([...prev, ...res.data]));
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