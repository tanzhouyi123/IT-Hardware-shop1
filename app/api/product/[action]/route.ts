import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const defaultColumn = 'products.product_id, products.name, products.description, products.price, products.stock, products.category, products.cover, products.deleted_at';

export async function GET() {
    return NextResponse.json({ message: 'Invalid request' }, { status: 500 });
}

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
    switch (params.action) {
        case 'getAllProduct':
            try {
                const result = await query(`
                    SELECT 
                        ${defaultColumn},
                        CAST(AVG(reviews.rating) AS DOUBLE(10, 2)) as rating
                    FROM products
                    LEFT JOIN orders ON orders.product_id = products.product_id
                    LEFT JOIN reviews ON reviews.order_id = orders.order_id
                    WHERE products.deleted_at IS NULL
                    GROUP BY products.product_id
                `);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'getAllCategory':
            try {
                const result = await query(`SELECT DISTINCT category FROM products`);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'getProductByName':
            try {
                const { product_name } = await req.json();
                const result = await query(`
                    SELECT 
                        ${defaultColumn},
                        CAST(AVG(reviews.rating) AS DOUBLE(10, 2)) as rating
                    FROM products
                    LEFT JOIN orders ON orders.product_id = products.product_id
                    LEFT JOIN reviews ON reviews.order_id = orders.order_id
                    WHERE products.name LIKE '%${product_name}%' AND products.deleted_at IS NULL
                    GROUP BY products.product_id
                `);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'getProductById':
            try {
                const { product_id } = await req.json();
                const result = await query(`
                    SELECT 
                        ${defaultColumn},
                        CAST(AVG(reviews.rating) AS DOUBLE(10, 2)) as rating
                    FROM products
                    LEFT JOIN orders ON orders.product_id = products.product_id
                    LEFT JOIN reviews ON reviews.order_id = orders.order_id
                    WHERE products.product_id = ${product_id}
                    GROUP BY products.product_id
                `);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'getProductByCategoryName':
            try {
                const { category_name } = await req.json();
                const result = await query(`
                    SELECT 
                        ${defaultColumn},
                        CAST(AVG(reviews.rating) AS DOUBLE(10, 2)) as rating
                    FROM products
                    LEFT JOIN orders ON orders.product_id = products.product_id
                    LEFT JOIN reviews ON reviews.order_id = orders.order_id
                    WHERE products.category = '${category_name}' AND products.deleted_at IS NULL
                    GROUP BY products.product_id
                `);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }

        default:
            return NextResponse.json({ message: 'Invalid API' }, { status: 500 });
    }
}