import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, OrderDetail } from '../models';
import { WebService } from '../web.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  form: FormGroup;
  orderDetails: OrderDetail[] = [];

  constructor(private fb: FormBuilder, private webSvc: WebService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      employee_id: this.fb.control('', [ Validators.required ]),
      customer_id: this.fb.control('', [ Validators.required ]),
      order_date: this.fb.control('', [ Validators.required ]),
      product_id: this.fb.control('', [ Validators.required ]),
      quantity: this.fb.control('', [ Validators.required ]),
      unit_price: this.fb.control('', [ Validators.required ]),
      discount: this.fb.control('0', [ Validators.required ]),
      status_id: this.fb.control('0', [ Validators.required ])
    });
  }

  async onClickSubmit() {
    const newOrder: Order = {
      employee_id: parseInt(this.form.get('employee_id').value),
      customer_id: parseInt(this.form.get('customer_id').value),
      order_date: this.form.get('order_date').value,
      product_id: parseInt(this.form.get('product_id').value),
      quantity: parseInt(this.form.get('quantity').value),
      unit_price: parseFloat(this.form.get('unit_price').value),
      discount: parseInt(this.form.get('discount').value),
      status_id: parseInt(this.form.get('status_id').value)
    };
    console.info('-> newOrder: ', newOrder);

    await this.webSvc.sendOrder(newOrder);
  }

  onClickAddOrderDetail() {
    // do nothing for now
  }

}
