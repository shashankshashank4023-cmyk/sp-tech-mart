package com.spcomputers.controller;
import com.spcomputers.dto.ProductResponse;
import com.spcomputers.entity.ProductCategory;
import com.spcomputers.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
@RestController @RequestMapping("/api/products")
public class ProductController {
 private final ProductService products;
 public ProductController(ProductService products){this.products=products;}
 @GetMapping public Page<ProductResponse> list(@RequestParam(required=false) ProductCategory category,@RequestParam(required=false) String brand,@RequestParam(required=false) BigDecimal minPrice,@RequestParam(required=false) BigDecimal maxPrice,@RequestParam(required=false) Boolean inStock,@RequestParam(required=false) String q,@RequestParam(required=false) String laptopType,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="12") int size){return products.search(category,brand,minPrice,maxPrice,inStock,q,laptopType,page,size);}
 @GetMapping("/{id}") public ProductResponse get(@PathVariable Long id){return products.get(id);}
}

