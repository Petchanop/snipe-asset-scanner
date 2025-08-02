import RegisterComponent from "@/_components/registerComponent";
import { redirect } from 'next/navigation'

export default async function RegisterPage(){

     const handleRegister = async (data: any) => {
        'use server'
        const payload = {
            method: "POST",
            body: JSON.stringify(data),
        }
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/register`, payload)
        if (response.status == 201) {
            redirect(`/auth/login`)
        }
        else
            redirect('/forbidden')
        // You can send this to an API route or backend here
    };
    return (
        <RegisterComponent handleRegister={handleRegister}/>
    )
}