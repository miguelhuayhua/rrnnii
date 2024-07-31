'use client';
import { Badge, Box, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Stack, SwipeableDrawer, useMediaQuery, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaFilter } from "react-icons/fa6";
import { Negrita, Titulo } from "../componentes/Textos";
import { BotonSimple } from "../componentes/Botones";
import { IoReload } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { InputBox } from "../componentes/Datos";
interface Props {
    open: boolean;
    setOpen: any
}

const Filtros = ({ open, setOpen }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();
    const params = useSearchParams();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {}
    });
    const onSubmit = ({ descuento, max, min }: any) => {
        let filtros = ''

        filtros = filtros + `descuento=${descuento}&max=${max}&min=${min}`
        router.prefetch(pathname + '?' + filtros);
        router.replace(pathname + '?' + filtros, { scroll: false });
    }
    const carrera = params.get('carrera') || '';
    const duracion = params.get('duracion') || '';

    return (
        <>
            <SwipeableDrawer
                anchor={'right'}
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
            >
                <Grid
                    container
                    component={'form'}
                    onSubmit={handleSubmit(onSubmit)}
                    width={270}
                >
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
                                    router.replace('/actividades');
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
                            Tipo
                        </Titulo>
                        <InputBox
                            select
                            value={carrera}
                            onChange={(ev) => {
                                router.replace(`/actividades?carrera=${ev.target.value}${params.has('duracion') ? '&duracion=' + params.get('duracion') : ''}`)
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

                            <MenuItem value='inge'>Becas</MenuItem>
                            <MenuItem value='inge'>Noticias</MenuItem>
                            <MenuItem value='inge'>Idiomas</MenuItem>
                        </InputBox>
                        <Titulo sx={{ mt: 1, fontSize: { xs: 13, md: 14 }, fontWeight: 600 }}>
                            Duración
                        </Titulo>
                        <RadioGroup value={duracion} onChange={(ev) => {
                            router.replace(`/actividades?duracion=${ev.target.value}${params.has('carrera') ? '&carrera=' + params.get('carrera') : ''}`)
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
                    </Grid>
                </Grid>
            </SwipeableDrawer >
        </>
    )
}


export default Filtros;