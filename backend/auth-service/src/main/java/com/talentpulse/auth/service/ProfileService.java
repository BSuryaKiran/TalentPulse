package com.talentpulse.auth.service;

import com.talentpulse.auth.dto.UpdateProfileRequest;
import com.talentpulse.auth.dto.UserProfileDto;
import com.talentpulse.auth.entity.Role;
import com.talentpulse.auth.entity.User;
import com.talentpulse.auth.repository.UserRepository;
import com.talentpulse.auth.security.UserPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(Long userId, Authentication authentication) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found with ID: " + userId));

        UserPrincipal principal = extractPrincipal(authentication);
        boolean isOwner = principal != null && principal.getUserId().equals(userId);
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());
        boolean isRecruiterViewingCandidate = principal != null
                && "RECRUITER".equalsIgnoreCase(principal.getRole())
                && targetUser.getRole() == Role.JOB_SEEKER;

        if (!isOwner && !isAdmin && !isRecruiterViewingCandidate) {
            throw new AccessDeniedException("You do not have permission to access this profile.");
        }

        return mapToDto(targetUser);
    }

    @Transactional
    public UserProfileDto updateProfile(Long userId, UpdateProfileRequest request, Authentication authentication) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found with ID: " + userId));

        UserPrincipal principal = extractPrincipal(authentication);
        boolean isOwner = principal != null && principal.getUserId().equals(userId);
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You cannot update another user's profile.");
        }

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            targetUser.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            targetUser.setPhone(request.getPhone().trim());
        }
        if (request.getLocation() != null) {
            targetUser.setLocation(request.getLocation().trim());
        }
        if (request.getSummary() != null) {
            targetUser.setSummary(request.getSummary().trim());
        }
        if (request.getSkills() != null) {
            String skillsJoined = String.join(",", request.getSkills());
            targetUser.setSkills(skillsJoined);
        }

        User savedUser = userRepository.save(targetUser);
        return mapToDto(savedUser);
    }

    private UserPrincipal extractPrincipal(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        return null;
    }

    private UserProfileDto mapToDto(User user) {
        List<String> skillsList = new ArrayList<>();
        if (user.getSkills() != null && !user.getSkills().trim().isEmpty()) {
            skillsList = Arrays.stream(user.getSkills().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        return new UserProfileDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone() != null ? user.getPhone() : "",
                user.getLocation() != null ? user.getLocation() : "",
                user.getSummary() != null ? user.getSummary() : "",
                skillsList
        );
    }
}
