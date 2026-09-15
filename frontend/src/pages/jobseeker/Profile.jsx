import { useState } from 'react';
import { getProfile, saveProfile } from '../../data/profile';
import ProfileHeader from '../../components/profile/ProfileHeader';
import SkillsList from '../../components/profile/SkillsList';
import EducationList from '../../components/profile/EducationList';
import ExperienceList from '../../components/profile/ExperienceList';
import ResumeSection from '../../components/profile/ResumeSection';

const Profile = () => {
  const [profile, setProfile] = useState(getProfile);

  const handleUpdateResume = (newResumeData) => {
    const updated = {
      ...profile,
      resume: newResumeData,
    };
    saveProfile(updated);
    setProfile(updated);
  };

  return (
    <div className="profile-page">
      <ProfileHeader profile={profile} isEditMode={false} />

      <div className="profile-body-sections">
        <ResumeSection resume={profile.resume} onUpdateResume={handleUpdateResume} />
        <SkillsList skills={profile.skills || []} isEditMode={false} />
        <ExperienceList experience={profile.experience || []} isEditMode={false} />
        <EducationList education={profile.education || []} isEditMode={false} />
      </div>
    </div>
  );
};

export default Profile;
