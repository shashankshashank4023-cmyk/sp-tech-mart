package com.spcomputers.dto;
import jakarta.validation.constraints.NotBlank;
public record PaymentVerifyRequest(@NotBlank String razorpay_order_id, @NotBlank String razorpay_payment_id, @NotBlank String razorpay_signature) {}
