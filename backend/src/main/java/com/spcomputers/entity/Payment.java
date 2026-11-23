package com.spcomputers.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;

@Entity
@Table(name = "payments", uniqueConstraints = {
    @UniqueConstraint(name = "uk_payment_razorpay_order", columnNames = "razorpay_order_id"),
    @UniqueConstraint(name = "uk_payment_razorpay_payment", columnNames = "razorpay_payment_id")
})
@Getter @Setter @NoArgsConstructor
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id", nullable = false, unique = true) private CustomerOrder order;
    @Column(name = "razorpay_order_id", nullable = false, unique = true) private String razorpayOrderId;
    @Column(name = "razorpay_payment_id", unique = true) private String razorpayPaymentId;
    @Column(length = 256) private String razorpaySignature;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private PaymentStatus status = PaymentStatus.CREATED;
    @Column(nullable = false, updatable = false) private Instant createdAt;
    @PrePersist void created() { if (createdAt == null) createdAt = Instant.now(); }
}
