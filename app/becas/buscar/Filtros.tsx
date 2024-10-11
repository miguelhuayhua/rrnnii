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
                <Grid container width={330}>
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
                            router.replace(`/becas?s=${ev.target.value}${params.has('t') ? '&t=' + params.get('t') : ''}${params.has('co') ? '&co=' + params.get('co') : ''}`)
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
                        <RadioGroup value={tipo} onChange={(ev) => {
                            router.replace(`/becas/buscar?t=${ev.target.value}${params.has('co') ? '&co=' + params.get('co') : ''}${params.has('c') ? '&c=' + params.get('c') : ''}`)
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
                        <Negrita my={1}>
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
                                        router.replace(`/becas/buscar?co=na${params.has('s') ? '&s=' + params.get('s') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
                                    }}
                                    src='/assets/america-norte.png' />
                                <Normal >
                                    America Norte
                                </Normal>
                            </Button>
                            <Button
                                onClick={() => {
                                    router.replace(`/becas/buscar?co=sa${params.has('s') ? '&s=' + params.get('s') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
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
                                    router.replace(`/becas/buscar?co=as${params.has('s') ? '&s=' + params.get('s') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
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
                                    router.replace(`/becas/buscar?co=eu${params.has('s') ? '&s=' + params.get('s') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
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
                                    router.replace(`/becas/buscar?co=af${params.has('s') ? '&s=' + params.get('s') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
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
                                    router.replace(`/becas/buscar?co=oc${params.has('s') ? '&s=' + params.get('s') : ''}${params.has('t') ? '&t=' + params.get('t') : ''}`)
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