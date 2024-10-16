import { Box, Tab, styled } from "@mui/material";

const BoxSombra = styled(Box)(() => {
    return {
        background: 'white',
        borderRadius: 14,
        boxShadow: 'rgba(145, 158, 171, 0.7) 0px 0.5px 2px 0px'
    }
});

const TabBox = styled(Tab)(() => {
    return {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: 16,
        color: 'black'
    }
})
export { BoxSombra, TabBox };