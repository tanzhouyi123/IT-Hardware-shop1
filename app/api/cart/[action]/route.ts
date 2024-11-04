import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const defaultColumn = 'cart_id, product_id, quantity, user_id';

export async function GET() {
    return NextResponse.json({ message: 'Invalid request' }, { status: 500 });
}

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
    switch (params.action) {
        case 'addToCart':
            try {
                const { user_id, product_id, quantity } = await req.json();
                let result;
                // Check if product exist in cart
                const existResultData = await query(`SELECT ${defaultColumn} FROM carts WHERE user_id = ? AND product_id = ?`, [user_id, product_id]);
                const existResult = JSON.parse(JSON.stringify(existResultData));
                if (existResult.length > 0) {
                    // Update quantity
                    result = await query(`UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`, [quantity, user_id, product_id]);
                } else {
                    // Insert product to cart
                    result = await query(`INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)`, [user_id, product_id, quantity]);
                }
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'getCartByUserId':
            try {
                const { user_id } = await req.json();
                const result = await query(`
                    SELECT 
                        carts.cart_id, 
                        carts.quantity,
                        products.product_id, 
                        products.name, 
                        products.price, 
                        products.description, 
                        products.stock, 
                        products.cover,
                        products.deleted_at
                    FROM 
                        carts 
                    INNER JOIN 
                        products ON carts.product_id = products.product_id 
                    WHERE 
                        carts.user_id = ? 
                    ORDER BY 
                        carts.cart_id DESC`
                    , [user_id]);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'updateCartQuantityByCartId':
            try {
                const { cart_id, quantity } = await req.json();
                const result = await query(`UPDATE carts SET quantity = ? WHERE cart_id = ?`, [quantity, cart_id]);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'deleteCartByCartId':
            try {
                const { cart_id } = await req.json();
                const result = await query(`DELETE FROM carts WHERE cart_id = ?`, [cart_id]);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'makeOrder':
            try {
                const { user_id, product_id, price, quantity, shipping_fee, total_amount } = await req.json();
                const result = await query(`INSERT INTO orders (user_id, product_id, price, quantity, shipping_fee, total_amount, status) VALUES (${user_id}, ${product_id}, ${price}, ${quantity}, ${shipping_fee}, ${total_amount}, 'Pending')`);
                // Update stock
                await query(`UPDATE products SET stock = stock - ? WHERE product_id = ?`, [quantity, product_id]);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }

        default:
            return NextResponse.json({ message: 'Invalid API' }, { status: 500 });
    }
}