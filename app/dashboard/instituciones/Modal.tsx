'use client';
import React, { useState } from 'react';
import { Grid, CircularProgress, Backdrop } from '@mui/material';
import { Institucion } from '@prisma/client';
import { Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { useFilePicker } from 'use-file-picker';
import { useModal } from '@/providers/ModalProvider';
import Image from 'next/legacy/image';
import { Icon } from '@iconify/react';
import { useSnackbar } from '@/providers/SnackbarProvider';
import axios from 'axios';
import { fileDomain } from '@/utils/globals';
import { Modal, Input, Form, Button, InputNumber, Text, } from 'rsuite';
interface Props {
    setInstitucion: any;
    Institucion: Institucion;
    setInstituciones: any;
    setPrevInstituciones: any;
}
export default function ModalInstitucion({ setInstitucion, Institucion, setInstituciones, setPrevInstituciones }: Props) {
    const [load, setLoad] = useState(false);
    const { control, formState: { errors, isDirty }, handleSubmit, setValue, watch } = useForm<Institucion>({
        defaultValues: Institucion, shouldFocusError: true
    });
    const { openSnackbar } = useSnackbar();
    const { openModal } = useModal();
    const [portada, setPortada] = useState<any>('');
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('logo', URL.createObjectURL(plainFiles[0]), { shouldDirty: true });
            setPortada(plainFiles[0]);
            openSnackbar('Logo institución cambiada con éxito');
        }
    });

    const onSubmit = (institucion: Institucion) => {
        let form = new FormData();
        form.append('nombre', institucion.nombre);
        form.append('contacto', institucion.contacto?.toString()!);
        form.append('logo', institucion.logo!);
        form.append('portada', portada);
        form.append('web', institucion.web || '');
        form.append('video', institucion.video || '');
        form.append('id', institucion.id);
        openModal({
            titulo: '¿Continuar?',
            content: 'La institución será modificada',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/institucion/modificar', form);
                if (!res.data.error) {
                    setInstitucion(null);
                    axios.post('/api/institucion/todo', {}).then(res => {
                        setInstituciones(res.data);
                        setPrevInstituciones(res.data);
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
                size='md'
                open={!!Institucion}
                onClose={() => { setInstitucion(null) }}
            >
                <Modal.Header>
                    <Titulo mb={2}>
                        Editar {Institucion.nombre}
                    </Titulo>
                </Modal.Header>
                <Modal.Body>
                    <Grid container spacing={4}>
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
                                    watch('logo') ?
                                        <Image src={(portada ? '' : fileDomain) + watch('logo')} layout='fill' objectFit='cover' />
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
                                name="nombre"
                                control={control}
                                rules={{ required: 'Nombre no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Nombre de institucion</Form.ControlLabel>
                                        <Input {...field} size='lg' />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="video"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Link de Youtube</Form.ControlLabel>
                                        <Input {...field} value={field.value!} size='lg' />
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="contacto"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Contacto</Form.ControlLabel>
                                        <InputNumber {...field} value={field.value!} size='lg' />
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="web"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Página web</Form.ControlLabel>
                                        <Input {...field} value={field.value!} size='lg' />
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
                                size='lg'
                                onClick={handleSubmit(onSubmit)} >
                                Modificar Institución
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
            </Backdrop></>

    );
}