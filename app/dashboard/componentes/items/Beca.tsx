'use client';
import { Negrita, Normal } from "@/app/componentes/Textos";
import { Beca, Institucion, ParticipanteBeca } from "@prisma/client";
import { ChipBox } from "@/app/componentes/Mostrar";
import dayjs from "dayjs";
import { BoxSombra } from "../Mostrar";
import { Icon } from '@iconify/react';
import { Box, Grid, Stack } from "@mui/material";
import Image from 'next/legacy/image';
import { fileDomain } from "@/utils/globals";
import { TbPdf } from "react-icons/tb";
import { blue, grey, red } from "@mui/material/colors";
import { SwitchBox } from "@/app/componentes/Datos";
import axios from "axios";
import { RiFileWord2Line } from "react-icons/ri";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useRouter } from "next/navigation";
import { IoEye } from "react-icons/io5";
import 'dayjs/locale/es';
import { IoMdPeople } from "react-icons/io";
import { Button } from "rsuite";
dayjs.locale('es');
interface Props {
    Beca: Beca & { Institucion: Institucion, Participantes: ParticipanteBeca[] };
    setBeca: any;
    setOpcion: any;
    setBecas: any;
    setPrevBecas: any;
}
const BecaComponent = ({ Beca, setBeca,
    setBecas,
    setOpcion,
    setPrevBecas
}: Props) => {
    const { openSnackbar } = useSnackbar();
    const router = useRouter();
    return (
        <BoxSombra p={1} bgcolor='white' borderRadius={4} >
            <Grid container spacing={2}>
                <Grid item xs={8} position='relative'>
                    <Stack direction='row' spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
                        <ChipBox sx={{ height: 30, }} label={Beca.estado ? 'Publicado' : 'Sin publicar'} />
                        <ChipBox sx={{ height: 30 }} label={
                            <Normal sx={{ display: 'flex', alignItems: 'center' }}>
                                <Icon style={{ marginRight: 5 }} icon={`flag:${Beca.tipo == 'nacional' ? 'bo' : Beca.pais.toLowerCase()}-4x3`} />
                                {Beca.tipo == 'nacional' ? 'BO' : Beca.pais}
                            </Normal>} />
                        <Negrita sx={{ display: 'flex', alignItems: 'center', color: grey[700] }}>
                            {Beca.conteo}
                            <Icon style={{ marginLeft: 4, fontSize: 18 }} icon="solar:eye-bold" />
                        </Negrita>
                    </Stack>
                    <Normal>
                        {dayjs(Beca.createdAt).format('DD MMMM YYYY')}
                    </Normal>
                    <Negrita>
                        {Beca.titulo}
                    </Negrita>
                    <Normal>
                        Termina el: {Beca.termina}
                    </Normal>

                    <Stack direction='row' sx={{ mt: 2 }} spacing={1} alignItems='center'>
                        <Button appearance='ghost' size='sm'
                            onClick={() => {
                                setBeca(Beca);
                            }}>Modificar</Button>
                        {
                            Beca.pdf ?
                                <Button appearance='primary' size='sm'
                                    onClick={() => {
                                        let a = document.createElement('a');
                                        a.download = fileDomain + Beca.pdf;
                                        a.target = '_blank';
                                        a.href = fileDomain + Beca.pdf;
                                        a.click();
                                        a.remove();
                                    }}
                                    style={{
                                        background: Beca.pdf.includes('pdf') ? red[700] : blue[500],
                                    }}>
                                    {
                                        Beca.pdf.includes('pdf') ? <TbPdf fontSize={22} /> : <RiFileWord2Line fontSize={22} />
                                    }
                                </Button> : null
                        }
                        <Button appearance='ghost' size='sm'
                            onClick={() => {
                                router.push(`/dashboard/becas/${Beca.id}`)
                            }}>
                            <Icon style={{ fontSize: 24, height: 20 }} icon="solar:eye-bold" />
                        </Button>
                        <SwitchBox checked={Beca.estado} onChange={(ev, checked) => {
                            axios.post('/api/beca/estado', { estado: checked, id: Beca.id }).then(res => {
                                openSnackbar(res.data.mensaje);
                                axios.post('/api/beca/todo', {}).then(res => {
                                    setBecas(res.data);
                                    setPrevBecas(res.data);
                                    setOpcion('todo');
                                });
                            });
                        }} />
                    </Stack>
                    <ChipBox
                        icon={<IoMdPeople />}
                        sx={{ mt: 2 }}
                        label={`${Beca.Participantes.length} participantes`} />
                </Grid>
                <Grid item xs={4}>
                    <Box position='relative' height="100%" borderRadius={3} overflow='hidden'>
                        <Image objectFit="cover" src={fileDomain + Beca.imagen} layout="fill" />
                    </Box>
                </Grid>
            </Grid>
        </BoxSombra>
    )
}
export default BecaComponent;