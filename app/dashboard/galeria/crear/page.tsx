'use client';
import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, LinearProgress, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { BoxSombra } from "../../componentes/Mostrar";
import { InputBox } from "@/app/componentes/Datos";
import { BsImageAlt } from "react-icons/bs";
import { Controller, useForm } from "react-hook-form";
import { Galeria } from "@prisma/client";
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
import { grey } from "@mui/material/colors";

export default function Page() {
    const { control, formState: { errors }, handleSubmit, watch, setValue } = useForm<Galeria>({
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
    const onSubmit = (galeria: Galeria) => {
        if (portada) {
            let formData = new FormData();
            formData.append('titulo', galeria.titulo);
            formData.append('imagen', galeria.imagen);
            formData.append('descripcion', galeria.descripcion);
            formData.append('file', portada);
            openModal({
                titulo: '¿Continuar?',
                content: 'Se añadirá a tu galeria',
                callback: async () => {
                    setLoad(true);
                    let res = await axiosInstance.post('/api/galeria/crear', formData);
                    if (!res.data.error) {
                        router.back();
                        router.refresh();
                    }
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
                <BotonSimple
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </BotonSimple>
                <Titulo sx={{ mt: 1 }}>
                    Añadir a galería
                </Titulo>
                <Breadcrumbs >
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/galerias">
                        <Normal>Galeria</Normal>
                    </Link>
                    <Normal>Crear</Normal>
                </Breadcrumbs>
                <Grid container spacing={2} px={{ xs: 0, md: 10, lg: 20, xl: 30 }} py={4}>
                    <Grid item xs={12} sm={5} lg={4}>
                        <Box px={{ xs: 12, sm: 0 }}>
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
                                    watch('imagen') ? <Image src={watch('imagen')} layout='fill' objectFit='cover' /> : null
                                }
                                <BsImageAlt color={'inherit'} fontSize={30} />
                                <Normal sx={{ color: 'inherit', fontWeight: 600, mt: 1 }}>+ Subir imagen</Normal>
                            </Box>
                            <Normal sx={{ fontSize: 13, textAlign: 'center', my: 3 }}>Permitido: .png, .jpeg, .jpg</Normal>

                        </Box>

                    </Grid>
                    <Grid item xs={12} sm={7} lg={8}>
                        <Box px={2} component='form' onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
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
                                                <Normal sx={{ fontSize: 16, my: 1, fontWeight: 500 }} >
                                                    Descripción:
                                                </Normal>
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

                                <Grid item xs={12}>
                                    <BotonFilled type="submit" sx={{ float: 'right' }}>Añadir a galeria</BotonFilled>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            {load ? <LinearProgress style={{ position: 'absolute', top: 0, width: "100%" }} /> : null}
        </>
    )
}