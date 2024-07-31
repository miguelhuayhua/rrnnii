import { MenuItem, Select, TextField, Typography, styled } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { DatePicker } from "@mui/x-date-pickers";

const InputBox = styled(TextField)(() => {
    return {
        width: "100%",
        '& .MuiOutlinedInput-root': {
            borderRadius: 14,
            '&:hover fieldset': {
                borderColor: blue[600], // Cambia el color al hacer hover
            },
            '&.Mui-focused fieldset': {
                borderColor: blue[600], // Cambia el color al hacer focus
            },
        },
        ".MuiFormLabel-root": {
            fontWeight: 600,
        },
        ".MuiTypography-root": {
            fontSize: 14,
        }
    }
});
const DatePickerBox = styled(DatePicker)(() => {
    return {
        margin: '10px 0',
        width: "100%",
        ".MuiInputBase-root": {
            borderRadius: 12,
        },
        ".MuiFormLabel-root": {

            fontWeight: 600,
        }
    }
});
export { InputBox, DatePickerBox };