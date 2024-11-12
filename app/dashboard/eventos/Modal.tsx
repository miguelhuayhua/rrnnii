'use client';
import React, { useState } from 'react';
import { Box, Grid, CircularProgress, Backdrop } from '@mui/material';
import { Evento } from '@prisma/client';
import { Negrita, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { useModal } from '@/providers/ModalProvider';
import Image from 'next/legacy/image';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { fileDomain } from '@/utils/globals';
import { Form, Modal, Input, Text, SelectPicker, DatePicker, Button, Uploader } from 'rsuite';
interface Props {
    setEvento: any;
    Evento: Evento;
    setEventos: any;
    setPrevEventos: any;
}
export default function ModalEvento({ setEvento, Evento, setEventos, setPrevEventos }: Props) {
    const { control, formState: { isDirty }, handleSubmit, setValue, watch } = useForm<Evento>({
        defaultValues: Evento, shouldFocusError: true
    });
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>([]);
    const { openModal } = useModal();
    const [load, setLoad] = useState(false);
    const { openSnackbar } = useSnackbar();
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]), { shouldDirty: true });
            setPortada(plainFiles[0]);
            openSnackbar('Imagen actualizada con éxito');
        }
    });
    const onSubmit = (evento: Evento) => {
        let form = new FormData();
        form.append('titulo', evento.titulo);
        form.append('tipo', evento.tipo);
        form.append('pdf', evento.pdf);
        form.append('link', evento.link!);
        form.append('inicio', evento.inicio);
        form.append('descripcion', evento.descripcion);
        form.append('imagen', portada);
        form.append('doc', documento);
        form.append('id', evento.id)
        openModal({
            titulo: '¿Continuar?',
            content: 'Un nuevo evento se agregará',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/evento/modificar', form);
                if (!res.data.error) {
                    axios.post('/api/evento/todo').then(res => {
                        setEventos(res.data);
                        setPrevEventos(res.data);
                    });
                    setEvento(null);
                    setLoad(false);
                }
                return res.data.mensaje;
            }
        });
    }
    return (
        <>
            <Modal
                overflow
                size='md'
                open={!!Evento}
                onClose={() => { setEvento(null) }}
            >
                <Modal.Header>
                    <Titulo mb={2}>
                        Editar {Evento.titulo}
                    </Titulo>
                </Modal.Header>
                <Modal.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12} mx='auto' sm={6}>
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
                                overflow: 'hidden'
                            }}
                                className='drop'
                                onClick={() => openFilePicker()}
                            >
                                {
                                    watch('imagen') ?
                                        <Image src={(portada ? '' : fileDomain) + watch('imagen')} layout='fill' objectFit='cover' />
                                        : null
                                }
                                <Icon icon="stash:image-light" width="60" height="60" style={{ color: '#000' }} />
                                <Text align='center'>+ Subir imagen</Text>
                            </div>
                            <Text
                                style={{ margin: '15px 0' }}
                                size='sm' align='center'>Permitido: .png, .jpeg, .jpg</Text>
                            <Uploader
                                fileList={documento}
                                autoUpload={false}
                                action="/"
                                onChange={setDocumento}
                                multiple={false}
                                accept=".pdf, .doc, .docx"
                            >
                                <Button size='lg' block>Seleccionar archivo...</Button>
                            </Uploader>
                            <Controller
                                name="titulo"
                                control={control}
                                rules={{ required: 'Título no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Título del evento</Form.ControlLabel>
                                        <Input {...field} size='lg' />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="tipo"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group controlId="tipo">
                                        <Form.ControlLabel>Modalidad</Form.ControlLabel>
                                        <SelectPicker
                                            {...field}
                                            size="lg"
                                            cleanable={false}
                                            style={{ marginBottom: 10, width: "100%" }}
                                            data={[{ label: 'Online', value: 'online' },
                                            { label: 'Presencial', value: 'presencial' }
                                            ]}
                                            searchable={false}
                                        />
                                    </Form.Group>

                                )}
                            />
                            <Controller
                                name="inicio"
                                control={control}
                                rules={{ required: 'Comienzo no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group controlId="fecha">
                                        <Form.ControlLabel>Comienzo</Form.ControlLabel>
                                        <DatePicker
                                            placement="top"
                                            block
                                            value={dayjs(field.value, 'DD/MM/YYYY').toDate()}
                                            style={{ marginBottom: 10 }}
                                            size="lg"
                                            onChange={ev => {
                                                field.onChange(dayjs(ev).format("DD/MM/YYYY"))
                                            }} />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                                )}
                            />
                            {
                                watch('tipo') == 'online' ?
                                    <Controller
                                        name="link"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Group style={{ marginBottom: 10 }}>
                                                <Form.ControlLabel>Link de acceso</Form.ControlLabel>
                                                <Input {...field} value={field.value!} size='lg' />
                                            </Form.Group>
                                        )}
                                    /> : null
                            }
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                                appearance='primary'
                                onClick={handleSubmit(onSubmit)} >
                                Modificar Evento
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