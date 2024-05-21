import { Button, Typography, styled } from "@mui/material";
import Link from "next/link";
const BotonOutline = styled(Button)(() =>
({
    background: 'transparent',
    fontSize: 14,
    borderRadius: 12,
    color: '#212b36',
    border: '1px solid #212b36',
    textTransform: 'none',
    fontWeight: 700,
    minWidth: 0,
    "&:hover": { background: '#212b36dd', color: 'white' }
}));
const BotonFilled = styled(Button)(() =>
({
    background: '#212b36',
    fontSize: 14,
    px: 2,
    borderRadius: 12,
    color: 'white',
    textTransform: 'none',
    fontWeight: 700,
    "&:hover": { background: '#212b36dd' },
    minWidth:0
}
));
const BotonSimple = styled(Button)(() =>
({
    background: 'transparent',
    fontSize: 14,
    borderRadius: 12,
    color: '#212b36',
    minWidth: 0,
    textTransform: 'none',
    fontWeight: 700,
    "&:hover": { color: '#666' }
}));

export { BotonOutline, BotonSimple, BotonFilled };