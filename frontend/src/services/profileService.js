import api from './api';

export const profileService = {
  /**
   * Fetch candidate profile from Profile Service
   * @param {string|number} userId
   */
  async getProfile(userId) {
    const response = await api.get(`/profiles/${userId}`);
    return response.data;
  },

  /**
   * Update candidate profile in Profile Service
   * @param {string|number} userId
   * @param {Object} profileData
   */
  async updateProfile(userId, profileData) {
    const response = await api.put(`/profiles/${userId}`, profileData);
    return response.data;
  },
};

export default profileService;
