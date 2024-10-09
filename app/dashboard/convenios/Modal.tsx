'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Grid, MenuItem, LinearProgress, ListSubheader } from '@mui/material';
import { Carrera, Convenio, ConvenioCarrera, Institucion } from '@prisma/client';
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
import Image from 'next/legacy/image';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import { grey, red } from '@mui/material/colors';
import { IoClose } from 'react-icons/io5';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { ChipBox } from '@/app/componentes/Mostrar';
import { RiFileWord2Line } from 'react-icons/ri';
import axios from 'axios';
import { Icon as Iconify } from '@iconify/react';
import { fileDomain, paises } from '@/utils/globals';
interface Props {
    setConvenio: any;
    Convenio: Convenio & { ConvenioCarrera: ConvenioCarrera[] };
    setConvenios: any;
    setPrevConvenios: any;
    setOpcion: any;
}
export default function ModalConvenio({ setConvenio, setOpcion, Convenio, setConvenios, setPrevConvenios }: Props) {
    const { control, formState: { errors, isDirty }, handleSubmit, setValue, watch } =
        useForm<Convenio & { Institucion: Institucion, ConvenioCarrera: ConvenioCarrera[], carreras: string[] }>({
            defaultValues: { ...Convenio, carreras: Convenio.ConvenioCarrera.map(value => value.carreraId) }, shouldFocusError: true
        });
    const { openModal } = useModal();
    const [portada, setPortada] = useState<any>('');
    const [load, setLoad] = useState(false);
    const [documento, setDocumento] = useState<any>('');
    const { openSnackbar } = useSnackbar();
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]), { shouldDirty: true });
            setPortada(plainFiles[0]);
            openSnackbar('Imagen actualizada con éxito');
        }
    });
    const PDFPicker = useFilePicker({
        readAs: 'DataURL',
        accept: '.pdf, .doc, .docx',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setDocumento(plainFiles[0]);
            setValue('pdf', plainFiles[0].name, { shouldDirty: true });
            openSnackbar('Documento actualizado con éxito');
        }
    });
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    useEffect(() => {
        axiosInstance.post('/api/carrera/listar').then(res => {
            setCarreras(res.data);
        })
    }, []);
    const onSubmit = (convenio: Convenio & { Institucion: Institucion, ConvenioCarrera: ConvenioCarrera[], carreras: string[] }) => {
        let form = new FormData();
        form.append('titulo', convenio.titulo);
        form.append('tipo', convenio.tipo);
        form.append('pdf', convenio.pdf);
        form.append('descripcion', convenio.descripcion);
        form.append('finalizacion', convenio.finalizacion!);
        form.append('institucion', convenio.Institucion.nombre);

        form.append('continente', convenio.continente);
        form.append('pais', convenio.pais);
        form.append('logo', convenio.Institucion.logo!);
        form.append('portada', portada);
        form.append('documento', documento);
        form.append('id', convenio.id);
        form.append('carreras', JSON.stringify(convenio.carreras));
        form.append('convenioCarrera', JSON.stringify(convenio.carreras.map(carreraId => {
            return { carreraId, id: convenio.ConvenioCarrera.find(value => value.carreraId == carreraId)?.id || '' }
        })))
        openModal({
            titulo: '¿Continuar?',
            content: 'El convenio será modificado',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/convenio/modificar', form);
                if (!res.data.error) {
                    setConvenio(null);
                    axios.post('/api/convenio/todo', {}).then(res => {
                        setConvenios(res.data);
                        setPrevConvenios(res.data);
                        setOpcion('todo');
                    });
                }
                setLoad(false);
                return res.data.mensaje;
            }
        });
    }
    const [instituciones, setInstituciones] = useState([]);
    useEffect(() => {
        axios.post('/api/institucion/todo', { opcion: 'activo' }).then(res => {
            setInstituciones(res.data);
        })
    }, []);
    return (
        <Dialog
            open={!!Convenio}
            keepMounted={false}
            maxWidth='md'
            onClose={() => { setConvenio(null) }}
        >
            {load ? <LinearProgress style={{ position: 'absolute', top: 0, left: 0, width: "100%", zIndex: 10 }} /> : null}
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <BotonSimple onClick={() => setConvenio(null)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>
                <Titulo sx={{ fontSize: 20, mb: 3, pr: 4 }}>
                    Información sobre {Convenio.titulo}
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
                                    watch('imagen') ?
                                        <Image src={(portada ? '' : fileDomain) + watch('imagen')} layout='fill' objectFit='cover' />
                                        : null
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
                                    helperText={errors.titulo?.message || 'Este es el título principal que será visible en el convenio'}
                                    inputRef={ref}
                                />
                            )}
                        />
                        <Controller
                            name="descripcion"
                            control={control}
                            render={({ field }) => (
                                <Box mb={2}>
                                    <Negrita sx={{ my: 1 }}>
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
                            name="Institucion.nombre"
                            control={control}
                            rules={{ required: 'Institución no puede quedar vacío' }}
                            render={({ field: { ref, ...field } }) => (
                                <Autocomplete
                                    freeSolo
                                    multiple={false}
                                    onChange={(_, value) => field.onChange(value)}
                                    disableClearable
                                    value={field.value}
                                    options={instituciones.map((value: Institucion) => value.nombre)}
                                    renderInput={(params) =>
                                        <InputBox
                                            {...params}
                                            {...field}
                                            error={!!errors.Institucion?.nombre}
                                            helperText={errors.Institucion?.nombre?.message}
                                            label='Institución'
                                        />}
                                />
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
                            name="finalizacion"
                            control={control}
                            rules={{ required: 'Finalización de convenio requerida' }}
                            render={({ field: { ref, ...field } }) => (
                                <DatePickerBox
                                    sx={{ mt: 2 }}
                                    value={dayjs(field.value, 'DD/MM/YYYY')}
                                    disablePast
                                    onChange={(ev: any) => {
                                        field.onChange(ev?.format('DD/MM/YYYY'))
                                    }}
                                    slotProps={{
                                        textField: {
                                            inputRef: ref,
                                            label: 'Finalización del convenio',
                                            error: !!errors.finalizacion,
                                            helperText: errors.finalizacion?.message
                                        }
                                    }}
                                />
                            )}
                        />
                        {
                            watch('tipo') != 'nacional' ?
                                <Controller
                                    name="pais"
                                    control={control}
                                    rules={{ required: 'País requerido' }}
                                    render={({ field: { ref, ...field } }) => (
                                        <InputBox
                                            select
                                            sx={{ '.MuiSelect-select': { display: 'flex', alignItems: 'center' } }}
                                            label='País'
                                            {...field}
                                            onChange={ev => {
                                                field.onChange(ev.target.value);
                                                if (paises.africa.findIndex(value => value.value == ev.target.value) > -1) {
                                                    setValue('continente', 'AF');
                                                }
                                                else if (paises.americaSur.findIndex(value => value.value == ev.target.value) > -1) {
                                                    setValue('continente', 'SA');
                                                }
                                                else if (paises.americaNorte.findIndex(value => value.value == ev.target.value) > -1) {
                                                    setValue('continente', 'NA');
                                                }
                                                else if (paises.europa.findIndex(value => value.value == ev.target.value) > -1) {
                                                    setValue('continente', 'EU');
                                                }
                                                else if (paises.asia.findIndex(value => value.value == ev.target.value) > -1) {
                                                    setValue('continente', 'AS');
                                                }
                                                else if (paises.oceania.findIndex(value => value.value == ev.target.value) > -1) {
                                                    setValue('continente', 'OC');
                                                }
                                            }}
                                            inputRef={ref}
                                            SelectProps={{
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
                                            <ListSubheader>América del norte</ListSubheader>
                                            {
                                                paises.americaNorte.map(value => (
                                                    <MenuItem value={value.value}>
                                                        <Iconify style={{ marginRight: 5 }} icon={`flagpack:${value.value.toLowerCase()}`} />
                                                        {value.pais}</MenuItem>
                                                ))
                                            }
                                            <ListSubheader>América del sur</ListSubheader>
                                            {
                                                paises.americaSur.map(value => (
                                                    <MenuItem value={value.value}>
                                                        <Iconify style={{ marginRight: 5 }} icon={`flagpack:${value.value.toLowerCase()}`} />
                                                        {value.pais}</MenuItem>
                                                ))
                                            }
                                            <ListSubheader>Europa</ListSubheader>
                                            {
                                                paises.europa.map(value => (
                                                    <MenuItem value={value.value}>
                                                        <Iconify style={{ marginRight: 5 }} icon={`flag:${value.value.toLowerCase()}-4x3`} />
                                                        {value.pais}</MenuItem>
                                                ))
                                            }
                                            <ListSubheader>Asia</ListSubheader>
                                            {
                                                paises.asia.map(value => (
                                                    <MenuItem value={value.value}>
                                                        <Iconify style={{ marginRight: 5 }} icon={`flag:${value.value.toLowerCase()}-4x3`} />
                                                        {value.pais}</MenuItem>
                                                ))
                                            }
                                            <ListSubheader>África</ListSubheader>
                                            {
                                                paises.africa.map(value => (
                                                    <MenuItem value={value.value}>
                                                        <Iconify style={{ marginRight: 5 }} icon={`flag:${value.value.toLowerCase()}-4x3`} />
                                                        {value.pais}</MenuItem>
                                                ))
                                            }
                                            <ListSubheader>Oceanía</ListSubheader>
                                            {
                                                paises.oceania.map(value => (
                                                    <MenuItem value={value.value}>
                                                        <Iconify style={{ marginRight: 5 }} icon={`flag:${value.value.toLowerCase()}-4x3`} />
                                                        {value.pais}</MenuItem>
                                                ))
                                            }
                                        </InputBox>
                                    )}
                                />
                                : null
                        }
                        <Controller
                            name="tipo"
                            control={control}
                            render={({ field: { ref, ...field } }) => (
                                <InputBox
                                    sx={{ mt: 1 }}
                                    select
                                    label='Tipo de convenio'
                                    {...field}
                                    inputRef={ref}
                                    SelectProps={{
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
                                    <MenuItem value='nacional'>Nacional</MenuItem>
                                    <MenuItem value='internacional'>Internacional</MenuItem>
                                </InputBox>
                            )}
                        />
                    </Grid>
                    {
                        isDirty ?
                            <Grid item xs={12}>
                                <BotonFilled onClick={handleSubmit(onSubmit)} sx={{ float: 'right' }}>Modificar Convenio</BotonFilled>
                            </Grid> : null
                    }
                </Grid>
            </DialogContent>

        </Dialog >
    );
}