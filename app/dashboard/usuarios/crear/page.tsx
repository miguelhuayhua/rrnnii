'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, CircularProgress, Backdrop } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Persona, Usuario } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
import { useModal } from "@/providers/ModalProvider";
import { useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { MdArrowLeft, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Button, Panel, Form, Input, InputNumber, SelectPicker, DatePicker, InputGroup } from "rsuite";
import { parseLetter } from "@/utils/data";
import { red } from "@mui/material/colors";
export default function Page() {
    const { control,
        watch,
        setError, clearErrors, handleSubmit } = useForm<Persona & { Usuario: Usuario & { password2: string } }>({
            defaultValues: {
                nombre: '', paterno: '', materno: '',
                cargo: 'tecnico', f_nacimiento: dayjs().format('DD/MM/YYYY'),
                Usuario: {
                    rol: 'usuario',
                    usuario: '',
                    password: '',
                    password2: ''
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
                <Breadcrumbs sx={{ my: 2 }} >
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/pasantias">
                        <Normal>Personal</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>

                <Titulo sx={{ mb: 1 }}>
                    Crear nuevo personal
                </Titulo>
                <Button
                    appearance="subtle"
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </Button>

                <Grid container spacing={4} py={2}>
                    <Grid item xs={12} sm={6}>
                        <Panel shaded style={{ background: 'white' }}>

                            <Controller
                                name="nombre"
                                control={control}
                                rules={{ required: 'Nombre no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Nombres</Form.ControlLabel>
                                        <Input {...field} size='lg'
                                            onChange={text => field.onChange(parseLetter(text))} />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="paterno"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Apellido Paterno</Form.ControlLabel>
                                        <Input {...field} size='lg' onChange={text => field.onChange(parseLetter(text))} />
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="materno"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Apellido Materno</Form.ControlLabel>
                                        <Input {...field} size='lg' onChange={text => field.onChange(parseLetter(text))} />
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="ci"
                                control={control}
                                rules={{
                                    required: 'CI no puede quedar vacío',
                                    maxLength: { message: 'CI no puede exceder de 8 dígitos', value: 8 }
                                }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Cédula Identidad</Form.ControlLabel>
                                        <InputNumber {...field} size='lg' />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="f_nacimiento"
                                control={control}
                                rules={{ required: 'Fecha de nacimiento no puede quedar vacío' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group controlId="fecha">
                                        <Form.ControlLabel>Fecha de nacimiento</Form.ControlLabel>
                                        <DatePicker
                                            placement="auto"
                                            style={{ width: "100%", marginBottom: 10 }}
                                            size="lg"
                                            // Deshabilitar fechas futuras
                                            shouldDisableDate={(date) => date > new Date()}
                                            onChange={(ev) => {
                                                field.onChange(dayjs(ev).format("DD/MM/YYYY"));
                                            }}
                                        />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                                )}
                            />

                            <Controller
                                name="cargo"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group controlId="tipo">
                                        <Form.ControlLabel>Cargo de Unidad</Form.ControlLabel>
                                        <SelectPicker
                                            {...field}
                                            size="lg"
                                            defaultValue={field.value}
                                            cleanable={false}
                                            placement="auto"
                                            style={{ marginBottom: 10, width: "100%" }}
                                            data={[{ label: 'Jefe de unidad', value: 'jefe' },
                                            { label: 'Técnico', value: 'tecnico' },
                                            { label: 'Secretario(a)', value: 'secretario' }
                                            ]}
                                            searchable={false}
                                        />
                                    </Form.Group>
                                )}
                            />
                        </Panel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Panel style={{ background: 'white' }} shaded>
                            <Controller
                                name="Usuario.usuario"
                                control={control}
                                rules={{
                                    required: 'No puede quedar vacío',
                                    onBlur: async () => {
                                        let res = await axios.post('/api/usuario/existe', { usuario: watch('Usuario.usuario') });
                                        res.data.existe ? setError('Usuario.usuario', { message: 'Usuario en uso' }) : clearErrors('Usuario.usuario');
                                    }
                                }} render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Usuario</Form.ControlLabel>
                                        <Input {...field} size='lg' />
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                control={control}
                                name="Usuario.password"
                                render={({ field }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Contraseña</Form.ControlLabel>
                                        <InputGroup inside >
                                            <Input
                                                size='lg' {...field} type={showPassword ? 'text' : 'password'} />
                                            <InputGroup.Button
                                                style={{ height: "100%" }} onClick={() => {
                                                    setShowPassword(!showPassword);
                                                }}>
                                                {showPassword ? <MdVisibilityOff fontSize={25} /> : <MdVisibility fontSize={23} />}
                                            </InputGroup.Button>
                                        </InputGroup>
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="Usuario.password2"
                                control={control}
                                rules={{ validate: value => value === (watch('Usuario.password') || '') || 'Las contraseñas no coinciden' }}
                                render={({ field, fieldState }) => (
                                    <Form.Group style={{ marginBottom: 10 }}>
                                        <Form.ControlLabel>Verificar contraseña</Form.ControlLabel>
                                        <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                            {fieldState.error?.message}
                                        </Form.ErrorMessage>
                                        <InputGroup inside >
                                            <Input
                                                size='lg' {...field} type={showPassword2 ? 'text' : 'password'} />
                                            <InputGroup.Button
                                                style={{ height: "100%" }} onClick={() => {
                                                    setShowPassword2(!showPassword2);
                                                }}>
                                                {showPassword ? <MdVisibilityOff fontSize={25} /> : <MdVisibility fontSize={23} />}
                                            </InputGroup.Button>
                                        </InputGroup>
                                    </Form.Group>
                                )}
                            />
                            <Controller
                                name="Usuario.rol"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group controlId="tipo">
                                        <Form.ControlLabel>Tipo de usuario</Form.ControlLabel>
                                        <SelectPicker
                                            {...field}
                                            size="lg"
                                            defaultValue={field.value}
                                            cleanable={false}
                                            style={{ marginBottom: 10, width: "100%" }}
                                            data={[
                                                { label: 'Administrador', value: 'admin' },
                                                { label: 'Usuario', value: 'usuario' }
                                            ]}
                                            searchable={false}
                                        />
                                    </Form.Group>
                                )}
                            />

                        </Panel>
                    </Grid>
                    <Grid item xs={6} mx='auto'>
                        <Button appearance="primary"
                            block
                            size='lg'
                            style={{ background: red[700] }} onClick={handleSubmit(Persona => {
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
                            })} >
                            Crear nuevo personal
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}