import { Chip, TextField, Typography, styled } from "@mui/material";

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
export { ChipBox };