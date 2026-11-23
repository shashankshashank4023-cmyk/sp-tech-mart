package com.spcomputers.dto;
import com.spcomputers.entity.ProductCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
public record ProductRequest(@NotBlank @Size(max=180) String name, @NotBlank @Size(max=100) String brand, @NotNull ProductCategory category, @NotNull @DecimalMin("0.01") BigDecimal price, @DecimalMin("0.00") BigDecimal discountPrice, @Min(0) int stockQty, String specsJson, @Size(max=1000) String imageUrl, boolean active) {}
