package com.spcomputers.dto;
import com.spcomputers.entity.ProductCategory;
import java.math.BigDecimal;
public record ProductResponse(Long id, String name, String brand, ProductCategory category, BigDecimal price, BigDecimal discountPrice, BigDecimal effectivePrice, int stockQty, String specsJson, String imageUrl, boolean active) {}
