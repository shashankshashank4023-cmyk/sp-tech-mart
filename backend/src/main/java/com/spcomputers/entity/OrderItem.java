package com.spcomputers.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter @Setter @NoArgsConstructor
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id", nullable = false) private CustomerOrder order;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_id") private Product product;
    @Column(nullable = false, length = 180) private String productName;
    @Column(nullable = false, length = 100) private String brand;
    @NotNull @Column(nullable = false, precision = 12, scale = 2) private BigDecimal unitPrice;
    @NotNull @Min(1) @Column(nullable = false) private int quantity;
}
