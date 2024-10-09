'use client';
import { Negrita, Normal } from "@/app/componentes/Textos";
import { Pasantia, Institucion } from "@prisma/client";
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
import { useSnackbar } from "@/providers/SnackbarProvider";
interface Props {
    Pasantia: Pasantia & { Institucion: Institucion };
    setPasantia: any;
    setOpcion: any;
    setPasantias: any;
    setPrevPasantias: any;
}
const PasantiaComponent = ({ Pasantia, setPasantia,
    setPasantias,
    setOpcion,
    setPrevPasantias
}: Props) => {
    const { openSnackbar } = useSnackbar();
    return (
        <BoxSombra p={3} bgcolor='white' borderRadius={4} >
            <Grid container spacing={2}>
                <Grid item xs={8} position='relative'>
                    <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
                        <ChipBox sx={{ height: 30, }} label={Pasantia.estado ? 'Publicado' : 'Sin publicar'} />
                    </Stack>
                    <Normal sx={{ color: '#929fac', fontSize: 15, mb: 2 }}>
                        {dayjs(Pasantia.createdAt).format('DD MMMM YYYY')}
                    </Normal>
                    <Negrita>
                        {Pasantia.titulo}
                    </Negrita>
                    <Normal sx={{ mt: 1 }}>
                        Termina el: {Pasantia.finalizacion}
                    </Normal>

                    <Stack direction='row' sx={{ mt: 2 }} spacing={2} alignItems='center'>
                        <BotonOutline sx={{ fontSize: 14 }} onClick={() => {
                            setPasantia(Pasantia);
                        }}>Modificar</BotonOutline>
                        {
                            Pasantia.pdf ?
                                <BotonFilled
                                    onClick={() => {
                                        let a = document.createElement('a');
                                        a.download = fileDomain + Pasantia.pdf;
                                        a.target = '_blank';
                                        a.href = fileDomain + Pasantia.pdf;
                                        a.click();
                                        a.remove();
                                    }}
                                    sx={{ background: Pasantia.pdf.includes('pdf') ? red[700] : blue[700] }}>
                                    {
                                        Pasantia.pdf.includes('pdf') ? <TbPdf fontSize={22} /> : <RiFileWord2Line fontSize={22} />
                                    }
                                </BotonFilled> : null
                        }
                        <SwitchBox checked={Pasantia.estado} onChange={(ev, checked) => {
                            axios.post('/api/pasantia/estado', { estado: checked, id: Pasantia.id }).then(res => {
                                openSnackbar(res.data.mensaje);
                                axios.post('/api/pasantia/todo', {}).then(res => {
                                    setPasantias(res.data);
                                    setPrevPasantias(res.data);
                                    setOpcion('todo');
                                });
                            });
                        }} />
                    </Stack>
                </Grid>
                <Grid item xs={4}>
                    <Box position='relative' height="100%" borderRadius={3} overflow='hidden'>
                        <Image src={fileDomain + Pasantia.imagen} layout="fill" />
                    </Box>
                </Grid>
            </Grid>
        </BoxSombra>
    )
}
export default PasantiaComponent;