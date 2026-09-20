package com.talentpulse.application.repository;

import com.talentpulse.application.entity.Application;
import com.talentpulse.application.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);

    boolean existsByJobIdAndCandidateEmail(Long jobId, String candidateEmail);

    Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);

    List<Application> findByCandidateId(Long candidateId);

    List<Application> findByCandidateIdAndStatus(Long candidateId, ApplicationStatus status);

    List<Application> findByCandidateEmail(String candidateEmail);

    List<Application> findByCandidateEmailAndStatus(String candidateEmail, ApplicationStatus status);

    List<Application> findByRecruiterId(Long recruiterId);

    List<Application> findByRecruiterIdAndStatus(Long recruiterId, ApplicationStatus status);

    List<Application> findByRecruiterEmail(String recruiterEmail);

    List<Application> findByRecruiterEmailAndStatus(String recruiterEmail, ApplicationStatus status);

    List<Application> findByJobId(Long jobId);

    List<Application> findByJobIdAndStatus(Long jobId, ApplicationStatus status);
}
