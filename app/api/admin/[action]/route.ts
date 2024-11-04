import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import path from "path";
import { writeFile } from "fs/promises";

export async function GET() {
    return NextResponse.json({ message: 'Invalid request' }, { status: 500 });
}

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
    switch (params.action) {
        case 'user_GetAllUsers':
            try {
                const result = await query(`
                    SELECT 
                        user_id, 
                        first_name, 
                        last_name, 
                        phone_number, 
                        email, 
                        role, 
                        created_at 
                    FROM users
                `);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'order_GetAllOrders':
            try {
                const result = await query(`
                    SELECT 
                        orders.order_id, 
                        orders.user_id,
                        orders.price,
                        orders.quantity,
                        orders.shipping_fee,
                        orders.total_amount,
                        orders.created_at,
                        orders.status,
                        CONCAT(users.first_name, ' ', users.last_name) AS user_name, 
                        users.email AS user_email,
                        products.product_id,
                        products.name AS product_name
                    FROM orders
                    INNER JOIN users ON orders.user_id = users.user_id
                    INNER JOIN products ON orders.product_id = products.product_id
                `);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'order_UpdateOrderStatus':
            try {
                const { order_id, status } = await req.json();
                const result = await query(`UPDATE orders SET status = '${status}' WHERE order_id = ${order_id}`);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'product_GetAllProducts':
            try {
                const result = await query(`
                    SELECT 
                        products.product_id, 
                        products.name, 
                        products.description, 
                        products.price, 
                        products.stock, 
                        products.category, 
                        products.cover,
                        products.deleted_at,
                        CAST(AVG(reviews.rating) AS DOUBLE(10, 2)) as rating
                    FROM products
                    LEFT JOIN orders ON orders.product_id = products.product_id
                    LEFT JOIN reviews ON reviews.order_id = orders.order_id
                    GROUP BY products.product_id
                `);
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'product_UploadCover':
            const formData = await req.formData();

            const file: any = formData.get("cover");
            if (!file) {
                return NextResponse.json({ error: "No files received." }, { status: 400 });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
            try {
                await writeFile(path.join(process.cwd(), "public/uploads/" + filename), buffer);
                return NextResponse.json({ Message: "Success", status: 201, success: true, data: "/uploads/" + filename });
            } catch (error) {
                return NextResponse.json({ Message: "Failed", status: 500, success: false, data: error });
            }
        case 'product_SaveProduct':
            try {
                const { product_id, name, description, price, stock, category, cover } = await req.json();
                // If product_id is provided, update the product. Otherwise, insert a new product.
                if (product_id) {
                    await query(`UPDATE products SET name = '${name}', description = '${description}', price = ${price}, stock = ${stock}, category = '${category}', cover = '${cover}' WHERE product_id = ${product_id}`);
                } else {
                    await query(`INSERT INTO products (name, description, price, stock, category, cover) VALUES ('${name}', '${description}', ${price}, ${stock}, '${category}', '${cover}')`);
                }
                return NextResponse.json({ success: true });
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'product_DeleteProduct':
            try {
                const { product_id } = await req.json();
                await query(`UPDATE products SET deleted_at = NOW() WHERE product_id = ${product_id}`);
                return NextResponse.json({ success: true });
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'review_UpdateReply':
            try {
                const { review_id, admin_reply } = await req.json();
                await query(`UPDATE reviews SET admin_reply = '${admin_reply}' WHERE review_id = ${review_id}`);
                return NextResponse.json({ success: true });
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }
        case 'dashboard_GetChartData':
            try {
                const { filter } = await req.json();
                // Function to generate an array of dates for the last 7 days
                const generateWeekDates = () => {
                    const today = new Date();
                    const dates = [];

                    for (let i = 0; i < 7; i++) {
                        const date = new Date(today);
                        date.setDate(today.getDate() - i);
                        dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
                    }

                    return dates.reverse();
                }

                // Function to generate an array of dates for the months
                const generateMonthDates = () => {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth();

                    const dates = [];
                    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the last day of the month

                    for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(year, month, day + 1);
                        dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
                    }

                    return dates;
                }

                // Function to generate an array of months for the year
                const generateYearMonths = () => {
                    const year = new Date().getFullYear();
                    const months = [];

                    for (let month = 0; month < 12; month++) {
                        const monthString = String(month + 1).padStart(2, '0'); // Format month as MM
                        months.push(`${year}-${monthString}`);
                    }

                    return months;
                }

                let dateList: string[] = [];
                let start_date = null;
                let end_date = null;
                let data = null;
                // Generate the date list and get the data based on the selected filter
                switch (filter) {
                    case "week":
                        dateList = generateWeekDates();
                        start_date = dateList[0];
                        end_date = new Date(dateList[dateList.length - 1]);
                        end_date = end_date.setDate(end_date.getDate() + 1);
                        end_date = new Date(end_date).toISOString().split('T')[0];

                        data = await query(`
                            SELECT 
                                DATE(created_at) AS date,
                                COUNT(*) AS orders,
                                SUM(total_amount) AS sales
                            FROM 
                                orders
                            WHERE 
                                created_at BETWEEN '${start_date}' AND '${end_date}'
                            GROUP BY 
                                DATE(created_at)
                            ORDER BY 
                                DATE(created_at);
                        `);
                        break;
                    case "month":
                        dateList = generateMonthDates();
                        start_date = dateList[0];
                        end_date = new Date(dateList[dateList.length - 1]);
                        end_date = end_date.setDate(end_date.getDate() + 1);
                        end_date = new Date(end_date).toISOString().split('T')[0];

                        data = await query(`
                            SELECT 
                                DATE(created_at) AS date,
                                COUNT(*) AS orders,
                                SUM(total_amount) AS sales
                            FROM 
                                orders
                            WHERE 
                                created_at BETWEEN '${start_date}' AND '${end_date}'
                            GROUP BY 
                                DATE(created_at)
                            ORDER BY 
                                DATE(created_at);
                        `);
                        break;
                    case "year":
                        dateList = generateYearMonths();
                        const currentYear = new Date().getFullYear();
                        start_date = new Date(currentYear, 0, 1).toISOString().split('T')[0];
                        end_date = new Date(currentYear + 1, 0, 1).toISOString().split('T')[0];

                        data = await query(`
                            SELECT 
                                DATE_FORMAT(created_at, '%Y-%m') AS date,
                                COUNT(*) AS orders,
                                SUM(total_amount) AS sales
                            FROM 
                                orders
                            WHERE 
                                created_at BETWEEN '${start_date}' AND '${end_date}'
                            GROUP BY 
                                DATE_FORMAT(created_at, '%Y-%m')
                            ORDER BY 
                                DATE_FORMAT(created_at, '%Y-%m');
                        `);
                        break;
                }

                data = JSON.parse(JSON.stringify(data));

                // Generate the template result
                let result = dateList.reduce((acc: any, date: string) => {
                    acc[date] = { date, order: 0, sales: 0 };
                    return acc;
                }, {});

                // Add the data to the result
                data.forEach((item: any) => {
                    const date = item.date.toString().split('T')[0];
                    result[date] = {
                        date: date,
                        order: item.orders,
                        sales: item.sales
                    };
                });
                
                // Format the result
                result = Object.values(result).map((item: any) => ({
                    date: item.date,
                    order: item.order,
                    sales: item.sales
                }));

                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ message: 'Failed to get product information', error }, { status: 500 });
            }

        default:
            return NextResponse.json({ message: 'Invalid API' }, { status: 500 });
    }
}