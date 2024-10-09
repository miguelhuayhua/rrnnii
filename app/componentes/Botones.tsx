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
    background: grey[900],
    borderRadius: 12,
    color: blueGrey[50],
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 700,
    minHeight: 0,
    height: 55,
    fontSize: 16,
    "&:hover": {
        background: blueGrey[700],
        color: 'white'
    }
}
));
const BotonSimple = styled(Button)(() =>
({
    background: 'transparent',
    borderRadius: 12,
    fontSize: 16,
    color: grey[900],
    minWidth: 0,
    textTransform: 'none',
    fontWeight: 700,
    "&:hover": {
        background: 'none',
        color: '#212121'
    }
}));

export { BotonOutline, BotonSimple, BotonFilled };