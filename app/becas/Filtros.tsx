'use client';
import { Badge, Box, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Stack, SwipeableDrawer, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Negrita, Titulo } from "../componentes/Textos";
import { BotonOutline, BotonSimple } from "../componentes/Botones";
import { IoReload } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { axiosInstance } from "@/globals";
import { Carrera } from "@prisma/client";
interface Props {
    open: boolean;
    setOpen: any
}

const Filtros = ({ open, setOpen }: Props) => {
    const router = useRouter();
    const params = useSearchParams();
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
                                    router.replace('/becas');
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
                        <Titulo sx={{ fontSize: 14, fontWeight: 600 }}>
                            Orden
                        </Titulo>
                        <RadioGroup value={orden} onChange={(ev) => {
                            router.replace(`/becas?s=${ev.target.value}${params.has('carrera') ? '&carrera=' + params.get('carrera') : ''}${params.has('d') ? '&d=' + params.get('d') : ''}`)
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