'use client';
import { createTheme, CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { indigo, grey, red, blue } from '@mui/material/colors';
import 'dayjs/locale/es-mx';

import { Karla } from 'next/font/google';
const karla = Karla({ subsets: ['latin'] });
function ThemeProviderCustom({ children }: any) {
    const theme = createTheme({
        palette: {
            action: { active: grey[900], selected: red[900], },
            mode: 'light',
            background: { default: grey[50], paper: grey[50] },
            primary: { main: grey[900] },
            text: { primary: grey[800], secondary: grey[800], disabled: grey[500] },
            divider: grey[100],
            error: { main: red[600] },
        },
        typography: {
            fontFamily: karla.style.fontFamily,
        }
    })
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    '.ql-formats': {
                        backgroundColor: '#fff',
                        borderRadius: "8px"
                    },
                    body: { backgroundColor: grey[50] },
                    a: { color: grey[900] }
                }}
            />
            {children}
        </ThemeProvider>
    );
}

export default ThemeProviderCustom;