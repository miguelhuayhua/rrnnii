'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { Box, Grid, CircularProgress, Backdrop } from '@mui/material';
import { Video as VideoType } from '@prisma/client';
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
import { blue, grey } from '@mui/material/colors';
import { useSnackbar } from '@/providers/SnackbarProvider';
import axios from 'axios';
import { fileDomain } from '@/utils/globals';
import Video from 'next-video';
import { Panel, Uploader } from 'rsuite';
interface Props {
    setVideo: any;
    video: VideoType;
    setVideos: any;
    setPrevVideos: any;
}
export default function ModalVideo({ setVideo, video, setVideos, setPrevVideos }: Props) {
    const [load, setLoad] = useState(false);
    const { control, formState: { errors, isDirty }, handleSubmit } = useForm<VideoType>({
        defaultValues: Video, shouldFocusError: true,
    });
    const { openSnackbar } = useSnackbar();
    const { openModal } = useModal();
    const [videoURL, setVideoURL] = useState<any>('');
    const [file, setFile] = useState<any>([]);

    const onSubmit = (video: VideoType) => {
      if(file[0]){
        let formData = new FormData();
        formData.append('titulo', video.titulo);
        formData.append('descripcion', video.descripcion);
        formData.append('id', video.id);
        openModal({
            titulo: '¿Continuar?',
            content: 'La imagen será editada',
            callback: async () => {
                setLoad(true);
                let res = await axiosInstance.post('/api/video/modificar', formData);
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
      else{
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
            <Dialog
                open={!!Video}
                keepMounted={false}
                maxWidth='md'
                onClose={() => { setVideo(null) }}
            >
                <DialogContent sx={{ position: 'relative', p: 2 }}>
                    <BotonSimple onClick={() => setVideo(null)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                        <IoClose fontSize={25} />
                    </BotonSimple>
                    <Titulo sx={{ fontSize: 20, mb: 3 }}>
                        Editar video
                    </Titulo>
                    <Grid container spacing={2} component='form' onSubmit={handleSubmit(onSubmit)}>
                        <Grid item xs={12} md={6}>
                            <Panel shaded style={{ padding: 16, background: 'white' }}>
                                <Video
                                    accentColor={blue[400]}
                                    autoPlay
                                    muted
                                    style={{
                                        borderRadius: 12,
                                        overflow: 'hidden', marginBottom: 10
                                    }} src={videoURL || video.video} />
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
                                            justifyContent: 'center'
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
                            <Controller
                                name="titulo"
                                control={control}
                                rules={{ required: 'Título es obligatorio' }}
                                render={({ field: { ref, ...field } }) => (
                                    <InputBox
                                        {...field}
                                        label='Título'
                                        error={!!errors.titulo}
                                        helperText={errors.titulo?.message}
                                        inputRef={ref}
                                    />
                                )}
                            />
                            <Controller
                                name="descripcion"
                                control={control}
                                render={({ field }) => (
                                    <Box>
                                        <Negrita sx={{ mb: 1, fontWeight: 600 }}>
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
                                    <BotonFilled sx={{ float: 'right' }} onClick={handleSubmit(onSubmit)} >Modificar Video</BotonFilled>
                                </Grid> : null
                        }
                    </Grid>
                </DialogContent>
            </Dialog >
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={load}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}