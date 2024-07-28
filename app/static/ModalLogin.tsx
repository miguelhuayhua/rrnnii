'use client';
import { Box, Divider, IconButton } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Titulo } from "../componentes/Textos";
import { InputBox } from "../componentes/Datos";
import { BotonFilled } from "../componentes/Botones";
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});
interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
}
export default function ModalLogin({ open, setOpen }: Props) {
    const router = useRouter();
    const [showTransition, setShowTransition] = useState<'password' | 'register' | ''>('');
    const [showPassword, setShowPassword] = React.useState(false);
    //controlador de eventos para el submit

    const credencialsForm = useForm<{ password: string, usuario: string }>({
        defaultValues: { password: '', usuario: '' }
    });
    //controlador de visualización de password
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const recaptcha = useRef<any>();


    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            maxWidth='sm'
            PaperProps={{ sx: { borderRadius: 2.5 } }}
            fullWidth
            onClose={() => {
                setShowTransition('');
                setOpen(false);
                setMensaje('');
            }}
        >
            <DialogContent sx={{ position: 'relative' }} >
                <Titulo sx={{ textAlign: 'center' }}>
                    Ingrese sus credenciales
                </Titulo>
                <Box
                    display={showTransition == '' ? 'block' : 'none'}
                    py={2}
                >
                    <Controller
                        rules={{ required: 'No puede quedar vacio' }}
                        control={credencialsForm.control}
                        name="usuario"
                        render={({ field }) => (
                            <InputBox
                                label='Usuario'
                                disabled={loading}
                                error={!!credencialsForm.formState.errors.usuario}
                                {...field}
                                helperText={credencialsForm.formState.errors.usuario?.message}
                            >
                            </InputBox>
                        )}
                    />
                    <Controller
                        rules={{ required: 'No puede quedar vacio' }}
                        control={credencialsForm.control}
                        name="password"
                        render={({ field }) => (
                            <InputBox
                                sx={{ mt: 3 }}
                                label='Contraseña'
                                error={!!credencialsForm.formState.errors.password}
                                disabled={loading}
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
                                helperText={credencialsForm.formState.errors.password?.message || mensaje}
                                {...field}
                            >
                            </InputBox>
                        )}
                    />
                    <BotonFilled sx={{ display: 'block', mt: 4, mx: 'auto', px: 4 }} onClick={async () => {
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
                    </BotonFilled>
                </Box>
            </DialogContent>

        </Dialog >
    );
}