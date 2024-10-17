'use client';
import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Autocomplete, Box, Breadcrumbs, Grid, LinearProgress, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft, MdOutlineAttachFile } from "react-icons/md";
import { DatePickerBox, InputBox } from "@/app/componentes/Datos";
import { BsFileEarmarkPdfFill, BsImageAlt } from "react-icons/bs";
import { Controller, useForm } from "react-hook-form";
import { Carrera, Institucion, Pasantia } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { axiosInstance } from "@/globals";
import { useEffect, useState } from "react";
import Image from 'next/legacy/image';
import { BoxSombra, ChipBox } from "@/app/componentes/Mostrar";
import { useSnackbar } from "@/providers/SnackbarProvider";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/app/skeletons/EditorSkeleton";
import { grey, red } from "@mui/material/colors";
import { RiFileWord2Line } from "react-icons/ri";
export default function Page() {
    const { control, formState: { errors }, handleSubmit, watch, setValue } = useForm<Pasantia & { Institucion: Institucion, carreras: string[] }>({
        defaultValues: { modalidad: '3', titulo: '', descripcion: '', Institucion: { nombre: '' }, carreras: [] }, shouldFocusError: true
    });
    const router = useRouter();
    const { openModal } = useModal();
    const [load, setLoad] = useState(false);
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>('');
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]));
            openSnackbar('Imagen modificada con éxito');
            setPortada(plainFiles[0]);
        }
    });
    const PDFPicker = useFilePicker({
        readAs: 'DataURL',
        accept: '.pdf, .doc, .docx',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setDocumento(plainFiles[0]);
            openSnackbar('Documento modificado con éxito');
            setValue('pdf', plainFiles[0].name);
        }
    });
    const { openSnackbar } = useSnackbar();
    const onSubmit = (pasantia: Pasantia & { Institucion: Institucion, carreras: string[] }) => {
        let form = new FormData();
        form.append('titulo', pasantia.titulo);
        form.append('pdf', pasantia.pdf);
        form.append('descripcion', pasantia.descripcion);
        form.append('portada', portada);
        form.append('documento', documento);
        form.append('modalidad', pasantia.modalidad);
        form.append('finalizacion', pasantia.finalizacion!);
        form.append('institucion', pasantia.Institucion.nombre);
        form.append('carreras', JSON.stringify(pasantia.carreras));
        if (portada) {
            openModal({
                titulo: '¿Continuar?',
                content: 'Una nueva pasantia se agregará',
                callback: async () => {
                    setLoad(true);
                    let res = await axiosInstance.post('/api/pasantia/crear', form);
                    if (!res.data.error) {
                        router.back();
                        router.refresh();
                    }
                    setLoad(false);
                    return res.data.mensaje;
                }
            });
        }
        else {
            openSnackbar('Por favor introduzca una imagen de referencia');;
        }
    }
    const [instituciones, setInstituciones] = useState([]);
    useEffect(() => {
        axiosInstance.post('/api/institucion/todo', { opcion: 'activo' }).then(res => {
            setInstituciones(res.data);
        })
    }, []);

    const [carreras, setCarreras] = useState<Carrera[]>([]);
    useEffect(() => {
        axiosInstance.post('/api/carrera/listar').then(res => {
            setCarreras(res.data);
        })
    }, []);
    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/pasantias">
                        <Normal>Pasantias</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>
                <Titulo sx={{ mb: 2 }}>
                    Crear nueva pasantía
                </Titulo>
                <BotonSimple
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </BotonSimple>
                <Grid container spacing={2} px={{ xs: 0, md: 5, lg: 10, xl: 5 }} py={4}>
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
                                    watch('imagen') ? <Image src={watch('imagen')} layout='fill' objectFit='cover' /> : null
                                }
                                <BsImageAlt color={'inherit'} fontSize={30} />
                                <Normal sx={{ color: 'inherit', fontWeight: 600, mt: 1 }}>+ Subir imagen</Normal>
                            </Box>
                            <Normal sx={{ fontSize: 13, textAlign: 'center', my: 3 }}>Permitido: .png, .jpeg, .jpg</Normal>
                            <Box px={{ xs: 2, sm: 0 }}>
                                <Box sx={{
                                    p: 2,
                                    border: `1px solid ${grey[400]}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderRadius: 3,
                                    color: grey[900],
                                    position: 'relative',
                                    transition: 'border .5s',
                                    "&:hover": {
                                        border: `1px solid ${red[300]}`
                                    }
                                }}
                                    onClick={() => PDFPicker.openFilePicker()}
                                >
                                    <Normal sx={{ fontSize: 15, color: 'inherit', fontWeight: 600 }}>PDF o Word de Referencia</Normal>
                                    <MdOutlineAttachFile style={{ fontSize: 20 }} />
                                </Box>
                                {
                                    documento ?
                                        <ChipBox icon={documento.type.includes('pdf') ?
                                            <BsFileEarmarkPdfFill fontSize={20} color={red[500]} /> : <RiFileWord2Line fontSize={20} color='#1951b2' />}
                                            sx={{
                                                mt: 2,
                                                border: `1px solid ${documento.type.includes('pdf') ? red[500] : '#1951b2'}`,
                                                height: 40,
                                                bgcolor: 'white'
                                            }}
                                            label={documento.name}
                                            onDelete={() => {
                                                setDocumento(null);
                                            }}
                                        />
                                        : null
                                }
                            </Box>
                        </BoxSombra>
                    </Grid>
                    <Grid item xs={12} sm={7} lg={8}>
                        <BoxSombra p={2} component='form' onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={6}>
                                    <Controller
                                        name="titulo"
                                        control={control}
                                        rules={{ required: 'Título es obligatorio' }}
                                        render={({ field: { ref, ...field } }) => (
                                            <InputBox
                                                {...field}
                                                label='Título'
                                                error={!!errors.titulo}
                                                helperText={errors.titulo?.message || 'Este es el título principal que será visible en el pasantia'}
                                                inputRef={ref}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="descripcion"
                                        control={control}
                                        render={({ field }) => (
                                            <Box>
                                                <Normal sx={{ fontSize: 16, mb: 1, fontWeight: 500 }} >
                                                    Descripción:
                                                </Normal>
                                                <Editor
                                                    value={field.value}
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': [2, 3, 4, 5, false] }],
                                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                                            ['link'],
                                                        ]
                                                    }}
                                                    preserveWhitespace
                                                    className="editor"
                                                    onChange={(value) => { field.onChange(value) }}
                                                />
                                            </Box>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Controller
                                        name="modalidad"
                                        control={control}
                                        render={({ field: { ref, ...field } }) => (
                                            <InputBox
                                                select
                                                label='Tiempo de duración'
                                                {...field}
                                                inputRef={ref}
                                                SelectProps={{
                                                    MenuProps: {
                                                        slotProps: {
                                                            paper: {
                                                                sx: {
                                                                    background: 'linear-gradient(25deg, rgba(255,245,245,1) 0%, rgba(255,255,255,1) 51%, rgba(255,255,255,1) 72%, rgba(244,247,255,1) 100%)',
                                                                    px: 0,
                                                                    borderRadius: 3,
                                                                    border: "1px solid #f1f1f1",
                                                                    boxShadow: '-10px 10px 30px #00000022',
                                                                    maxHeight: 400
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value='3'>3 meses</MenuItem>
                                                <MenuItem value='6'>6 meses</MenuItem>
                                            </InputBox>
                                        )}
                                    />
                                    <Controller
                                        name="carreras"
                                        control={control}
                                        rules={{
                                            validate: (value) => value.length > 0 || 'Seleccione al menos una carrera'
                                        }}
                                        render={({ field: { ref, ...field }, fieldState }) => (
                                            <InputBox
                                                {...field}
                                                label='Carreras'
                                                select
                                                inputRef={ref}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                SelectProps={{
                                                    multiple: true,
                                                    MenuProps: {
                                                        slotProps: {
                                                            paper: {
                                                                sx: {
                                                                    background: 'linear-gradient(25deg, rgba(255,245,245,1) 0%, rgba(255,255,255,1) 51%, rgba(255,255,255,1) 72%, rgba(244,247,255,1) 100%)',
                                                                    borderRadius: 3,
                                                                    border: "1px solid #f1f1f1",
                                                                    boxShadow: '-10px 10px 30px #00000022',
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            >
                                                {
                                                    carreras.map(value => (
                                                        <MenuItem key={value.id} value={value.id}>
                                                            {value.nombre}
                                                        </MenuItem>))
                                                }
                                            </InputBox>
                                        )}
                                    />
                                    <Controller
                                        name="Institucion.nombre"
                                        control={control}
                                        rules={{ required: 'Institución es obligatoria' }}
                                        render={({ field: { ref, ...field } }) => (
                                            <Autocomplete
                                                freeSolo
                                                multiple={false}
                                                onChange={(_, value) => field.onChange(value)}
                                                disableClearable
                                                options={instituciones.map((value: Institucion) => value.nombre)}
                                                renderInput={(params) =>
                                                    <InputBox
                                                        sx={{ mt: 2 }}
                                                        error={!!errors.Institucion?.nombre}
                                                        helperText={errors.Institucion?.nombre?.message || 'Es importante involucrar la institución que ofrece la pasantía'}
                                                        {...params}
                                                        {...field}
                                                        label='Institución'
                                                    />}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="finalizacion"
                                        rules={{ required: 'Finalización es obligatoria' }}
                                        control={control}
                                        render={({ field: { ref, ...field } }) => (
                                            <DatePickerBox
                                                sx={{ mt: 2 }}
                                                onChange={(ev: any) => {
                                                    field.onChange(ev?.format('DD/MM/YYYY'))
                                                }}
                                                disablePast
                                                slotProps={{
                                                    textField: {
                                                        error: !!errors.finalizacion,
                                                        helperText: errors.finalizacion?.message,
                                                        inputRef: ref,
                                                        label: 'Finalización del pasantia',
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <BotonFilled type="submit" sx={{ float: 'right' }}>Crear Pasantia</BotonFilled>
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