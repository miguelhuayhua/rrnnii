'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { Box, Grid, Backdrop, CircularProgress } from '@mui/material';
import { Carrera } from '@prisma/client';
import { BotonFilled, BotonSimple } from '@/app/componentes/Botones';
import { Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { useFilePicker } from 'use-file-picker';
import { BsImageAlt } from 'react-icons/bs';
import { InputBox } from '@/app/componentes/Datos';
import { axiosInstance } from '@/globals';
import { useModal } from '@/providers/ModalProvider';
import Image from 'next/legacy/image';
import { grey } from '@mui/material/colors';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { Modal, Input, Button, Form, Text, InputNumber } from 'rsuite';
import { fileDomain } from '@/utils/globals';
interface Props {
    setCarrera: any;
    Carrera: Carrera;
    setCarreras: any;
    setPrevCarreras: any;
}
export default function ModalCarrera({ setCarrera, Carrera,
    setCarreras, setPrevCarreras
}: Props) {

    const { control, formState: { errors, isDirty }, handleSubmit, setValue, watch } = useForm<Carrera>({
        defaultValues: Carrera, shouldFocusError: true
    });
    const [load, setLoad] = useState(false);
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
            openSnackbar('Logo carrera modificada con éxito');
        }
    });

    const onSubmit = (carrera: Carrera) => {
        let form = new FormData();
        form.append('nombre', carrera.nombre);
        form.append('logo', carrera.logo!);
        form.append('contacto', carrera.contacto ? carrera.contacto.toString() : '0');
        form.append('portada', portada);
        form.append('id', carrera.id);
        openModal({
            titulo: '¿Continuar?',
            content: 'La carrera será modificada',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/carrera/modificar', form);
                if (!res.data.error) {
                    setCarrera(null);
                    axios.post('/api/carrera/todo', {}).then(res => {
                        setCarreras(res.data);
                        setPrevCarreras(res.data);
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
                open={!!Carrera}
                onClose={() => { setCarrera(null) }}
            >
                <Modal.Header>
                    <Titulo mb={2}>
                        Editar {Carrera.nombre}
                    </Titulo>
                </Modal.Header>
                <Modal.Body>
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
                                        <Form.ControlLabel>Título del evento</Form.ControlLabel>
                                        <Input {...field} size='lg' />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
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
                        </Grid>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    {
                        isDirty ?
                            <Button
                                appearance='primary'
                                onClick={handleSubmit(onSubmit)} >
                                Modificar Carrera
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