'use client';
import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import {
    Box, Breadcrumbs, Grid, CircularProgress,
    Backdrop
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { Controller, useForm } from "react-hook-form";
import { Noticia } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { axiosInstance } from "@/globals";
import { useState } from "react";
import Image from 'next/legacy/image';
import { useSnackbar } from "@/providers/SnackbarProvider";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/app/skeletons/EditorSkeleton";
import { Icon } from '@iconify/react';
import { BoxSombra } from "@/app/componentes/Mostrar";
import { Button, Form, Input, Text, Panel } from "rsuite";
import { red } from "@mui/material/colors";

export default function Page() {
    const { control, handleSubmit, watch, setValue } = useForm<Noticia>({
        defaultValues: { titulo: '', imagen: '', descripcion: '' }, shouldFocusError: true
    });
    const [portada, setPortada] = useState<any>(null);
    const router = useRouter();
    const { openSnackbar } = useSnackbar();
    const [load, setLoad] = useState(false);
    const { openModal } = useModal();
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]));
            setPortada(plainFiles[0]);
            openSnackbar('Imagen modificada con éxito');
        }
    });
    const onSubmit = (noticia: Noticia) => {
        if (portada) {
            let formData = new FormData();
            formData.append('titulo', noticia.titulo);
            formData.append('imagen', noticia.imagen);
            formData.append('descripcion', noticia.descripcion);
            formData.append('file', portada);
            openModal({
                titulo: '¿Continuar?',
                content: 'Se añadirá a tu noticia',
                callback: async () => {
                    setLoad(true);
                    let res = await axiosInstance.post('/api/noticia/crear', formData);
                    router.replace('/dashboard/noticias');
                    setLoad(false);
                    return res.data.mensaje;
                }
            });
        }
        else {
            openSnackbar('Por favor introduzca una imagen de referencia');
        }
    }
    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ my: 2 }} >
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/noticias">
                        <Normal>Noticia</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>
                <Titulo sx={{ mb: 2 }}>
                    Añadir noticia
                </Titulo>
                <Button
                    appearance="subtle"
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </Button>
                <Grid container spacing={4} py={3}>
                    <Grid item xs={12} sm={5} lg={4}>
                        <Panel shaded style={{ background: 'white' }}>
                            <div style={{
                                aspectRatio: 1,
                                border: `1px dashed #aaa`,
                                flexDirection: 'column',
                                borderRadius: 12,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'color 0.25s',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}
                                className='drop'
                                onClick={() => openFilePicker()}
                            >
                                {
                                    watch('imagen') ?
                                        <Image src={watch('imagen')} layout='fill' objectFit='contain' /> : null
                                }
                                <Icon icon="stash:image-light" width="60" height="60" style={{ color: '#000' }} />
                                <Text align='center'>+ Subir imagen</Text>
                            </div>
                            <Text
                                style={{ margin: '15px 0' }}
                                size='sm' align='center'>Permitido: .png, .jpeg, .jpg</Text>
                        </Panel>

                    </Grid>
                    <Grid item xs={12} sm={7} lg={8}>
                        <Panel shaded style={{ background: 'white' }} >

                            <Controller
                                name="titulo"
                                control={control}
                                rules={{ required: 'Título no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Título de noticia</Form.ControlLabel>
                                        <Input {...field} size='lg' />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                                )}
                            />

                            <Controller
                                name="descripcion"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group >
                                        <Form.ControlLabel>Descripción</Form.ControlLabel>
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
                                    </Form.Group>
                                )}
                            />
                            <Button
                                size="lg"
                                style={{ background: red[700], marginTop: 10 }}
                                appearance="primary"
                                block
                                onClick={handleSubmit(onSubmit)}>
                                Crear noticia</Button>

                        </Panel>
                    </Grid>
                </Grid>
            </Box>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={load}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}