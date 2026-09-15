import { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { getProfile, saveProfile } from '../../data/profile';
import profileService from '../../services/profileService';
import ProfileHeader from '../../components/profile/ProfileHeader';
import SkillsList from '../../components/profile/SkillsList';
import EducationList from '../../components/profile/EducationList';
import ExperienceList from '../../components/profile/ExperienceList';
import ResumeSection from '../../components/profile/ResumeSection';
import { Info } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(getProfile);
  const [loading, setLoading] = useState(() => Boolean(user?.id));
  const [apiNotice, setApiNotice] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      profileService
        .getProfile(user.id)
        .then((data) => {
          if (isMounted && data) {
            setProfile(data);
            setApiNotice('');
          }
        })
        .catch(() => {
          if (isMounted) {
            // Profile Service backend is pending implementation by the team
            setApiNotice('Profile Service backend integration pending. Displaying active candidate profile.');
            setProfile(getProfile());
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleUpdateResume = (newResumeData) => {
    const updated = {
      ...profile,
      resume: newResumeData,
    };
    saveProfile(updated);
    setProfile(updated);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {apiNotice && (
        <div className="alert alert-info mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={16} />
          <span>{apiNotice}</span>
        </div>
      )}

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
