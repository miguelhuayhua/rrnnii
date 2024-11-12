'use client';
import React, { useEffect, useState } from 'react';
import {
    Box, Grid,
    CircularProgress, Backdrop
} from '@mui/material';
import { Negrita, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { Icon } from '@iconify/react';
import { useModal } from '@/providers/ModalProvider';
import Image from 'next/legacy/image';
import dynamic from 'next/dynamic';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import { Beca, Institucion } from '@prisma/client';
import { useSnackbar } from '@/providers/SnackbarProvider';
import axios from 'axios';
import { fileDomain, paises } from '@/utils/globals';
import dayjs from 'dayjs';
import { Uploader, Text, Input, AutoComplete, SelectPicker, Button, Form, DatePicker, Modal } from 'rsuite';
interface Props {
    setBeca: any;
    Beca: Beca;
    setBecas: any;
    setPrevBecas: any;
}
export default function ModalBeca({ setBeca, Beca, setBecas, setPrevBecas }: Props) {
    const { control, formState: { isDirty }, handleSubmit, watch, setValue } =
        useForm<Beca & { Institucion: Institucion }>({
            defaultValues: Beca, shouldFocusError: true
        });
    const { openModal } = useModal();
    const [load, setLoad] = useState(false);
    const [portada, setPortada] = useState<any>('');
    const { openSnackbar } = useSnackbar();
    const [documento, setDocumento] = useState<any>([]);
    const [instituciones, setInstituciones] = useState([]);
    useEffect(() => {
        axios.post('/api/institucion/todo', { opcion: 'activo' }).then(res => {
            setInstituciones(res.data);
        })
    }, []);
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
    const onSubmit = (beca: Beca & { Institucion: Institucion }) => {
        let form = new FormData();
        form.append('titulo', beca.titulo);
        form.append('pdf', beca.pdf);
        form.append('descripcion', beca.descripcion);
        form.append('portada', portada);
        form.append('documento', documento);
        form.append('institucion', beca.Institucion.nombre);
        form.append('encargado', beca.encargado);
        form.append('termina', beca.termina);
        form.append('continente', beca.continente);
        form.append('pais', beca.pais);
        form.append('tipo', beca.tipo);
        form.append('id', beca.id);
        openModal({
            titulo: '¿Continuar?',
            content: 'La beca será modificada',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/beca/modificar', form);
                if (!res.data.error) {
                    setBeca(null);
                    axios.post('/api/beca/todo', {}).then(res => {
                        setBecas(res.data);
                        setPrevBecas(res.data);
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
                size='md'
                open={!!Beca}
                onClose={() => { setBeca(null) }}
                overflow
            >
                <Modal.Header>
                    <Titulo mb={2}>
                        Editar {Beca.titulo}
                    </Titulo>
                </Modal.Header>
                <Modal.Body style={{ padding: "0 10px" }}>
                    <Grid container spacing={2}>
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
                                Modificar Beca
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