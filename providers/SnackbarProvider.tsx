'use client';
import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from '@mui/material';
// Creamos un contexto para almacenar el estado del Snackbar
const SnackbarContext = createContext({
    openSnackbar: (message: string) => {
    }
});
export const SnackbarProvider = ({ children }: any) => {
    const openSnackbar = (message: string) => {
        setMessage(message);
        setOpen(true);
    };
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    return (
        <SnackbarContext.Provider value={{ openSnackbar }}>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={() => setOpen(false)}
                message={message}
            />
            {/* Renderizamos el Snackbar aquí */}
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