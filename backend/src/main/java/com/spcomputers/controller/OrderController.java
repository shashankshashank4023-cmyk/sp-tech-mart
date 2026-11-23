package com.spcomputers.controller;
import com.spcomputers.dto.CheckoutRequest;
import com.spcomputers.dto.CheckoutResponse;
import com.spcomputers.dto.OrderResponse;
import com.spcomputers.service.CheckoutService;
import com.spcomputers.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/api/orders")
public class OrderController {
 private final CheckoutService checkout;private final OrderService orders;
 public OrderController(CheckoutService checkout,OrderService orders){this.checkout=checkout;this.orders=orders;}
 @PostMapping("/checkout") public CheckoutResponse checkout(Principal p,@Valid @RequestBody CheckoutRequest r){return checkout.checkout(p.getName(),r.shippingAddress());}
 @GetMapping("/my-orders") public List<OrderResponse> mine(Principal p){return orders.mine(p.getName());}
}
