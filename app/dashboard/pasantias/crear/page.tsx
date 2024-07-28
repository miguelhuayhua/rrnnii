'use client';
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Autocomplete, Box, Breadcrumbs, Grid, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft, MdOutlineAttachFile } from "react-icons/md";
import { BoxSombra } from "../../componentes/Mostrar";
import { DatePickerBox, InputBox } from "@/app/componentes/Datos";
import { BsFileEarmarkPdfFill, BsImageAlt } from "react-icons/bs";
import { Controller, useForm } from "react-hook-form";
import { Institucion, Pasantia } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { axiosInstance } from "@/globals";
import { useEffect, useState } from "react";
import Image from 'next/legacy/image';
import { ChipBox } from "@/app/componentes/Mostrar";
import { FaFileWord } from "react-icons/fa6";
import { useSnackbar } from "@/providers/SnackbarProvider";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/app/skeletons/EditorSkeleton";
import { grey, red } from "@mui/material/colors";
export default function Page() {
    const { control, formState: { errors }, handleSubmit, watch, setValue } = useForm<Pasantia & { Institucion: Institucion }>({
        defaultValues: { modalidad: '3', titulo: '', descripcion: '', Institucion: { nombre: '' } }, shouldFocusError: true
    });
    const router = useRouter();
    const { openModal } = useModal();
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>('');
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]));
            setPortada(plainFiles[0]);
        }
    });
    const PDFPicker = useFilePicker({
        readAs: 'DataURL',
        accept: '.pdf, .doc, .docx',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setDocumento(plainFiles[0]);
            setValue('pdf', plainFiles[0].name);
        }
    });
    const { openSnackbar } = useSnackbar();
    const onSubmit = (pasantia: Pasantia & { Institucion: Institucion }) => {
        let form = new FormData();
        form.append('titulo', pasantia.titulo);
        form.append('pdf', pasantia.pdf);
        form.append('descripcion', pasantia.descripcion);
        form.append('portada', portada);
        form.append('documento', documento);
        form.append('modalidad', pasantia.modalidad);
        form.append('finalizacion', pasantia.finalizacion!);
        form.append('institucion', pasantia.Institucion.nombre);
        if (portada) {
            openModal({
                titulo: '¿Continuar?',
                content: 'Una nueva pasantia se agregará',
                callback: async () => {
                    let res = await axiosInstance.post('/api/pasantia/crear', form);
                    if (!res.data.error) {
                        router.back();
                        router.refresh();
                    }
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
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }}>
            <BotonSimple
                startIcon={<MdArrowLeft fontSize={20} />}
                onClick={() => router.back()}>
                Regresar
            </BotonSimple>
            <Titulo sx={{ mt: 1 }}>
                Crear nueva pasantía
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/pasantias">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/pasantias">
                    <Normal>Pasantias</Normal>
                </Link>
                <Normal>Crear</Normal>
            </Breadcrumbs>
            <Grid container spacing={2} px={{ xs: 0, md: 10, lg: 20, xl: 30 }} py={4}>
                <Grid item xs={12} md={6} lg={4}>
                    <BoxSombra p={2}>
                        <Box sx={{
                            height: 200,
                            bgcolor: grey[200],
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
                        <Box sx={{
                            p: 2,
                            border: `1px solid ${grey[500]}`,
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
                                    <BsFileEarmarkPdfFill fontSize={20} color={'#e62c31'} /> : <FaFileWord fontSize={20} color='#1951b2' />}
                                    sx={{
                                        mt: 2,
                                        border: `1px solid ${documento.type.includes('pdf') ? '#e62c31' : '#1951b2'}`,
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
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} md={6} lg={8}>
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
                                            <Negrita sx={{ my: 1, color: '#888888', fontWeight: 600, fontSize: 14 }}>
                                                Descripción:
                                            </Negrita>
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
    )
}