import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api";

// GET Request (with token for protected routes)
export const fetchDataFromApi = async (url) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(BASE_URL + url, {
      headers: {
        Authorization: `Bearer ${token}`, // Token included
      },
      withCredentials: true, // only if backend uses cookies
    });

    return data;
  } catch (error) {
    console.log("Error in fetchDataFromApi:", error.response?.data || error.message);
    throw error; 
  }
};

//post data
export const postData = async (url, formData, isFormData = false) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    const { data } = await axios.post(BASE_URL + url, formData, {
      headers,
      withCredentials: true,
    });

    return data;
  } catch (error) {
    console.error("Error in postData:", error.response?.data || error.message);
    throw error;
  }
};

// PUT Request (Edit/Update)
export const editData = async (url, updatedData) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.put(BASE_URL + url, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    console.error("Error in editData:", error.response?.data || error.message);
    throw error;
  }
};

// DELETE Request
export const deleteData = async (url) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.delete(BASE_URL + url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.error("Error in deleteData:", error.response?.data || error.message);
    throw error;
  }
};

//  PATCH Request
export const patchData = async (url, payload = {}) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.patch(BASE_URL + url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    console.error("Error in patchData:", error.response?.data || error.message);
    throw error;
  }
};

// PATCH: Promote to Associate
export const promoteUserToAssociate = async (userId, level, percent) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.patch(
      `${BASE_URL}/users/promote-to-associate/${userId}`,
      { level, percent },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error promoting user:", error.response?.data || error.message);
    throw error;
  }
};
