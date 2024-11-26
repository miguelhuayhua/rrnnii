'use client';
import { Negrita, Normal } from "@/app/componentes/Textos";
import { Noticia, Institucion } from "@prisma/client";
import dayjs from "dayjs";
import { BoxSombra } from "../Mostrar";
import { Box, Grid, Stack } from "@mui/material";
import Image from 'next/legacy/image';
import { SwitchBox } from "@/app/componentes/Datos";
import parse from 'html-react-parser';
import axios from "axios";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { fileDomain } from "@/utils/globals";
import { Button } from "rsuite";
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
        <BoxSombra p={1} bgcolor='white' borderRadius={4} >
            <Grid container spacing={1}>
                <Grid item xs={8} position='relative'>
                    <Normal >
                        {dayjs(Noticia.createdAt).format('DD MMMM YYYY')}
                    </Normal>
                    <Negrita>
                        {Noticia.titulo}
                    </Negrita>

                    <Box >
                        {
                            parse(Noticia.descripcion.substring(0, 200) + "...")
                        }
                    </Box>
                    <Stack direction='row' sx={{ mt: 2 }} spacing={2} alignItems='center'>
                        <Button size='sm' appearance="ghost" onClick={() => {
                            setNoticia(Noticia);
                        }}>Modificar</Button>

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
                        <Image src={fileDomain + Noticia.imagen} layout="fill" objectFit="cover" />
                    </Box>
                </Grid>
            </Grid>
        </BoxSombra>
    )
}
export default NoticiaComponent;