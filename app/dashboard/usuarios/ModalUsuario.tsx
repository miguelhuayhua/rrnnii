import { Titulo } from "@/app/componentes/Textos";
import { useModal } from "@/providers/ModalProvider";
import { Backdrop, CircularProgress } from "@mui/material";
import { Usuario } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Button, Form, Input, InputGroup, Modal, SelectPicker } from "rsuite";

interface Props {
    personaId: string;
    setPersonaId: any;
}

const ModalUsuario = ({ personaId, setPersonaId }: Props) => {
    const { control, watch, formState: { isDirty }, clearErrors, setError, handleSubmit,
        reset } = useForm<Usuario & { password2: string }>({
            defaultValues: {
                personaId,
                usuario: '',
                password: '',
                rol: '',
                password2: ''
            }, shouldFocusError: true
        });
    const { openModal } = useModal();
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [load, setLoad] = useState(false);
    useEffect(() => {
        axios.post('/api/usuario/xpersona', { personaId }).then(res => {
            reset(res.data);
        })
    }, [personaId])
    return (
        <>
            <Modal
                overflow
                size='md'
                backdrop='static'
                open={!!personaId}
                onClose={() => { setPersonaId(null) }}
            >
                <Modal.Header>
                    <Titulo >
                        Modificar Usuario
                    </Titulo>
                </Modal.Header>
                <Modal.Body style={{ padding: 12 }}>
                    <Controller
                        name="usuario"
                        control={control}
                        rules={{
                            required: 'No puede quedar vacío',
                            onBlur: async () => {
                                let res = await axios.post('/api/usuario/existe', { usuario: watch('usuario') });
                                res.data.existe ? setError('usuario', { message: 'Usuario en uso' }) : clearErrors('usuario');
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
                        name="password"
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
                        name="password2"
                        control={control}
                        rules={{ validate: value => value === (watch('password') || '') || 'Las contraseñas no coinciden' }}
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
                        name="rol"
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
                                    data={[{ label: 'Jefe de unidad', value: 'jefe' },
                                    { label: 'Administrador', value: 'admin' },
                                    { label: 'Usuario', value: 'usuario' }
                                    ]}
                                    searchable={false}
                                />
                            </Form.Group>
                        )}
                    />
                </Modal.Body>
                <Modal.Footer>
                    {
                        isDirty ?
                            <Button
                                size='lg'
                                appearance='primary'
                                onClick={handleSubmit((Usuario) => {
                                    openModal({
                                        async callback() {
                                            setLoad(true);
                                            let res = await axios.post('/api/usuario/modificar', Usuario);
                                            setPersonaId(null);
                                            setLoad(false);
                                            return res.data.mensaje;
                                        },
                                        content: 'El usuario será modificado',
                                        titulo: '¿Continuar?'
                                    })
                                })} >
                                Guardar cambios
                            </Button>
                            : null
                    }
                </Modal.Footer>
            </Modal >
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={load}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

        </>
    )
}

export default ModalUsuario;