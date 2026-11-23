package com.spcomputers.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customer_orders")
@Getter @Setter @NoArgsConstructor
public class CustomerOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false) private AppUser user;
    @NotNull @Column(nullable = false, precision = 12, scale = 2) private BigDecimal totalAmount;
    @NotNull @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private OrderStatus orderStatus = OrderStatus.PENDING;
    @NotBlank @Column(nullable = false, length = 1000) private String shippingAddress;
    @Column(nullable = false, updatable = false) private Instant createdAt;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true) private List<OrderItem> items = new ArrayList<>();
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true) private Payment payment;
    @PrePersist void created() { if (createdAt == null) createdAt = Instant.now(); }
    public void addItem(OrderItem item) { items.add(item); item.setOrder(this); }
}
