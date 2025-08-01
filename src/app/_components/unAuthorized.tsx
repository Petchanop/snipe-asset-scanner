'use client';

import { Box, Typography, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from 'next/navigation';

export default function UnauthorizedComponent() {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f5f5f5"
      textAlign="center"
      px={3}
    >
      <LockOutlinedIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      <Typography variant="h4" color="error" gutterBottom>
        401 - Unauthorized
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        You don’t have permission to access this page. Please log in or contact your administrator.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push('/auth/login')}>
        Go to Login
      </Button>
    </Box>
  );
}