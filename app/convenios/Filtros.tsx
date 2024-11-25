'use client';
import { Badge, FormControlLabel, Box, Grid, Radio, RadioGroup, Stack, SwipeableDrawer, MenuItem, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Titulo, Negrita, Normal } from "../componentes/Textos";
import { BotonSimple } from "../componentes/Botones";
import { IoReload } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { InputBox } from "../componentes/Datos";
import { useEffect, useState } from "react";
import { Carrera } from "@prisma/client";
import Image from 'next/legacy/image';
import { fileDomain } from "@/utils/globals";
import axios from "axios";
import { grey } from "@mui/material/colors";
interface Props {
    open: boolean;
    setOpen: any
}

const Filtros = ({ open, setOpen }: Props) => {
    const router = useRouter();
    const params = useSearchParams();
    const tipo = params.get('t') || '';
    const carrera = params.get('c') || '';
    const continente = params.get('co') || '';
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    useEffect(() => {
        axios.post('/api/carrera/listar').then(res => {
            setCarreras(res.data);
        })
    }, []);
    return (
        <>
            <SwipeableDrawer
                anchor={'right'}
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
            >
                <Grid container width={380}>
                    <Grid display='flex' justifyContent='space-between' item xs={12} p={2} borderBottom='1px solid #ddd' >
                        <Titulo >
                            Filtros
                        </Titulo>
                        <Stack direction='row' >
                            <Badge sx={{
                                '& .MuiBadge-badge': {
                                    right: 7,
                                    top: 7,
                                },
                            }} color="info" variant="dot" invisible={params.size == 0}>
                                <BotonSimple onClick={() => router.replace('/convenios/buscar')}>
                                    <IoReload fontSize={22} />
                                </BotonSimple>
                            </Badge>
                            <BotonSimple onClick={() => setOpen(false)}>
                                <CgClose fontSize={22} />
                            </BotonSimple>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} p={2}>

                        <InputBox
                            value={carrera}
                            sx={{ ".MuiTypography-root": { fontSize: 11 } }}
                            defaultValue={''}
                            select
                            label='Carrera'
                            onChange={(ev) => {
                                router.replace(`/convenios/buscar?c=${ev.target.value}${params.has('t') ? '&t=' + params.get('t') : ''}${params.has('co') ? '&co=' + params.get('co') : ''}`)
                            }}
                            SelectProps={{
                                MenuProps: {
                                    slotProps: {
                                        paper: {
                                            sx: {
                                                background: 'linear-gradient(25deg, rgba(255,245,245,1) 0%, rgba(255,255,255,1) 51%, rgba(255,255,255,1) 72%, rgba(244,247,255,1) 100%)',
                                                px: 0,
                                                borderRadius: 3,
                                                border: "1px solid #f1f1f1",
                                                boxShadow: '-10px 10px 30px #00000022',
                                                maxHeight: 400
                                            }
                                        }
                                    }
                                }
                            }}
                        >
                            {
                                carreras.map(value => (
                                    <MenuItem key={value.id} value={value.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{ width: 30, minWidth: 30, aspectRatio: 1, position: 'relative', mr: 1 }}>
                                                <Image layout='fill' src={fileDomain + value.logo} style={{ borderRadius: 10 }} />
                                            </Box>
                                            <Negrita sx={{ fontSize: 14 }}>{value.nombre}</Negrita>
                                        </Box>
                                    </MenuItem>
                                ))
                            }
                        </InputBox>
                        <Negrita>
                            Tipo
                        </Negrita>
                        <RadioGroup value={tipo} onChange={(ev) => {
                            router.replace(`/convenios/buscar?t=${ev.target.value}${params.has('co') ? '&co=' + params.get('co') : ''}${params.has('c') ? '&c=' + params.get('c') : ''}`)
                        }}>
                            <FormControlLabel
                                value={'nacional'}
                                sx={{ '.MuiFormControlLabel-label': { fontSize: 16 } }}
                                control={<Radio />}
                                label={'Nacionales'}
                            />
                            <FormControlLabel
                                value={'internacional'}
                                sx={{ '.MuiFormControlLabel-label': { fontSize: 16 } }}
                                control={<Radio />}
                                label={'Internacionales'}
                            />
                        </RadioGroup>
                        <Negrita>
                            Continente
                        </Negrita>
                        <Box display='flex' flexWrap='wrap' justifyContent='space-around'>
                            <Button sx={{
                                borderRadius: 4,
                                boxShadow: '0 3px 3px #ddd',
                                border: `${continente == 'na' ? 2 : 0}px solid ${grey[900]}`,
                                flexDirection: 'column', m: 1
                            }}>
                                <Image className="img" layout="fixed" objectFit="cover"
                                    width={100} height={100} style={{
                                        userSelect: 'none',
                                        aspectRatio: 1
                                    }}
                                    onClick={() => {
                                        router.replace(`/convenios/buscar?co=na${params.has('c') ? '&c=' + params.get('c') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
                                    }}
                                    src='/assets/america-norte.png' />
                                <Normal >
                                    America Norte
                                </Normal>
                            </Button>
                            <Button
                                onClick={() => {
                                    router.replace(`/convenios/buscar?co=sa${params.has('c') ? '&c=' + params.get('c') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
                                }}
                                sx={{
                                    borderRadius: 4,
                                    border: `${continente == 'sa' ? 2 : 0}px solid ${grey[900]}`,
                                    boxShadow: '0 3px 3px #ddd', flexDirection: 'column', m: 1
                                }}>
                                <Image className="img" layout="fixed" objectFit="cover"
                                    width={100} height={100} style={{
                                        userSelect: 'none',
                                        aspectRatio: 1
                                    }}
                                    src='/assets/america-sur.png' />
                                <Normal >
                                    America Sur
                                </Normal>
                            </Button>
                            <Button
                                onClick={() => {
                                    router.replace(`/convenios/buscar?co=as${params.has('c') ? '&c=' + params.get('c') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
                                }}
                                sx={{
                                    borderRadius: 4,
                                    border: `${continente == 'as' ? 2 : 0}px solid ${grey[900]}`,
                                    boxShadow: '0 3px 3px #ddd', flexDirection: 'column', m: 1
                                }}>
                                <Image className="img" layout="fixed" objectFit="cover"
                                    width={100} height={100} style={{
                                        userSelect: 'none',
                                        aspectRatio: 1
                                    }}
                                    src='/assets/asia.png' />
                                <Normal >
                                    Ásia
                                </Normal>
                            </Button>
                            <Button
                                onClick={() => {
                                    router.replace(`/convenios/buscar?co=eu${params.has('c') ? '&c=' + params.get('c') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
                                }}
                                sx={{
                                    borderRadius: 4,
                                    border: `${continente == 'eu' ? 2 : 0}px solid ${grey[900]}`,
                                    boxShadow: '0 3px 3px #ddd', flexDirection: 'column', m: 1
                                }}>
                                <Image className="img" layout="fixed" objectFit="cover"
                                    width={100} height={100} style={{
                                        userSelect: 'none',
                                        aspectRatio: 1
                                    }}
                                    src='/assets/europa.png' />
                                <Normal >
                                    Europa
                                </Normal>
                            </Button>
                            <Button
                                onClick={() => {
                                    router.replace(`/convenios/buscar?co=af${params.has('c') ? '&c=' + params.get('c') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
                                }}
                                sx={{
                                    borderRadius: 4,
                                    border: `${continente == 'af' ? 2 : 0}px solid ${grey[900]}`,
                                    boxShadow: '0 3px 3px #ddd', flexDirection: 'column', m: 1
                                }}>
                                <Image className="img" layout="fixed" objectFit="cover"
                                    width={100} height={100} style={{
                                        userSelect: 'none',
                                        aspectRatio: 1
                                    }}
                                    src='/assets/africa.png' />
                                <Normal >
                                    África
                                </Normal>
                            </Button>
                            <Button
                                onClick={() => {
                                    router.replace(`/convenios/buscar?co=oc${params.has('c') ? '&c=' + params.get('c') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
                                }}
                                sx={{
                                    borderRadius: 4,
                                    border: `${continente == 'oc' ? 2 : 0}px solid ${grey[900]}`,
                                    boxShadow: '0 3px 3px #ddd', flexDirection: 'column', m: 1
                                }}>
                                <Image className="img" layout="fixed" objectFit="cover"
                                    width={100} height={100} style={{
                                        userSelect: 'none',
                                        aspectRatio: 1
                                    }}
                                    src='/assets/oceania.png' />
                                <Normal >
                                    Oceanía
                                </Normal>
                            </Button>

                        </Box>
                    </Grid>
                </Grid>
            </SwipeableDrawer >
        </>
    )
}


export default Filtros;