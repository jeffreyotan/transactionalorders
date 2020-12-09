export interface Order {
    employee_id: number,
    customer_id: number,
    order_date: string,
    product_id: number,
    quantity: number,
    unit_price: number,
    discount: number,
    status_id: number
}

export interface OrderHeader {
    employee_id: number,
    customer_id: number,
    order_date: string
    // ship_name: string,
    // ship_address: string,
    // ship_city: string,
    // ship_state_province: string,
    // ship_zip_postal_code: string,
    // ship_country_region: string,
    // shipping_fee: number,
    // taxes: number,
    // payment_type: string,
    // tax_rate: number,
    // status_id: number
}

export interface OrderDetail {
    product_id: number,
    quantity: number,
    unit_price: number,
    discount: number,
    status_id: number
}