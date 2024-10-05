'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Avatar, Box, Stack, Grid, LinearProgress, List, ListItem, ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import { BotonFilled, BotonSimple } from '@/app/componentes/Botones';
import { Negrita, Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { BsFileEarmarkPdfFill, BsImageAlt, BsPlus } from 'react-icons/bs';
import { InputBox } from '@/app/componentes/Datos';
import { MdGroups2, MdOutlineAttachFile } from 'react-icons/md';
import { useModal } from '@/providers/ModalProvider';
import Image from 'next/legacy/image';
import dynamic from 'next/dynamic';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import { Actividad, Participante } from '@prisma/client';
import { grey, red } from '@mui/material/colors';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { RiFileWord2Line } from 'react-icons/ri';
import { ChipBox } from '@/app/componentes/Mostrar';
import axios from 'axios';
import { FaUserGraduate, FaUserSlash, FaUserTie } from 'react-icons/fa';
import { CgAdd } from 'react-icons/cg';
interface Props {
    setActividad: any;
    Actividad: Actividad;
    setActividades: any;
    setPrevActividades: any;
}
export default function ModalParticipantes({ setActividad, Actividad, setActividades, setPrevActividades }: Props) {
    const { control, formState: { errors, isDirty }, handleSubmit, watch, setValue } = useForm<Actividad & { Participante: Participante[] }>({
        defaultValues: { ...Actividad, Participante: [] }, shouldFocusError: true
    });
    const { append } = useFieldArray({ control, name: 'Participante' })
    const { openSnackbar } = useSnackbar();
    const onSubmit = (actividad: Actividad) => {

    }
    return (
        <Dialog
            open={!!Actividad}
            keepMounted={false}
            maxWidth='sm'
            fullWidth
            onClose={() => { setActividad(null) }}
        >
            <DialogContent sx={{ position: 'relative', p: 2, py: 1.2 }}>
                <BotonSimple onClick={() => setActividad(null)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>
                <Negrita sx={{ mb: 3, pr: 5, fontSize: 18 }}>
                    Actividad: {Actividad.titulo}
                </Negrita>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Controller control={control}
                            name='encargado'
                            render={
                                ({ field, fieldState }) =>
                                    <InputBox
                                        size='small'
                                        InputProps={{ endAdornment: <FaUserTie /> }}
                                        label='Encargado' {...field} />}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} >
                    <Normal sx={{ display: 'flex', alignItems: 'center' }}>
                        Lista de participantes
                        <MdGroups2 style={{ marginLeft: 10 }} fontSize={23} />
                    </Normal>


                    <Stack direction='row'>
                        <InputBox
                            onKeyUp={(ev) => {
                                append({ nombre_completo: ev.target.value as string })
                            }}
                            sx={{ mt: 1 }}
                            InputProps={{
                                endAdornment:
                                    <BotonSimple sx={{ mx: 0, px: 0, height: 30 }}>
                                        <BsPlus fontSize={30} />
                                    </BotonSimple>
                            }}
                            size='small'
                            label='Nombre completo participante' />
                    </Stack>

                    <List dense>
                        {
                            watch('Participante').length > 0 ?
                                watch('Participante').map(value => (
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <FaUserGraduate />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={value.nombre_completo}
                                            secondary={value.contacto}
                                        />
                                    </ListItem>
                                )) : <ListItem>
                                    <ListItemAvatar >
                                        <Avatar >
                                            <FaUserSlash />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={'Sin participantes'}
                                    />
                                </ListItem>
                        }
                    </List>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}