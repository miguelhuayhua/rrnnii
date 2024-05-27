'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Box, Grid, LinearProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Galeria } from '@prisma/client';
import { BotonFilled } from '@/app/componentes/Botones';
import { Negrita, Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import Editor from 'react-quill';
import { useFilePicker } from 'use-file-picker';
import { BsImageAlt } from 'react-icons/bs';
import { DatePickerBox, InputBox, ItemBox } from '@/app/componentes/Datos';
import { MdOutlineAttachFile } from 'react-icons/md';
import { axiosInstance } from '@/globals';
import { useModal } from '@/providers/ModalProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/legacy/image';
import { ChipBox } from '@/app/componentes/Mostrar';
interface Props {
    setGaleria: any;
    Galeria: Galeria;
}
export default function ModalGaleria({ setGaleria, Galeria }: Props) {
    const theme = useTheme();
    const router = useRouter();
    const [file, setFile] = useState<any>(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { control, formState: { errors }, handleSubmit, setValue, watch } = useForm<Galeria>({
        defaultValues: Galeria, shouldFocusError: true,
    });
    const { openModal } = useModal();
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]));
            setFile(plainFiles[0]);
        }
    });

    const [load, setLoad] = useState(false);
    const onSubmit = (galeria: Galeria) => {
        let formData = new FormData();
        formData.append('titulo', galeria.titulo);
        formData.append('imagen', galeria.imagen);
        formData.append('descripcion', galeria.descripcion);
        formData.append('file', file);
        formData.append('id', galeria.id);
        openModal({
            titulo: '¿Continuar?',
            content: 'La imagen será editada',
            callback: async () => {
                setLoad(true);
                let res = await axiosInstance.post('/api/galeria/modificar', formData);
                if (!res.data.error) {
                    setGaleria(null);
                    router.refresh();
                }
                setLoad(false);
                return res.data.mensaje;
            }
        });
    }
    return (
        <Dialog
            open={!!Galeria}
            fullScreen={fullScreen}
            keepMounted={false}
            maxWidth='md'
            onClose={() => { setGaleria(null) }}
        >
            {load ? <LinearProgress /> : null}
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <BotonFilled sx={{ position: 'absolute', top: 10, left: 10 }} onClick={() => setGaleria(null)}>
                    <IoClose fontSize={20} />
                </BotonFilled>
                <Titulo sx={{ fontSize: 16, mt: 4, mb: 2 }}>
                    Editar imagen de galería
                </Titulo>
                <Grid container spacing={2} component='form' onSubmit={handleSubmit(onSubmit)}>
                    <Grid item xs={6} mx='auto' md={4}>
                        <Box sx={{
                            height: 200,
                            bgcolor: '#f6f7f9',
                            p: 1,
                            border: '1px dashed #ddd',
                            flexDirection: 'column',
                            borderRadius: 5,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#919eab',
                            transition: 'color 0.25s',
                            position: 'relative',
                            overflow: 'hidden',
                            "&:hover": {
                                color: '#919eab77',
                                cursor: 'pointer'
                            }
                        }}
                            onClick={() => openFilePicker()}
                        >
                            {
                                watch('imagen') ? <Image src={watch('imagen')} layout='fill' objectFit='cover' /> : null
                            }
                            <BsImageAlt color={'inherit'} fontSize={30} />
                            <Normal sx={{ color: 'inherit', fontWeight: 600, mt: 1 }}>+ Subir imagen</Normal>
                        </Box>
                        <Typography sx={{ fontSize: 13, color: '#a6b0bb', textAlign: 'center', my: 1, fontWeight: 500 }}>Permitido: .png, .jpeg, .jpg</Typography>

                    </Grid>
                    <Grid item xs={12} md={8} >

                        <Controller
                            name="titulo"
                            control={control}
                            rules={{ required: 'Título es obligatorio' }}
                            render={({ field: { ref, ...field } }) => (
                                <InputBox
                                    {...field}
                                    label='Título'
                                    error={!!errors.titulo}
                                    helperText={errors.titulo?.message || 'Este es el título principal que será visible en el galeria'}
                                    inputRef={ref}
                                />
                            )}
                        />
                        <Controller
                            name="descripcion"
                            control={control}
                            render={({ field }) => (
                                <Box>
                                    <Negrita sx={{ my: 1, color: '#888888', fontWeight: 600, fontSize: 14 }}>
                                        Descripción:
                                    </Negrita>
                                    <Editor
                                        value={field.value}
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [2, 3, 4, 5, false] }],
                                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                                ['link'],
                                            ]
                                        }}
                                        preserveWhitespace
                                        className="editor"
                                        onChange={(value) => { field.onChange(value) }}
                                    />
                                </Box>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    </Grid>
                    <Grid item xs={12}>
                        <BotonFilled type="submit" sx={{ float: 'right' }}>Modificar Galeria</BotonFilled>
                    </Grid>
                </Grid>
            </DialogContent>

        </Dialog >
    );
}