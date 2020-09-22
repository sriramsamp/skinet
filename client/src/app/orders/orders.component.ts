import { OrderServiceService } from './order-service.service';
import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: IOrder[];

  constructor(private orderServiceService: OrderServiceService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderServiceService.getOrdersForUser().subscribe((orders: IOrder[]) => {
      this.orders = orders;
    }, error => {
      console.log(error);
    });
  }


}
