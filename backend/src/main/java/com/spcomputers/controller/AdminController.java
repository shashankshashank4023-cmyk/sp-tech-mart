package com.spcomputers.controller;
import com.spcomputers.dto.ProductRequest;
import com.spcomputers.dto.ProductResponse;
import com.spcomputers.dto.OrderResponse;
import com.spcomputers.dto.RevenueResponse;
import com.spcomputers.entity.OrderStatus;
import com.spcomputers.service.OrderService;
import com.spcomputers.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/admin") @PreAuthorize("hasRole('ADMIN')")
public class AdminController {
 private final ProductService products;private final OrderService orders;
 public AdminController(ProductService products,OrderService orders){this.products=products;this.orders=orders;}
 @GetMapping("/products") public List<ProductResponse> products(){return products.adminList();}
 @PostMapping("/products") public ProductResponse create(@Valid @RequestBody ProductRequest r){return products.create(r);}
 @PutMapping("/products/{id}") public ProductResponse update(@PathVariable Long id,@Valid @RequestBody ProductRequest r){return products.update(id,r);}
 @DeleteMapping("/products/{id}") public void delete(@PathVariable Long id){products.delete(id);}
 @PutMapping("/products/{id}/stock") public ProductResponse stock(@PathVariable Long id,@RequestParam int quantity){return products.stock(id,quantity);}
 @GetMapping("/orders") public List<OrderResponse> allOrders(){return orders.all();}
 @PutMapping("/orders/{id}/status") public OrderResponse status(@PathVariable Long id,@RequestParam OrderStatus status){return orders.updateStatus(id,status);}
 @GetMapping("/analytics/revenue") public RevenueResponse revenue(){return new RevenueResponse(orders.revenue(),orders.paidOrders());}
}


