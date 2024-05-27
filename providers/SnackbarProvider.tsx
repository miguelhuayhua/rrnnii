'use client';
import React, { createContext, useContext } from 'react';
import { SnackbarProvider as Notistack, useSnackbar as useSnack } from 'notistack';
// Creamos un contexto para almacenar el estado del Snackbar
const SnackbarContext = createContext({
    openSnackbar: (message: string) => {
    }
});
export const SnackbarProvider = ({ children }: any) => {
    const { enqueueSnackbar } = useSnack();
    const openSnackbar = (message: string) => {
        enqueueSnackbar(message);
    };

    return (
        <SnackbarContext.Provider value={{ openSnackbar }}>
            {/* Renderizamos el Snackbar aquí */}
            <Notistack maxSnack={3} style={{ color: '#666', background: 'white', borderRadius: 10, overflow: 'hidden' }} >
                {children}
            </Notistack>
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