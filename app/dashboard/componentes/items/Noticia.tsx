'use client';
import { Negrita, Normal } from "@/app/componentes/Textos";
import { Noticia, Institucion } from "@prisma/client";
import dayjs from "dayjs";
import { BoxSombra } from "../Mostrar";
import { Box, Grid, Stack } from "@mui/material";
import Image from 'next/legacy/image';
import { BotonOutline } from "@/app/componentes/Botones";
import { SwitchBox } from "@/app/componentes/Datos";
import parse from 'html-react-parser';
import axios from "axios";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { fileDomain } from "@/utils/globals";
interface Props {
    Noticia: Noticia & { Institucion: Institucion };
    setNoticia: any;
    setOpcion: any;
    setNoticias: any;
    setPrevNoticias: any;
}
const NoticiaComponent = ({ Noticia, setNoticia,
    setNoticias,
    setOpcion,
    setPrevNoticias
}: Props) => {
    const { openSnackbar } = useSnackbar();
    return (
        <BoxSombra p={3} bgcolor='white' borderRadius={4} >
            <Grid container spacing={2}>
                <Grid item xs={8} position='relative'>
                    <Normal sx={{ color: '#929fac', fontSize: 15, mb: 2 }}>
                        {dayjs(Noticia.createdAt).format('DD MMMM YYYY')}
                    </Normal>
                    <Negrita>
                        {Noticia.titulo}
                    </Negrita>

                    <Box sx={{ fontSize: 15 }}>
                        {
                            parse(Noticia.descripcion.substring(0, 200) + "...")
                        }
                    </Box>


                    <Stack direction='row' sx={{ mt: 2 }} spacing={2} alignItems='center'>
                        <BotonOutline sx={{ fontSize: 14 }} onClick={() => {
                            setNoticia(Noticia);
                        }}>Modificar</BotonOutline>

                        <SwitchBox checked={Noticia.estado} onChange={(ev, checked) => {
                            axios.post('/api/noticia/estado', { estado: checked, id: Noticia.id }).then(res => {
                                openSnackbar(res.data.mensaje);
                                axios.post('/api/noticia/todo', {}).then(res => {
                                    setNoticias(res.data);
                                    setPrevNoticias(res.data);
                                    setOpcion('todo');
                                });
                            });
                        }} />
                    </Stack>
                </Grid>
                <Grid item xs={4}>
                    <Box position='relative' height="100%" borderRadius={3} overflow='hidden'>
                        <Image src={fileDomain + Noticia.imagen} layout="fill" />
                    </Box>
                </Grid>
            </Grid>
        </BoxSombra>
    )
}
export default NoticiaComponent;