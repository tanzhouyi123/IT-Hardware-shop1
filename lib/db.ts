import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'utc'
});

// Check if the connection is successful
async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

checkConnection();

export async function query(sql: string, values?: any) {
    const [results] = await pool.execute(sql, values);
    return results;
}
