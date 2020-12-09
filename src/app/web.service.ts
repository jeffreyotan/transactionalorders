import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Order } from './models';

@Injectable()
export class WebService {

    svrUrl: string = "http://localhost:3000";
    resourceUrl: string = "/order";

    constructor(private http: HttpClient) {}

    async sendOrder(newOrder: Order) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        const results = await this.http.post(`${this.svrUrl}${this.resourceUrl}`, this.convertBodyDatatoString(newOrder), httpOptions).toPromise();
        console.info('=> Results obtained: ', results);
    }

    convertBodyDatatoString(newOrder: Order): string {
        const orderString = `employee_id=${newOrder.employee_id}&customer_id=${newOrder.customer_id}&order_date=${newOrder.order_date}&product_id=${newOrder.product_id}&quantity=${newOrder.quantity}&unit_price=${newOrder.unit_price}&discount=${newOrder.discount}&status_id=${newOrder.status_id}`;
        return orderString;
    }

}