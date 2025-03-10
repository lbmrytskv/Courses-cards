const API_BASE_URL = 'http://localhost:4000';

const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  const token = localStorage.getItem('token'); 
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      ...(token && { Authorization: `Bearer ${token}` }), 
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }

  return response.json();
};

export const updateCourseOnServer = async (course: Course) => {
  let token = localStorage.getItem("token");

  if (!token) {
      throw new Error("No authorization token found. Please log in.");
  }

  token = token.replace(/^Bearer\s+/, ""); 

  console.log("🔄 Sending PUT request to server with data:", course);

  const response = await fetch(`http://localhost:4000/courses/${course.id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(course),
  });

  console.log("📥 Response status:", response.status);

  if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Server error:", errorData);
      throw new Error(`Failed to update course: ${errorData.message || response.statusText}`);
  }

  const data = await response.json();
  console.log("✅ Successfully updated course:", data);
  return data;
};


export const deleteCourseFromServer = async (courseId: string) => {
  let token = localStorage.getItem("token");
  if (!token) {
      throw new Error("No authorization token found. Please log in.");
  }

  token = token.replace(/^Bearer\s+/, "");

console.log("🔑 Sending token:", token);

  const response = await fetch(`http://localhost:4000/courses/${courseId}`, {
      method: "DELETE",
      headers: {
          "Authorization": `Bearer ${token}`,
      },
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete course: ${errorData.message || response.statusText}`);
  }

  return true; 
};

export const deleteAuthorFromServer = async (authorId: string) => {
  let token = localStorage.getItem('token');

  if (!token) {
    throw new Error("No authorization token found. Please log in.");
  }

  token = token.replace(/^Bearer\s+/, "");

  const response = await fetch(`http://localhost:4000/authors/${authorId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to delete author: ${errorData.message || response.statusText}`);
  }

  return true;
};




export const getCourses = async () => {
  const data = await fetchFromApi<{ successful: boolean; result: Course[] }>('/courses/all');
  console.log("📥 Courses from API:", data.result);
  if (data.successful) {
    return data.result; 
  }
  throw new Error('Failed to fetch courses');
};

export const addCourseToServer = async (course: Course) => {
  let token = localStorage.getItem('token');

  if (!token) {
      throw new Error("No authorization token found. Please log in.");
  }

  if (token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", ""); 
  }

  const response = await fetch(`http://localhost:4000/courses/add`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(course),
  });

  if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error(`Failed to add course: ${errorData.message || response.statusText}`);
  }

  return response.json();
};



export const getAuthors = async () => {
  const data = await fetchFromApi<{ successful: boolean; result: Author[] }>('/authors/all');
  if (data.successful) {
    return data.result; 
  }
  throw new Error('Failed to fetch authors');
};

export const addAuthor = async (name: string) => {
  let token = localStorage.getItem('token');

  if (!token) {
    throw new Error("No authorization token found. Please log in.");
  }

  
  if (token.startsWith("Bearer ")) {
    token = token.replace("Bearer ", "");
  }

  const response = await fetch(`http://localhost:4000/authors/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Server error:", errorData);
    throw new Error(`Failed to add author: ${errorData.message || response.statusText}`);
  }

  return response.json();
};



export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Failed to login: ${response.statusText}`);
  }

  return response.json();
};

export interface Course {
  id: string;
  title: string;
  description: string;
  authors: string[];  
  duration: number;
  creationDate: string;
}


export interface Author {
  id: string;
  name: string;
}
