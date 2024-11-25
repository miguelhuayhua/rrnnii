import { Box, Chip, TextField, Typography, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

const ChipBox = styled(Chip)(() => {
    return {
        borderRadius: 6,
        fontSize: 13,
        color: grey[900],
        background: grey[100],
        fontWeight: 700,
        marginRight: 5,
        marginTop: 5
    }
});
const BoxSombra = styled(Box)(() => {
    return {
        overflow: 'hidden',
        borderRadius: 10,
        boxShadow: '#21212144 0px 0px 6px',
        background: 'white'
    }
})
export { ChipBox, BoxSombra };