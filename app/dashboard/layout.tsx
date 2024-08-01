import { NextAuthProvider } from "@/providers/AuthProvider";
import Navbar from "./componentes/Navbar";
import SideBar from "./componentes/SideBar";
import { Box } from "@mui/material";
import DatePickerProvider from "@/providers/DatePickerProvider";
import './globals.scss';
import { ModalProvider } from "@/providers/ModalProvider";
import { SnackbarProvider } from "@/providers/SnackbarProvider";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: 'Dashboard'
}
export default async function Layout({ children }: any) {
    return (
        <NextAuthProvider>
            <DatePickerProvider>
                <SnackbarProvider>
                    <ModalProvider>
                        <Box display='flex'>
                            <SideBar />
                            <Box width={"100%"} >
                                <Navbar />
                                <Box mt={5}>
                                    {children}
                                </Box>
                            </Box>
                        </Box>
                    </ModalProvider>
                </SnackbarProvider>
            </DatePickerProvider>
        </NextAuthProvider>
    )
}

