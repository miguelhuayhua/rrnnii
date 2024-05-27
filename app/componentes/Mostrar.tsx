import { Box, Chip, TextField, Typography, styled } from "@mui/material";

const ChipBox = styled(Chip)(() => {
    return {
        height: 20,
        borderRadius: 6,
        fontSize: 11,
        color: '#888',
        fontWeight: 600,
        margin: 2.5
    }
});
const BoxSombra = styled(Box)(() => {
    return {
        overflow: 'hidden',
        borderRadius: 4,
        boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px'
    }
})
export { ChipBox, BoxSombra };