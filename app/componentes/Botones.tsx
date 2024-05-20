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

export { BotonOutline, BotonSimple };