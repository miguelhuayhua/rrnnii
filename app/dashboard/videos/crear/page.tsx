'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import {
    Box, Breadcrumbs,
    Backdrop, CircularProgress,
    Grid
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { Controller, useForm } from "react-hook-form";
import { Video as VideoType } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useModal } from "@/providers/ModalProvider";
import { useState } from "react";
import Video from 'next-video';
import { useSnackbar } from "@/providers/SnackbarProvider";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/app/skeletons/EditorSkeleton";
import axios from "axios";
import { Button, Form, Input, Panel, Uploader } from 'rsuite';
import { blue } from "@mui/material/colors";

export default function Page() {
    const { control, handleSubmit } =
        useForm<VideoType>({
            defaultValues: {
                titulo: '', video: '', descripcion: ''
            }
        });
    const router = useRouter();
    const [videoURL, setVideoURL] = useState<any>('');
    const [file, setFile] = useState<any>([]);

    const [load, setLoad] = useState(false);
    const { openModal } = useModal();
    const { openSnackbar } = useSnackbar();
    const onSubmit = (video: VideoType) => {
        if (file[0]) {
            let formData = new FormData();
            formData.append('titulo', video.titulo);
            formData.append('file', file[0].blobFile);
            formData.append('descripcion', video.descripcion);
            openModal({
                titulo: '¿Continuar?',
                content: 'Se agregará un nuevo video',
                callback: async () => {
                    setLoad(true);
                    let res = await axios.post('/api/video/crear', formData);
                    router.replace('/dashboard/videos');
                    setLoad(false);
                    return res.data.mensaje;
                }
            });
        }
        else {
            openSnackbar('Por favor introduzca el video solicitado');
        }
    }
    const handleFileChange = (fileList: any) => {
        setFile(fileList);

        // Verifica si existe un archivo y crea la URL utilizando blobFile
        if (fileList.length > 0 && fileList[0].blobFile) {
            const url = URL.createObjectURL(fileList[0].blobFile);
            setVideoURL(url);
        } else {
            setVideoURL(null);
        }
    };
    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ mb: 1, mt: 2 }} >
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/videos">
                        <Normal>Videos</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>
                <Titulo sx={{ mb: 2 }}>
                    Añadir nuevo video
                </Titulo>
                <Button
                    appearance="subtle"
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </Button>

                <Grid container spacing={2} px={{ xs: 0, xl: 5 }} py={2}>
                    <Grid item xs={12} md={6}>
                        <Panel shaded style={{ background: 'white' }}>
                            {videoURL && (
                                <Video
                                    accentColor={blue[400]}
                                    autoPlay
                                    muted
                                    style={{
                                        borderRadius: 12,
                                        overflow: 'hidden', marginBottom: 10
                                    }} src={videoURL} />
                            )}
                            <Uploader
                                fileList={file}
                                multiple={false}
                                accept=".mp4"
                                onChange={handleFileChange}
                                action="/"
                                autoUpload={false}
                            >
                                <div
                                    style={{
                                        height: 200,
                                        cursor: 'pointer',
                                        border: '1px #ddd dashed',
                                        borderRadius: 12,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        
                                    }}
                                >
                                    <Normal sx={{ textAlign: 'center' }}>
                                        Haz clic, o suelta el video sobre este espacio.
                                    </Normal>
                                </div>
                            </Uploader>
                        </Panel>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Panel shaded style={{ background: 'white' }}>
                            <Controller
                                name="titulo"
                                control={control}
                                rules={{ required: 'Título no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Título del video</Form.ControlLabel>
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
                                block
                                size="lg"
                                style={{ marginTop: 10 }}
                                appearance="primary"
                                onClick={handleSubmit(onSubmit)}>
                                Añadir video
                            </Button>
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