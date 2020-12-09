// step 1: load needed libraries and modules
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

// step 2: configure PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

// step 3: create an instance of the express server
const app = express();

// step 4: create a mysql DB connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME || 'northwind',
    connectionLimit: process.env.DB_CONN_LIMIT || 4,
    timezone: '+08:00'
});

// step 5: define a start up function/routine to ensure that the server start up with the appropriate resources
const startApp = async (newApp, newPool) => {
    // we do not know if a connection can be established at this time
    try {
        // try to get a connection
        const conn = await newPool.getConnection();

        // output a message so that admin know what step the server is running
        console.info('We are pinging the database..');
        await conn.ping();

        // release the connection immediately after use
        conn.release();

        // start the server after confirmation that the DB connection can be established
        newApp.listen(PORT, () => {
            console.info(`Server was started at port ${PORT} on ${new Date()}`);
        });
    } catch (e) {
        console.error('=> Error occurred while establishing DB connection: ', e);
    }
};

// step 6: define the SQL queries
const SQL_QUERY_INSERT_ORDERS = "insert into orders (employee_id, customer_id, order_date) values (?, ?, ?)";
const SQL_QUERY_INSERT_ORDER_DETAILS = "insert into order_details (order_id, product_id, quantity, unit_price, discount, status_id) values (?, ?, ?, ?, ?, ?)";

const makeQuery = (sql, pool) => {
    console.info('=> Creating query: ', sql);
    return (async (args) => {
        console.info("=> Received args: ", args);
        const conn = await pool.getConnection();
        try {
            let results = await conn.query(sql, args) || [];
            return results[0];
        } catch (e) {
            console.error(e);
        } finally {
            conn.release();
        }
    });
}

const insertOrders = makeQuery(SQL_QUERY_INSERT_ORDERS, pool);
const insertOrderDetails = makeQuery(SQL_QUERY_INSERT_ORDER_DETAILS, pool);

// Step 7: define middlewares and any necessary routes
app.use(cors());
app.use(express.urlencoded( {extended: true} ));
app.use(express.json());

// POST /order
// Content-Type: application/x-www-form-urlencoded
app.post('/order', async (req, res, next) => {
    const bodyInfo = req.body;
    // console.info('=> Body received: ', bodyInfo);

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        let result = await insertOrders([
            parseInt(bodyInfo['employee_id']),
            parseInt(bodyInfo['customer_id']),
            bodyInfo['order_date']
        ]);
        console.info("=> insertOrders result: ", result);

        // note that the order_id is found in the field result.insertId
        result = await insertOrderDetails([
            result['insertId'],
            parseInt(bodyInfo['product_id']),
            parseInt(bodyInfo['quantity']),
            parseFloat(bodyInfo['unit_price']),
            parseInt(bodyInfo['discount']),
            parseInt(bodyInfo['status_id'])
        ]);
        console.info("=> insertOrderDetails result: ", result);

        await conn.commit();
    } catch (e) {
        console.info('=> Rollback Called: ', e);
        conn.rollback();
    } finally {
        conn.release();
    }

    res.status(200).contentType('application/json');
    res.json({ status: "Success" });
});

app.use((req, res, next) => {
    res.redirect('/');
});

// Step 8: start the server program
startApp(app, pool);
