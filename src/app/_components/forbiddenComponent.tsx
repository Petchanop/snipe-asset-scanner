'use client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BlockIcon from '@mui/icons-material/Block'; // More fitting for 403
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
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
      <BlockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      <Typography variant="h4" color="error" gutterBottom>
        403 - Forbidden
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        You don’t have permission to register Please contact your administrator.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push('/')}>
        Go to Homepage
      </Button>
    </Box>
  );
}