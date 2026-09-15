package com.talentpulse.auth.dto;

import com.talentpulse.auth.entity.Role;

public class UserDto {

    private Long userId;
    private String fullName;
    private String email;
    private Role role;

    public UserDto() {
    }

    public UserDto(Long userId, String fullName, String email, Role role) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
