'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { Box, Grid, LinearProgress } from '@mui/material';
import { Noticia } from '@prisma/client';
import { BotonFilled, BotonSimple } from '@/app/componentes/Botones';
import { Negrita, Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { BsImageAlt } from 'react-icons/bs';
import { InputBox } from '@/app/componentes/Datos';
import { axiosInstance } from '@/globals';
import { useModal } from '@/providers/ModalProvider';
import Image from 'next/legacy/image';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import dynamic from 'next/dynamic';
import { IoClose } from 'react-icons/io5';
import { grey } from '@mui/material/colors';
import { useSnackbar } from '@/providers/SnackbarProvider';
import axios from 'axios';
import { fileDomain } from '@/utils/globals';
interface Props {
    setNoticia: any;
    Noticia: Noticia;
    setNoticias: any;
    setPrevNoticias: any;
}
export default function ModalNoticia({ setNoticia, Noticia, setNoticias, setPrevNoticias }: Props) {
    const [load, setLoad] = useState(false);
    const [file, setFile] = useState<any>('');
    const { control, formState: { errors, isDirty }, handleSubmit, setValue, watch } = useForm<Noticia>({
        defaultValues: Noticia, shouldFocusError: true,
    });
    const { openSnackbar } = useSnackbar();
    const { openModal } = useModal();
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]), { shouldDirty: true });
            setFile(plainFiles[0]);
            openSnackbar('Imagen modificada con éxito');
        }
    });
    const onSubmit = (noticia: Noticia) => {
        let formData = new FormData();
        formData.append('titulo', noticia.titulo);
        formData.append('imagen', noticia.imagen);
        formData.append('descripcion', noticia.descripcion);
        formData.append('file', file);
        formData.append('id', noticia.id);
        openModal({
            titulo: '¿Continuar?',
            content: 'La imagen será editada',
            callback: async () => {
                setLoad(true);
                let res = await axiosInstance.post('/api/noticia/modificar', formData);
                if (!res.data.error) {
                    setNoticia(null);
                    axios.post('/api/noticia/todo', {}).then(res => {
                        setNoticias(res.data);
                        setPrevNoticias(res.data);
                    });
                }
                setLoad(false);
                return res.data.mensaje;
            }
        });
    }
    return (
        <Dialog
            open={!!Noticia}
            keepMounted={false}
            maxWidth='md'
            onClose={() => { setNoticia(null) }}
        >
            {load ? <LinearProgress style={{ position: 'absolute', top: 0, left: 0, width: "100%" }} /> : null}
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <BotonSimple onClick={() => setNoticia(null)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>
                <Titulo sx={{ fontSize: 20, mb: 3 }}>
                    Editar imagen
                </Titulo>
                <Grid container spacing={2} component='form' onSubmit={handleSubmit(onSubmit)}>
                    <Grid item xs={12} sm={6}>
                        <Box px={{ xs: 10, sm: 0 }}>
                            <Box sx={{
                                aspectRatio: 1,
                                bgcolor: grey[100],
                                p: 1,
                                border: `1px dashed ${grey[400]}`,
                                flexDirection: 'column',
                                borderRadius: 5,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: grey[900],
                                transition: 'color 0.25s',
                                position: 'relative',
                                overflow: 'hidden',
                                "&:hover": {
                                    color: grey[500],
                                    cursor: 'pointer'
                                }
                            }}
                                onClick={() => openFilePicker()}
                            >
                                {
                                    watch('imagen') ?
                                        <Image src={(file ? '' : fileDomain) + watch('imagen')} layout='fill' objectFit='cover' />
                                        : null
                                }
                                <BsImageAlt color={'inherit'} fontSize={30} />
                                <Normal sx={{ color: 'inherit', fontWeight: 600, mt: 1 }}>+ Subir imagen</Normal>
                            </Box>
                        </Box>
                        <Normal sx={{ fontSize: 13, textAlign: 'center', my: 3 }}>Permitido: .png, .jpeg, .jpg</Normal>

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="titulo"
                            control={control}
                            rules={{ required: 'Título es obligatorio' }}
                            render={({ field: { ref, ...field } }) => (
                                <InputBox
                                    {...field}
                                    label='Título'
                                    error={!!errors.titulo}
                                    helperText={errors.titulo?.message || 'Este es el título principal que será visible en el noticia'}
                                    inputRef={ref}
                                />
                            )}
                        />
                        <Controller
                            name="descripcion"
                            control={control}
                            render={({ field }) => (
                                <Box>
                                    <Negrita sx={{ my: 1, fontWeight: 600, fontSize: 14 }}>
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
                    {
                        isDirty ?
                            <Grid item xs={12}>
                                <BotonFilled sx={{ float: 'right' }} onClick={handleSubmit(onSubmit)} >Modificar Noticia</BotonFilled>
                            </Grid> : null
                    }
                </Grid>
            </DialogContent>

        </Dialog >
    );
}