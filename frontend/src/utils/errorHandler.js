// Utility to extract error messages from API responses
export const getErrorMessage = (error) => {
  if (!error.response) {
    return "Network error. Please check your connection.";
  }

  const { data } = error.response;

  // Handle FastAPI validation errors
  if (data?.detail && Array.isArray(data.detail)) {
    // Extract messages from validation errors
    return data.detail.map(err => err.msg || JSON.stringify(err)).join(", ");
  }

  // Handle string error messages
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  // Handle other error formats
  if (data?.message) {
    return data.message;
  }

  // Default error message
  return "An error occurred. Please try again.";
};
