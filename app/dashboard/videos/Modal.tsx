'use client';
import React, { useState } from 'react';
import { Grid, CircularProgress, Backdrop } from '@mui/material';
import { Video as VideoType } from '@prisma/client';
import { Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useModal } from '@/providers/ModalProvider';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import dynamic from 'next/dynamic';
import ReactPlayer from 'react-player/lazy'
import axios from 'axios';
import { Uploader, Modal, Form, Button, Input } from 'rsuite';
import { fileDomain } from '@/utils/globals';
interface Props {
    setVideo: any;
    video: VideoType;
    setVideos: any;
    setPrevVideos: any;
}
export default function ModalVideo({ setVideo, video, setVideos, setPrevVideos }: Props) {
    const [load, setLoad] = useState(false);
    const { control, watch, formState: { isDirty }, handleSubmit,
        setValue } = useForm<VideoType>({
            defaultValues: { ...video, video: '' }, shouldFocusError: true,
        });
    const { openModal } = useModal();
    const [file, setFile] = useState<any>([]);

    const onSubmit = (video: VideoType) => {
        let formData = new FormData();
        formData.append('titulo', video.titulo);
        formData.append('descripcion', video.descripcion);
        formData.append('id', video.id);
        formData.append('file', file[0] ? file[0].blobFile : '');
        openModal({
            titulo: '¿Continuar?',
            content: 'El video será actualizado',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/video/modificar', formData);
                if (!res.data.error) {
                    setVideo(null);
                    axios.post('/api/video/todo', {}).then(res => {
                        setVideos(res.data);
                        setPrevVideos(res.data);
                    });
                }
                setLoad(false);
                return res.data.mensaje;
            }
        });

    }
    const handleFileChange = (fileList: any) => {
        setFile(fileList);

        // Verifica si existe un archivo y crea la URL utilizando blobFile
        if (fileList.length > 0 && fileList[0].blobFile) {
            setValue('video', URL.createObjectURL(fileList[0].blobFile), { shouldDirty: true });
        } else {
            setValue('video', '');
        }
    };
    return (
        <>
            <Modal
                overflow
                size='md'
                open={!!video}
                onClose={() => { setVideo(null) }}
            >
                <Modal.Header>
                    <Titulo mb={2}>
                        Editar {video.titulo}
                    </Titulo>
                </Modal.Header>
                <Modal.Body>
                    <Grid p={2} container spacing={4} component='form' onSubmit={handleSubmit(onSubmit)}>
                        <Grid item xs={12} md={6}>
                            <ReactPlayer
                                controls
                                muted
                                playing
                                loop
                                width="100%"
                                url={`${watch('video') || fileDomain + video.video}`} />
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
                                        marginTop: 20,
                                        cursor: 'pointer',
                                        border: '1px #666 dashed',
                                        borderRadius: 12,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Normal sx={{ textAlign: 'center' }}>
                                        Haz clic, o suelta el video sobre este espacio.
                                    </Normal>
                                </div>
                            </Uploader>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="titulo"
                                control={control}
                                rules={{ required: 'Título no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Título de la pasantía</Form.ControlLabel>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        </Grid>

                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    {
                        isDirty ?
                            <Button
                                size='lg'
                                appearance='primary'
                                onClick={handleSubmit(onSubmit)} >
                                Modificar Video
                            </Button>
                            : null
                    }
                </Modal.Footer>
            </Modal >
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={load}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}