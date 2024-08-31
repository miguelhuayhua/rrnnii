'use client';
import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, LinearProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { BsImageAlt } from "react-icons/bs";
import { Controller, useForm } from "react-hook-form";
import { Institucion } from "@prisma/client";
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { axiosInstance } from "@/globals";
import { useState } from "react";
import Image from 'next/legacy/image';
import { parseNumber } from "@/utils/data";
import { grey } from "@mui/material/colors";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { InputBox } from "@/app/componentes/Datos";

export default function Page() {
    const { openSnackbar } = useSnackbar();
    const { control, formState: { errors }, handleSubmit, setValue, watch } = useForm<Institucion & { Institucion: Institucion }>({
        defaultValues: { nombre: '', logo: '' }, shouldFocusError: true
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
                let res = await axiosInstance.post('/api/institucion/crear', form);
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
                <BotonSimple
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </BotonSimple>
                <Titulo sx={{ mt: 1 }}>
                    Añadir institución
                </Titulo>
                <Breadcrumbs >
                    <Link href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link href="/dashboard/instituciones">
                        <Normal>Instituciones</Normal>
                    </Link>
                    <Normal>Crear</Normal>
                </Breadcrumbs>
                <Grid container spacing={2} px={{ xs: 0, md: 10, lg: 20, xl: 30 }} py={4}>
                    <Grid item xs={12} sm={5} lg={4}>
                        <Box px={{ xs: 12, sm: 0 }}>
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

                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={7} lg={8}>
                        <Box px={2} component='form' onSubmit={handleSubmit(onSubmit)}>
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
                                                helperText={errors.nombre?.message || 'Este es el título principal que será visible para la institución'}
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
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            {load ? <LinearProgress style={{ position: 'absolute', top: 0, left: 0, width: "100%" }} /> : null}
        </>
    )
}