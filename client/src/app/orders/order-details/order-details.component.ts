import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderServiceService } from './../order-service.service';
import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/shared/models/order';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: IOrder;

  constructor(
    private orderServiceService: OrderServiceService,
    private breadcrumbService: BreadcrumbService,
    private activatedRoute: ActivatedRoute) {
      this.breadcrumbService.set('@OrderDetailed', '');
     }

  ngOnInit(): void {
    this.getOrderById(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  getOrderById(id: number) {
    this.orderServiceService.getOrderById(id).subscribe((order: IOrder) => {
      this.order = order;
      this.breadcrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
    }, error => {
      console.log(error);
    });
  }
}
