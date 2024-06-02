'use client';
import { Badge, FormControlLabel, Grid, Radio, RadioGroup, Stack, SwipeableDrawer, useTheme } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaFilter } from "react-icons/fa6";
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
    const modo = params.get('modo') || '';

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
                    width={270}
                >
                    <Grid display='flex' justifyContent='space-between' item xs={12} p={2} borderBottom='1px solid #ddd' >
                        <Titulo sx={{ fontSize: 15 }}>
                            Filtros
                        </Titulo>
                        <Stack direction='row' >
                            <Badge invisible={params.size == 0} sx={{
                                '& .MuiBadge-badge': {
                                    right: 7,
                                    top: 7,
                                },
                            }} color="info" variant="dot">
                                <BotonSimple onClick={() => router.replace('/eventos')}>
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
                            Modo
                        </Titulo>
                        <RadioGroup value={modo} onChange={(ev) => {
                            router.replace(`/eventos?modo=${ev.target.value}${params.has('tipo') ? '&tipo=' + params.get('tipo') : ''}`)
                        }}>
                            <FormControlLabel
                                value={'online'}
                                sx={{ '.MuiFormControlLabel-label': { fontSize: 14 } }}
                                control={<Radio />}
                                label={'Online'}
                            />
                            <FormControlLabel
                                value={'presencial'}
                                sx={{ '.MuiFormControlLabel-label': { fontSize: 14 } }}
                                control={<Radio />}
                                label={'Presencial'}
                            />
                        </RadioGroup>
                        <Titulo sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 600 }}>
                            Tipo
                        </Titulo>
                        <InputBox
                            select
                            value={tipo}
                            onChange={(ev) => {
                                router.replace(`/eventos?tipo=${ev.target.value}${params.has('modo') ? '&modo=' + params.get('modo') : ''}`)
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
                            <ItemBox value='taller'>Taller</ItemBox>
                        </InputBox>
                    </Grid>
                </Grid>
            </SwipeableDrawer >
        </>
    )
}


export default Filtros;