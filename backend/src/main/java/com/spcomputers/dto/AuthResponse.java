package com.spcomputers.dto;
import com.spcomputers.entity.Role;
public record AuthResponse(String token, Role role, Long userId, String name) {}
