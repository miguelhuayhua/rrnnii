'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { Box, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import { Institucion } from '@prisma/client';
import { BotonFilled } from '@/app/componentes/Botones';
import { Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { useFilePicker } from 'use-file-picker';
import { BsImageAlt } from 'react-icons/bs';
import { InputBox, SwitchBox } from '@/app/componentes/Datos';
import { axiosInstance } from '@/globals';
import { useModal } from '@/providers/ModalProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/legacy/image';
import { grey } from '@mui/material/colors';
import { useSnackbar } from '@/providers/SnackbarProvider';
interface Props {
    setInstitucion: any;
    Institucion: Institucion;
}
export default function ModalInstitucion({ setInstitucion, Institucion }: Props) {
    const theme = useTheme();
    const router = useRouter();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { control, formState: { errors }, handleSubmit, setValue, watch } = useForm<Institucion>({
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
            setValue('logo', URL.createObjectURL(plainFiles[0]));
            setPortada(plainFiles[0]);
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
                let res = await axiosInstance.post('/api/institucion/modificar', form);
                if (!res.data.error) {
                    setInstitucion(null);
                }
                return res.data.mensaje;
            }
        });
    }
    return (
        <Dialog
            open={!!Institucion}
            fullScreen={fullScreen}
            keepMounted={false}
            maxWidth='md'
            onClose={() => { setInstitucion(null) }}
        >
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <Titulo sx={{ fontSize: 20, mb: 3, textAlign: 'center' }}>
                    Información sobre el institucion
                </Titulo>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            height: 200,
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
                            <Normal sx={{ color: 'inherit', fontWeight: 600, mt: 1 }}>+ Subir logo</Normal>
                        </Box>
                        <Normal sx={{ fontSize: 13, textAlign: 'center', my: 3 }}>Permitido: .png, .jpeg, .jpg</Normal>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2} component='form' onSubmit={handleSubmit(onSubmit)}>
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

                            </Grid>
                            <Grid item xs={12} sm={6}>
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

                            <Grid item xs={12}>
                                <BotonFilled type="submit" sx={{ float: 'right' }}>Modificar Institucion</BotonFilled>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>

        </Dialog >
    );
}