// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from "react";
import * as echarts from "echarts";
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  dateJoined: string;
}
interface Issue {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  status: string;
  date: string;
  reporterId: number;
  photos?: string[];
  isSensitive?: boolean;
  upvotes: number;
  downvotes: number;
  upvotedBy: number[]; // Array of user IDs who have upvoted
  downvotedBy: number[]; // Array of user IDs who have downvoted
  comments: {
    id: number;
    userId: number;
    userName: string;
    content: string;
    date: string;
  }[];
}
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Add global styles for animations
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
@keyframes fadeInOut {
0% { opacity: 0; transform: translateY(-10px); }
10% { opacity: 1; transform: translateY(0); }
90% { opacity: 1; transform: translateY(0); }
100% { opacity: 0; transform: translateY(-10px); }
}
.animate-fade-in-out {
animation: fadeInOut 3s ease-in-out forwards;
}
`;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: "Admin User",
    email: "admin@campus.edu",
    role: "admin",
    dateJoined: "2025-01-01",
  });
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Admin User",
      email: "admin@campus.edu",
      role: "admin",
      dateJoined: "2025-01-01",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@campus.edu",
      role: "user",
      dateJoined: "2025-03-15",
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane@campus.edu",
      role: "user",
      dateJoined: "2025-04-01",
    },
  ]);
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 1,
      title: "Broken Water Fountain",
      category: "Hostel",
      description:
        "The water fountain on the second floor of Building A is not working properly...",
      location: "Building A, Second Floor",
      status: "In Progress",
      date: "April 15, 2025",
      reporterId: 0,
      upvotes: 0,
      downvotes: 0,
      upvotedBy: [],
      downvotedBy: [],
      comments: [
        {
          id: 1,
          userId: 1,
          userName: "Admin User",
          content:
            "We have assigned a maintenance team to look into this issue.",
          date: "April 16, 2025",
        },
      ],
    },
  ]);
  const addNewIssue = (
    issue: Omit<
      Issue,
      "id" | "upvotes" | "downvotes" | "upvotedBy" | "downvotedBy"
    >
  ) => {
    setIssues((prevIssues) => [
      {
        ...issue,
        id: prevIssues.length + 1,
        upvotes: 0,
        downvotes: 0,
        upvotedBy: [],
        downvotedBy: [],
      },
      ...prevIssues,
    ]);
  };
  const handleVote = (issueId: number, voteType: "up" | "down") => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) => {
        if (issue.id === issueId) {
          const hasUpvoted = issue.upvotedBy.includes(currentUser.id);
          const hasDownvoted = issue.downvotedBy.includes(currentUser.id);

          if (voteType === "up") {
            if (hasUpvoted) {
              // Remove upvote
              return {
                ...issue,
                upvotes: issue.upvotes - 1,
                upvotedBy: issue.upvotedBy.filter(
                  (id) => id !== currentUser.id
                ),
              };
            } else {
              // Add upvote, remove downvote if exists
              return {
                ...issue,
                upvotes: issue.upvotes + 1,
                upvotedBy: [...issue.upvotedBy, currentUser.id],
                downvotes: hasDownvoted ? issue.downvotes - 1 : issue.downvotes,
                downvotedBy: hasDownvoted
                  ? issue.downvotedBy.filter((id) => id !== currentUser.id)
                  : issue.downvotedBy,
              };
            }
          } else {
            if (hasDownvoted) {
              // Remove downvote
              return {
                ...issue,
                downvotes: issue.downvotes - 1,
                downvotedBy: issue.downvotedBy.filter(
                  (id) => id !== currentUser.id
                ),
              };
            } else {
              // Add downvote, remove upvote if exists
              return {
                ...issue,
                downvotes: issue.downvotes + 1,
                downvotedBy: [...issue.downvotedBy, currentUser.id],
                upvotes: hasUpvoted ? issue.upvotes - 1 : issue.upvotes,
                upvotedBy: hasUpvoted
                  ? issue.upvotedBy.filter((id) => id !== currentUser.id)
                  : issue.upvotedBy,
              };
            }
          }
        }
        return issue;
      })
    );
  };
  const addComment = (issueId: number, content: string) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            comments: [
              ...issue.comments,
              {
                id: issue.comments.length + 1,
                userId: currentUser.id,
                userName: currentUser.name,
                content,
                date: new Date().toLocaleDateString(),
              },
            ],
          };
        }
        return issue;
      })
    );
  };
  const LandingPage = () => {
    const [loginType, setLoginType] = useState<"student" | "admin">("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (loginType === "admin") {
          if (email === "admin@campus.edu" && password === "admin123") {
            setCurrentUser({
              id: 1,
              name: "Admin User",
              email: "admin@campus.edu",
              role: "admin",
              dateJoined: "2025-01-01",
            });
            setIsLoggedIn(true);
          } else {
            throw new Error("Invalid credentials");
          }
        } else {
          const student = users.find(
            (user) => user.email === email && user.role === "user"
          );
          if (student && password === "password123") {
            // Simple password validation for demo
            setCurrentUser(student);
            setIsLoggedIn(true);
          } else {
            throw new Error("Invalid credentials");
          }
        }
      } catch (error) {
        setToastMessage("Invalid email or password. Please try again.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white relative">
        {showToast && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {toastMessage}
          </div>
        )}
        <div className="max-w-md w-full px-6 py-12 bg-white rounded-lg shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Campus Issue Reporter
            </h1>
            <p className="text-lg text-gray-600">
              Report and track campus issues efficiently
            </p>
          </div>
          <div className="mb-8">
            <img
              src="https://readdy.ai/api/search-image?query=modern%20minimalist%20illustration%20of%20a%20university%20campus%20building%20with%20clean%20lines%20and%20simple%20geometric%20shapes%2C%20set%20against%20a%20light%20background%20with%20subtle%20gradient%2C%20professional%20and%20sophisticated%20design&width=400&height=300&seq=1&orientation=landscape"
              alt="Campus Illustration"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="mb-6 flex justify-center space-x-4">
            <button
              onClick={() => setLoginType("student")}
              className={`!rounded-button px-6 py-2 ${
                loginType === "student"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              } whitespace-nowrap cursor-pointer`}
            >
              <i className="fas fa-user-graduate mr-2"></i>
              Student Login
            </button>
            <button
              onClick={() => setLoginType("admin")}
              className={`!rounded-button px-6 py-2 ${
                loginType === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              } whitespace-nowrap cursor-pointer`}
            >
              <i className="fas fa-user-shield mr-2"></i>
              Admin Login
            </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${
                    loginType === "admin" ? "admin" : "student"
                  } email`}
                  required
                />
                <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            <button
              id="loginButton"
              type="submit"
              className="!rounded-button w-full px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 cursor-pointer whitespace-nowrap relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Logging in...
                </span>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Login
                </>
              )}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              id="googleSignInBtn"
              onClick={async () => {
                const btn = document.getElementById("googleSignInBtn");
                if (btn) {
                  // Disable button and show loading state
                  btn.setAttribute("disabled", "true");
                  btn.innerHTML =
                    '<i class="fas fa-circle-notch fa-spin mr-2"></i>Signing in with Google...';
                  try {
                    // Simulate OAuth flow with a delay
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    // Mock successful Google sign in
                    if (loginType === "admin") {
                      const mockAdminUser = {
                        id: 1,
                        name: "Admin User",
                        email: "admin@campus.edu",
                        role: "admin" as const,
                        dateJoined: "2025-01-01",
                      };
                      setCurrentUser(mockAdminUser);
                      setIsLoggedIn(true);
                    } else {
                      const mockGoogleUser = {
                        id: Math.floor(Math.random() * 1000) + 4,
                        name: "Google User",
                        email: "user@gmail.com",
                        role: "user" as const,
                        dateJoined: new Date().toLocaleDateString(),
                      };
                      setCurrentUser(mockGoogleUser);
                      setUsers((prev) => [...prev, mockGoogleUser]);
                      setIsLoggedIn(true);
                    }
                  } catch (error) {
                    // Reset button state on error
                    btn.removeAttribute("disabled");
                    btn.innerHTML =
                      '<i class="fab fa-google mr-2"></i>Sign in with Google';
                    setToastMessage("Google sign in failed. Please try again.");
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }
                }
              }}
              className="!rounded-button w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer whitespace-nowrap relative flex items-center justify-center"
            >
              <i className="fab fa-google text-red-600 mr-2"></i>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  };
  const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [newComment, setNewComment] = useState("");
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const categories = [
      "All",
      "Hostel",
      "Classroom",
      "Facilities",
      "IT Services",
    ];
    const filteredIssues = issues
      .filter((issue) => {
        const matchesSearch =
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" ||
          issue.category.toLowerCase() === selectedCategory;
        // Only show non-sensitive issues to regular users
        const isVisible = currentUser.role === "admin" || !issue.isSensitive;
        return matchesSearch && matchesCategory && isVisible;
      })
      .sort((a, b) => {
        // Calculate net votes (upvotes - downvotes)
        const netVotesA = a.upvotes - a.downvotes;
        const netVotesB = b.upvotes - b.downvotes;
        // Sort by net votes in descending order
        return netVotesB - netVotesA;
      });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const newPhotos: string[] = [];
        const newPreviews: string[] = [];

        Array.from(files).forEach((file) => {
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result as string;
              newPhotos.push(base64String);
              newPreviews.push(base64String);
              if (newPhotos.length === files.length) {
                setSelectedPhotos((prev) => [...prev, ...newPhotos]);
                setPhotoPreviews((prev) => [...prev, ...newPreviews]);
              }
            };
            reader.readAsDataURL(file);
          }
        });
      }
    };

    const removePhoto = (index: number) => {
      setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
      setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Campus Issue Reporter
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  id="reportIssueBtn"
                  onClick={() => setShowIssueModal(true)}
                  className="!rounded-button px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Report Issue
                </button>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="!rounded-button text-gray-500 hover:text-gray-700 cursor-pointer whitespace-nowrap"
                >
                  <i className="fas fa-sign-out-alt text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category.toLowerCase())}
                    className={`!rounded-button px-4 py-2 text-sm cursor-pointer whitespace-nowrap ${
                      selectedCategory === category.toLowerCase()
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                    {issue.category}
                  </span>
                  <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                    {issue.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {issue.title}
                </h3>
                <p className="text-gray-600 mb-4">{issue.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <i className="far fa-clock mr-2"></i>
                    <span>Reported on {issue.date}</span>
                  </div>
                  {currentUser.role === "user" && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(issue.id, "up");
                        }}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                          issue.upvotedBy.includes(currentUser.id)
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <i
                          className={`fas fa-arrow-up ${
                            issue.upvotedBy.includes(currentUser.id)
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        ></i>
                        <span>{issue.upvotes}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(issue.id, "down");
                        }}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                          issue.downvotedBy.includes(currentUser.id)
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <i
                          className={`fas fa-arrow-down ${
                            issue.downvotedBy.includes(currentUser.id)
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        ></i>
                        <span>{issue.downvotes}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Issue Detail Modal */}
          {selectedIssue && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Issue Details
                  </h2>
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                <div className="space-y-6">
                  {/* Issue Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                        {selectedIssue.category}
                      </span>
                      <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                        {selectedIssue.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {selectedIssue.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {selectedIssue.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span>{selectedIssue.location}</span>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold mb-3">Comments</h4>
                    <div className="space-y-4 mb-4">
                      {selectedIssue.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                              {comment.userName}
                            </span>
                            <span className="text-sm text-gray-500">
                              {comment.date}
                            </span>
                          </div>
                          <p className="text-gray-600">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                    {currentUser.role === "admin" && (
                      <div className="mt-4">
                        <div className="relative">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Add a comment..."
                          ></textarea>
                          <button
                            onClick={() => {
                              if (newComment.trim()) {
                                addComment(selectedIssue.id, newComment);
                                setNewComment("");
                              }
                            }}
                            className="!rounded-button absolute bottom-2 right-2 px-4 py-1 bg-blue-600 text-white hover:bg-blue-700 text-sm whitespace-nowrap"
                          >
                            <i className="fas fa-paper-plane mr-1"></i>
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Issue Reporting Modal */}
        {showIssueModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Report New Issue
                </h2>
                <button
                  onClick={() => {
                    setShowIssueModal(false);
                    setSelectedPhotos([]);
                    setPhotoPreviews([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newIssue: Omit<
                    Issue,
                    "id" | "upvotes" | "downvotes" | "upvotedBy" | "downvotedBy"
                  > = {
                    title: formData.get("title") as string,
                    category: formData.get("category") as string,
                    description: formData.get("description") as string,
                    location: formData.get("location") as string,
                    status: "New",
                    date: new Date().toLocaleDateString(),
                    reporterId: currentUser.id,
                    photos: selectedPhotos,
                    isSensitive: formData.get("isSensitive") === "on",
                    comments: [],
                  };
                  addNewIssue(newIssue);
                  setShowIssueModal(false);
                  setSelectedPhotos([]);
                  setPhotoPreviews([]);
                  e.currentTarget.reset();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Hostel">Hostel</option>
                    <option value="Classroom">Classroom</option>
                    <option value="Facilities">Facilities</option>
                    <option value="IT Services">IT Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isSensitive"
                    id="isSensitive"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isSensitive"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    This is a sensitive issue (only visible to admins)
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photos (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload photos</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Photo Previews */}
                  {photoPreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="!rounded-button px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="!rounded-button px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Submit Issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
  const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState<"overview" | "users" | "issues">(
      "overview"
    );
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [newComment, setNewComment] = useState("");
    const issuesByStatus = {
      new: issues.filter((issue) => issue.status === "New").length,
      inProgress: issues.filter((issue) => issue.status === "In Progress")
        .length,
      resolved: issues.filter((issue) => issue.status === "Resolved").length,
      closed: issues.filter((issue) => issue.status === "Closed").length,
    };
    React.useEffect(() => {
      if (activeTab === "overview") {
        const chartDom = document.getElementById("issuesChart");
        if (chartDom) {
          const myChart = echarts.init(chartDom);
          const option = {
            animation: false,
            tooltip: {
              trigger: "item" as const,
              formatter: "{b}: {c} ({d}%)",
            },
            series: [
              {
                type: "pie",
                radius: ["40%", "70%"],
                itemStyle: {
                  borderRadius: 10,
                  borderColor: "#fff",
                  borderWidth: 2,
                },
                label: {
                  show: true,
                  formatter: "{b}: {c}",
                },
                data: [
                  {
                    value: issuesByStatus.new,
                    name: "New",
                    itemStyle: { color: "#60A5FA" },
                  },
                  {
                    value: issuesByStatus.inProgress,
                    name: "In Progress",
                    itemStyle: { color: "#34D399" },
                  },
                  {
                    value: issuesByStatus.resolved,
                    name: "Resolved",
                    itemStyle: { color: "#A78BFA" },
                  },
                  {
                    value: issuesByStatus.closed,
                    name: "Closed",
                    itemStyle: { color: "#9CA3AF" },
                  },
                ],
              },
            ],
          };
          myChart.setOption(option);
        }
      }
    }, [activeTab, issues]);
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Admin Panel
                </h1>
                <div className="ml-10 flex space-x-4">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`!rounded-button px-4 py-2 ${
                      activeTab === "overview"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    } whitespace-nowrap`}
                  >
                    <i className="fas fa-chart-line mr-2"></i>
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`!rounded-button px-4 py-2 ${
                      activeTab === "users"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    } whitespace-nowrap`}
                  >
                    <i className="fas fa-users mr-2"></i>
                    Users
                  </button>
                  <button
                    onClick={() => setActiveTab("issues")}
                    className={`!rounded-button px-4 py-2 ${
                      activeTab === "issues"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    } whitespace-nowrap`}
                  >
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    Issues
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-4 text-gray-700">
                  <i className="fas fa-user-shield mr-2"></i>
                  {currentUser.name}
                </span>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="!rounded-button text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-sign-out-alt text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Issues</p>
                      <p className="text-2xl font-semibold">{issues.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-clipboard-list text-blue-600"></i>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Users</p>
                      <p className="text-2xl font-semibold">{users.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-users text-green-600"></i>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Open Issues</p>
                      <p className="text-2xl font-semibold">
                        {
                          issues.filter((issue) => issue.status !== "Closed")
                            .length
                        }
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-exclamation-circle text-yellow-600"></i>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Resolved Today</p>
                      <p className="text-2xl font-semibold">
                        {
                          issues.filter(
                            (issue) =>
                              issue.status === "Resolved" &&
                              issue.date === new Date().toLocaleDateString()
                          ).length
                        }
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-check-circle text-purple-600"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Issues Overview</h2>
                <div id="issuesChart" style={{ height: "400px" }}></div>
              </div>
            </div>
          )}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">User Management</h2>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="!rounded-button px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                >
                  <i className="fas fa-user-plus mr-2"></i>
                  Add User
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.dateJoined}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="!rounded-button text-blue-600 hover:text-blue-800 mr-3">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="!rounded-button text-red-600 hover:text-red-800">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "issues" && (
            <div className="space-y-8">
              {/* Regular Issues Section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Regular Issues</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {issues
                    .filter((issue) => !issue.isSensitive)
                    .sort((a, b) => {
                      const netVotesA = a.upvotes - a.downvotes;
                      const netVotesB = b.upvotes - b.downvotes;
                      return netVotesB - netVotesA;
                    })
                    .map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => setSelectedIssue(issue)}
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                            {issue.category}
                          </span>
                          <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                            {issue.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {issue.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {issue.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <i className="far fa-clock mr-2"></i>
                            <span>Reported on {issue.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600">
                              <i className="fas fa-arrow-up mr-1"></i>
                              {issue.upvotes}
                            </span>
                            <span className="text-red-600">
                              <i className="fas fa-arrow-down mr-1"></i>
                              {issue.downvotes}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Sensitive Issues Section - Only visible to admins */}
              {currentUser.role === "admin" && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <i className="fas fa-lock text-red-600 mr-2"></i>
                    Sensitive Issues
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues
                      .filter((issue) => issue.isSensitive)
                      .sort((a, b) => {
                        const netVotesA = a.upvotes - a.downvotes;
                        const netVotesB = b.upvotes - b.downvotes;
                        return netVotesB - netVotesA;
                      })
                      .map((issue) => (
                        <div
                          key={issue.id}
                          onClick={() => setSelectedIssue(issue)}
                          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-red-500 cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                                {issue.category}
                              </span>
                              <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800">
                                Sensitive
                              </span>
                            </div>
                            <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                              {issue.status}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {issue.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {issue.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <i className="far fa-clock mr-2"></i>
                              <span>Reported on {issue.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">
                                <i className="fas fa-arrow-up mr-1"></i>
                                {issue.upvotes}
                              </span>
                              <span className="text-red-600">
                                <i className="fas fa-arrow-down mr-1"></i>
                                {issue.downvotes}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Issue Detail Modal */}
              {selectedIssue && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Issue Details
                      </h2>
                      <button
                        onClick={() => setSelectedIssue(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <i className="fas fa-times text-xl"></i>
                      </button>
                    </div>
                    <div className="space-y-6">
                      {/* Issue Information */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                            {selectedIssue.category}
                          </span>
                          <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                            {selectedIssue.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {selectedIssue.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {selectedIssue.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          <span>{selectedIssue.location}</span>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold mb-3">
                          Update Status
                        </h4>
                        <div className="flex gap-2">
                          {["New", "In Progress", "Resolved", "Closed"].map(
                            (status) => (
                              <button
                                key={status}
                                onClick={() => {
                                  setIssues((prevIssues) =>
                                    prevIssues.map((issue) =>
                                      issue.id === selectedIssue.id
                                        ? { ...issue, status }
                                        : issue
                                    )
                                  );
                                  setSelectedIssue({
                                    ...selectedIssue,
                                    status,
                                  });
                                }}
                                className={`!rounded-button px-4 py-2 text-sm whitespace-nowrap ${
                                  selectedIssue.status === status
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {status}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Comments Section */}
                      <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold mb-3">Comments</h4>
                        <div className="space-y-4 mb-4">
                          {selectedIssue.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="bg-gray-50 p-3 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">
                                  {comment.userName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {comment.date}
                                </span>
                              </div>
                              <p className="text-gray-600">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <div className="relative">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={3}
                              placeholder="Add a comment..."
                            ></textarea>
                            <button
                              onClick={() => {
                                if (newComment.trim()) {
                                  addComment(selectedIssue.id, newComment);
                                  setNewComment("");
                                }
                              }}
                              className="!rounded-button absolute bottom-2 right-2 px-4 py-1 bg-blue-600 text-white hover:bg-blue-700 text-sm whitespace-nowrap"
                            >
                              <i className="fas fa-paper-plane mr-1"></i>
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
        {/* Add User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New User</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowUserModal(false);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="!rounded-button px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="!rounded-button px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
  return isLoggedIn ? (
    currentUser.role === "admin" ? (
      <AdminPanel />
    ) : (
      <Dashboard />
    )
  ) : (
    <LandingPage />
  );
};
export default App;
