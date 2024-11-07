'use client';
import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, CircularProgress, Backdrop, MenuItem, IconButton } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DatePickerBox, InputBox } from "@/app/componentes/Datos";
import { Controller, useForm } from "react-hook-form";
import { Persona, Usuario } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
import { useModal } from "@/providers/ModalProvider";
import { useState } from "react";
import { BoxSombra } from "@/app/componentes/Mostrar";
import dayjs from "dayjs";
import axios from "axios";
import { MdArrowLeft, MdVisibility, MdVisibilityOff } from "react-icons/md";
export default function Page() {
    const { control,
        watch,
        setError, clearErrors, handleSubmit } = useForm<Persona & { Usuario: Usuario & { password2: string } }>({
            defaultValues: {
                nombre: '', paterno: '', materno: '',
                cargo: '', f_nacimiento: dayjs().format('DD/MM/YYYY'),
                Usuario: {
                    rol: 'usuario',
                    usuario: '',
                    password: ''
                }
            }, shouldFocusError: true
        });
    const router = useRouter();
    const { openModal } = useModal();
    const [load, setLoad] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    return (
        <>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={load}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ mb: 1 }} >
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/pasantias">
                        <Normal>Personal</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>

                <Titulo sx={{ mb: 2 }}>
                    Crear nuevo personal
                </Titulo>
                <BotonSimple
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </BotonSimple>

                <Grid container spacing={2} px={{ xs: 0, md: 10, lg: 20, xl: 5 }} mt={2}>

                    <Grid item xs={12} sm={6}>
                        <BoxSombra p={2}>

                            <Controller
                                name="nombre"
                                control={control}
                                rules={{ required: 'Nombre es obligatorio' }}
                                render={({ field: { ref, ...field }, fieldState }) => (
                                    <InputBox
                                        {...field}
                                        label='Nombre'
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        inputRef={ref}
                                    />
                                )}
                            />
                            <Controller
                                name="paterno"
                                control={control}
                                render={({ field }) => (
                                    <InputBox
                                        {...field}
                                        label='Ap. Paterno'
                                    />
                                )}
                            />
                            <Controller
                                name="materno"
                                control={control}
                                render={({ field }) => (
                                    <InputBox
                                        {...field}
                                        label='Ap. Materno'
                                    />
                                )}
                            />
                            <Controller
                                name="ci"
                                control={control}
                                rules={{ required: 'C.I. es requerido' }}
                                render={({ field: { ref, ...field }, fieldState }) => (
                                    <InputBox
                                        {...field}
                                        label='Carnet de identidad'
                                        inputRef={ref}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="f_nacimiento"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                    <DatePickerBox
                                        disableFuture
                                        inputRef={ref}
                                        label='Fecha de nacimiento'
                                        onChange={ev => {
                                            field.onChange(ev?.format('DD/MM/YYYY'))
                                        }}
                                        value={dayjs(field.value, 'DD/MM/YYYY')}
                                    />
                                )}
                            />
                            <Controller
                                name="cargo"
                                rules={{ required: 'Cargo es requerido' }}
                                control={control}
                                render={({ field: { ref, ...field }, fieldState }) => (
                                    <InputBox
                                        select
                                        label='Cargo en la unidad'
                                        helperText={fieldState.error?.message}
                                        error={!!fieldState.error}
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
                                        <MenuItem value='jefe'>Jefe de unidad</MenuItem>
                                        <MenuItem value='tecnico'>Técnico</MenuItem>
                                        <MenuItem value='secretario'>{"Secretario(a)"}</MenuItem>
                                    </InputBox>
                                )}
                            />

                        </BoxSombra>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <BoxSombra p={2}>
                            <Controller
                                control={control}
                                name="Usuario.usuario"
                                rules={{
                                    required: 'No puede quedar vacío',
                                    onBlur: async () => {
                                        let res = await axios.post('/api/usuario/existe', { usuario: watch('Usuario.usuario') });
                                        res.data.existe ? setError('Usuario.usuario', { message: 'Usuario en uso' }) : clearErrors('Usuario.usuario');
                                    }
                                }}
                                render={({ field: { ref, ...field }, fieldState }) => (
                                    <InputBox
                                        {...field}
                                        sx={{ mt: 4 }}
                                        color='success'
                                        inputRef={ref}
                                        label='Usuario'
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="Usuario.password"
                                control={control}
                                rules={{ required: 'No puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <InputBox
                                        {...field}
                                        label='Contraseña'
                                        error={!!fieldState.error}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment:
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                                </IconButton>
                                        }}
                                        helperText={fieldState.error?.message}

                                    />
                                )}
                            />
                            <Controller
                                name="Usuario.password2"
                                control={control}
                                rules={{ validate: value => value === watch('Usuario.password') || 'Las contraseñas no coinciden' }}
                                render={({ field, fieldState }) => (
                                    <InputBox
                                        {...field}
                                        label='Verificar contraseña'
                                        type={showPassword2 ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment:
                                                <IconButton
                                                    onClick={() => setShowPassword2(!showPassword2)}
                                                    edge="end"
                                                >
                                                    {showPassword2 ? <MdVisibilityOff /> : <MdVisibility />}
                                                </IconButton>
                                        }}
                                        helperText={fieldState.error?.message}
                                        error={!!fieldState.error}
                                    />
                                )}
                            />
                            <Controller
                                name="Usuario.rol"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                    <InputBox
                                        select
                                        label='Rol de usuario'
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
                                        <MenuItem value='admin'>Administrador</MenuItem>
                                        <MenuItem value='usuario'>Usuario</MenuItem>
                                    </InputBox>
                                )}
                            />

                        </BoxSombra>
                    </Grid>
                    <Grid item xs={12}>
                        <BotonFilled onClick={handleSubmit(Persona => {
                            openModal({
                                titulo: '¿Continuar?',
                                content: 'Se agregará un nuevo personal',
                                async callback() {
                                    setLoad(true);
                                    let res = await axios.post('/api/persona/crear', Persona);
                                    router.replace('/dashboard/usuarios');
                                    setLoad(false);
                                    return res.data.mensaje;
                                }
                            })
                        })} sx={{ float: 'right' }}>
                            Crear nuevo personal
                        </BotonFilled>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}