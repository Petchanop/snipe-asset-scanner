'use client'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation";

export default function LoginComponent() {
  const { data: session } = useSession()
  if (session) {
    redirect("/reports")
  }
  const { register, handleSubmit, setError, formState: { errors } } = useForm()
  const { push } = useRouter()

  const onSubmit = async (data: any) => {
    const result = await signIn('credentials', {
      redirect: false,
      username: data.Username,
      password: data.Password,
      callbackUrl: '/reports'
    })
    if (result && result.error) {
      setError("Username", { message: result.error })
    }
  }
  return (
    <Container className="lg:w-1/3 h-screen mt-15 justify-center">
      <Box className="bg-white p-4 rounded shadow-[1px_1px_2px_2px_rgba(0,0,0,0.1)] ring-gray-700 w-full">
        <Typography variant="h5" className="mb-4 text-gray-400 font-semibold">Login</Typography>
        {errors.Username?.message ?
          <Typography className="text-red-400 mb-2">* {errors.Username?.message as string}</Typography>
          : <></>
        }
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("Username")}
            label="Username"
            name="Username"
            fullWidth
            variant="outlined"
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
            <Button variant="text" fullWidth onClick={() => push(`/auth/register`)}>
              Register
            </Button>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Login
            </Button>
          </div>
        </form>
      </Box>
    </Container>
  );
}