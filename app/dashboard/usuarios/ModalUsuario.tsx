import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Titulo } from "@/app/componentes/Textos";
import { useModal } from "@/providers/ModalProvider";
import { Dialog, DialogContent, Grid, IconButton, MenuItem } from "@mui/material";
import { Usuario } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { InputBox } from "@/app/componentes/Datos";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

interface Props {
    personaCi: string;
    setPersonaCi: any;
}

const ModalUsuario = ({ personaCi, setPersonaCi }: Props) => {
    const { control, watch, formState: { isDirty }, handleSubmit,
        reset } = useForm<Usuario & { password2: string }>({
            defaultValues: {
                personaCi,
                usuario: '',
                password: '',
                rol: ''
            }, shouldFocusError: true
        });
    const { openModal } = useModal();
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    useEffect(() => {
        axios.post('/api/usuario/xpersona', { personaCi }).then(res => {
            reset(res.data);
        })
    }, [personaCi])
    return (
        <>
            <Dialog
                open={!!personaCi}
                keepMounted={false}
                maxWidth='sm'
                onClose={() => { setPersonaCi(null) }}
            >
                <DialogContent sx={{ position: 'relative', p: 2 }}>
                    <BotonSimple onClick={() => setPersonaCi(null)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                        <IoClose fontSize={25} />
                    </BotonSimple>
                    <Titulo sx={{ fontSize: 20, mb: 3, pr: 4 }}>
                        Modificar Usuario
                    </Titulo>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <Controller
                                name="usuario"
                                control={control}
                                rules={{ required: 'Usuario es obligatorio' }}
                                render={({ field: { ref, ...field }, fieldState }) => (
                                    <InputBox
                                        {...field}
                                        label='Usuario'
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        inputRef={ref}
                                    />
                                )}
                            />
                            <Controller
                                name="password"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputBox
                                        {...field}
                                        label='Contraseña'

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
                                name="password2"
                                control={control}
                                rules={{ validate: value => value === watch('password') || 'Las contraseñas no coinciden' }}
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
                                name="rol"
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
                        </Grid>
                        {
                            isDirty ?
                                <Grid item xs={12}>
                                    <BotonFilled
                                        sx={{ float: 'right' }}
                                        onClick={handleSubmit((Usuario) => {
                                            openModal({
                                                async callback() {
                                                    let res = await axios.post('/api/usuario/modificar', Usuario);
                                                    setPersonaCi(null);
                                                    return res.data.mensaje;
                                                },
                                                content: 'El usuario será modificado',
                                                titulo: '¿Continuar?'
                                            })
                                        })} >
                                        Guardar cambios
                                    </BotonFilled>
                                </Grid> : null
                        }
                    </Grid>
                </DialogContent>

            </Dialog >
        </>
    )
}

export default ModalUsuario;