package com.talentpulse.auth.dto;

import java.util.List;

public class UpdateProfileRequest {

    private String fullName;
    private String phone;
    private String location;
    private String summary;
    private List<String> skills;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String fullName, String phone, String location, String summary, List<String> skills) {
        this.fullName = fullName;
        this.phone = phone;
        this.location = location;
        this.summary = summary;
        this.skills = skills;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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
