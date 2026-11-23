package com.spcomputers.service;
import com.spcomputers.dto.CartAddRequest;
import com.spcomputers.dto.CartItemResponse;
import com.spcomputers.dto.CartResponse;
import com.spcomputers.entity.AppUser;
import com.spcomputers.entity.Cart;
import com.spcomputers.entity.CartItem;
import com.spcomputers.entity.Product;
import com.spcomputers.exception.ApiException;
import com.spcomputers.repository.CartItemRepository;
import com.spcomputers.repository.CartRepository;
import com.spcomputers.repository.ProductRepository;
import com.spcomputers.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
@Service
public class CartService {
 private final CartRepository carts;private final CartItemRepository items;private final ProductRepository products;private final UserRepository users;
 public CartService(CartRepository carts,CartItemRepository items,ProductRepository products,UserRepository users){this.carts=carts;this.items=items;this.products=products;this.users=users;}
 @Transactional(readOnly=true) public CartResponse get(String email){Cart c=cart(email);return map(c);}
 @Transactional public CartResponse add(String email,CartAddRequest r){Product p=products.findById(r.productId()).filter(Product::isActive).orElseThrow(()->ApiException.notFound("Product not found"));Cart c=cart(email);CartItem item=c.getItems().stream().filter(i->i.getProduct().getId().equals(p.getId())).findFirst().orElse(null);int quantity=(item==null?0:item.getQuantity())+r.quantity();if(quantity>p.getStockQty())throw ApiException.conflict("Requested quantity exceeds available stock");if(item==null){item=new CartItem();item.setProduct(p);item.setQuantity(r.quantity());c.addItem(item);}else item.setQuantity(quantity);carts.save(c);return map(c);}
 @Transactional public CartResponse remove(String email,Long itemId){CartItem item=items.findByIdAndCartUserId(itemId,user(email).getId()).orElseThrow(()->ApiException.notFound("Cart item not found"));Cart c=item.getCart();c.removeItem(item);carts.save(c);return map(c);}
 @Transactional public void clear(Long userId){carts.findByUserId(userId).ifPresent(c->{c.getItems().clear();carts.save(c);});}
 private Cart cart(String email){AppUser u=user(email);return carts.findByUserId(u.getId()).orElseGet(()->{Cart c=new Cart();c.setUser(u);return carts.save(c);});}
 private AppUser user(String email){return users.findByEmailIgnoreCase(email).orElseThrow(()->ApiException.notFound("User not found"));}
 private CartResponse map(Cart c){List<CartItemResponse> rows=c.getItems().stream().map(i->{BigDecimal unit=i.getProduct().effectivePrice();return new CartItemResponse(i.getId(),i.getProduct().getId(),i.getProduct().getName(),i.getProduct().getBrand(),unit,i.getQuantity(),unit.multiply(BigDecimal.valueOf(i.getQuantity())),i.getProduct().getImageUrl(),i.getProduct().getStockQty());}).toList();BigDecimal total=rows.stream().map(CartItemResponse::lineTotal).reduce(BigDecimal.ZERO,BigDecimal::add);return new CartResponse(rows,total);}
}
