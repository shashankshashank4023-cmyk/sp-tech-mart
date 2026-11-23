package com.spcomputers.config;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spcomputers.dto.ErrorResponse;
import com.spcomputers.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import java.time.Instant;
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration c)throws Exception{return c.getAuthenticationManager();}
 @Bean SecurityFilterChain securityFilterChain(HttpSecurity http,JwtAuthenticationFilter jwtFilter,ObjectMapper mapper)throws Exception{
  http.csrf(csrf->csrf.disable()).cors(cors->{}).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authorizeHttpRequests(a->a.requestMatchers(org.springframework.http.HttpMethod.OPTIONS,"/**").permitAll().requestMatchers("/api/auth/**","/api/products/**","/actuator/health").permitAll().anyRequest().authenticated()).exceptionHandling(e->e.authenticationEntryPoint((req,res,ex)->writeError(res,mapper,HttpStatus.UNAUTHORIZED,"Authentication required",req.getRequestURI())).accessDeniedHandler((req,res,ex)->writeError(res,mapper,HttpStatus.FORBIDDEN,"Access denied",req.getRequestURI()))).addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class);
  return http.build();
 }
 private void writeError(HttpServletResponse response,ObjectMapper mapper,HttpStatus status,String message,String path)throws java.io.IOException{response.setStatus(status.value());response.setContentType("application/json");mapper.writeValue(response.getOutputStream(),new ErrorResponse(Instant.now(),status.value(),status.getReasonPhrase(),message,path));}
}
