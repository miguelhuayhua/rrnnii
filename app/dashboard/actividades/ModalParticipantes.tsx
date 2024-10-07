'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Avatar, Box, Stack, Grid, LinearProgress, List, ListItem, ListItemAvatar, ListItemText, MenuItem, TableContainer, Table, TableRow, TableCell, TableHead, TableBody } from '@mui/material';
import { BotonFilled, BotonOutline, BotonSimple } from '@/app/componentes/Botones';
import { Negrita, Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
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
import axios from 'axios';
import { FaPlus, FaUserGraduate, FaUserSlash, FaUserTie } from 'react-icons/fa';
import { CgAdd, CgMathPlus } from 'react-icons/cg';
import { BiTrash } from 'react-icons/bi';
import { HiOutlinePlus, HiPlus } from 'react-icons/hi2';
interface Props {
    setActividad: any;
    Actividad: Actividad;
    setActividades: any;
    setPrevActividades: any;
    setOpenP: any;
}
export default function ModalParticipantes({ setActividad,
    setOpenP,
    Actividad, setActividades, setPrevActividades }: Props) {
    const { control, formState: { isDirty },
        resetField, handleSubmit, watch, setValue } = useForm<Actividad & { Participantes: Participante[] }>({
            defaultValues: { ...Actividad }, shouldFocusError: true
        });
    const formP = useForm<Participante>({
        defaultValues: { nombre_completo: '', contacto: '' }, shouldFocusError: true
    });
    const { append, remove } = useFieldArray({ control, name: 'Participantes' })
    const { openSnackbar } = useSnackbar();
    return (
        <Dialog
            open={!!Actividad}
            keepMounted={false}
            maxWidth='sm'
            fullWidth
            onClose={() => {
                setActividad(null);
                setOpenP(false);
                axios.post('/api/actividad/todo', {}).then(res => {
                    setActividades(res.data);
                    setPrevActividades(res.data);
                });
            }}
        >
            <DialogContent sx={{ position: 'relative', p: 2, py: 1.2 }}>
                <BotonSimple
                    onClick={() => {
                        setActividad(null);
                        setOpenP(false);
                    }} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>
                <Negrita sx={{ mb: 3, pr: 5, fontSize: 18 }}>
                    Actividad: {Actividad.titulo}
                </Negrita>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack direction='row' spacing={2}>
                            <Controller control={control}
                                name='encargado'
                                render={
                                    ({ field, fieldState }) =>
                                        <InputBox
                                            size='small'
                                            InputProps={{ endAdornment: <FaUserTie /> }}
                                            label='Encargado'
                                            {...field}
                                        />
                                }
                            />
                            {
                                isDirty ?
                                    <BotonFilled onClick={() => {
                                        axios.post('/api/actividad/encargado', {
                                            encargado: watch('encargado'),
                                            id: Actividad.id
                                        }).then(res => {
                                            openSnackbar(res.data.mensaje);
                                            axios.post('/api/actividad/todo', {}).then(res => {
                                                setActividades(res.data);
                                                setPrevActividades(res.data);
                                            });
                                        });
                                        resetField('encargado', { keepDirty: false, defaultValue: watch('encargado') })
                                    }}>
                                        Aceptar
                                    </BotonFilled>
                                    : null
                            }
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item xs={12} >
                    <Negrita sx={{ display: 'flex', mt: 2, mb: 1, fontSize: 18 }}>
                        Lista de participantes
                    </Negrita>
                    <TableContainer>
                        <Table size="small" sx={{ mx: 0, px: 0 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Datos personales</TableCell>
                                    <TableCell>Contacto</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {watch('Participantes').map((row, i) => (
                                    <TableRow
                                        key={i}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ fontSize: 16 }}>
                                            {row.nombre_completo}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 16 }}>
                                            {row.contacto}
                                        </TableCell>
                                        <TableCell >
                                            <BotonOutline
                                                onClick={() => {
                                                    remove(watch('Participantes').findIndex(p => p.nombre_completo == row.nombre_completo));
                                                    if(row.id){
                                                        axios.post('/api/actividad/participante/quitar',{id: row.id}).then(res=>{
                                                            openSnackbar(res.data.mensaje);
                                                        });
                                                    }
                                                    else{
                                                        openSnackbar(`Participante ${row.nombre_completo} eliminado`)
                                                    }
                                                }}>
                                                <BiTrash />
                                            </BotonOutline>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Controller
                                            rules={{ required: 'Nombre requerido' }}
                                            control={formP.control}
                                            name='nombre_completo'
                                            render={
                                                ({ field, fieldState }) =>
                                                    <InputBox
                                                        {...field}
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                        size='small'
                                                        variant='standard'
                                                        placeholder='Nombre completo' />
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Controller control={formP.control}
                                            name='contacto'
                                            render={
                                                ({ field, fieldState }) =>
                                                    <InputBox
                                                        variant='standard'
                                                        {...field}
                                                        size='small'
                                                        placeholder='Contacto' />
                                            }
                                        />

                                    </TableCell>
                                    <TableCell>
                                        <BotonOutline onClick={formP.handleSubmit((Participante) => {
                                            append(Participante);
                                            formP.reset();
                                            axios.post('/api/actividad/participante', {
                                                id: Actividad.id,
                                                Participante
                                            }).then(res => {
                                                openSnackbar(res.data.mensaje);
                                            })
                                        })} >
                                            <CgMathPlus />
                                        </BotonOutline>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>


                </Grid>
            </DialogContent>
        </Dialog>
    );
}