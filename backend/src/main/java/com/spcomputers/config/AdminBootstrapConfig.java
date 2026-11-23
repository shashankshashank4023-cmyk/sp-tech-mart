package com.spcomputers.config;
import com.spcomputers.entity.AppUser;
import com.spcomputers.entity.Role;
import com.spcomputers.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration
public class AdminBootstrapConfig {
 @Bean CommandLineRunner bootstrapAdmin(UserRepository users,PasswordEncoder encoder,@Value("${app.admin.email:}") String email,@Value("${app.admin.password:}") String password){return args->{if(email.isBlank()||password.isBlank())return;if(password.length()<12)throw new IllegalStateException("ADMIN_PASSWORD must be at least 12 characters");if(!users.existsByEmailIgnoreCase(email)){AppUser admin=new AppUser();admin.setName("SP Computers Admin");admin.setEmail(email.trim().toLowerCase());admin.setPhone("0000000000");admin.setPassword(encoder.encode(password));admin.setRole(Role.ROLE_ADMIN);users.save(admin);}};}
}
