'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { Box, Grid, LinearProgress } from '@mui/material';
import { Institucion } from '@prisma/client';
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
        <Dialog
            open={!!Institucion}
            keepMounted={false}
            maxWidth='md'
            onClose={() => { setInstitucion(null) }}
        >
            {load ? <LinearProgress style={{ position: 'absolute', top: 0, left: 0, width: "100%" }} /> : null}
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <BotonSimple onClick={() => setInstitucion(null)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>
                <Titulo sx={{ fontSize: 20, mb: 3, pr: 4 }}>
                    Información sobre {Institucion.nombre}
                </Titulo>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box px={{ xs: 10, sm: 0 }}>
                            <Box sx={{
                                aspectRatio: 1,
                                bgcolor: grey[100],
                                p: 1,
                                border: `1px dashed ${grey[400]}`,
                                flexDirection: 'column',
                                borderRadius: 5,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: grey[900],
                                transition: 'color 0.25s',
                                position: 'relative',
                                overflow: 'hidden',
                                "&:hover": {
                                    color: grey[500],
                                    cursor: 'pointer'
                                }
                            }}
                                onClick={() => openFilePicker()}
                            >
                                {
                                    watch('logo') ? <Image src={watch('logo')} layout='fill' objectFit='cover' /> : null
                                }
                                <BsImageAlt color={'inherit'} fontSize={30} />
                                <Normal sx={{ color: 'inherit', fontWeight: 600, mt: 1 }}>+ Subir imagen</Normal>
                            </Box>
                        </Box>
                        <Normal sx={{ fontSize: 13, textAlign: 'center', my: 3 }}>Permitido: .png, .jpeg, .jpg</Normal>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="nombre"
                            control={control}
                            rules={{ required: 'Nombre es obligatorio' }}
                            render={({ field: { ref, ...field } }) => (
                                <InputBox
                                    {...field}
                                    label='Título'
                                    error={!!errors.nombre}
                                    helperText={errors.nombre?.message || 'Este es el título principal que será visible en el institucion'}
                                    inputRef={ref}
                                />
                            )}
                        />
                        <Controller
                            name="contacto"
                            control={control}
                            render={({ field: { ref, ...field } }) => (
                                <InputBox
                                    {...field}
                                    label='Contacto'
                                    inputRef={ref}
                                />
                            )}
                        />
                    </Grid>
                    {
                        isDirty ?
                            <Grid item xs={12}>
                                <BotonFilled sx={{ float: 'right' }} onClick={handleSubmit(onSubmit)} >
                                    Modificar Institución
                                </BotonFilled>
                            </Grid> : null
                    }
                </Grid>
            </DialogContent>
        </Dialog >
    );
}