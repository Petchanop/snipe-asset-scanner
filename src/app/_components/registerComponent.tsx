'use client'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container'
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export default function RegisterComponent( props: { handleRegister: (data: any) => void }) {
    const { handleRegister } = props
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { push } = useRouter()

    return (
        <Container className="lg:w-1/3 h-screen mt-15 justify-center">
            <Box className="bg-white p-4 rounded shadow-[1px_1px_2px_2px_rgba(0,0,0,0.1)] ring-gray-700 w-full">
                <Typography variant="h5" className="mb-6 text-gray-400 font-semibold" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <TextField
                        {...register("FirstName")}
                        label="First Name"
                        name="FirstName"
                        fullWidth
                        className="mb-4"
                        required
                    />
                    {errors.FirstName?.message as string}
                    <TextField
                        {...register("LastName")}
                        label="Last Name"
                        name="LastName"
                        fullWidth
                        className="mb-4"
                        required
                    />
                    <TextField
                        {...register("Position")}
                        label="Position"
                        name="position"
                        fullWidth
                        className="mb-4"
                        required
                    />
                    <TextField
                        {...register("Email")}
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        className="mb-4"
                        required
                    />
                    <TextField
                        {...register("Password")}
                        label="Password"
                        name="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        className="mb-6"
                        required
                    />
                    <div className="flex flex-row space-x-2">
                        <Button variant="contained" color="inherit" fullWidth onClick={() => push(`/auth/login`)}>
                            Back
                        </Button>
                        <Button variant="text" fullWidth type="submit" >
                            Register
                        </Button>
                    </div>
                </form>
            </Box>
        </Container>
    );
}