'use client';
import { FaBuilding } from "react-icons/fa6";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Convenio, Institucion } from "@prisma/client";
import { ChipBox } from "@/app/componentes/Mostrar";
import dayjs from "dayjs";
import { BoxSombra } from "../Mostrar";
import { Box, Grid, Stack } from "@mui/material";
import Image from 'next/legacy/image';
import { BotonFilled, BotonOutline } from "@/app/componentes/Botones";
import { fileDomain } from "@/utils/globals";
import { TbPdf } from "react-icons/tb";
import { blue, red } from "@mui/material/colors";
import { SwitchBox } from "@/app/componentes/Datos";
import axios from "axios";
import { RiFileWord2Line } from "react-icons/ri";
import { Icon as Iconify } from '@iconify/react';
import { useSnackbar } from "@/providers/SnackbarProvider";
interface Props {
    Convenio: Convenio & { Institucion: Institucion };
    setConvenio: any;
    setOpcion: any;
    setConvenios: any;
    setPrevConvenios: any;
}
const ConvenioComponent = ({ Convenio, setConvenio,
    setConvenios,
    setOpcion,
    setPrevConvenios
}: Props) => {
    const { openSnackbar } = useSnackbar();
    return (
        <BoxSombra p={3} bgcolor='white' borderRadius={4} >
            <Grid container spacing={2}>
                <Grid item xs={8} position='relative'>
                    <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
                        <ChipBox sx={{ height: 30, }} label={Convenio.estado ? 'Publicado' : 'Sin publicar'} />
                        <ChipBox sx={{ height: 30, bgcolor: Convenio.tipo == 'nacional' ? '#0074b7' : '#09b615', color: 'white', mx: 0, }} label={Convenio.tipo == 'nacional' ? 'Convenio nacional' : 'Convenio internacional'} />
                        <ChipBox sx={{ height: 30 }} label={
                            <Normal sx={{ display: 'flex', alignItems: 'center' }}>
                                <Iconify style={{ marginRight: 5 }} icon={`flag:${Convenio.tipo == 'nacional' ? 'bo' : Convenio.pais.toLowerCase()}-4x3`} />
                                {Convenio.tipo == 'nacional' ? 'BO' : Convenio.pais}
                            </Normal>} />
                    </Stack>
                    <Normal sx={{ color: '#929fac', fontSize: 15, mb: 2 }}>
                        {dayjs(Convenio.createdAt).format('DD MMMM YYYY')}
                    </Normal>
                    <Negrita>
                        {Convenio.titulo}
                    </Negrita>
                    <Normal sx={{ mt: 1 }}>
                        Termina el: {Convenio.finalizacion}
                    </Normal>

                    <Stack direction='row' sx={{ mt: 2 }} spacing={2} alignItems='center'>
                        <BotonOutline sx={{ fontSize: 14 }} onClick={() => {
                            setConvenio(Convenio);
                        }}>Modificar</BotonOutline>
                        {
                            Convenio.pdf ?
                                <BotonFilled
                                    onClick={() => {
                                        let a = document.createElement('a');
                                        a.download = fileDomain + Convenio.pdf;
                                        a.target = '_blank';
                                        a.href = fileDomain + Convenio.pdf;
                                        a.click();
                                        a.remove();
                                    }}
                                    sx={{
                                        background: Convenio.pdf.includes('pdf') ? red[700] : blue[700],
                                        height: 40
                                    }}>
                                    {
                                        Convenio.pdf.includes('pdf') ? <TbPdf fontSize={22} /> : <RiFileWord2Line fontSize={22} />
                                    }
                                </BotonFilled> : null
                        }
                        <SwitchBox checked={Convenio.estado} onChange={(ev, checked) => {
                            axios.post('/api/convenio/estado', { estado: checked, id: Convenio.id }).then(res => {
                                openSnackbar(res.data.mensaje);
                                axios.post('/api/convenio/todo', {}).then(res => {
                                    setConvenios(res.data);
                                    setPrevConvenios(res.data);
                                    setOpcion('todo');
                                });
                            });
                        }} />
                    </Stack>
                </Grid>
                <Grid item xs={4}>
                    <Box position='relative' height="100%" borderRadius={3} overflow='hidden'>
                        <Image src={fileDomain + Convenio.imagen} layout="fill" />
                    </Box>
                </Grid>
            </Grid>
        </BoxSombra>
    )
}
export default ConvenioComponent;