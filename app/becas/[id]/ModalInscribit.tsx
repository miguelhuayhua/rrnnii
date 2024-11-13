'use client';
import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { BotonFilled } from '@/app/componentes/Botones';
import { Negrita, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { InputBox } from '@/app/componentes/Datos';
import { useModal } from '@/providers/ModalProvider';
import { ParticipanteBeca } from '@prisma/client';
import axios from 'axios';
import { parseLetter } from '@/utils/data';
import { blue } from '@mui/material/colors';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { TbReload } from 'react-icons/tb';
import { makeid } from '@/utils/globals';
import { Button, Form, Input, InputNumber, Modal, Uploader } from 'rsuite';
interface Props {
    open: boolean;
    setOpen: any;
    becaId: string;
}
export default function ModalInscribir({ becaId, open, setOpen }: Props) {
    const { control, formState: { isDirty }, handleSubmit, setValue, watch } = useForm<ParticipanteBeca & {
        captcha: string,
        confirmCaptcha: string
    }>({
        defaultValues: { captcha: makeid(7) }, shouldFocusError: true
    });
    const { openModal } = useModal();
    const { openSnackbar } = useSnackbar();
    const [ci, setCi] = useState<any>([]);
    const [ru, setRu] = useState<any>([]);
    const onSubmit = (participante: ParticipanteBeca) => {
        if (ci && ru) {
            let form = new FormData();
            form.append('nombre_completo', participante.nombre_completo);
            form.append('ru', participante.ru);
            form.append('ci', participante.ci);
            form.append('contacto', participante.contacto);
            form.append('archivoru', ru[0].blobFile);
            form.append('archivoci', ci[0].blobFile);
            form.append('becaId', becaId)
            openModal({
                titulo: '¿Continuar?',
                content: 'Tu postulación será enviada y serás contactado',
                callback: async () => {
                    let res = await axios.post('/api/beca/participante/crear', form);
                    if (!res.data.error) {
                        setOpen(false);
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
                    <Grid item xs={12} lg={6}>
                        <Uploader
                            fileList={ci}
                            autoUpload={false}
                            action="/"
                            onChange={setCi}
                            multiple={false}
                            accept=".pdf, .doc, .docx"
                        >
                            <>
                                <Negrita sx={{ mt: 2, mb: 1 }}>Suba su carnet de identidad</Negrita>
                                <Button size='lg' block>Seleccionar archivo...</Button>
                            </>
                        </Uploader>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Uploader
                            fileList={ru}
                            autoUpload={false}
                            action="/"
                            onChange={setRu}
                            multiple={false}
                            accept=".pdf, .doc, .docx, .jpg, .png"
                        >
                            <>
                                <Negrita sx={{ mt: 2, mb: 1 }}>Suba su registro universitario</Negrita>
                                <Button size='lg' block>Seleccionar archivo...</Button>
                            </>
                        </Uploader>

                    </Grid>
                    <Grid item xs={8} sm={6} lg={3} mx='auto'>
                        <Controller
                            rules={{ required: 'No puede quedar vacio' }}
                            control={control}
                            name="captcha"
                            render={({ field }) => (
                                <InputBox
                                    label='Captcha'
                                    disabled
                                    sx={{ userSelect: 'none', mt: 1 }}
                                    {...field}
                                    InputProps={{
                                        endAdornment: <BotonFilled
                                            onClick={() => {
                                                setValue('captcha', makeid(7))
                                            }}
                                            sx={{
                                                bgcolor: blue[500],
                                                minWidth: 0,
                                                height: 35, width: 40,
                                            }}>
                                            <TbReload fontSize={24} /></BotonFilled>
                                    }}
                                />
                            )}
                        />
                        <Controller
                            rules={{
                                required: 'No puede quedar vacio',
                                validate: value => value === watch('captcha') || 'El valor del captcha no coincide, inténtelo de nuevo'

                            }}
                            control={control}
                            name="confirmCaptcha"
                            render={({ field, fieldState }) => (
                                <InputBox
                                    label='Confirme el captcha'
                                    error={!!fieldState.error}
                                    {...field}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        {
                            isDirty ?
                                <BotonFilled onClick={handleSubmit(onSubmit)} fullWidth>
                                    Solicitar mi postulación
                                </BotonFilled>
                                : null
                        }
                    </Grid>
                </Grid>
            </Modal.Body>

        </Modal >
    );
}