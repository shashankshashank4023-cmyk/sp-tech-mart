package com.spcomputers.config;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spcomputers.entity.Product;
import com.spcomputers.entity.ProductCategory;
import com.spcomputers.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
@Configuration
public class DemoCatalogSeedConfig {
 @Bean @ConditionalOnProperty(name="app.catalog.demo-seed",havingValue="true") CommandLineRunner seedDemoCatalog(ProductRepository repo,ObjectMapper mapper){return args->{if(repo.count()>0)return;List<String[]> laptops=List.of(
  new String[]{"ROG Strix SCAR 16","ASUS","Gaming","279990","Intel Core Ultra 9 · RTX 5080 · 16 inch 240Hz Mini LED"},
  new String[]{"ROG Zephyrus G14 OLED","ASUS","Gaming","199990","AMD Ryzen AI 9 · RTX 5070 · 14 inch 3K OLED"},
  new String[]{"TUF Gaming A15","ASUS","Gaming","129990","AMD Ryzen 7 · RTX 5060 · 15.6 inch 165Hz"},
  new String[]{"Legion Pro 7i","Lenovo","Gaming","269990","Intel Core Ultra 9 · RTX 5080 · 16 inch OLED 240Hz"},
  new String[]{"LOQ 15","Lenovo","Gaming","109990","Intel Core i7 HX · RTX 5060 · 15.6 inch 144Hz"},
  new String[]{"OMEN 16","HP","Gaming","149990","Intel Core Ultra 7 · RTX 5070 · 16 inch QHD"},
  new String[]{"Victus 15","HP","Gaming","84990","AMD Ryzen 7 · RTX 4050 · 15.6 inch FHD 144Hz"},
  new String[]{"ProArt P16 OLED","ASUS","Creator","249990","AMD Ryzen AI 9 · RTX 5070 · 16 inch 4K OLED touch"},
  new String[]{"Zephyrus G14 Creator Edition","ASUS","Creator","189990","AMD Ryzen AI 9 · RTX 5060 · 14 inch OLED"},
  new String[]{"Precision 5690 Mobile Workstation","Dell","Workstation","289990","Intel Core Ultra 9 · professional graphics · 16 inch UHD+"},
  new String[]{"ThinkPad X1 Carbon","Lenovo","Business","189990","Intel Core Ultra 7 · 32GB · 14 inch OLED"},
  new String[]{"Latitude 7450","Dell","Business","159990","Intel Core Ultra 7 · 16GB · 14 inch business display"},
  new String[]{"Zenbook 14 OLED","ASUS","Ultrabook","109990","Intel Core Ultra 7 · 16GB · 14 inch 3K OLED"},
  new String[]{"Swift Go 14 OLED","Acer","Ultrabook","89990","Intel Core Ultra 7 · 16GB · 14 inch 2.8K OLED"},
  new String[]{"Yoga 9i 2-in-1","Lenovo","2-in-1","169990","Intel Core Ultra 7 · 360 degree touch · 14 inch OLED"},
  new String[]{"OmniBook Flip x360 14","HP","2-in-1","119990","Intel Core Ultra 7 · 360 degree touch · 14 inch OLED"},
  new String[]{"IdeaPad Slim 3","Lenovo","Student","54990","AMD Ryzen 5 · 16GB · 15.6 inch FHD"},
  new String[]{"Aspire 5","Acer","Student","59990","Intel Core i5 · 16GB · 15.6 inch IPS"},
  new String[]{"Chromebook Plus 514","Acer","Chromebook","39990","Intel Core i3 · 8GB · 14 inch FHD"},
  new String[]{"MacBook Air 13 M4","Apple","MacBook","99900","Apple M4 · 16GB unified memory · 13.6 inch Liquid Retina"},
  new String[]{"MacBook Pro 14 M4 Pro","Apple","MacBook","199900","Apple M4 Pro · 24GB unified memory · 14.2 inch XDR"},
  new String[]{"Inspiron 14 2-in-1","Dell","2-in-1","79990","Intel Core Ultra 5 · 16GB · 14 inch touchscreen"}
 );for(String[] row:laptops){Product p=new Product();p.setName(row[0]);p.setBrand(row[1]);p.setCategory(ProductCategory.Laptops);p.setPrice(new BigDecimal(row[3]));p.setDiscountPrice(new BigDecimal(row[3]).multiply(new BigDecimal("0.95")).setScale(2));p.setStockQty(5);p.setActive(true);p.setImageUrl("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=82");p.setSpecsJson(mapper.writeValueAsString(Map.of("laptopType",row[2],"details",row[4])));repo.save(p);}
  seed(repo,ProductCategory.CPUs,"Ryzen 7 9800X3D Processor","AMD",52990,"{\"cores\":\"8 cores · 16 threads\",\"socket\":\"AM5\"}");seed(repo,ProductCategory.Motherboards,"AORUS B850 Elite WiFi7","Gigabyte",26990,"{\"socket\":\"AM5\",\"formFactor\":\"ATX\"}");seed(repo,ProductCategory.RAM,"Vengeance DDR5 32GB 6000MHz","Corsair",10990,"{\"capacity\":\"32GB\",\"type\":\"DDR5\"}");seed(repo,ProductCategory.GPUs,"GeForce RTX 5070 Ti 16GB","Gigabyte",104999,"{\"memory\":\"16GB GDDR7\"}");seed(repo,ProductCategory.Storage,"990 PRO 2TB NVMe SSD","Samsung",17990,"{\"capacity\":\"2TB\",\"interface\":\"NVMe Gen4\"}");seed(repo,ProductCategory.PSUs,"RM850e 850W Gold PSU","Corsair",10990,"{\"wattage\":\"850W\",\"rating\":\"80+ Gold\"}");seed(repo,ProductCategory.Cabinets,"North XL PC Cabinet","Fractal Design",15990,"{\"formFactor\":\"E-ATX\"}");
 };}
 private void seed(ProductRepository repo,ProductCategory category,String name,String brand,int price,String specs){Product p=new Product();p.setName(name);p.setBrand(brand);p.setCategory(category);p.setPrice(BigDecimal.valueOf(price));p.setDiscountPrice(BigDecimal.valueOf(price).multiply(new BigDecimal("0.95")).setScale(2));p.setStockQty(5);p.setActive(true);p.setSpecsJson(specs);p.setImageUrl("https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=700&q=82");repo.save(p);}
}
