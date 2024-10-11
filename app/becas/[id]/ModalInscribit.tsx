'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Icon as Iconify } from '@iconify/react';
import { Autocomplete, Box, Grid, LinearProgress, MenuItem } from '@mui/material';
import { BotonFilled, BotonSimple } from '@/app/componentes/Botones';
import { Negrita, Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { BsFileEarmarkPdfFill, BsImageAlt } from 'react-icons/bs';
import { DatePickerBox, InputBox } from '@/app/componentes/Datos';
import { MdOutlineAttachFile } from 'react-icons/md';
import { useModal } from '@/providers/ModalProvider';
import Image from 'next/legacy/image';
import dynamic from 'next/dynamic';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import { Beca, Institucion, ParticipanteBeca } from '@prisma/client';
import { grey, red } from '@mui/material/colors';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { RiFileWord2Line } from 'react-icons/ri';
import { ChipBox } from '@/app/componentes/Mostrar';
import axios from 'axios';
import { fileDomain } from '@/utils/globals';
import { FaUserTie } from 'react-icons/fa';
import dayjs from 'dayjs';
interface Props {
    open: boolean;
    setOpen: any;
    becaId: string;
}
export default function ModalInscribir({ becaId, open, setOpen }: Props) {
    const { control, formState: { errors, isDirty }, handleSubmit, watch, setValue } =
        useForm<ParticipanteBeca>({
            defaultValues: {}, shouldFocusError: true
        });
    const { openModal } = useModal();
    const onSubmit = (participante: ParticipanteBeca) => {
        let form = new FormData();
        form.append('nombre_completo', participante.nombre_completo);

        openModal({
            titulo: '¿Continuar?',
            content: 'La beca será modificada',
            callback: async () => {
                let res = await axios.post('/api/participante/crear', form);
                if (!res.data.error) {
                    setOpen(false)

                }
                return res.data.mensaje;
            }
        });
    }
    return (
        <Dialog
            open={open}
            keepMounted={false}
            maxWidth='md'
            onClose={() => { setOpen(false) }}
        >
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <BotonSimple onClick={() => setOpen(false)}
                    sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>
                <Titulo sx={{ fontSize: 20, mb: 3, pr: 4 }}>
                    Registro de postulante
                </Titulo>
                <Grid container spacing={2}>

                    <Controller control={control}
                        name='nombre_completo'
                        render={
                            ({ field }) =>
                                <InputBox
                                    InputProps={{ endAdornment: <FaUserTie /> }}
                                    label='Nombre'
                                    {...field}
                                />
                        }
                    />
                    {
                        isDirty ?
                            <Grid item xs={12}>
                                <BotonFilled onClick={handleSubmit(onSubmit)} sx={{ float: 'right' }}>
                                    Enviar datos
                                </BotonFilled>
                            </Grid>
                            : null
                    }
                </Grid>
            </DialogContent>

        </Dialog >
    );
}