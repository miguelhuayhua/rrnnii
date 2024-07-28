import { Button, Typography, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import Link from "next/link";
const BotonOutline = styled(Button)(() =>
({
    background: 'transparent',
    fontSize: 16,
    borderRadius: 12,
    color: grey[900],
    border: `1px solid ${grey[800]}`,
    textTransform: 'none',
    fontWeight: 700,
    minWidth: 0,
    "&:hover": { background: grey[100] }
}));
const BotonFilled = styled(Button)(() =>
({
    background: grey[900],
    borderRadius: 12,
    color: grey[50],
    textTransform: 'none',
    fontWeight: 700,
    minWidth: 0,
    fontSize: 16,
    "&:hover": {
        background: grey[700]
    }
}
));
const BotonSimple = styled(Button)(() =>
({
    background: grey[50],
    borderRadius: 12,
    fontSize: 16,
    color: grey[900],
    minWidth: 0,
    textTransform: 'none',
    fontWeight: 700,
}));

export { BotonOutline, BotonSimple, BotonFilled };