'use client';
import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, LinearProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { InputBox } from "@/app/componentes/Datos";
import { BsImageAlt } from "react-icons/bs";
import { Controller, useForm } from "react-hook-form";
import { Carrera, Institucion } from "@prisma/client";
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { axiosInstance } from "@/globals";
import { useState } from "react";
import Image from 'next/legacy/image';
import { parseNumber } from "@/utils/data";
import { grey } from "@mui/material/colors";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { BoxSombra } from "@/app/componentes/Mostrar";
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

    const onSubmit = (carrera: Institucion) => {
        let form = new FormData();
        form.append('nombre', carrera.nombre);
        form.append('contacto', carrera.contacto?.toString()!);
        form.append('portada', portada);
        openModal({
            titulo: '¿Continuar?',
            content: 'Una nueva carrera se agregará',
            callback: async () => {
                setLoad(true);
                let res = await axiosInstance.post('/api/carrera/crear', form);
                if (!res.data.error) {
                    router.back();
                    router.refresh();
                    setLoad(false);
                }
                return res.data.mensaje;
            }
        });
    }
    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ mb: 1 }} >
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

                <BotonSimple
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </BotonSimple>
                <Grid container spacing={2} px={{ xs: 0, md: 10, lg: 20, xl: 5 }} py={4}>
                    <Grid item xs={12} sm={5} lg={4}>
                        <BoxSombra p={2}>
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
                            <Normal sx={{ fontSize: 13, textAlign: 'center', my: 3 }}>Permitido: .png, .jpeg, .jpg</Normal>
                        </BoxSombra>
                    </Grid>
                    <Grid item xs={12} sm={7} lg={8}>
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
                                                helperText={errors.nombre?.message || 'Este es el título principal que será visible en el carrera'}
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
                                    <BotonFilled type="submit" sx={{ float: 'right' }}>Añadir carrera</BotonFilled>
                                </Grid>
                            </Grid>
                        </BoxSombra>
                    </Grid>
                </Grid>
            </Box>
            {load ? <LinearProgress style={{ position: 'absolute', top: 0, width: "100%" }} /> : null}
        </>

    )
}