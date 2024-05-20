import { MenuItem, Select, TextField, Typography, styled } from "@mui/material";

const InputBox = styled(TextField)(() => {
    return {
        ":focus-visible": {
            outline: 'none !important'
        },
        width: "100%",
        ".MuiInputBase-root": {
            borderRadius: 7.5,
            color: '#333',
            fontSize: 14,
            fontWeight: 400,
            fontfamily: 'inherit',
            ":focus-visible": {
                outline: 'none !important'
            },
        },
        ".MuiFormLabel-root": {
            color: '#071a28',
            fontSize: 14,
            fontfamily: 'inherit',
            fontWeight: 600,
        },
        ".MuiTypography-root": {
            color: '#666',
            fontSize: 14,
        },
        fieldset: {
            border: '1px solid #dfdfdf'
        },
        "svg": {
            color: '#999',
            margin: '0 10px 0px 0'
        }
    }
});
const ItemBox = styled(MenuItem)(() => {
    return {
        fontSize: 14,
        "&.Mui-selected": {
            background: 'none',
            borderRadius: 10,
            width: "98%",
            mx: 'auto',
            "&:hover": {
                background: '#f7f7f7'
            },
        }
    }
});
export { InputBox, ItemBox };