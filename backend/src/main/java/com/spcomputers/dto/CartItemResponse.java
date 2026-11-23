package com.spcomputers.dto;
import java.math.BigDecimal;
public record CartItemResponse(Long itemId, Long productId, String name, String brand, BigDecimal unitPrice, int quantity, BigDecimal lineTotal, String imageUrl, int stockQty) {}
