package com.spcomputers.dto;
import java.math.BigDecimal;
public record RevenueResponse(BigDecimal totalRevenue, long paidOrders) {}
