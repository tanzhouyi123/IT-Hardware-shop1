import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const defaultColumn = 'reviews.review_id, reviews.order_id, reviews.rating, reviews.comment, reviews.admin_reply, reviews.created_at AS date';

export async function GET() {
    return NextResponse.json({ message: 'Invalid request' }, { status: 500 });
}

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
    switch (params.action) {
        case 'getReviewByOrderId':
            try {
                const { order_id } = await req.json();
                const result = await query(`SELECT ${defaultColumn} FROM reviews WHERE order_id = ?`, [order_id]);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'saveReview':
            try {
                const { order_id, rating, comment } = await req.json();
                // Check if review exist
                const prevReviewData = await query(`SELECT ${defaultColumn} FROM reviews WHERE order_id = ?`, [order_id]);
                const prevReview = JSON.parse(JSON.stringify(prevReviewData));
                let result;
                if (prevReview.length > 0)
                    result = await query(`UPDATE reviews SET rating = ${rating}, comment = '${comment}', updated_at = NOW() WHERE order_id = ${order_id}`);
                else
                    result = await query(`INSERT INTO reviews (order_id, rating, comment) VALUES (${order_id}, ${rating}, '${comment}')`);
                return NextResponse.json({ success: true, data: result });
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'getReviewByProductId':
            try {
                const { product_id } = await req.json();
                const result = await query(`
                    SELECT 
                        ${defaultColumn},
                        users.user_id,
                        users.first_name,
                        users.last_name
                    FROM orders
                    INNER JOIN reviews ON reviews.order_id = orders.order_id
                    INNER JOIN users ON users.user_id = orders.user_id
                    WHERE orders.product_id = ${product_id}
                `);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }

        default:
            return NextResponse.json({ message: 'Invalid API' }, { status: 500 });
    }
}