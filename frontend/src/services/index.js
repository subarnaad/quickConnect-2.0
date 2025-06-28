import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  // Pass the selected role from formData to the backend
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: formData.role || "user", // Default to 'user' if no role is selected
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}

export async function fetchAllUsersService({ role }) {
  const { data } = await axiosInstance.get(
    "/admin/getAllUsers" + `?role=${role}`
  );

  return data;
}

export async function fetchAllCoursesService({ page, limit }) {
  const { data } = await axiosInstance.get(
    `/admin/getAllCourses?page=${page}&limit=${limit}`
  );
  return data;
}

export async function editCourseService({ courseId, curriculumId }) {
  const { data } = await axiosInstance.get(
    `/admin/editCourse/${courseId}/curriculum/${curriculumId}`
  );
  return data;
}
export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function sendClassMail(data) {
  const response = await axiosInstance.post(
    "/instructor/course/send-mail",
    data
  );
  return response.data;
}
export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);

  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function initiateKhaltiPaymentService(formData) {
  const { data } = await axiosInstance.post(
    `/payment/khalti/initiate`,
    formData
  );

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}

export const submitFeedbackService = async (feedbackData) => {
  try {
    const response = await axiosInstance.post(
      "/feedback/submit-feedback",
      feedbackData
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error.response?.data || error.message;
  }
};

export const getAllFeedbackService = async () => {
  try {
    const response = await axiosInstance.get(`/feedback/getAllFeedback`);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error.response?.data || error.message;
  }
};

export async function documentUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post(
    "/media/document/upload",
    formData,
    {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgressCallback) onProgressCallback(percentCompleted);
      },
    }
  );
  return data;
}

export async function documentDeleteService(publicId) {
  const { data } = await axiosInstance.delete(
    `/media/document/delete/${publicId}`
  );
  return data;
}
