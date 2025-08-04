'use client'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container'
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export default function RegisterComponent(props: { handleRegister: (data: any) => void }) {
    const { handleRegister } = props
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { push } = useRouter()

    return (
        <Container className="lg:w-1/3 h-screen mt-15 justify-center">
            <Box
                className="bg-white p-4 rounded shadow-[1px_1px_2px_2px_rgba(0,0,0,0.1)] ring-gray-700 w-full"
            >
                <Typography variant="h5" className="mb-6 text-gray-400 font-semibold" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleSubmit(handleRegister)}>
                    {
                        errors.FirstName ?
                            <Typography className="text-red-400 mb-2">* {errors.FirstName.message as string}</Typography>
                            : <></>
                    }
                    <TextField
                        error={errors.FirstName?.message ? true : false}
                        {...register("FirstName", {
                            required: "First name is required"
                        })}
                        label="First Name"
                        name="FirstName"
                        fullWidth
                        className="mb-4"
                    />
                    {
                        errors.LastName ?
                            <Typography className="text-red-400 mb-2">* {errors.LastName.message as string} </Typography>
                            : <></>
                    }
                    <TextField
                        error={errors.LastName?.message ? true : false}
                        {...register("LastName", {
                            required: "Last name is required"
                        })}
                        label="Last Name"
                        name="LastName"
                        fullWidth
                        className="mb-4"
                    />
                    {
                        errors.Position?.message ?
                            <Typography className="text-red-400 mb-2">* {errors.Position?.message as string} </Typography>
                            : <></>
                    }
                    {/* <TextField
                        error={errors.Position?.message ? true : false}
                        {...register("Position", {
                            required: "Position is required"
                        })}
                        label="Position"
                        name="Position"
                        fullWidth
                        className="mb-4"
                    />
                    {
                        errors.Email?.message ?
                            <Typography className="text-red-400 mb-2">* {errors.Email.message as string}</Typography>
                            : <></>
                    } */}
                    <TextField
                        error={errors.Email?.message ? true : false}
                        {...register("Email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        })}
                        label="Email"
                        name="Email"
                        type="email"
                        fullWidth
                        className="mb-4"
                    />
                    {
                        errors.Password?.message ?
                            <Typography className="text-red-400 mb-2">* {errors.Password?.message as string} </Typography>
                            : <></>
                    }
                    <TextField
                        error={errors.Password?.message ? true : false}
                        {...register("Password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                            },
                            maxLength: {
                                value: 15,
                                message: "Password must not exceed 15 characters",
                            },
                            validate: {
                                hasUpper: (value) =>
                                    /[A-Z]/.test(value) || "Password must include an uppercase letter",
                                hasLower: (value) =>
                                    /[a-z]/.test(value) || "Password must include a lowercase letter",
                                hasNumber: (value) =>
                                    /[0-9]/.test(value) || "Password must include a number",
                                hasSpecial: (value) =>
                                    /[@$!%*?&#]/.test(value) || "Password must include a special character",
                            },
                        })}
                        label="Password"
                        name="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        className="mb-6"
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