'use client';
import { Badge, Box, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Stack, SwipeableDrawer, useMediaQuery, useTheme } from "@mui/material";
import Image from 'next/legacy/image';
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaFilter } from "react-icons/fa6";
import { Negrita, Titulo } from "../componentes/Textos";
import { BotonOutline, BotonSimple } from "../componentes/Botones";
import { IoReload } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { InputBox } from "../componentes/Datos";
import { axiosInstance } from "@/globals";
import { Carrera } from "@prisma/client";
interface Props {
    open: boolean;
    setOpen: any
}

const Filtros = ({ open, setOpen }: Props) => {
    const router = useRouter();
    const params = useSearchParams();
    const duracion = params.get('d') || '';
    const carrera = params.get('carrera') || '';
    const orden = params.get('s');
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    useEffect(() => {
        axiosInstance.post('/api/carrera/listar').then(res => {
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
                <Grid container width={270}>
                    <Grid display='flex' justifyContent='space-between' item xs={12} p={2} borderBottom='1px solid #ddd' >
                        <Titulo sx={{ fontSize: 15 }}>
                            Filtros
                        </Titulo>
                        <Stack direction='row' >
                            <Badge sx={{
                                '& .MuiBadge-badge': {
                                    right: 7,
                                    top: 7,
                                },
                            }} color="info" variant="dot" invisible={params.size == 0}>
                                <BotonSimple onClick={() => {
                                    router.replace('/pasantias');
                                }}>
                                    <IoReload fontSize={18} />
                                </BotonSimple>
                            </Badge>
                            <BotonSimple onClick={() => setOpen(false)}>
                                <CgClose fontSize={18} />
                            </BotonSimple>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} p={2}>
                        <Titulo sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 600 }}>
                            Carrera
                        </Titulo>
                        <InputBox
                            value={carrera}
                            sx={{ ".MuiTypography-root": { fontSize: 11 } }}
                            defaultValue={''}
                            select
                            onChange={(ev) => {
                                router.replace(`/pasantias?carrera=${ev.target.value}${params.has('d') ? '&d=' + params.get('d') : ''}${params.has('s') ? '&s=' + params.get('s') : ''}`)
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
                                    <MenuItem value={value.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{ width: 30, minWidth: 30, aspectRatio: 1, position: 'relative', mr: 1 }}>
                                                <Image layout='fill' src={value.logo} style={{ borderRadius: 10 }} />
                                            </Box>
                                            <Negrita sx={{ fontSize: 12 }}>{value.nombre}</Negrita>
                                        </Box>
                                    </MenuItem>
                                ))
                            }
                        </InputBox>
                        <Titulo sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 600, mt: 1 }}>
                            Duración
                        </Titulo>
                        <RadioGroup value={duracion} onChange={(ev) => {
                            router.replace(`/pasantias?${params.has('carrera') ? '&carrera=' + params.get('carrera') : ''}${params.has('d') ? '&d=' + ev.target.value : ''}${params.has('s') ? '&s=' + params.get('s') : ''}`)
                        }}>
                            <FormControlLabel
                                value={'3'}
                                sx={{ '.MuiFormControlLabel-label': { fontSize: 14 } }}
                                control={<Radio />}
                                label={'3 meses'}
                            />
                            <FormControlLabel
                                value={'6'}
                                sx={{ '.MuiFormControlLabel-label': { fontSize: 14 } }}
                                control={<Radio />}
                                label={'6 meses'}
                            />
                        </RadioGroup>
                        <Titulo sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 600 }}>
                            Orden
                        </Titulo>
                        <RadioGroup value={orden} onChange={(ev) => {
                            router.replace(`/pasantias?orden=${ev.target.value}${params.has('carrera') ? '&carrera=' + params.get('carrera') : ''}${params.has('duracion') ? '&duracion=' + params.get('duracion') : ''}`)
                        }}>
                            <FormControlLabel
                                value={'0'}
                                sx={{ '.MuiFormControlLabel-label': { fontSize: 14 } }}
                                control={<Radio />}
                                label={'Más recientes'}
                            />
                            <FormControlLabel
                                value={'1'}
                                sx={{ '.MuiFormControlLabel-label': { fontSize: 14 } }}
                                control={<Radio />}
                                label={'Más antiguos'}
                            />
                        </RadioGroup>
                    </Grid>
                </Grid>
            </SwipeableDrawer >
        </>
    )
}


export default Filtros;