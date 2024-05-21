import { MenuItem, Select, TextField, Typography, styled } from "@mui/material";

const InputBox = styled(TextField)(() => {
    return {
        ":focus-visible": {
            outline: 'none !important'
        },
        width: "100%",
        ".MuiInputBase-root": {
            borderRadius: 12,
            color: '#333',
            fontSize: 14,
            fontWeight: 400,
            fontfamily: 'inherit',
            ":focus-visible": {
                outline: 'none !important'
            },
        },
        ".MuiFormLabel-root": {
            color: 'black !important',
            fontSize: 14,
            fontfamily: 'inherit',
            fontWeight: 600,
        },
        ".MuiTypography-root": {
            color: '#666',
            fontSize: 14,
        },
        fieldset: {
            border: '1px solid #e1e4e7'
        },
        "svg": {
            color: '#999',
            margin: '0 10px 0px 0'
        },
        '.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black'
        }
    }
});
const ItemBox = styled(MenuItem)(() => {
    return {
        fontSize: 14,
        "&.MuiButtonBase-root": {
            background: 'none',
            borderRadius: 10,
            width: "95%",
            margin: 'auto',
            mx: 'auto',
            "&:hover": {
                background: '#f7f7f7'
            },

        },


    }
});
export { InputBox, ItemBox };