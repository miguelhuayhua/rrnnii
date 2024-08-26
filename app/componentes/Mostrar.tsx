import { Box, Chip, TextField, Typography, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

const ChipBox = styled(Chip)(() => {
    return {
        height: 20,
        borderRadius: 10,
        fontSize: 12,
        color: grey[700],
        background: grey[100],
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