'use client';
import { BotonFilled, BotonOutline } from "@/app/componentes/Botones";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { BoxSombra } from "../../componentes/Mostrar";
import { InputBox } from "@/app/componentes/Datos";
import { BsImageAlt } from "react-icons/bs";
import { Controller, useForm } from "react-hook-form";
import { Institucion } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { axiosInstance } from "@/globals";
import { useState } from "react";
import Image from 'next/legacy/image';
import { parseNumber } from "@/utils/data";

export default function Page() {
    const { control, formState: { errors }, handleSubmit, setValue, watch } = useForm<Institucion & { Institucion: Institucion }>({
        defaultValues: { nombre: '', logo: '' }, shouldFocusError: true
    });
    const router = useRouter();
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
        form.append('portada', portada);
        openModal({
            titulo: '¿Continuar?',
            content: 'Una nueva institucion se agregará',
            callback: async () => {
                let res = await axiosInstance.post('/api/institucion/crear', form);
                if (!res.data.error) {
                    router.back();
                    router.refresh();
                }
                return res.data.mensaje;
            }
        });
    }
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }}>
            <BotonOutline onClick={() => router.back()}>
                <MdArrowLeft fontSize={20} /> Volver
            </BotonOutline>
            <Titulo sx={{ fontSize: 20, mt: 1 }}>
                Añadir institucion
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/institucions">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/institucions">
                    <Normal>Instituciones</Normal>
                </Link>
                <Normal>Crear</Normal>
            </Breadcrumbs>
            <Grid container spacing={2} px={{ xs: 0, md: 10, lg: 20, xl: 30 }} py={4}>
                <Grid item xs={12} md={6} lg={4}>
                    <BoxSombra p={2}>
                        <Box sx={{
                            height: 200,
                            bgcolor: '#f6f7f9',
                            p: 1,
                            border: '1px dashed #ddd',
                            flexDirection: 'column',
                            borderRadius: 5,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#919eab',
                            transition: 'color 0.25s',
                            position: 'relative',
                            overflow: 'hidden',
                            "&:hover": {
                                color: '#919eab77',
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
                        <Typography sx={{ fontSize: 13, color: '#a6b0bb', textAlign: 'center', my: 1, fontWeight: 500 }}>Permitido: .png, .jpeg, .jpg</Typography>


                    </BoxSombra>
                </Grid>
                <Grid item xs={12} md={6} lg={8}>
                    <BoxSombra p={2} component='form' onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={6}>
                                <Controller
                                    name="nombre"
                                    control={control}
                                    rules={{ required: 'Nombre es obligatorio' }}
                                    render={({ field: { ref, ...field } }) => (
                                        <InputBox
                                            {...field}
                                            label='Nombre'
                                            error={!!errors.nombre}
                                            helperText={errors.nombre?.message || 'Este es el título principal que será visible en el institucion'}
                                            inputRef={ref}
                                        />
                                    )}
                                />

                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Controller
                                    name="contacto"
                                    control={control}
                                    render={({ field: { ref, ...field } }) => (
                                        <InputBox
                                            {...field}
                                            label='Contacto'
                                            inputRef={ref}
                                            onChange={(ev) => field.onChange(parseNumber(ev.target.value))}
                                        />
                                    )}
                                />

                            </Grid>

                            <Grid item xs={12}>
                                <BotonFilled type="submit" sx={{ float: 'right' }}>Crear Institucion</BotonFilled>
                            </Grid>
                        </Grid>
                    </BoxSombra>
                </Grid>
            </Grid>
        </Box>
    )
}