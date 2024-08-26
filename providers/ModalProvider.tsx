'use client';
import { Box, Dialog, Stack } from '@mui/material';
import React, { ReactElement, createContext, useContext, useState } from 'react';
import { Normal, Titulo } from '@/app/componentes/Textos';
import { BotonFilled, BotonOutline } from '@/app/componentes/Botones';
import { useSnackbar } from './SnackbarProvider';

// Creamos un contexto para almacenar el estado del Snackbar
const ModalContext = createContext({
    openModal: (
        params: {
            content: ReactElement | string,
            titulo: string,
            ButtonText?: { yes: string, no: string },
            callback: Function,
        }
    ) => {
    }
});
export const ModalProvider = ({ children }: any) => {
    const [open, setOpen] = useState(false);
    const { openSnackbar } = useSnackbar();
    const [action, setAction] = useState<{
        params: {
            content: ReactElement | string,
            titulo: string,
            ButtonText?: { yes: string, no: string },
            callback: Function,
        }
    }>({
        params:
        {
            content: <></>,
            titulo: '',
            ButtonText: { yes: 'Aceptar', no: 'Cancelar' },
            callback: () => { },
        }
    });
    const openModal = (params: { content: ReactElement | string, titulo: string, ButtonText?: { yes: string, no: string }, callback: Function } = { ...action.params }) => {
        setOpen(true);
        setAction({
            params: {
                ...params,
                ButtonText: params.ButtonText ?
                    params.ButtonText : { no: 'Cancelar', yes: 'Aceptar' }
            }
        });
    };

    return (

        <ModalContext.Provider value={{ openModal }}>

            {children}
            <Dialog
                onClose={() => setOpen(false)}
                open={open}
                aria-labelledby="Seleccione el producto"
                aria-describedby="Área de selección de productos para la generación de información"
                maxWidth={'xs'}
                sx={{
                    ".MuiPaper-root": {
                        zIndex: 100
                    }
                }}
            >
                <Box p={3} >
                    <Titulo sx={{ fontSize: 18, textAlign: 'center' }}>
                        {action.params.titulo}
                    </Titulo>
                    {
                        typeof action.params.content == 'string' ?
                            <Normal sx={{ my: 2, textAlign: 'center' }}>
                                {action.params.content}
                            </Normal>
                            : action.params.content
                    }
                    <Stack direction='row' justifyContent={'center'} spacing={3}>
                        <BotonFilled onClick={() => setOpen(false)}>
                            {action.params.ButtonText?.no}
                        </BotonFilled>
                        <BotonOutline
                            onClick={async () => {
                                openSnackbar(await action.params.callback());
                                setOpen(false);
                            }}
                        >
                            {action.params.ButtonText?.yes}
                        </BotonOutline>
                    </Stack>
                </Box>
            </Dialog>

        </ModalContext.Provider>


    );
};

// Hook para consumir el contexto del Snackbar en cualquier componente
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal debe ser usado dentro de un ModalProvider');
    }

    return context;
};