'use client';
import React, { createContext, useContext } from 'react';
import { Icon } from '@iconify/react';
import { Normal } from '@/app/componentes/Textos';
import { Notification, useToaster } from 'rsuite';
// Creamos un contexto para almacenar el estado del Snackbar
const SnackbarContext = createContext({
    openSnackbar: (message: string) => {
    }
});
export const SnackbarProvider = ({ children }: any) => {
    const toaster = useToaster();
    const openSnackbar = (message: string) => {
        toaster.push(<Notification
            type='info'>
            <Normal sx={{ display: 'flex', alignItems: 'center' }}>
                <Icon icon='lucide:info' fontSize={30}
                    style={{ marginRight: 20 }} />
                {message}
            </Normal>
        </Notification>, { placement: 'topEnd' });
    };
    return (
        <SnackbarContext.Provider value={{ openSnackbar }}>
            {children}
        </SnackbarContext.Provider>
    );
};

// Hook para consumir el contexto del Snackbar en cualquier componente
export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar debe ser utilizado dentro de un SnackbarProvider');
    }

    return context;
};