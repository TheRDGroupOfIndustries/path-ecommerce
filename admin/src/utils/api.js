import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api"; 

export const fetchDataFromApi=async(url)=>{
    try{
        const {data} = await axios.get(BASE_URL+ url)
        return data;
    }catch(error){
        console.log(error);
        return error;
    }
}

export const postData = async (url, formData) => {
  try {
    const token = localStorage.getItem("token"); // ✅ get token from storage

    const { data } = await axios.post(BASE_URL + url, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ add token to header
      },
    });

    return data;
  } catch (error) {
    console.error("Error in postData:", error.response?.data || error.message);
    throw error;
  }
};


export const editData = async (url, updatedData) => {
    try {
        console.log("Updating:", BASE_URL + url, updatedData); // Debugging
        const { data } = await axios.put(BASE_URL + url, updatedData);
        return data;
    } catch (error) {
        console.error("Error in editData:", error.response?.data || error.message);
        throw error;
    }
};


export const deleteData = async (url) => {
    try {
      const { data } = await axios.delete(BASE_URL + url);
      return data;
    } catch (error) {
      console.error("Error in deleteData:", error);
      throw error;
    }
  };
  

  //associate
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
