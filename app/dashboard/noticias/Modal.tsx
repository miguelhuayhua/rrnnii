'use client';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { Grid, CircularProgress, Backdrop } from '@mui/material';
import { Noticia } from '@prisma/client';
import { Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { useModal } from '@/providers/ModalProvider';
import Image from 'next/legacy/image';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import dynamic from 'next/dynamic';
import { Input, Modal, Form, Text, Button } from 'rsuite';
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
    const { control, formState: { isDirty }, handleSubmit, setValue, watch } = useForm<Noticia>({
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
            content: 'La noticia será editada',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/noticia/modificar', formData);
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
        <>
            <Modal
                overflow
                size='lg'
                open={!!Noticia}
                onClose={() => { setNoticia(null) }}
            >
                <Modal.Header>
                    <Titulo mb={2}>
                        Editar {Noticia.titulo}
                    </Titulo>
                </Modal.Header>
                <Modal.Body>
                    <Grid container spacing={4} component='form' onSubmit={handleSubmit(onSubmit)}>
                        <Grid item xs={12} sm={6}>
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
                                        <Image src={(file ? '' : fileDomain) + watch('imagen')} layout='fill' objectFit='cover' />
                                        : null
                                }
                                <Icon icon="stash:image-light" width="60" height="60" style={{ color: '#000' }} />
                                <Text align='center'>+ Subir imagen</Text>
                            </div>
                            <Text
                                style={{ margin: '15px 0' }}
                                size='sm' align='center'>Permitido: .png, .jpeg, .jpg</Text>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="titulo"
                                control={control}
                                rules={{ required: 'Título no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Título de la noticia</Form.ControlLabel>
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

                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    {
                        isDirty ?
                            <Button
                                size='lg'
                                appearance='primary'
                                onClick={handleSubmit(onSubmit)} >
                                Modificar Noticia
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