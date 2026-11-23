package com.spcomputers.controller;
import com.spcomputers.dto.AuthResponse;
import com.spcomputers.dto.LoginRequest;
import com.spcomputers.dto.RegisterRequest;
import com.spcomputers.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final AuthService auth;
 public AuthController(AuthService auth){this.auth=auth;}
 @PostMapping("/register") public AuthResponse register(@Valid @RequestBody RegisterRequest request){return auth.register(request);}
 @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest request){return auth.login(request);}
}
