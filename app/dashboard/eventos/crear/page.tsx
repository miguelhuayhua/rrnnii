"use client";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import {
    Box, Breadcrumbs, Grid,
    Backdrop, CircularProgress
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { Controller, useForm } from "react-hook-form";
import { Evento } from "@prisma/client";
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
import { red } from "@mui/material/colors";
import { Icon } from '@iconify/react';
import { Uploader, Text, Button, Panel, Form, Input, SelectPicker, DatePicker } from "rsuite";
import dayjs from "dayjs";

export default function Page() {
    const { control, handleSubmit, setValue, watch } = useForm<Evento>({
        defaultValues: {
            titulo: '', tipo: 'online',
            ubicacion: '', descripcion: '', inicio: '', link: '', pdf: ''
        }, shouldFocusError: true
    });
    const [load, setLoad] = useState(false);
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>([]);
    const router = useRouter();
    const { openSnackbar } = useSnackbar();
    const { openModal } = useModal();
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]));
            setPortada(plainFiles[0]);
            openSnackbar('Imagen actualizada con éxito');
        }
    });

    const onSubmit = (evento: Evento) => {
        if (portada) {
            let form = new FormData();
            form.append('titulo', evento.titulo);
            form.append('tipo', evento.tipo);
            form.append('pdf', evento.pdf);
            form.append('ubicacion', evento.ubicacion!);
            form.append('link', evento.link!);
            form.append('documento', documento[0] ? documento[0].blobFile : '');
            form.append('inicio', evento.inicio);
            form.append('descripcion', evento.descripcion);
            form.append('imagen', portada);
            openModal({
                titulo: '¿Continuar?',
                content: 'Un nuevo evento se agregará',
                callback: async () => {
                    setLoad(true);
                    let res = await axiosInstance.post('/api/evento/crear', form);
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
                <Breadcrumbs sx={{ my: 2 }}>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/eventos">
                        <Normal>Eventos</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>
                <Titulo sx={{ mb: 2 }}>
                    Crear nuevo evento
                </Titulo>
                <Button
                    appearance="subtle"
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </Button>

                <Grid container spacing={4} py={4}>
                    <Grid item xs={12} sm={5}>
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
                                overflow: 'hidden'
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
                        </Panel>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                        <Panel shaded style={{ background: 'white' }}>
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
                                            placement="auto"
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
                            {
                                watch('tipo') == 'presencial' ?

                                    <Controller
                                        name="ubicacion"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Group style={{ marginBottom: 10 }}>
                                                <Form.ControlLabel>Ubicación</Form.ControlLabel>
                                                <Input {...field} value={field.value!} size='lg' />
                                            </Form.Group>
                                        )}
                                    /> : null
                            }
                            <Controller
                                name="inicio"
                                control={control}
                                rules={{ required: 'Comienzo no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group controlId="fecha">
                                        <Form.ControlLabel>Comienzo</Form.ControlLabel>
                                        <DatePicker
                                            placement="auto"
                                            block
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
                                block
                                style={{ background: red[700], marginTop: 10 }}
                                appearance="primary"
                                onClick={handleSubmit(onSubmit)}>
                                Crear Evento
                            </Button>

                        </Panel>
                    </Grid>

                </Grid >
            </Box >
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={load}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}