import { NextAuthProvider } from "@/providers/AuthProvider";
import Navbar from "./componentes/Navbar";
import SideBar from "./componentes/SideBar";
import { Box } from "@mui/material";

export default async function Layout({ children }: any) {
    return (
        <NextAuthProvider>
            <Box display='flex'>
                <SideBar />
                <Box width={"100%"}>
                    <Navbar />
                    {children}
                </Box>
            </Box>
        </NextAuthProvider>
    )
}

