'use client';
import { BotonSimple } from "@/app/componentes/Botones";
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
import { Beca, Institucion } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { useEffect, useState } from "react";
import Image from 'next/legacy/image';
import { BoxSombra } from "@/app/componentes/Mostrar";
import { useSnackbar } from "@/providers/SnackbarProvider";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/app/skeletons/EditorSkeleton";
import { Icon } from '@iconify/react';
import axios from "axios";
import { paises } from "@/utils/globals";
import { Button, Panel, Uploader, Text, Form, Input, DatePicker, AutoComplete, SelectPicker } from "rsuite";
import dayjs from "dayjs";
export default function Page() {
    const { control, handleSubmit, setValue, watch } = useForm<Beca & { Institucion: Institucion }>({
        defaultValues: { titulo: '', descripcion: '', tipo: 'nacional' }, shouldFocusError: true
    });
    const { openSnackbar } = useSnackbar();
    const router = useRouter();
    const [load, setLoad] = useState(false);
    const { openModal } = useModal();
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>([]);
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
    const [instituciones, setInstituciones] = useState([]);
    useEffect(() => {
        axios.post('/api/institucion/todo', { opcion: 'activo' }).then(res => {
            setInstituciones(res.data);
        })
    }, []);
    const onSubmit = (beca: Beca & { Institucion: Institucion }) => {
        if (portada) {
            let form = new FormData();
            form.append('titulo', beca.titulo);
            form.append('pdf', beca.pdf);
            form.append('descripcion', beca.descripcion);
            form.append('portada', portada);
            form.append('documento', documento[0].blobFile);
            form.append('continente', beca.continente);
            form.append('pais', beca.pais);
            form.append('tipo', beca.tipo);
            form.append('institucion', beca.Institucion.nombre)
            form.append('termina', beca.termina);
            form.append('encargado', beca.encargado);
            openModal({
                titulo: '¿Continuar?',
                content: 'Una nueva beca se agregará',
                callback: async () => {
                    setLoad(true);
                    let res = await axios.post('/api/beca/crear', form);
                    router.replace('/dashboard/becas');
                    setLoad(false);
                    return res.data.mensaje;
                }
            });
        }
        else {
            openSnackbar('Por favor introduzca una imagen de referencia');;
        }
    }
    return (
        <>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={load}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ mb: 1 }} >
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/becas">
                        <Normal>Becas</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>
                <Titulo sx={{ mb: 2 }}>
                    Crear nueva beca
                </Titulo>
                <BotonSimple
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </BotonSimple>
                <Grid container spacing={2} px={{ xs: 0, xl: 5 }} py={2}>
                    <Grid item xs={12} sm={5} lg={4}>
                        <Panel shaded style={{ padding: 16, background: 'white' }}>
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
                                <>
                                    <Negrita sx={{ mt: 2, mb: 1 }}>Documento respaldo</Negrita>
                                    <Button size='lg' block>Seleccionar archivo...</Button>
                                </>
                            </Uploader>
                        </Panel>

                    </Grid>
                    <Grid item xs={12} sm={7} lg={8}>
                        <BoxSombra p={2} component='form' onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={6} >
                                    <Controller
                                        name="titulo"
                                        control={control}
                                        rules={{ required: 'Título no puede quedar vacío' }}
                                        render={({ field, fieldState }) => (
                                            <Form.Group style={{ marginBottom: 10 }}>
                                                <Form.ControlLabel>Título del convenio</Form.ControlLabel>
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
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Controller
                                        name="encargado"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Group style={{ marginBottom: 10 }}>
                                                <Form.ControlLabel>Encargado</Form.ControlLabel>
                                                <Input {...field} size='lg' />
                                            </Form.Group>
                                        )}
                                    />
                                    <Controller
                                        name="termina"
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
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" appearance="primary" size='lg'>
                                        Crear Beca
                                    </Button>
                                </Grid>
                            </Grid>
                        </BoxSombra>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}