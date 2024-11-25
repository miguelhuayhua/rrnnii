'use client';
import { Badge, Box, Button, FormControlLabel, Grid, Radio, RadioGroup, Stack, SwipeableDrawer } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Image from 'next/legacy/image';
import { IoReload } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { BotonSimple } from "@/app/componentes/Botones";
import { grey } from "@mui/material/colors";
interface Props {
    open: boolean;
    setOpen: any
}

const Filtros = ({ open, setOpen }: Props) => {
    const router = useRouter();
    const params = useSearchParams();
    const orden = params.get('s');
    const continente = params.get('co');
    const tipo = params.get('t');
    return (
        <>
            <SwipeableDrawer
                anchor={'right'}
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
            >
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
                                router.replace('/becas/buscar');
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
                    <Negrita my={1}>
                        Orden
                    </Negrita>
                    <RadioGroup value={orden} onChange={(ev) => {
                        router.replace(`/becas/buscar?s=${ev.target.value}${params.has('t') ? '&t=' + params.get('t') : ''}${params.has('co') ? '&co=' + params.get('co') : ''}`)
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
                    <Negrita>
                        Tipo
                    </Negrita>
                   

                </Grid>
            </SwipeableDrawer >
        </>
    )
}


export default Filtros;