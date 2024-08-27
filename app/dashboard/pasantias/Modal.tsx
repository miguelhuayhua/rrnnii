'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Autocomplete, Box, Grid, LinearProgress, MenuItem, useTheme } from '@mui/material';
import { Carrera, Institucion, Pasantia, PasantiaCarrera } from '@prisma/client';
import { BotonFilled, BotonSimple } from '@/app/componentes/Botones';
import { Negrita, Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { BsFileEarmarkPdfFill, BsImageAlt } from 'react-icons/bs';
import { DatePickerBox, InputBox } from '@/app/componentes/Datos';
import { MdOutlineAttachFile } from 'react-icons/md';
import { axiosInstance } from '@/globals';
import { useModal } from '@/providers/ModalProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/legacy/image';
import { ChipBox } from '@/app/componentes/Mostrar';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import { grey, red } from '@mui/material/colors';
import { RiFileWord2Line } from 'react-icons/ri';
import { useSnackbar } from '@/providers/SnackbarProvider';
interface Props {
    setPasantia: any;
    Pasantia: Pasantia & { PasantiaCarrera: PasantiaCarrera[] };
}
export default function ModalPasantia({ setPasantia, Pasantia }: Props) {
    const router = useRouter();
    const { openSnackbar } = useSnackbar();
    const [load, setLoad] = useState(false);
    const { control, formState: { errors, isDirty }, handleSubmit, watch, setValue } = useForm<Pasantia & { PasantiaCarrera: PasantiaCarrera[], Institucion: Institucion, carreras: string[] }>({
        defaultValues: { ...Pasantia, carreras: Pasantia.PasantiaCarrera.map(value => value.carreraId) }, shouldFocusError: true
    });
    const { openModal } = useModal();
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>('');
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]), { shouldDirty: true });
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
            setValue('pdf', plainFiles[0].name, { shouldDirty: true });
            openSnackbar('Documento modificado con éxito');
        }
    });
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    useEffect(() => {
        axiosInstance.post('/api/carrera/listar').then(res => {
            setCarreras(res.data);
        })
    }, []);
    const onSubmit = (pasantia: Pasantia & { Institucion: Institucion, carreras: string[] }) => {
        let form = new FormData();
        form.append('titulo', pasantia.titulo);
        form.append('pdf', pasantia.pdf);
        form.append('descripcion', pasantia.descripcion);
        form.append('portada', portada);
        form.append('documento', documento);
        form.append('finalizacion', pasantia.finalizacion!);
        form.append('id', pasantia.id);
        form.append('modalidad', pasantia.modalidad);
        form.append('institucion', pasantia.Institucion.nombre);
        form.append('carreras', JSON.stringify(pasantia.carreras));
        openModal({
            titulo: '¿Continuar?',
            content: 'La pasantía se modificará',
            callback: async () => {
                setLoad(true);
                let res = await axiosInstance.post('/api/pasantia/modificar', form);
                if (!res.data.error) {
                    setPasantia(null);
                    router.refresh();
                    setLoad(false);
                }
                return res.data.mensaje;
            }
        });
    }
    const [instituciones, setInstituciones] = useState([]);
    useEffect(() => {
        axiosInstance.post('/api/institucion/todo', { opcion: 'activo' }).then(res => {
            setInstituciones(res.data);
        })
    }, []);
    return (
        <Dialog
            open={!!Pasantia}
            keepMounted={false}
            maxWidth='md'
            onClose={() => { setPasantia(null) }}
        >
            {load ? <LinearProgress style={{ position: 'absolute', top: 0, left: 0, width: "100%" }} /> : null}
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <BotonSimple onClick={() => setPasantia(null)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>
                <Titulo sx={{ fontSize: 20, mb: 3, pr: 4 }}>
                    Información sobre {Pasantia.titulo}
                </Titulo>
                <Grid container spacing={2}>
                    <Grid item xs={12} mx='auto' sm={6}>
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
                                    watch('imagen') ? <Image src={watch('imagen')} layout='fill' objectFit='cover' /> : null
                                }
                                <BsImageAlt color={'inherit'} fontSize={30} />
                                <Normal sx={{ color: 'inherit', fontWeight: 600, mt: 1 }}>+ Subir imagen</Normal>
                            </Box>
                        </Box>
                        <Normal sx={{ fontSize: 13, textAlign: 'center', my: 3 }}>Permitido: .png, .jpeg, .jpg</Normal>
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
                                    <BsFileEarmarkPdfFill fontSize={20} color={'#e62c31'} /> : <RiFileWord2Line fontSize={20} color='#1951b2' />}
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
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="titulo"
                            control={control}
                            rules={{ required: 'Título es obligatorio' }}
                            render={({ field: { ref, ...field } }) => (
                                <InputBox
                                    {...field}
                                    label='Título'
                                    error={!!errors.titulo}
                                    helperText={errors.titulo?.message || 'Este es el título principal que será visible en el Pasantia'}
                                    inputRef={ref}
                                />
                            )}
                        />
                        <Controller
                            name="descripcion"
                            control={control}
                            render={({ field }) => (
                                <Box mb={2}>
                                    <Negrita sx={{ my: 1, fontWeight: 600, fontSize: 14 }}>
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
                                            <MenuItem value={value.id}>
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
                                    value={field.value}
                                    disableClearable
                                    onChange={(_, value) => field.onChange(value)}
                                    options={instituciones.map((value: Institucion) => value.nombre)}
                                    renderInput={(params) =>
                                        <InputBox
                                            error={!!errors.Institucion?.nombre}
                                            helperText={errors.Institucion?.nombre?.message || 'Es importante involucrar la institución que ofrece la pasantía'}
                                            sx={{ mt: 2 }}
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
                                    defaultValue={dayjs(field.value, 'DD/MM/YYYY')}
                                    slotProps={{
                                        textField: {
                                            inputRef: ref,
                                            label: 'Finalización del Pasantia',
                                        }
                                    }}
                                />
                            )}
                        />

                    </Grid>
                    {
                        isDirty ?
                            <Grid item xs={12}>
                                <BotonFilled
                                    sx={{ float: 'right' }}
                                    onClick={handleSubmit(onSubmit)} >Modificar Pasantia</BotonFilled>
                            </Grid> : null
                    }
                </Grid>
            </DialogContent>

        </Dialog >
    );
}