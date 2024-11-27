'use client';
import { Box, Grid, useMediaQuery, useTheme, } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Beca } from "@prisma/client";
import Image from 'next/legacy/image';
import BecaItem from "@/app/componentes/items/Beca";
import { Negrita, Normal } from "@/app/componentes/Textos";
import { Button, Input, InputGroup, SelectPicker, Stack } from "rsuite";
import { IoSearch } from "react-icons/io5";
import { grey, red } from "@mui/material/colors";
import { continentes } from "@/utils/globals";
import { Icon } from '@iconify/react';
const Cliente = () => {
    const [Becas, setBecas] = useState<Beca[]>([]);
    const [BecasMain, setBecasMain] = useState<Beca[]>([]);
    const params = useSearchParams();
    const router = useRouter();
    const [skip, setSkip] = useState(0);
    const [load, setLoad] = useState(true);

    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        const tipo = params.get('t') || '';
        const orden = params.get('s');
        const continente = params.get('co');
        axios.post('/api/beca/listar',
            { orden, continente, tipo, skip: 0 }).then(res => {
                setBecas(res.data);
                setBecasMain(res.data);
                setLoad(false);
                setSkip(1);

            });

    }, [params]);
    return (
        <>
            <InputGroup
                style={{
                    position: 'absolute', top: 230, right: 0, left: 0,
                    margin: '0 auto',
                    width: "60%", maxWidth: 500
                }}
                aria-label="Barra de búsqueda de becas"  // Añadir label para la barra de búsqueda
            >
                <Input
                    style={{ fontFamily: 'inherit' }}
                    placeholder="Buscar becas"
                    size="lg"
                    onChange={text => {
                        setBecas(BecasMain.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
                    }}
                    aria-label="Buscar becas por título"  
                />
                <InputGroup.Addon>
                    <IoSearch fontSize={20} aria-label="Icono de búsqueda" />  
                </InputGroup.Addon>
            </InputGroup>

            <Box py={{ xs: 0, sm: 2 }}
                sx={{
                    px: { xs: 1, sm: 5, md: 20, lg: 40, xl: 50 },
                    background: grey[100],
                    position: 'sticky',
                    top: 65, zIndex: 1,
                    borderBottom: '1px solid #ddd'
                }}
                role="region" aria-labelledby="filter-section"  // Definir el área como un bloque accesible
            >
                <Stack>
                    <Negrita fontSize={18} id="filter-section">
                        Filtrar Becas
                    </Negrita>
                    <Button
                        appearance="subtle"
                        onClick={() => {
                            router.push('/becas')
                        }}
                        aria-label="Recargar filtros de becas"
                    >
                        <Icon fontSize={20} icon="ant-design:reload-outlined" aria-hidden="true" />  
                    </Button>
                </Stack>
                <Grid container spacing={1} mt={0.5}>
                    <Grid item xs={6} sm={4} mx='auto'>
                        <SelectPicker
                            data={continentes}
                            placeholder='Continente'
                            labelKey="label"
                            valueKey="value"
                            style={{
                                width: "100%",
                                marginBottom: 10
                            }}
                            size={sm ? 'sm' : 'lg'}
                            cleanable={false}
                            value={params.get('co')}
                            onChange={pais => {
                                router.replace(`/becas?co=${pais}${params.has('s') ? '&s=' + params.get('s') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}${params.has('c') ? '&c=' + params.get('c') : ''}`)
                            }}
                            aria-label="Seleccionar continente"  // Añadir aria-label al selector
                            renderMenuItem={(label, item) => (
                                <div
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    key={label?.toString()}
                                    aria-live="polite"  // Anunciar cambios en el menú
                                >
                                    <Image
                                        src={item.image} width={30} height={30}
                                        layout="fixed"
                                        alt={`Bandera del continente ${label}`}  // Descripción accesible para la imagen
                                    />
                                    <span style={{ marginLeft: 15 }}>
                                        {label}
                                    </span>
                                </div>
                            )}
                        />
                    </Grid>

                    <Grid item xs={6} sm={4} mx='auto'>
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
                                router.replace(`/becas?s=${orden}${params.has('t') ? '&t=' + params.get('t') : ''}${params.has('co') ? '&co=' + params.get('co') : ''}${params.has('c') ? '&c=' + params.get('c') : ''}`)
                            }}
                            aria-label="Seleccionar orden de becas"  // Añadir aria-label al selector
                        />
                    </Grid>

                    <Grid item xs={6} sm={4} mx='auto'>
                        <SelectPicker
                            searchable={false}
                            cleanable={false}
                            value={params.get('t')}
                            data={[{ label: 'Nacionales', value: 'nacional' }, { label: 'Internacionales', value: 'internacional' }]}
                            size={sm ? 'sm' : 'lg'}
                            placeholder='Tipo'
                            labelKey="label"
                            valueKey="value"
                            style={{
                                width: "100%",
                                marginBottom: 10
                            }}
                            onChange={tipo => {
                                router.replace(`/becas?t=${tipo}${params.has('co') ? '&co=' + params.get('co') : ''}${params.has('s') ? '&s=' + params.get('s') : ''}${params.has('c') ? '&c=' + params.get('c') : ''}`)
                            }}
                            aria-label="Seleccionar tipo de beca"  // Añadir aria-label al selector
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box mt={4}
                px={{ xs: 1, sm: 10, md: 20, lg: 40, xl: 60 }}
                display='flex' flexDirection='column' alignItems='center'
                role="region" aria-labelledby="becas-list"
            >
                <div id="becas-list">
                    {
                        Becas.length > 0 ?
                            Becas.map(value => (
                                <BecaItem key={value.id} value={value as any} />
                            )) : <Normal m={2}>
                                Becas no encontradas
                            </Normal>
                    }
                </div>
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
                                setBecas(prev => ([...prev, ...res.data]));
                                setBecasMain(prev => ([...prev, ...res.data]));
                                setLoad(false)
                                setSkip(prev => prev + 1);
                            })
                    }}
                    aria-label="Cargar más becas"  // Descripción accesible para el botón de carga
                >
                    Cargar más
                </Button>
            </Box>
        </>
    )
}
export default Cliente;