import { Button, Typography, styled } from "@mui/material";
import { blueGrey, grey } from "@mui/material/colors";
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
    background: blueGrey[900],
    borderRadius: 12,
    color: blueGrey[50],
    textTransform: 'none',
    fontWeight: 700,
    minWidth: 0,
    fontSize: 15,
    "&:hover": {
        background: blueGrey[700],
        color: 'white'
    }
}
));
const BotonSimple = styled(Button)(() =>
({
    background: grey[50],
    borderRadius: 12,
    fontSize: 15,
    color: grey[900],
    minWidth: 0,
    textTransform: 'none',
    fontWeight: 700,
    "&:hover": {
        background: 'none'
    }
}));

export { BotonOutline, BotonSimple, BotonFilled };