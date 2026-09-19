package com.talentpulse.job.repository;

import com.talentpulse.job.entity.Job;
import com.talentpulse.job.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatus(JobStatus status);

    List<Job> findByRecruiterEmail(String recruiterEmail);

    List<Job> findByRecruiterId(Long recruiterId);

    List<Job> findByRecruiterEmailAndStatus(String recruiterEmail, JobStatus status);
}
