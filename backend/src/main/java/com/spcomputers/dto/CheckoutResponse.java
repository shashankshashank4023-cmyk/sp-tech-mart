package com.spcomputers.dto;
public record CheckoutResponse(Long orderId, String razorpayOrderId, long amount, String currency, String razorpayKeyId) {}
