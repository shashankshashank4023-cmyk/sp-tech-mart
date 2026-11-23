package com.spcomputers.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;
@Configuration
public class CorsConfig {
 @Bean public CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origins:http://localhost:5173}") String allowedOrigins){
  CorsConfiguration c=new CorsConfiguration();c.setAllowedOrigins(Arrays.stream(allowedOrigins.split(",")).map(String::trim).filter(s->!s.isEmpty()).toList());c.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));c.setAllowedHeaders(List.of("Authorization","Content-Type","Accept","Origin","X-Requested-With"));c.setExposedHeaders(List.of("Authorization"));c.setAllowCredentials(true);c.setMaxAge(3600L);
  UrlBasedCorsConfigurationSource source=new UrlBasedCorsConfigurationSource();source.registerCorsConfiguration("/**",c);return source;
 }
}
