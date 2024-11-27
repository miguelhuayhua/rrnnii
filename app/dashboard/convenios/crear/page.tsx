'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import {
    Box, Breadcrumbs,
    Backdrop, CircularProgress,
    Grid
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from '@iconify/react';
import { MdArrowLeft } from "react-icons/md";
import { Controller, useForm } from "react-hook-form";
import { Carrera, Convenio, ConvenioCarrera, Institucion } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { useEffect, useState } from "react";
import Image from 'next/legacy/image';
import { useSnackbar } from "@/providers/SnackbarProvider";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/app/skeletons/EditorSkeleton";
import { red } from "@mui/material/colors";
import axios from "axios";
import { fileDomain, paises } from "@/utils/globals";
import {
    AutoComplete, DatePicker, Form, Text
    , Input, SelectPicker, TagPicker,
    Button,
    Uploader,
    Panel
} from "rsuite";
import dayjs from "dayjs";
import { toUpperCase } from "@/utils/data";

export default function Page() {
    const { control, handleSubmit, setValue, watch } =
        useForm<Convenio & { Institucion: Institucion, ConvenioCarrera: ConvenioCarrera[], carreras: string[] }>({
            defaultValues: {
                titulo: '', tipo: 'nacional',
                finalizacion: '',
                descripcion: '', Institucion: { nombre: '' },
                ConvenioCarrera: [], carreras: []
            }, shouldFocusError: true
        });
    const router = useRouter();
    const [load, setLoad] = useState(false);
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    const { openModal } = useModal();
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>([]);
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

    const { openSnackbar } = useSnackbar();
    useEffect(() => {
        axios.post('/api/carrera/listar').then(res => {
            setCarreras(res.data);
        })
    }, []);
    const onSubmit = (convenio: Convenio & { Institucion: Institucion, ConvenioCarrera: ConvenioCarrera[], carreras: string[] }) => {
        if (portada) {
            let form = new FormData();
            form.append('titulo', convenio.titulo);
            form.append('pdf', convenio.pdf);
            form.append('descripcion', convenio.descripcion);
            form.append('portada', portada);
            form.append('documento', documento[0].blobFile);
            form.append('continente', convenio.continente);
            form.append('pais', convenio.pais);
            form.append('descripcioncorta', convenio.descripcionCorta);
            form.append('tipo', convenio.tipo);
            form.append('institucion', convenio.Institucion.nombre);
            form.append('finalizacion', convenio.finalizacion!);
            form.append('carreras', JSON.stringify(convenio.carreras))
            openModal({
                titulo: '¿Continuar?',
                content: 'Un nuevo convenio se agregará',
                callback: async () => {
                    setLoad(true);
                    let res = await axios.post('/api/convenio/crear', form);
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
    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ my: 1, mt: 2 }}>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/convenios">
                        <Normal>Convenios</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>
                <Titulo sx={{ mt: 2, mb: 1.5 }}>
                    Crear nuevo convenio
                </Titulo>
                <Button
                    appearance="subtle"
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </Button>

                <Grid container spacing={4} py={3}>
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
                            <Negrita sx={{ mt: 2, mb: 1 }}>Documento respaldo</Negrita>
                            <Uploader
                                fileList={documento}
                                autoUpload={false}
                                action="/"
                                onChange={setDocumento}
                                accept=".pdf, .doc, .docx"

                            >
                                <Button style={{ zIndex: 2000 }}
                                    size='lg' block>Seleccionar archivo...</Button>
                            </Uploader>
                        </Panel>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                        <Panel shaded style={{ background: 'white' }}
                            as='form' onSubmit={handleSubmit(onSubmit)}>

                            <Controller
                                name="titulo"
                                control={control}
                                rules={{ required: 'Título no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Título del convenio</Form.ControlLabel>
                                        <Input {...field}
                                            onChange={text => field.onChange(toUpperCase(text))} size='lg' />
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
                                            valueKey="id" data={carreras}
                                            renderMenuItem={(label, item) => (
                                                <div style={{ display: 'flex', alignItems: 'center', height: 22 }}>
                                                    <div style={{ width: 25, minWidth: 25, aspectRatio: 1, position: 'relative', marginRight: 10 }}>
                                                        <Image layout='fill' src={item.logo ? fileDomain + item.logo : '/default-image.jpg'} style={{ borderRadius: 10 }} />
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
                                name="tipo"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group controlId="tipo">
                                        <Form.ControlLabel>Tipo de convenio</Form.ControlLabel>
                                        <SelectPicker
                                            {...field}
                                            size="lg"
                                            cleanable={false}
                                            style={{ marginBottom: 10, width: "100%" }}
                                            data={[{ label: 'Nacional', value: 'nacional' },
                                            { label: 'Internacional', value: 'internacional' }
                                            ]}
                                            searchable={false}
                                        />
                                    </Form.Group>

                                )}
                            />
                            {
                                watch('tipo') != 'nacional' ?
                                    <Controller
                                        name="pais"
                                        control={control}
                                        rules={{ required: 'País no puede quedar vacío' }}
                                        render={({ field, fieldState }) => (
                                            <Form.Group controlId="pais">
                                                <Form.ControlLabel>País</Form.ControlLabel>
                                                <SelectPicker
                                                    data={paises}
                                                    size='lg'
                                                    groupBy="continente"
                                                    placement="top"
                                                    labelKey="pais"
                                                    valueKey="value"
                                                    style={{
                                                        width: "100%",
                                                        marginBottom: 10
                                                    }}
                                                    onChange={pais => {
                                                        let p = paises.find(value => value.value == pais);
                                                        setValue('continente', p?.continenteAbrev!);
                                                        field.onChange(pais);
                                                    }}
                                                    renderMenuItem={(label, item) => (
                                                        <div key={label?.toString()}>
                                                            <Icon style={{ marginRight: 5 }} icon={`flagpack:${(item?.value as any).toLowerCase()}`} />
                                                            {label}</div>
                                                    )}
                                                />
                                                <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                                    {fieldState.error?.message}
                                                </Form.ErrorMessage>
                                            </Form.Group>
                                        )}
                                    />
                                    : null
                            }

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
                            <Button
                                size="lg"
                                block
                                style={{ background: red[700] }}
                                appearance="primary"
                                onClick={handleSubmit(onSubmit)}>
                                Crear Convenio</Button>

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