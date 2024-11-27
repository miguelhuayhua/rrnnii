'use client';
import { Titulo } from "@/app/componentes/Textos";
import { useModal } from "@/providers/ModalProvider";
import { Backdrop, CircularProgress } from "@mui/material";
import { Persona } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { Button, Modal, Form, Input, InputNumber, DatePicker, SelectPicker } from "rsuite";
import { parseLetter, toUpperCase } from "@/utils/data";

interface Props {
    Persona: Persona;
    setPersona: any;
    setPersonas: any;
    setPrevPersonas: any;
}

const ModalPersonal = ({ Persona, setPersona, setPersonas, setPrevPersonas }: Props) => {
    const { control, formState: { isDirty }, handleSubmit } = useForm<Persona>({
        defaultValues: Persona, shouldFocusError: true
    });
    const { openModal } = useModal();
    const [load, setLoad] = useState(false);
    return (
        <>
            <Modal
                overflow
                size='md'
                backdrop='static'
                open={!!Persona}
                onClose={() => { setPersona(null) }}
            >
                <Modal.Header>
                    <Titulo>
                        Modificar Personal
                    </Titulo>
                </Modal.Header>
                <Modal.Body style={{ padding: "0 10px" }}>
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
                                    placement="top"
                                    value={dayjs(field.value, 'DD/MM/YYYY').toDate()}
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
                                    placement="auto"
                                    defaultValue={field.value}
                                    cleanable={false}
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

                </Modal.Body>
                <Modal.Footer>
                    {
                        isDirty ?
                            <Button
                                size='lg'
                                appearance='primary'
                                onClick={handleSubmit((Persona) => {
                                    openModal({
                                        async callback() {
                                            setLoad(true);
                                            let res = await axios.post('/api/persona/modificar', Persona);
                                            setPersona(null);
                                            axios.post('/api/persona/todo').then(res => {
                                                setPersonas(res.data);
                                                setPrevPersonas(res.data);
                                            });
                                            setLoad(false);
                                            return res.data.mensaje;
                                        },
                                        content: 'El personal será modificado',
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

export default ModalPersonal;