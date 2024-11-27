'use client';
import React, { useEffect, useState } from 'react';
import {
    Grid, CircularProgress,
    Backdrop
} from '@mui/material';
import { Carrera, Institucion, Pasantia, PasantiaCarrera } from '@prisma/client';
import { Negrita, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { Icon } from '@iconify/react';
import { useModal } from '@/providers/ModalProvider';
import Image from 'next/legacy/image';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import { useSnackbar } from '@/providers/SnackbarProvider';
import axios from 'axios';
import { fileDomain } from '@/utils/globals';
import { Uploader, Input, Form, AutoComplete, SelectPicker, Text, Button, TagPicker, DatePicker, Modal } from 'rsuite';
import { toUpperCase } from '@/utils/data';
interface Props {
    setPasantia: any;
    Pasantia: Pasantia & { PasantiaCarrera: PasantiaCarrera[] };
    setPasantias: any;
    setPrevPasantias: any;
}
export default function ModalPasantia({ setPasantia, Pasantia, setPasantias, setPrevPasantias }: Props) {
    const { openSnackbar } = useSnackbar();
    const [load, setLoad] = useState(false);
    const { control, formState: { isDirty }, handleSubmit, watch, setValue } = useForm<Pasantia & { PasantiaCarrera: PasantiaCarrera[], Institucion: Institucion, carreras: string[] }>({
        defaultValues: { ...Pasantia, carreras: Pasantia.PasantiaCarrera.map(value => value.carreraId) }, shouldFocusError: true
    });
    const { openModal } = useModal();
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>([]);
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]), { shouldDirty: true });
            openSnackbar('Imagen modificada con éxito');
            setPortada(plainFiles[0]);
        }
    });
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    useEffect(() => {
        axios.post('/api/carrera/listar').then(res => {
            setCarreras(res.data);
        })
    }, []);
    const onSubmit = (pasantia: Pasantia & { Institucion: Institucion, carreras: string[] }) => {
        let form = new FormData();
        form.append('titulo', pasantia.titulo);
        form.append('pdf', pasantia.pdf);
        form.append('descripcion', pasantia.descripcion);
        form.append('portada', portada);
        form.append('documento', documento);
        form.append('descripcioncorta', pasantia.descripcionCorta);
        form.append('finalizacion', pasantia.finalizacion!);
        form.append('id', pasantia.id);
        form.append('modalidad', pasantia.modalidad);
        form.append('institucion', pasantia.Institucion.nombre);
        form.append('carreras', JSON.stringify(pasantia.carreras));
        openModal({
            titulo: '¿Continuar?',
            content: 'La pasantía se modificará',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/pasantia/modificar', form);
                if (!res.data.error) {
                    setPasantia(null);
                    axios.post('/api/pasantia/todo').then(res => {
                        setPasantias(res.data);
                        setPrevPasantias(res.data);
                    });
                    setLoad(false);
                }
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
                overflow
                size='lg'
                open={!!Pasantia}
                onClose={() => { setPasantia(null) }}
            >
                <Modal.Header>
                    <Titulo mb={2}>
                        Editar {Pasantia.titulo}
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
                            <Negrita sx={{ mt: 2, mb: 1 }}>Documento respaldo</Negrita>
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
                                        <Form.ControlLabel>Título de la pasantía</Form.ControlLabel>
                                        <Input {...field}
                                            onChange={text => field.onChange(toUpperCase(text))}
                                            size='lg' />
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
                                name="modalidad"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                    <Form.Group controlId="modalidad">
                                        <Form.ControlLabel>Tiempo de duración</Form.ControlLabel>
                                        <SelectPicker
                                            {...field}
                                            size="lg"
                                            cleanable={false}
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
                                name="Institucion.nombre"
                                control={control}
                                rules={{ required: 'Institución no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Institución</Form.ControlLabel>
                                        <AutoComplete
                                            onBlur={ev => field.onChange((ev.target as any).value! as any)}
                                            size="lg"
                                            value={field.value}
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
                            <Button
                                appearance='primary'
                                onClick={handleSubmit(onSubmit)} >
                                Modificar Pasantia
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