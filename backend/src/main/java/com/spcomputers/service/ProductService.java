package com.spcomputers.service;
import com.spcomputers.dto.ProductRequest;
import com.spcomputers.dto.ProductResponse;
import com.spcomputers.entity.Product;
import com.spcomputers.entity.ProductCategory;
import com.spcomputers.exception.ApiException;
import com.spcomputers.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
@Service
public class ProductService {
 private final ProductRepository products;
 public ProductService(ProductRepository products){this.products=products;}
 @Transactional(readOnly=true) public Page<ProductResponse> search(ProductCategory category,String brand,BigDecimal min,BigDecimal max,Boolean inStock,String query,String laptopType,int page,int size){if(page<0)throw ApiException.badRequest("Page must be zero or greater");if(size<1||size>100)throw ApiException.badRequest("Page size must be between 1 and 100");if(min!=null&&max!=null&&min.compareTo(max)>0)throw ApiException.badRequest("minPrice cannot exceed maxPrice");Specification<Product> spec=(root,q,cb)->cb.isTrue(root.get("active"));if(category!=null)spec=spec.and((root,q,cb)->cb.equal(root.get("category"),category));if(brand!=null&&!brand.isBlank())spec=spec.and((root,q,cb)->cb.equal(cb.lower(root.get("brand")),brand.trim().toLowerCase()));if(min!=null)spec=spec.and((root,q,cb)->cb.greaterThanOrEqualTo(cb.coalesce(root.get("discountPrice"),root.get("price")),min));if(max!=null)spec=spec.and((root,q,cb)->cb.lessThanOrEqualTo(cb.coalesce(root.get("discountPrice"),root.get("price")),max));if(Boolean.TRUE.equals(inStock))spec=spec.and((root,q,cb)->cb.greaterThan(root.get("stockQty"),0));if(query!=null&&!query.isBlank()){String term="%"+query.trim().toLowerCase()+"%";spec=spec.and((root,q,cb)->cb.or(cb.like(cb.lower(root.get("name")),term),cb.like(cb.lower(root.get("brand")),term)));}if(laptopType!=null&&!laptopType.isBlank()){String term="%\"laptopType\":\""+laptopType.trim().toLowerCase()+"\"%";spec=spec.and((root,q,cb)->cb.like(cb.lower(root.get("specsJson")),term));}Pageable pageable=PageRequest.of(page,size,Sort.by(Sort.Direction.DESC,"id"));return products.findAll(spec,pageable).map(this::toResponse);}
 @Transactional(readOnly=true) public java.util.List<ProductResponse> adminList(){return products.findAll(Sort.by(Sort.Direction.DESC,"id")).stream().map(this::toResponse).toList();}
 @Transactional(readOnly=true) public ProductResponse get(Long id){return toResponse(products.findById(id).filter(Product::isActive).orElseThrow(()->ApiException.notFound("Product not found")));}
 @Transactional public ProductResponse create(ProductRequest r){Product p=new Product();apply(p,r);return toResponse(products.save(p));}
 @Transactional public ProductResponse update(Long id,ProductRequest r){Product p=products.findById(id).orElseThrow(()->ApiException.notFound("Product not found"));apply(p,r);return toResponse(products.save(p));}
 @Transactional public void delete(Long id){Product p=products.findById(id).orElseThrow(()->ApiException.notFound("Product not found"));p.setActive(false);products.save(p);}
 @Transactional public ProductResponse stock(Long id,int quantity){if(quantity<0)throw ApiException.badRequest("Stock quantity cannot be negative");Product p=products.findByIdForUpdate(id).orElseThrow(()->ApiException.notFound("Product not found"));p.setStockQty(quantity);return toResponse(p);}
 private void apply(Product p,ProductRequest r){p.setName(r.name().trim());p.setBrand(r.brand().trim());p.setCategory(r.category());p.setPrice(r.price());p.setDiscountPrice(r.discountPrice());p.setStockQty(r.stockQty());p.setSpecsJson(r.specsJson());p.setImageUrl(r.imageUrl());p.setActive(r.active());}
 public ProductResponse toResponse(Product p){return new ProductResponse(p.getId(),p.getName(),p.getBrand(),p.getCategory(),p.getPrice(),p.getDiscountPrice(),p.effectivePrice(),p.getStockQty(),p.getSpecsJson(),p.getImageUrl(),p.isActive());}
}



