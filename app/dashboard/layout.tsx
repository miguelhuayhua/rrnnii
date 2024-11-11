import { NextAuthProvider } from "@/providers/AuthProvider";
import Navbar from "./componentes/Navbar";
import SideBar from "./componentes/SideBar";
import { Box } from "@mui/material";
import DatePickerProvider from "@/providers/DatePickerProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import { SnackbarProvider } from "@/providers/SnackbarProvider";
import { Metadata } from "next";
import { CustomProvider } from "rsuite";
import esAR from 'rsuite/locales/es_AR';
import './globals.scss';

export const metadata: Metadata = {
    title: 'Dashboard'
}
export default async function Layout({ children }: any) {
    return (

        <NextAuthProvider>
            <DatePickerProvider>
                <CustomProvider
                    locale={esAR}>

                    <SnackbarProvider>
                        <ModalProvider>
                            <Box bgcolor='transparent' display='flex'>
                                <SideBar />
                                <Box
                                    bgcolor='transparent'
                                    sx={{ width: { xs: "100%", md: "calc(100% -300px)" }, overflow: 'hidden' }}>
                                    <Navbar />
                                    <Box
                                        bgcolor='transparent'
                                        mt={5}>
                                        {children}
                                    </Box>
                                </Box>

                            </Box>
                            <div className="gradient-wrap">
                                <div className="meshgradient">
                                    <div className="color c1"></div>
                                    <div className="color c2"></div>
                                    <div className="color c3"></div>
                                    <div className="color c4"></div>
                                </div>
                            </div>
                        </ModalProvider>
                    </SnackbarProvider>
                </CustomProvider>
            </DatePickerProvider>
        </NextAuthProvider>
    )
}

