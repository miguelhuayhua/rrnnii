import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Titulo } from "@/app/componentes/Textos";
import { useModal } from "@/providers/ModalProvider";
import { Dialog, DialogContent, Grid, MenuItem } from "@mui/material";
import { Persona } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { DatePickerBox, InputBox } from "@/app/componentes/Datos";
import axios from "axios";
import dayjs from "dayjs";

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
    return (
        <>
            <Dialog
                open={!!Persona}
                keepMounted={false}
                maxWidth='sm'
                onClose={() => { setPersona(null) }}
            >
                <DialogContent sx={{ position: 'relative', p: 2 }}>
                    <BotonSimple onClick={() => setPersona(null)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                        <IoClose fontSize={25} />
                    </BotonSimple>
                    <Titulo sx={{ fontSize: 20, mb: 3, pr: 4 }}>
                        Modificar Personal
                    </Titulo>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
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
                                name="ci"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                    <InputBox
                                        {...field}
                                        label='Carnet de identidad'
                                        inputRef={ref}
                                    />
                                )}
                            />
                            <Controller
                                name="cargo"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                    <InputBox
                                        select
                                        label='Cargo en la unidad'
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
                                        <MenuItem value='becas'>Jefe de unidad</MenuItem>
                                        <MenuItem value='idiomas'>Técnico</MenuItem>
                                        <MenuItem value='noticias'>Secretaria</MenuItem>
                                    </InputBox>
                                )}
                            />
                        </Grid>
                        {
                            isDirty ?
                                <Grid item xs={12}>
                                    <BotonFilled
                                        sx={{ float: 'right' }}
                                        onClick={handleSubmit((Persona) => {
                                            openModal({
                                                async callback() {
                                                    let res = await axios.post('/api/persona/modificar', Persona);
                                                    setPersona(null);
                                                    axios.post('/api/persona/todo').then(res => {
                                                        setPersonas(res.data);
                                                        setPrevPersonas(res.data);
                                                    });
                                                    return res.data.mensaje;
                                                },
                                                content: 'El personal será modificado',
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

export default ModalPersonal;