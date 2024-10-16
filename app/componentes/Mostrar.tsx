import { Box, Chip, TextField, Typography, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

const ChipBox = styled(Chip)(() => {
    return {
        height: 30,
        borderRadius: 10,
        fontSize: 14,
        color: grey[700],
        background: grey[200],
        fontWeight: 700,
        marginRight: 5,
        marginTop: 5
    }
});
const BoxSombra = styled(Box)(() => {
    return {
        overflow: 'hidden',
        borderRadius: 10,
        boxShadow: 'rgba(145, 158, 171, 0.4) 0px 1px 2px 0px',
        background: 'white'
    }
})
export { ChipBox, BoxSombra };