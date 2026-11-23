package com.spcomputers.service;
import com.spcomputers.dto.AuthResponse;
import com.spcomputers.dto.LoginRequest;
import com.spcomputers.dto.RegisterRequest;
import com.spcomputers.entity.AppUser;
import com.spcomputers.entity.Cart;
import com.spcomputers.entity.Role;
import com.spcomputers.exception.ApiException;
import com.spcomputers.repository.CartRepository;
import com.spcomputers.repository.UserRepository;
import com.spcomputers.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class AuthService {
 private final UserRepository users; private final CartRepository carts; private final PasswordEncoder encoder; private final AuthenticationManager auth; private final JwtService jwt;
 public AuthService(UserRepository users,CartRepository carts,PasswordEncoder encoder,AuthenticationManager auth,JwtService jwt){this.users=users;this.carts=carts;this.encoder=encoder;this.auth=auth;this.jwt=jwt;}
 @Transactional public AuthResponse register(RegisterRequest r){if(users.existsByEmailIgnoreCase(r.email()))throw ApiException.conflict("An account with this email already exists");AppUser u=new AppUser();u.setName(r.name().trim());u.setEmail(r.email().trim().toLowerCase());u.setPhone(r.phone().trim());u.setPassword(encoder.encode(r.password()));u.setRole(Role.ROLE_CUSTOMER);u=users.save(u);Cart c=new Cart();c.setUser(u);carts.save(c);return response(u);}
 public AuthResponse login(LoginRequest r){auth.authenticate(new UsernamePasswordAuthenticationToken(r.email().trim().toLowerCase(),r.password()));return response(users.findByEmailIgnoreCase(r.email()).orElseThrow());}
 private AuthResponse response(AppUser u){return new AuthResponse(jwt.create(u.getEmail(),u.getRole().name()),u.getRole(),u.getId(),u.getName());}
}
