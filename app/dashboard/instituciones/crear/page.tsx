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
import { BsImageAlt } from "react-icons/bs";
import { Controller, useForm } from "react-hook-form";
import { Institucion } from "@prisma/client";
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { useState } from "react";
import Image from 'next/legacy/image';
import { parseNumber } from "@/utils/data";
import { Icon } from '@iconify/react';
import { useSnackbar } from "@/providers/SnackbarProvider";
import { InputBox } from "@/app/componentes/Datos";
import { BoxSombra } from "@/app/componentes/Mostrar";
import { FaYoutube } from "react-icons/fa";
import { TbWorldWww } from "react-icons/tb";
import axios from "axios";
import { Button, Form, Input, InputNumber, Panel, Text } from "rsuite";

export default function Page() {
    const { openSnackbar } = useSnackbar();
    const { control, handleSubmit, setValue, watch } = useForm<Institucion & { Institucion: Institucion }>({
        defaultValues: { nombre: '', logo: '', video: '' }, shouldFocusError: true
    });
    const router = useRouter();
    const { openModal } = useModal();
    const [load, setLoad] = useState(false);
    const [portada, setPortada] = useState<any>('');
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('logo', URL.createObjectURL(plainFiles[0]));
            setPortada(plainFiles[0]);
            openSnackbar('Logo agregado con éxito');
        }
    });

    const onSubmit = (institucion: Institucion) => {
        let form = new FormData();
        form.append('nombre', institucion.nombre);
        form.append('contacto', institucion.contacto?.toString()!);
        form.append('portada', portada);
        openModal({
            titulo: '¿Continuar?',
            content: 'Una nueva institucion se agregará',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/institucion/crear', form);
                if (!res.data.error) {
                    router.back();
                    router.refresh();
                }
                setLoad(false);
                return res.data.mensaje;
            }
        });
    }
    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/instituciones">
                        <Normal>Instituciones</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>
                <Titulo sx={{ mb: 2 }}>
                    Añadir institución
                </Titulo>
                <Button
                    size='lg'
                    appearance="subtle"
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </Button>
                <Grid container spacing={2} px={{ xs: 0, md: 5, lg: 10, xl: 5 }} py={4}>
                    <Grid item xs={12} sm={5} lg={4}>
                        <Panel shaded style={{ padding: 16, background: 'white' }}>
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
                        <BoxSombra p={2} component='form' onSubmit={handleSubmit(onSubmit)}>
                            <Grid container columnSpacing={2}>
                                <Grid item xs={12} lg={6}>
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
                                <Grid item xs={12}>
                                    <Button size="lg"
                                        appearance="primary"
                                        onClick={handleSubmit(onSubmit)}>
                                        Crear Institucion</Button>
                                </Grid>
                            </Grid>
                        </BoxSombra>
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