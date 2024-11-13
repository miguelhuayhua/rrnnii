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
                            <div className="gradient-wrap">
                                <div className="meshgradient">
                                    <div className="color c1"></div>
                                    <div className="color c2"></div>
                                    <div className="color c3"></div>
                                    <div className="color c4"></div>
                                </div>
                            </div>
                            <Box bgcolor='white'
                                overflow='hidden'
                                boxShadow='0 0 5px #21212133'
                                display='flex'
                                mx='auto'
                                width={{ xs: "100%", md: '90%', xl: '80%' }}
                                my={{ xs: 0, md: 2 }}
                                height={{ xs: '100vh', md: "95.5vh" }}
                                border='2px solid #ddd'
                                borderRadius={{ xs: 0, md: 3 }}>
                                <SideBar />
                                <Box
                                    sx={{
                                        width: { xs: "100%", md: "calc(100% -300px)" },
                                        overflowY: 'scroll',
                                        bgcolor: "#f6f6f6"
                                    }}>
                                    <Navbar />
                                    <Box>
                                        {children}
                                    </Box>
                                </Box>

                            </Box>

                        </ModalProvider>
                    </SnackbarProvider>
                </CustomProvider>
            </DatePickerProvider>
        </NextAuthProvider>
    )
}

