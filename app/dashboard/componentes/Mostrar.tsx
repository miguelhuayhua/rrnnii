import { Box, MenuItem, Select, Tab, TextField, Typography, styled } from "@mui/material";

const BoxSombra = styled(Box)(() => {
    return {
        background: 'white',
        borderRadius: 15,
        boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px'
    }
});

const TabBox = styled(Tab)(() => {
    return {
        textTransform: 'none',
        fontWeight: 700,
        minWidth: 0,
        height: 35,
        minHeight: 0,
        fontSize: 13,
        margin: "0 40px 0 0",
        padding: 0
    }
})
export { BoxSombra, TabBox };