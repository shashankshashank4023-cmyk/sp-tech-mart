package com.spcomputers.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "app_users", uniqueConstraints = @UniqueConstraint(name = "uk_app_users_email", columnNames = "email"))
@Getter @Setter @NoArgsConstructor
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank @Size(max = 100) @Column(nullable = false, length = 100) private String name;
    @NotBlank @Email @Size(max = 190) @Column(nullable = false, length = 190) private String email;
    @NotBlank @Size(max = 20) @Column(nullable = false, length = 20) private String phone;
    @NotBlank @Column(nullable = false) private String password;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private Role role = Role.ROLE_CUSTOMER;
    @Size(max = 1000) @Column(length = 1000) private String shippingAddress;
}
