'use client';
import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import {
    Box, Breadcrumbs, Grid,
    CircularProgress, Backdrop
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { InputBox } from "@/app/componentes/Datos";
import { BsImageAlt } from "react-icons/bs";
import { Controller, useForm } from "react-hook-form";
import { Carrera } from "@prisma/client";
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { useState } from "react";
import Image from 'next/legacy/image';
import { Icon } from '@iconify/react';
import { useSnackbar } from "@/providers/SnackbarProvider";
import { Input, Panel, Text, Form, InputNumber, Button } from "rsuite";
import axios from "axios";
import { red } from "@mui/material/colors";
import { toUpperCase } from "@/utils/data";
export default function Page() {
    const { control, formState: { errors }, handleSubmit, setValue, watch } = useForm<Carrera>({
        defaultValues: { nombre: '', logo: '' }, shouldFocusError: true
    });
    const router = useRouter();
    const { openModal } = useModal();
    const [portada, setPortada] = useState<any>('');
    const [load, setLoad] = useState(false);
    const { openSnackbar } = useSnackbar();
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('logo', URL.createObjectURL(plainFiles[0]));
            setPortada(plainFiles[0]);
            openSnackbar('Logo de carrera agregado con éxito');
        }
    });
    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ my: 2 }} >
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/carreras">
                        <Normal>Carreras</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>
                <Titulo sx={{ mb: 2 }}>
                    Añadir carrera
                </Titulo>

                <Button appearance="subtle"
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </Button>
                <Grid container spacing={4} py={3}>
                    <Grid item xs={12} sm={5} lg={4}>
                        <Panel shaded style={{ background: 'white' }}>
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
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}
                                className='drop'
                                onClick={() => openFilePicker()}
                            >
                                {
                                    watch('logo') ?
                                        <Image src={watch('logo')} layout='fill' objectFit='contain' /> : null
                                }
                                <Icon icon="stash:image-light" width="60" height="60" style={{ color: '#000' }} />
                                <Text align='center'>+ Subir imagen</Text>
                            </div>
                            <Text
                                style={{ margin: '15px 0' }}
                                size='sm' align='center'>Permitido: .png, .jpeg, .jpg</Text>

                        </Panel>
                    </Grid>
                    <Grid item xs={12} sm={7} lg={8}>
                        <Panel shaded style={{ background: 'white' }} >
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={6}>
                                    <Controller
                                        name="nombre"
                                        control={control}
                                        rules={{ required: 'Nombre no puede quedar vacío' }}
                                        render={({ field, fieldState }) => (
                                            <Form.Group style={{ marginBottom: 10 }}>
                                                <Form.ControlLabel>Nombre de la carrera</Form.ControlLabel>
                                                <Input {...field} size='lg'
                                                    onChange={text => field.onChange(toUpperCase(text))} />
                                                <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                                    {fieldState.error?.message}
                                                </Form.ErrorMessage>
                                            </Form.Group>
                                        )}
                                    />

                                </Grid>
                                <Grid item xs={12} lg={6}>
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

                                <Grid item xs={6} mx='auto'>
                                    <Button
                                        size="lg" block
                                        appearance='primary'
                                        style={{ background: red[700] }}
                                        onClick={handleSubmit((carrera) => {
                                            let form = new FormData();
                                            form.append('nombre', carrera.nombre);
                                            form.append('contacto', carrera.contacto?.toString()!);
                                            form.append('portada', portada);
                                            openModal({
                                                titulo: '¿Continuar?',
                                                content: 'Una nueva carrera se agregará',
                                                callback: async () => {
                                                    setLoad(true);
                                                    let res = await axios.post('/api/carrera/crear', form);
                                                    if (!res.data.error) {
                                                        router.back();
                                                        router.refresh();
                                                        setLoad(false);
                                                    }
                                                    return res.data.mensaje;
                                                }
                                            });
                                        })} >Añadir carrera</Button>
                                </Grid>
                            </Grid>
                        </Panel>
                    </Grid>
                </Grid>
            </Box>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={load}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>

    )
}