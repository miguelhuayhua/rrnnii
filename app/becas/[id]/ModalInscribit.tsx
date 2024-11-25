'use client';
import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { useModal } from '@/providers/ModalProvider';
import { ParticipanteBeca } from '@prisma/client';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { parseLetter } from '@/utils/data';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { makeid } from '@/utils/globals';
import { Button, Form, Input, InputNumber, Modal, Uploader, Text } from 'rsuite';
interface Props {
    open: boolean;
    setOpen: any;
    becaId: string;
}
export default function ModalInscribir({ becaId, open, setOpen }: Props) {
    const { control, formState: { isDirty }, handleSubmit,
        reset, setValue, watch } = useForm<ParticipanteBeca & {
            captcha: string,
            confirmCaptcha: string
        }>({
            defaultValues: { captcha: makeid(7) }, shouldFocusError: true
        });
    const { openModal } = useModal();
    const { openSnackbar } = useSnackbar();
    const [ci, setCi] = useState<any>([]);
    const [ru, setRu] = useState<any>([]);
    const [archivos, setArchivos] = useState<any>([]);
    const onSubmit = (participante: ParticipanteBeca) => {

        if (ci && ru) {
            let form = new FormData();
            form.append('nombre_completo', participante.nombre_completo);
            form.append('ru', participante.ru);
            form.append('ci', participante.ci);
            form.append('contacto', participante.contacto);
            archivos.forEach((file: any) => {
                form.append('archivos', file.blobFile); // Usamos el mismo nombre para todos los archivos
            });
            form.append('becaId', becaId)
            openModal({
                titulo: '¿Continuar?',
                content: 'Tu postulación será enviada y serás contactado',
                callback: async () => {
                    let res = await axios.post('/api/beca/participante/crear', form);
                    if (!res.data.error) {
                        setOpen(false);
                        reset();
                    }
                    return res.data.mensaje;
                }
            });
        }
        else {
            openSnackbar('Por favor, ingrese los archivos de respaldo')
        }
    }
    return (
        <Modal
            size='md'
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2001 // Asegura que esté al frente
            }}
            open={!!open}
            onClose={() => { setOpen(false) }}
        >
            <Modal.Header>
                <Titulo sx={{ textAlign: 'center' }}>
                    Registro de postulantes
                </Titulo>
            </Modal.Header>
            <Modal.Body style={{ padding: "0 10px" }}>
                <Grid container spacing={1}>

                    <Grid item xs={12}>
                        <Titulo sx={{ fontSize: 20, pr: 4 }}>
                            Datos del postulante
                        </Titulo>
                    </Grid>
                    <Grid item xs={12} >
                        <Controller control={control}
                            name='nombre_completo'
                            rules={{ required: 'Inserte su nombre completo' }}
                            render={
                                ({ field, fieldState }) =>
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Nombre completo</Form.ControlLabel>
                                        <Input {...field} size='lg' onChange={text => field.onChange(parseLetter(text))} />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                            }
                        />

                    </Grid>
                    <Grid item xs={12} md={4} >
                        <Controller control={control}
                            name='ru'
                            rules={{ required: 'Inserte su registro universitario' }}
                            render={
                                ({ field, fieldState }) =>
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Registro universitario</Form.ControlLabel>
                                        <InputNumber {...field} size='lg' />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                            }
                        />

                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Controller control={control}
                            rules={{ required: 'Inserte su carnet de identidad' }}
                            name='ci'
                            render={
                                ({ field, fieldState }) =>
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Cédula de identidad</Form.ControlLabel>
                                        <InputNumber {...field} size='lg' />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Controller control={control}
                            name='contacto'
                            rules={{ required: 'Número de contacto es requerido' }}
                            render={
                                ({ field, fieldState }) =>
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Número de contacto</Form.ControlLabel>
                                        <InputNumber {...field} size='lg' />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Titulo sx={{ fontSize: 20 }}>
                            Archivos de respaldo
                        </Titulo>
                    </Grid>
                    <Grid item xs={12} >
                        <Uploader
                            fileList={archivos}
                            autoUpload={false}
                            action="/"
                            onChange={setArchivos}
                            multiple
                            appearance='ghost'
                            accept=".pdf, .doc, .docx"
                        >
                            <Button
                                style={{
                                    border: '1px solid #999',
                                    color: '#212121'
                                }}
                                size='lg' block>Seleccionar archivos de convocatoria...</Button>
                        </Uploader>
                    </Grid>
                    <Grid item xs={8} sm={6} lg={3} mx='auto'>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
                            <Text as='del'
                                style={{ userSelect: 'none', fontSize: 25 }}>
                                {watch('captcha')}
                            </Text>
                            <Button
                                onClick={() => {
                                    setValue('captcha', makeid(7))
                                }} appearance="ghost" style={{ marginLeft: 10, color: '#212121', border: '1px solid #212121' }} >
                                <Icon icon='mdi:reload' fontSize={22} />
                            </Button>
                        </Box>
                        <Controller
                            rules={{
                                required: 'Por favor confirme el Captcha',
                                validate: value => value === watch('captcha') || 'El valor del captcha no coincide, inténtelo de nuevo'
                            }}
                            control={control}
                            name="confirmCaptcha"
                            render={({ field, fieldState }) => (
                                <Form.Group style={{ marginBottom: 10 }}>
                                    <Form.ControlLabel>Confirme el Captcha</Form.ControlLabel>
                                    <Input {...field} size='lg' />
                                    <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                        {fieldState.error?.message}
                                    </Form.ErrorMessage>
                                </Form.Group>
                            )}
                        />

                    </Grid>
                </Grid>

            </Modal.Body>
            <Modal.Footer >
                {
                    isDirty ?
                        <Button
                            style={{ background: "#212121" }}
                            block
                            appearance='primary'
                            size='lg'
                            onClick={handleSubmit(onSubmit)}>
                            Solicitar mi postulación
                        </Button>
                        : null
                }
            </Modal.Footer>
        </Modal >
    );
}