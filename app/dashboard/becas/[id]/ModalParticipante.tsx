'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Backdrop, CircularProgress, Grid, LinearProgress } from '@mui/material';
import { BotonFilled, BotonSimple } from '@/app/componentes/Botones';
import { Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { InputBox } from '@/app/componentes/Datos';
import { useModal } from '@/providers/ModalProvider';
import { ParticipanteBeca, } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, InputNumber, Modal, Panel, Stack } from 'rsuite';
import { parseLetter } from '@/utils/data';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { fileDomain } from '@/utils/globals';
import { red } from '@mui/material/colors';
interface Props {
    setParticipante: any;
    Participante: ParticipanteBeca;
}
export default function ModalParticipante({ Participante, setParticipante }: Props) {
    const { control, formState: { isDirty }, handleSubmit } =
        useForm<ParticipanteBeca>({
            defaultValues: Participante, shouldFocusError: true
        });
    const [load, setLoad] = useState(false);
    const { openModal } = useModal();
    const { openSnackbar } = useSnackbar();
    const router = useRouter();
    return (
        <>
            <Modal
                size='md'
                open={!!Participante}
                onClose={() => { setParticipante(null) }}
                overflow
            >
                <Modal.Header>
                    <Titulo>
                        Participante: {Participante.nombre_completo}
                    </Titulo>
                </Modal.Header>
                <Modal.Body style={{ padding: "0 10px" }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <Controller control={control}
                                rules={{ required: 'No puede quedar vacío' }}
                                name='nombre_completo'
                                render={
                                    ({ field, fieldState }) =>
                                        <Form.Group style={{ marginBottom: 10 }}>
                                            <Form.ControlLabel>Nombre completo</Form.ControlLabel>
                                            <Input {...field} size='lg' onChange={text => {
                                                field.onChange(parseLetter(text))
                                            }} />
                                            <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                                {fieldState.error?.message}
                                            </Form.ErrorMessage>
                                        </Form.Group>
                                }
                            />
                            <Controller control={control}
                                name='ci'
                                rules={{ required: 'No puede quedar vacío' }}
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
                            <Controller control={control}
                                name='ru'
                                rules={{ required: 'No puede quedar vacío' }}
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
                            <Controller control={control}
                                name='contacto'
                                render={
                                    ({ field, fieldState }) =>
                                        <Form.Group style={{ marginBottom: 20 }}>
                                            <Form.ControlLabel>Número de contacto</Form.ControlLabel>
                                            <InputNumber {...field} size='lg' />
                                            <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                                {fieldState.error?.message}
                                            </Form.ErrorMessage>
                                        </Form.Group>
                                }
                            />
                            {
                                isDirty ?
                                    <Button size='lg'
                                        block
                                        appearance='primary'
                                        onClick={handleSubmit(Participante => {
                                            openModal({
                                                titulo: '¿Continuar?',
                                                content: 'El participante será modificado',
                                                async callback() {
                                                    setLoad(true);
                                                    let res = await axios.post('/api/beca/participante/modificar', Participante);
                                                    setLoad(false);
                                                    router.refresh();
                                                    setParticipante(null);
                                                    return res.data.mensaje;
                                                }
                                            })
                                        })}>
                                        Modificar Participante
                                    </Button>
                                    : null
                            }
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Panel shaded >
                                <Button
                                    block
                                    size='lg'
                                    appearance='primary' style={{ background: red[600] }}
                                    onClick={() => {
                                        let a = document.createElement('a');
                                        a.href = fileDomain + Participante.cipath;
                                        a.target = '_blank';
                                        a.download = fileDomain + Participante.cipath;
                                        a.click();
                                        a.remove();
                                        openSnackbar('Carnet descargado con éxito');
                                    }}
                                >
                                    Descargar Cédula de Identidad
                                </Button>
                                <Button size='lg'
                                    block appearance='primary'
                                    onClick={() => {
                                        let a = document.createElement('a');
                                        a.href = fileDomain + Participante.rupath;
                                        a.target = '_blank';
                                        a.download = fileDomain + Participante.rupath;
                                        a.click();
                                        a.remove();
                                        openSnackbar('Registro universitario descargado con éxito');
                                    }}
                                    style={{ background: red[600], marginTop: 20 }}>
                                    Descargar Registro Universitario
                                </Button>
                                <Button size='lg'
                                    block appearance='primary'
                                    onClick={() => {
                                        let a = document.createElement('a');
                                        a.href = fileDomain + Participante.rupath;
                                        a.target = '_blank';
                                        a.download = fileDomain + Participante.rupath;
                                        a.click();
                                        a.remove();
                                        openSnackbar('Registro universitario descargado con éxito');
                                    }}
                                    style={{ marginTop: 20 }}>
                                    Contactar
                                </Button>
                            </Panel>
                        </Grid>
                    </Grid>
                </Modal.Body>
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