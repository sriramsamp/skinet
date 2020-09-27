import { AccountService } from './../../account/account.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IAddress } from 'src/app/shared/models/address';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  saveUserAddress() {
    this.accountService.UpdateUserAddress(this.checkoutForm.get('addressForm').value).subscribe((address: IAddress) => {
      this.toastr.success('Address saved');
      this.checkoutForm.get('addressForm').reset(address);
    }, error => {
      this.toastr.error(error.message);
      console.log(error);
    });
  }
}
