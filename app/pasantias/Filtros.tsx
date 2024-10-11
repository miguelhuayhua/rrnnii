'use client';
import { Badge, Box, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Stack, SwipeableDrawer } from "@mui/material";
import Image from 'next/legacy/image';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Negrita, Titulo } from "../componentes/Textos";
import { BotonSimple } from "../componentes/Botones";
import { IoReload } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { InputBox } from "../componentes/Datos";
import { axiosInstance } from "@/globals";
import { Carrera } from "@prisma/client";
import { fileDomain } from "@/utils/globals";
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
                        <Titulo>
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
                        <InputBox
                            value={carrera}
                            sx={{ ".MuiTypography-root": { fontSize: 11 } }}
                            defaultValue={''}
                            select
                            label='Carrera'
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
                                    <MenuItem key={value.id} value={value.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{ width: 30, minWidth: 30, aspectRatio: 1, position: 'relative', mr: 1 }}>
                                                <Image layout='fill' src={fileDomain + value.logo} style={{ borderRadius: 10 }} />
                                            </Box>
                                            <Negrita sx={{ fontSize: 12 }}>{value.nombre}</Negrita>
                                        </Box>
                                    </MenuItem>
                                ))
                            }
                        </InputBox>
                        <Negrita my={1}>
                            Duración
                        </Negrita>
                        <RadioGroup value={duracion} onChange={(ev) => {
                            router.replace(`/pasantias?${params.has('carrera') ? '&carrera=' + params.get('carrera') : ''}&d=${ev.target.value}${params.has('s') ? '&s=' + params.get('s') : ''}`)
                        }}>
                            <FormControlLabel
                                value={'3'}
                                control={<Radio />}
                                label={'3 meses'}
                            />
                            <FormControlLabel
                                value={'6'}
                                control={<Radio />}
                                label={'6 meses'}
                            />
                        </RadioGroup>
                        <Negrita my={1}>
                            Orden
                        </Negrita>
                        <RadioGroup value={orden} onChange={(ev) => {
                            router.replace(`/pasantias?s=${ev.target.value}${params.has('carrera') ? '&carrera=' + params.get('carrera') : ''}${params.has('d') ? '&d=' + params.get('d') : ''}`)
                        }}>
                            <FormControlLabel
                                value={'0'}
                                control={<Radio />}
                                label={'Más recientes'}
                            />
                            <FormControlLabel
                                value={'1'}
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