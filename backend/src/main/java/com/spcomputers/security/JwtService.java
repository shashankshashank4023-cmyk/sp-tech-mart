package com.spcomputers.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
@Service
public class JwtService {
 private final SecretKey key; private final long expirationMs;
 public JwtService(@Value("${app.jwt.secret}") String secret,@Value("${app.jwt.expiration-ms:86400000}") long expirationMs){if(secret==null||secret.getBytes(StandardCharsets.UTF_8).length<32)throw new IllegalStateException("JWT_SECRET must be at least 32 characters");this.key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));this.expirationMs=expirationMs;}
 public String create(String email,String role){Date now=new Date();return Jwts.builder().subject(email).claim("role",role).issuedAt(now).expiration(new Date(now.getTime()+expirationMs)).signWith(key).compact();}
 public String subject(String token){return claims(token).getSubject();}
 public boolean valid(String token,String email){return email.equals(subject(token))&&claims(token).getExpiration().after(new Date());}
 private Claims claims(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();}
}
