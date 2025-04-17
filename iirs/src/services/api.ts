import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Making request to:", config.url);
  return config;
});

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log("Response from:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const createIssue = async (issueData: any) => {
  try {
    console.log("Creating issue:", issueData);
    const response = await api.post("/issues", issueData);
    return response.data;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
};

export const getIssues = async () => {
  try {
    console.log("Fetching issues");
    const response = await api.get("/issues");
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};

export const updateIssue = async (id: string, issueData: any) => {
  try {
    console.log("Updating issue:", id, issueData);
    const response = await api.put(`/issues/${id}`, issueData);
    return response.data;
  } catch (error) {
    console.error("Error updating issue:", error);
    throw error;
  }
};

export const deleteIssue = async (id: string) => {
  try {
    console.log("Deleting issue:", id);
    const response = await api.delete(`/issues/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting issue:", error);
    throw error;
  }
};
