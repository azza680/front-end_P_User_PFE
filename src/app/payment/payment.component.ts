import { Component } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  paymentHandler: any = null;
  constructor() {}
  ngOnInit() {
    this.invokeStripe();
  }
  makePayment() {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51ORfw8CGCz5RXlZeoe3XDe37HmmqpZVdoHzeTdv6BwUbc2FN7TshEC3TQJeGrDQPE1oBRYJHeXUPDPqoUvwRZsAb00g0HXBiwp',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken);
        alert('Stripe token generated!');
        console.log("wsol lhna4");
        this.invokeStripe();
      },
    });
    paymentHandler.open({
      name: '',
      description: '',
   
    });
  }
  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      console.log("wsol lhna"),
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      console.log("wsol lhna1"),
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51Oji5gJWrsLJ8D1xQhzDTIUrYq3rsuU8KMuRYbFelv9NwU46WrvmcOQ16jzLfh08PMwdzsLcq8n9RuVasHPQUlRB00LmTRx2aE',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            console.log("wsol lhna2"),
            alert('Payment effectuée avec success!');
          },
        });
      };
      console.log("wsol lhna3"),
      window.document.body.appendChild(script);
    }
  }
  
}
