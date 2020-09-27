using System.IO;
using System.Threading.Tasks;
using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;

using Order = Core.Entities.OrderAggregate.Order;
using OrderStatus = Core.Entities.OrderAggregate.OrderStatus;

namespace API.Controllers
{
    public class PaymentController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<IPaymentService> _logger;

        private const string WhSecret = "whsec_DZvpDnT49Ugnysu9Z7itQ1Ss6KT6fxcQ";
        public PaymentController(IPaymentService paymentService, ILogger<IPaymentService> logger)
        {
            _logger = logger;
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await this._paymentService.CreateOrUpdatePaymentIntent(basketId);

            if (basket == null) return BadRequest(new ApiResponse(400, "Problem with your basket"));

            return basket;
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], WhSecret);

            PaymentIntent intent;
            Order order;

            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Succeeded: " + intent.Id);
                    order = await this._paymentService.UpdateOrderPaymentStatus(intent.Id, OrderStatus.PaymentReceived);
                    _logger.LogInformation("Order status updated to payment received: ", order.Id);
                    break;
                
                case "payment_intent.payment_failed":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Failed: " + intent.Id);
                    order = await this._paymentService.UpdateOrderPaymentStatus(intent.Id, OrderStatus.PaymentFailed);
                    _logger.LogInformation("Order status updated to payment failed: ", order.Id);
                    break;
            }

            return new EmptyResult();
        }
    }
}