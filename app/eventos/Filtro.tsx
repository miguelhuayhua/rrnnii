'use client';
import { Badge, FormControlLabel, Grid, Radio, RadioGroup, Stack, SwipeableDrawer } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Titulo } from "../componentes/Textos";
import { BotonSimple } from "../componentes/Botones";
import { IoReload } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
interface Props {
    open: boolean;
    setOpen: any
}
const Filtros = ({ open, setOpen }: Props) => {
    const router = useRouter();
    const params = useSearchParams();
    const t = params.get('t') || '';
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
                        <RadioGroup value={t} onChange={(ev) => {
                            router.replace(`/eventos?t=${ev.target.value}`)
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
                    </Grid>
                </Grid>
            </SwipeableDrawer >
        </>
    )
}


export default Filtros;