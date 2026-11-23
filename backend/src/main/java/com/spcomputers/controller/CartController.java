package com.spcomputers.controller;
import com.spcomputers.dto.CartAddRequest;
import com.spcomputers.dto.CartResponse;
import com.spcomputers.service.CartService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
@RestController @RequestMapping("/api/cart")
public class CartController {
 private final CartService carts;
 public CartController(CartService carts){this.carts=carts;}
 @GetMapping public CartResponse get(Principal p){return carts.get(p.getName());}
 @PostMapping("/add") public CartResponse add(Principal p,@Valid @RequestBody CartAddRequest r){return carts.add(p.getName(),r);}
 @DeleteMapping("/remove/{itemId}") public CartResponse remove(Principal p,@PathVariable Long itemId){return carts.remove(p.getName(),itemId);}
}
