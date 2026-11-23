package com.spcomputers.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record CheckoutRequest(@NotBlank @Size(max=1000) String shippingAddress) {}
