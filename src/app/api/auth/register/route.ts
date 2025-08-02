import { NextRequest } from 'next/server'
import { CreateAssetCountUser } from '@/api/auth.api';

export const POST = async (request: NextRequest) => {
    const { FirstName, LastName, Email, Password } = await request.json();
    const newUser = {
        FirstName: FirstName,
        LastName: LastName,
        Password: Password,
    }
    try {
        const user = await CreateAssetCountUser(newUser)
        if (!user) {
            return new Response(JSON.stringify({ message: `Cannot register ${FirstName} ${LastName}.` }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ message: `User ${user?.username} has been created and verification email sent.` }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}