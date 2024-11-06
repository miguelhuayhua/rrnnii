'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Backdrop, CircularProgress, LinearProgress } from '@mui/material';
import { BotonFilled, BotonSimple } from '@/app/componentes/Botones';
import { Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { InputBox } from '@/app/componentes/Datos';
import { useModal } from '@/providers/ModalProvider';
import { ParticipanteBeca, } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    return (
        <>
            <Dialog
                open={!!Participante}
                keepMounted={false}
                maxWidth='sm'
                onClose={() => { setParticipante(null) }}
            >
                <DialogContent sx={{ position: 'relative', p: 2 }}>
                    <BotonSimple onClick={() => setParticipante(null)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                        <IoClose fontSize={25} />
                    </BotonSimple>

                    <Titulo>
                        Modificar Participante
                    </Titulo>
                    <Controller control={control}
                        name='nombre_completo'
                        render={
                            ({ field }) =>
                                <InputBox
                                    sx={{ marginTop: 3 }}
                                    label='Nombre completo'
                                    {...field}
                                />
                        }
                    />
                    <Controller control={control}
                        name='ci'
                        render={
                            ({ field }) =>
                                <InputBox
                                    sx={{ marginTop: 2 }}
                                    label='Cédula de identidad'
                                    {...field}
                                />
                        }
                    />
                    <Controller control={control}
                        name='ru'
                        render={
                            ({ field }) =>
                                <InputBox
                                    sx={{ marginTop: 2 }}
                                    label='Registro universitario'
                                    {...field}
                                />
                        }
                    />
                    <Controller control={control}
                        name='contacto'
                        render={
                            ({ field }) =>
                                <InputBox
                                    sx={{ marginTop: 2 }}
                                    label='Contacto'
                                    {...field}
                                />
                        }
                    />
                    {
                        isDirty ?
                            <BotonFilled onClick={handleSubmit(Participante => {
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
                            })} sx={{ float: 'right' }}>Modificar Participante</BotonFilled>
                            : null
                    }
                </DialogContent>
            </Dialog >
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={load}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}