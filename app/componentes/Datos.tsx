import { MenuItem, Select, Switch, TextField, Typography, styled } from "@mui/material";
import { blue, blueGrey, grey, red } from "@mui/material/colors";
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

const SwitchBox = styled(Switch)(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: blueGrey[900],
                opacity: 1,
                border: 0,
            }
        },

        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7
        },
    },
    '& .MuiSwitch-thumb': {
        width: 22,
        height: 22,
        background: blueGrey[50]
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: blueGrey[200],
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },

}));

export { InputBox, DatePickerBox, SwitchBox };