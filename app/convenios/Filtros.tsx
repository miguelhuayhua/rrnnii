'use client';
import { Badge, FormControlLabel, Grid, Radio, RadioGroup, Stack, SwipeableDrawer } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Titulo } from "../componentes/Textos";
import { BotonSimple } from "../componentes/Botones";
import { IoReload } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { InputBox, ItemBox } from "../componentes/Datos";
interface Props {
    open: boolean;
    setOpen: any
}

const Filtros = ({ open, setOpen }: Props) => {
    const router = useRouter();
    const params = useSearchParams();
    const tipo = params.get('tipo') || '';
    const carrera = params.get('carrera') || '';
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
                                <BotonSimple onClick={() => router.replace('/convenios')}>
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
                            defaultValue={''}
                            select
                            onChange={(ev) => {
                                router.replace(`/convenios?carrera=${ev.target.value}${params.has('tipo') ? '&tipo=' + params.get('tipo') : ''}`)
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
                            <ItemBox value='inge'>Ingeniería de Sistemas</ItemBox>
                        </InputBox>
                        <Titulo sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 600 }}>
                            Tipo
                        </Titulo>
                        <RadioGroup value={tipo} onChange={(ev) => {
                            router.replace(`/convenios?tipo=${ev.target.value}${params.has('carrera') ? '&carrera=' + params.get('carrera') : ''}`)
                        }}>
                            <FormControlLabel
                                value={'nacional'}
                                sx={{ '.MuiFormControlLabel-label': { fontSize: 14 } }}
                                control={<Radio />}
                                label={'Nacionales'}
                            />
                            <FormControlLabel
                                value={'internacional'}
                                sx={{ '.MuiFormControlLabel-label': { fontSize: 14 } }}
                                control={<Radio />}
                                label={'Internacionales'}
                            />
                        </RadioGroup>
                    </Grid>
                </Grid>
            </SwipeableDrawer >
        </>
    )
}


export default Filtros;