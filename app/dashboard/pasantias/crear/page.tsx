'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import {
    Box, Breadcrumbs, Grid,
    CircularProgress, Backdrop
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { Controller, useForm } from "react-hook-form";
import { Carrera, Institucion, Pasantia } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { useEffect, useState } from "react";
import Image from 'next/legacy/image';
import { useSnackbar } from "@/providers/SnackbarProvider";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/app/skeletons/EditorSkeleton";
import { Icon } from '@iconify/react';
import { fileDomain } from "@/utils/globals";
import axios from "axios";
import {
    AutoComplete, Button, DatePicker, Form, Input, Panel, SelectPicker, TagPicker, Uploader,
    Text
} from "rsuite";
import dayjs from "dayjs";
import { red } from "@mui/material/colors";
import { toUpperCase } from "@/utils/data";
export default function Page() {
    const { control, handleSubmit, watch, setValue } = useForm<Pasantia & { Institucion: Institucion, carreras: string[] }>({
        defaultValues: { modalidad: '3', titulo: '', descripcion: '', Institucion: { nombre: '' }, carreras: [] }, shouldFocusError: true
    });
    const router = useRouter();
    const { openModal } = useModal();
    const [load, setLoad] = useState(false);
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>([]);
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]));
            openSnackbar('Imagen modificada con éxito');
            setPortada(plainFiles[0]);
        }
    });
    const { openSnackbar } = useSnackbar();
    const onSubmit = (pasantia: Pasantia & { Institucion: Institucion, carreras: string[] }) => {
        let form = new FormData();
        form.append('titulo', pasantia.titulo);
        form.append('pdf', pasantia.pdf);
        form.append('descripcion', pasantia.descripcion);
        form.append('portada', portada);
        form.append('descripcioncorta', pasantia.descripcionCorta);
        form.append('documento', documento[0] ? documento[0].blobFile : '');
        form.append('modalidad', pasantia.modalidad);
        form.append('finalizacion', pasantia.finalizacion!);
        form.append('institucion', pasantia.Institucion.nombre);
        form.append('carreras', JSON.stringify(pasantia.carreras));
        if (portada) {
            openModal({
                titulo: '¿Continuar?',
                content: 'Una nueva pasantia se agregará',
                callback: async () => {
                    setLoad(true);
                    let res = await axios.post('/api/pasantia/crear', form);
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
            openSnackbar('Por favor introduzca una imagen de referencia');;
        }
    }
    const [instituciones, setInstituciones] = useState([]);
    useEffect(() => {
        axios.post('/api/institucion/todo', { opcion: 'activo' }).then(res => {
            setInstituciones(res.data);
        })
    }, []);

    const [carreras, setCarreras] = useState<Carrera[]>([]);
    useEffect(() => {
        axios.post('/api/carrera/listar').then(res => {
            setCarreras(res.data);
        })
    }, []);
    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ mb: 1, mt: 2 }}>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/pasantias">
                        <Normal>Pasantias</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>
                <Titulo sx={{ mt: 1, mb: 2 }}>
                    Crear nueva pasantía
                </Titulo>
                <Button
                    appearance="subtle"
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </Button>
                <Grid container spacing={4} py={3}>
                    <Grid item xs={12} sm={5} >
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
                            <Negrita sx={{ mt: 2, mb: 1 }}>Documento respaldo</Negrita>
                            <Uploader
                                fileList={documento}
                                autoUpload={false}
                                action="/"
                                onChange={files => {
                                    setValue('pdf', 'file', { shouldDirty: true })
                                    setDocumento(files);
                                }}
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
                                        <Form.ControlLabel>Título de la pasantía</Form.ControlLabel>
                                        <Input {...field} size='lg' onChange={text => field.onChange(toUpperCase(text))} />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                                )}
                            /><Controller
                                name="modalidad"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                    <Form.Group controlId="modalidad">
                                        <Form.ControlLabel>Tiempo de duración</Form.ControlLabel>
                                        <SelectPicker
                                            {...field}
                                            size="lg"
                                            cleanable={false}
                                            placement='auto'
                                            style={{ marginBottom: 10, width: "100%" }}
                                            data={[{ label: '3 meses', value: '3' },
                                            { label: '6 meses', value: '6' },
                                            { label: 'Más de 6 meses', value: 'more' }
                                            ]}
                                            searchable={false}
                                        />
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="carreras"
                                control={control}
                                rules={{
                                    validate: (value) => value.length > 0 || 'Seleccione al menos una carrera'
                                }}
                                render={({ field, fieldState }) => (
                                    <Form.Group controlId="carrera">
                                        <Form.ControlLabel>Carrera</Form.ControlLabel>
                                        <TagPicker
                                            id='carrera'
                                            style={{ width: "100%", marginBottom: 10 }}
                                            labelKey="nombre"
                                            {...field}
                                            size="lg"
                                            placement="auto"
                                            valueKey="id" data={carreras}
                                            renderMenuItem={(label, item) => (
                                                <div style={{ display: 'flex', alignItems: 'center', height: 22 }}>
                                                    <div style={{ width: 25, minWidth: 25, aspectRatio: 1, position: 'relative', marginRight: 10 }}>
                                                        <Image layout='fill' src={item.logo ? (fileDomain + item.logo) : '/default-image.jpg'} style={{ borderRadius: 10 }} />
                                                    </div>
                                                    <Negrita sx={{ fontSize: 14 }}>{item.nombre}</Negrita>
                                                </div>
                                            )} />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="Institucion.nombre"
                                control={control}
                                rules={{ required: 'Institución no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Institución</Form.ControlLabel>
                                        <AutoComplete
                                            onBlur={ev => field.onChange((ev.target as any).value! as any)}
                                            size="lg"
                                            data={
                                                instituciones.map((value: Institucion) => value.nombre)
                                            } />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="finalizacion"
                                control={control}
                                rules={{ required: 'Finalización no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group controlId="fecha">
                                        <Form.ControlLabel>Fecha de finalización</Form.ControlLabel>
                                        <DatePicker
                                            placement="top"
                                            style={{ width: "100%", marginBottom: 10 }}
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
                            <Controller
                                name="descripcionCorta"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Descripción Corta</Form.ControlLabel>
                                        <Input {...field}
                                            multiple
                                            style={{ maxHeight: 200 }}
                                            as='textarea'
                                            rows={3}
                                            size='lg' />
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="descripcion"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
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
                            <Button size='lg'
                                block appearance='primary'
                                style={{ background: red[700] }}
                                onClick={handleSubmit(onSubmit)} >
                                Crear Pasantia
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