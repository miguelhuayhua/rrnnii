'use client';
import React, { useEffect, useState } from 'react';
import {
    Box, Grid,
    Backdrop, CircularProgress
} from '@mui/material';
import { Carrera, Convenio, ConvenioCarrera, Institucion } from '@prisma/client';
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
import axios from 'axios';
import { Icon } from '@iconify/react';
import { fileDomain, paises } from '@/utils/globals';
import { Uploader, Text, Form, Input, Button, AutoComplete, TagPicker, DatePicker, SelectPicker, Modal } from 'rsuite';
interface Props {
    setConvenio: any;
    Convenio: Convenio & { ConvenioCarrera: ConvenioCarrera[] };
    setConvenios: any;
    setPrevConvenios: any;
    setOpcion: any;
}
export default function ModalConvenio({ setConvenio, setOpcion, Convenio, setConvenios, setPrevConvenios }: Props) {
    const { control, formState: { errors, isDirty }, handleSubmit, setValue, watch } =
        useForm<Convenio & { Institucion: Institucion, ConvenioCarrera: ConvenioCarrera[], carreras: string[] }>({
            defaultValues: { ...Convenio, carreras: Convenio.ConvenioCarrera.map(value => value.carreraId) }, shouldFocusError: true
        });
    const { openModal } = useModal();
    const [portada, setPortada] = useState<any>('');
    const [load, setLoad] = useState(false);
    const [documento, setDocumento] = useState<any>([]);
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
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    useEffect(() => {
        axios.post('/api/carrera/listar').then(res => {
            setCarreras(res.data);
        })
    }, []);
    const onSubmit = (convenio: Convenio & { Institucion: Institucion, ConvenioCarrera: ConvenioCarrera[], carreras: string[] }) => {
        let form = new FormData();
        form.append('titulo', convenio.titulo);
        form.append('tipo', convenio.tipo);
        form.append('pdf', convenio.pdf);
        form.append('descripcion', convenio.descripcion);
        form.append('finalizacion', convenio.finalizacion!);
        form.append('institucion', convenio.Institucion.nombre);
        form.append('continente', convenio.continente);
        form.append('pais', convenio.pais);
        form.append('logo', convenio.Institucion.logo!);
        form.append('portada', portada);
        form.append('documento', documento[0] ? documento[0].blobFile : '');
        form.append('id', convenio.id);
        form.append('carreras', JSON.stringify(convenio.carreras));
        form.append('convenioCarrera', JSON.stringify(convenio.carreras.map(carreraId => {
            return { carreraId, id: convenio.ConvenioCarrera.find(value => value.carreraId == carreraId)?.id || '' }
        })))
        openModal({
            titulo: '¿Continuar?',
            content: 'El convenio será modificado',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/convenio/modificar', form);
                if (!res.data.error) {
                    setConvenio(null);
                    axios.post('/api/convenio/todo', {}).then(res => {
                        setConvenios(res.data);
                        setPrevConvenios(res.data);
                        setOpcion('todo');
                    });
                }
                setLoad(false);
                return res.data.mensaje;
            }
        });
    }
    const [instituciones, setInstituciones] = useState([]);
    useEffect(() => {
        axios.post('/api/institucion/todo', { opcion: 'activo' }).then(res => {
            setInstituciones(res.data);
        })
    }, []);
    return (
        <>
            <Modal
                size='md'
                open={!!Convenio}
                onClose={() => { setConvenio(null) }}
                overflow
            >
                <Modal.Header>
                    <Titulo mb={2}>
                        Editar {Convenio.titulo}
                    </Titulo>
                </Modal.Header>
                <Modal.Body style={{ padding: "0 10px" }}>
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
                                <>
                                    <Negrita sx={{ mt: 2, mb: 1 }}>Documento respaldo</Negrita>
                                    <Button size='lg' block>Seleccionar archivo...</Button>
                                </>
                            </Uploader>
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
                                name="Institucion.nombre"
                                control={control}
                                rules={{ required: 'Institución no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Institución</Form.ControlLabel>
                                        <AutoComplete
                                            {...field}
                                            size='lg'
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
                                                        <Image layout='fill' src={fileDomain + item.logo} style={{ borderRadius: 10 }} />
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
                                            value={dayjs(field.value, 'DD/MM/YYYY').toDate()}
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
                                                    value={field.value}
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
                        <Grid item xs={12} sm={6}>
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
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    {
                        isDirty ?
                            <Button appearance='primary'
                                size='lg' onClick={handleSubmit(onSubmit)} >
                                Modificar Convenio
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