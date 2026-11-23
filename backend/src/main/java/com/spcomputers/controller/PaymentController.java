package com.spcomputers.controller;
import com.spcomputers.dto.PaymentVerifyRequest;
import com.spcomputers.service.CheckoutService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/payments")
public class PaymentController {
 private final CheckoutService checkout;
 public PaymentController(CheckoutService checkout){this.checkout=checkout;}
 @PostMapping("/verify") public Map<String,String> verify(@Valid @RequestBody PaymentVerifyRequest r){return Map.of("message",checkout.verify(r));}
}
