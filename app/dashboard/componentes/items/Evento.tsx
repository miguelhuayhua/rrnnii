'use client';
import { Negrita, Normal } from "@/app/componentes/Textos";
import { Evento, Institucion } from "@prisma/client";
import { ChipBox } from "@/app/componentes/Mostrar";
import dayjs from "dayjs";
import { BoxSombra } from "../Mostrar";
import { Box, Grid, Stack } from "@mui/material";
import Image from 'next/legacy/image';
import { fileDomain } from "@/utils/globals";
import { TbPdf } from "react-icons/tb";
import { blue, red } from "@mui/material/colors";
import { SwitchBox } from "@/app/componentes/Datos";
import axios from "axios";
import { RiFileWord2Line } from "react-icons/ri";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { Button } from 'rsuite';
interface Props {
    Evento: Evento & { Institucion: Institucion };
    setEvento: any;
    setOpcion: any;
    setEventos: any;
    setPrevEventos: any;
}
const EventoComponent = ({ Evento, setEvento,
    setEventos,
    setOpcion,
    setPrevEventos
}: Props) => {
    const { openSnackbar } = useSnackbar();
    return (
        <BoxSombra p={1} bgcolor='white' borderRadius={4} >
            <Grid container spacing={1}>
                <Grid item xs={8} position='relative'>
                    <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
                        <ChipBox sx={{ height: 30, }} label={Evento.estado ? 'Publicado' : 'Sin publicar'} />
                        <ChipBox sx={{ height: 30, bgcolor: Evento.tipo == 'online' ? '#0074b7' : '#09b615', color: 'white', mx: 0, }} label={Evento.tipo == 'online' ? 'Online' : 'Presencial'} />
                    </Stack>
                    <Normal>
                        {dayjs(Evento.createdAt).format('DD MMMM YYYY')}
                    </Normal>
                    <Negrita>
                        {Evento.titulo}
                    </Negrita>
                    <Normal>
                        Inicia el: {Evento.inicio}
                    </Normal>

                    <Stack direction='row' sx={{ mt: 2 }} spacing={2} alignItems='center'>
                        <Button size='sm'
                            appearance="ghost" onClick={() => {
                                setEvento(Evento);
                            }}>Modificar</Button>
                        {
                            Evento.pdf ?
                                <Button appearance='primary'
                                    size='sm'
                                    onClick={() => {
                                        let a = document.createElement('a');
                                        a.download = fileDomain + Evento.pdf;
                                        a.target = '_blank';
                                        a.href = fileDomain + Evento.pdf;
                                        a.click();
                                        a.remove();
                                    }}
                                    style={{
                                        background: Evento.pdf.includes('pdf') ? red[700] : blue[500],
                                    }}>
                                    {
                                        Evento.pdf.includes('pdf') ? <TbPdf fontSize={20} /> : <RiFileWord2Line fontSize={20} />
                                    }
                                </Button> : null
                        }
                        <SwitchBox checked={Evento.estado} onChange={(ev, checked) => {
                            axios.post('/api/evento/estado', { estado: checked, id: Evento.id }).then(res => {
                                openSnackbar(res.data.mensaje);
                                axios.post('/api/evento/todo', {}).then(res => {
                                    setEventos(res.data);
                                    setPrevEventos(res.data);
                                    setOpcion('todo');
                                });
                            });
                        }} />
                    </Stack>
                </Grid>
                <Grid item xs={4}>
                    <Box position='relative' height="100%" borderRadius={3} overflow='hidden'>
                        <Image objectFit="cover" src={fileDomain + Evento.imagen} layout="fill" />
                    </Box>
                </Grid>
            </Grid>
        </BoxSombra>
    )
}
export default EventoComponent;