import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const defaultColumn = 'orders.order_id, orders.price, orders.quantity, orders.shipping_fee, orders.total_amount, orders.status';

export async function GET() {
    return NextResponse.json({ message: 'Invalid request' }, { status: 500 });
}

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
    switch (params.action) {
        case 'getOrdersByUserId':
            try {
                const { user_id } = await req.json();
                const result = await query(`
                    SELECT 
                        ${defaultColumn},
                        products.product_id,
                        products.name,
                        products.description,
                        products.cover
                    FROM 
                        orders
                    INNER JOIN
                        products
                    ON
                        orders.product_id = products.product_id
                    WHERE 
                        user_id = ${user_id}`
                );
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }

        default:
            return NextResponse.json({ message: 'Invalid API' }, { status: 500 });
    }
}