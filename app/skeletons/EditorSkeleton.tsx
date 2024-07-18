import { Box, Skeleton } from "@mui/material";
const EditorSkeleton = () => {
    return (
        <>
            <Box width="100%" display='flex' py={0.5} >
                <Skeleton variant="rounded" width={30} height={30} sx={{ mx: 0.25, animationDuration: '0.4s' }} />
                <Skeleton variant="rounded" width={30} height={30} sx={{ mx: 0.25, animationDuration: '0.4s' }} />
                <Skeleton variant="rounded" width={30} height={30} sx={{ mx: 0.25, animationDuration: '0.4s' }} />
                <Skeleton variant="rounded" width={30} height={30} sx={{ mx: 0.25, animationDuration: '0.4s' }} />
            </Box>
            <Box style={{ width: "100%" }} mb={2}>
                <Skeleton variant="rounded" width={"100%"} height={100} style={{ margin: 'auto', animationDuration: '0.4s' }} />
            </Box>
        </>
    );
}

export default EditorSkeleton;