package com.talentpulse.auth.controller;

import com.talentpulse.auth.dto.UpdateProfileRequest;
import com.talentpulse.auth.dto.UserProfileDto;
import com.talentpulse.auth.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/profiles", "/profile"})
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileDto> getProfile(@PathVariable Long userId, Authentication authentication) {
        UserProfileDto profile = profileService.getProfile(userId, authentication);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileDto> updateProfile(@PathVariable Long userId,
                                                        @RequestBody UpdateProfileRequest request,
                                                        Authentication authentication) {
        UserProfileDto updated = profileService.updateProfile(userId, request, authentication);
        return ResponseEntity.ok(updated);
    }
}
