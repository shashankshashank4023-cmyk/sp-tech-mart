package com.spcomputers.dto;
import com.spcomputers.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
public record OrderResponse(Long orderId, BigDecimal totalAmount, OrderStatus orderStatus, String shippingAddress, Instant createdAt, List<OrderLineResponse> items) {
 public record OrderLineResponse(Long productId, String productName, String brand, BigDecimal unitPrice, int quantity) {}
}
