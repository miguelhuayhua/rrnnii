'use client';
import { Open_Sans, Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const openSans = Open_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-open-sans' });


const theme = createTheme({
    typography: {
        fontFamily: openSans.style.fontFamily,
    },
   
});

export default theme;
