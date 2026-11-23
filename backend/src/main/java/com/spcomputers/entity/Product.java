package com.spcomputers.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank @Size(max = 180) @Column(nullable = false, length = 180) private String name;
    @NotBlank @Size(max = 100) @Column(nullable = false, length = 100) private String brand;
    @NotNull @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private ProductCategory category;
    @NotNull @DecimalMin("0.01") @Column(nullable = false, precision = 12, scale = 2) private BigDecimal price;
    @DecimalMin("0.00") @Column(precision = 12, scale = 2) private BigDecimal discountPrice;
    @Column(nullable = false) private int stockQty;
    @Column(columnDefinition = "json") private String specsJson;
    @Size(max = 1000) @Column(length = 1000) private String imageUrl;
    @Column(nullable = false) private boolean active = true;
    @Version private Long version;

    public BigDecimal effectivePrice() {
        return discountPrice != null && discountPrice.compareTo(BigDecimal.ZERO) > 0 && discountPrice.compareTo(price) < 0 ? discountPrice : price;
    }
}
