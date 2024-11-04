import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const defaultColumn = 'user_id, first_name, last_name, phone_number, email, role';

export async function GET() {
    return NextResponse.json({ message: 'Invalid request' }, { status: 500 });
}

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
    switch (params.action) {
        case 'getUserById':
            try {
                const { user_id } = await req.json();
                const result = await query(`SELECT ${defaultColumn} FROM users WHERE user_id = ?`, [user_id]);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get user information', error }, { status: 500 });
            }
        case 'getUserByEmail':
            try {
                const { email } = await req.json();
                const result = await query(`SELECT ${defaultColumn} FROM users WHERE email = ?`, [email]);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get user information', error }, { status: 500 });
            }
        case 'addUser':
            try {
                const { first_name, last_name, phone_number, email, password } = await req.json();
                const result = await query('INSERT INTO users (first_name, last_name, phone_number, email, password) VALUES (?, ?, ?, ?, ?)', [first_name, last_name, phone_number, email, password]);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to add user', error }, { status: 500 });
            }

        default:
            return NextResponse.json({ message: 'Invalid API' }, { status: 500 });
    }
}