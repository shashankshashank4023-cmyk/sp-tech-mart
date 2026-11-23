package com.spcomputers.repository;
import com.spcomputers.entity.CustomerOrder;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
public interface OrderRepository extends JpaRepository<CustomerOrder,Long> {
 @EntityGraph(attributePaths={"items","items.product","payment"}) List<CustomerOrder> findAllByOrderByCreatedAtDesc();
 @EntityGraph(attributePaths={"items","items.product","payment"}) List<CustomerOrder> findByUserIdOrderByCreatedAtDesc(Long userId);
 @EntityGraph(attributePaths={"items","items.product","payment"}) Optional<CustomerOrder> findWithDetailsById(Long id);
 @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select o from CustomerOrder o where o.id=:id") Optional<CustomerOrder> findByIdForUpdate(@Param("id") Long id);
 @Query("select coalesce(sum(o.totalAmount),0) from CustomerOrder o join o.payment p where p.status=com.spcomputers.entity.PaymentStatus.CAPTURED and o.orderStatus <> com.spcomputers.entity.OrderStatus.CANCELLED") BigDecimal sumCapturedRevenue();
 @Query("select count(o) from CustomerOrder o join o.payment p where p.status=com.spcomputers.entity.PaymentStatus.CAPTURED and o.orderStatus <> com.spcomputers.entity.OrderStatus.CANCELLED") long countCapturedOrders();
}
