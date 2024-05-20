'use client';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';

function DatePickerProvider({ children }: any) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es-mx'>
            {children}
        </LocalizationProvider>
    );
}

export default DatePickerProvider;