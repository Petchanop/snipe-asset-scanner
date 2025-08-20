import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function Gone410(props: {reportId: number}) {
  const { reportId } = props
  return (
    <Container sx={{ textAlign: 'center', mt: 10, height: 400 }} className="space-y-4">
      <Typography variant="h3" gutterBottom sx={{ color: '#d32f2f'}}>
        410 – Gone
      </Typography>
      <Typography variant="body1" gutterBottom>
        The resource for document number {reportId} has been permanently removed.
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">
          Go Home
        </Button>
      </Link>
    </Container>
  );
}