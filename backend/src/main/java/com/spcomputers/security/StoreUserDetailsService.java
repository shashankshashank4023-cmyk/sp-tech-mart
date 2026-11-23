package com.spcomputers.security;
import com.spcomputers.entity.AppUser;
import com.spcomputers.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
@Service
public class StoreUserDetailsService implements UserDetailsService {
 private final UserRepository users;
 public StoreUserDetailsService(UserRepository users){this.users=users;}
 @Override public UserDetails loadUserByUsername(String email){AppUser u=users.findByEmailIgnoreCase(email).orElseThrow(()->new UsernameNotFoundException("User not found"));return User.withUsername(u.getEmail()).password(u.getPassword()).authorities(u.getRole().name()).build();}
}
