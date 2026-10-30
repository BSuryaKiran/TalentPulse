package com.talentpulse.auth.dto;

import com.talentpulse.auth.entity.Role;
import java.util.List;

public class UserProfileDto {

    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String phone;
    private String location;
    private String summary;
    private List<String> skills;

    public UserProfileDto() {
    }

    public UserProfileDto(Long id, String fullName, String email, Role role,
                          String phone, String location, String summary, List<String> skills) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.location = location;
        this.summary = summary;
        this.skills = skills;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}
