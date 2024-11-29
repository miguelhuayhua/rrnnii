'use client';
import { Box } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from "react";
import { Icon } from '@iconify/react';
import { signIn } from "next-auth/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import React from 'react';
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Normal, Titulo } from "../componentes/Textos";
import { makeid } from "@/utils/globals";
import { grey, red } from "@mui/material/colors";
import { Form, Input, InputGroup, Button, Text, Modal } from "rsuite";

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
}
export default function ModalLogin({ open, setOpen }: Props) {
    const router = useRouter();
    const [showPassword, setShowPassword] = React.useState(false);
    //controlador de eventos para el submit

    const credencialsForm = useForm<{
        password: string,
        usuario: string,
        captcha: string,
        confirmCaptcha: string
    }>({
        defaultValues: { password: '', usuario: '', captcha: makeid(7), confirmCaptcha: '' }
    });
    //controlador de visualización de password
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');
    return (
        <Modal
            size='sm'
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2001 ,// Asegura que esté al frente
            }}
            open={!!open}
            onClose={() => { setOpen(false) }}
        >
            <Modal.Header>
                <Titulo sx={{ textAlign: 'center' }}>
                    Ingrese sus credenciales
                </Titulo>
            </Modal.Header>
            <Modal.Body style={{ padding: "0 10px" }}>
                <Controller
                    name="usuario"
                    control={credencialsForm.control}
                    rules={{ required: 'Usuario no puede quedar vacío' }}
                    render={({ field, fieldState }) => (
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
                    rules={{
                        required: 'La contraseña es requerida',
                    }}
                    control={credencialsForm.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <Form.Group style={{ marginBottom: 10 }}>
                            <Form.ControlLabel>Contraseña</Form.ControlLabel>
                            <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                {fieldState.error?.message}
                            </Form.ErrorMessage>
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
                    <Text as='del'
                        style={{ userSelect: 'none', fontSize: 25 }}>
                        {credencialsForm.watch('captcha')}
                    </Text>
                    <Button
                        onClick={() => {
                            credencialsForm.setValue('captcha', makeid(7))
                        }} appearance="ghost" style={{ marginLeft: 10, color: '#212121', border: '1px solid #212121' }} >
                        <Icon icon='mdi:reload' fontSize={22} />
                    </Button>
                </Box>
                <Controller
                    rules={{
                        required: 'Por favor confirme el Captcha',
                        validate: value => value === credencialsForm.watch('captcha') || 'El valor del captcha no coincide, inténtelo de nuevo'
                    }}
                    control={credencialsForm.control}
                    name="confirmCaptcha"
                    render={({ field, fieldState }) => (
                        <Form.Group style={{ marginBottom: 10 }}>
                            <Form.ControlLabel>Confirme el Captcha</Form.ControlLabel>
                            <Input {...field} size='lg' />
                            <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                {fieldState.error?.message}
                            </Form.ErrorMessage>

                        </Form.Group>
                    )}
                />
                {
                    mensaje ?
                        <Normal sx={{
                            fontSize: 13,
                            textAlign: 'center',
                            color: red[500]
                        }}>
                            {mensaje}
                        </Normal> : null
                }
                <Button
                    appearance='primary'
                    loading={loading}
                    block
                    size='lg'
                    style={{
                        marginTop: 10,
                        background: grey[900]
                    }}
                    onClick={async () => {
                        if (await credencialsForm.trigger()) {
                            setLoading(true);
                            signIn('credentials', {
                                redirect: false,
                                callbackUrl: '/dashboard',
                                password: credencialsForm.getValues('password'),
                                usuario: credencialsForm.getValues('usuario')
                            }).then(response => {
                                if (response?.status == 401) {
                                    setMensaje('Usuario o Contraseña inválida');
                                    setLoading(false);
                                }
                                else if (response?.status == 200 && response.url) {
                                    router.push(response.url);
                                }
                            })
                        }
                    }}>
                    Ingresar
                </Button>
            </Modal.Body>
        </Modal >
    );
}