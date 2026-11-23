package com.spcomputers.service;
import com.spcomputers.dto.OrderResponse;
import com.spcomputers.entity.*;
import com.spcomputers.exception.ApiException;
import com.spcomputers.repository.OrderRepository;
import com.spcomputers.repository.ProductRepository;
import com.spcomputers.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
@Service
public class OrderService {
 private final OrderRepository orders;private final UserRepository users;private final ProductRepository products;
 public OrderService(OrderRepository orders,UserRepository users,ProductRepository products){this.orders=orders;this.users=users;this.products=products;}
 @Transactional(readOnly=true) public List<OrderResponse> mine(String email){AppUser u=users.findByEmailIgnoreCase(email).orElseThrow(()->ApiException.notFound("User not found"));return orders.findByUserIdOrderByCreatedAtDesc(u.getId()).stream().map(this::map).toList();}
 @Transactional(readOnly=true) public List<OrderResponse> all(){return orders.findAllByOrderByCreatedAtDesc().stream().map(this::map).toList();}
 @Transactional public OrderResponse updateStatus(Long id,OrderStatus next){CustomerOrder o=orders.findByIdForUpdate(id).orElseThrow(()->ApiException.notFound("Order not found"));OrderStatus old=o.getOrderStatus();if(old==next)return map(o);if(old==OrderStatus.DELIVERED||old==OrderStatus.CANCELLED)throw ApiException.conflict("A completed or cancelled order cannot be changed");if(next==OrderStatus.PENDING||next==OrderStatus.PAID)throw ApiException.badRequest("Status can only move forward from the admin panel");if(next==OrderStatus.PROCESSING&&old!=OrderStatus.PAID)throw ApiException.conflict("Only paid orders can be processed");if(next==OrderStatus.SHIPPED&&old!=OrderStatus.PAID&&old!=OrderStatus.PROCESSING)throw ApiException.conflict("Only paid or processing orders can be shipped");if(next==OrderStatus.DELIVERED&&old!=OrderStatus.SHIPPED)throw ApiException.conflict("Only shipped orders can be delivered");if(next==OrderStatus.CANCELLED){if(old==OrderStatus.SHIPPED)throw ApiException.conflict("A shipped order cannot be cancelled from this endpoint");if(o.getPayment()!=null&&o.getPayment().getStatus()==PaymentStatus.CAPTURED)restoreStock(o);}
  o.setOrderStatus(next);return map(o);
 }
 @Transactional(readOnly=true) public BigDecimal revenue(){return orders.sumCapturedRevenue();}
 @Transactional(readOnly=true) public long paidOrders(){return orders.countCapturedOrders();}
 private void restoreStock(CustomerOrder o){for(OrderItem item:o.getItems()){if(item.getProduct()==null)continue;Product p=products.findByIdForUpdate(item.getProduct().getId()).orElseThrow(()->ApiException.notFound("Ordered product not found"));p.setStockQty(p.getStockQty()+item.getQuantity());}}
 private OrderResponse map(CustomerOrder o){List<OrderResponse.OrderLineResponse> lines=o.getItems().stream().map(i->new OrderResponse.OrderLineResponse(i.getProduct()==null?null:i.getProduct().getId(),i.getProductName(),i.getBrand(),i.getUnitPrice(),i.getQuantity())).toList();return new OrderResponse(o.getId(),o.getTotalAmount(),o.getOrderStatus(),o.getShippingAddress(),o.getCreatedAt(),lines);}
}
