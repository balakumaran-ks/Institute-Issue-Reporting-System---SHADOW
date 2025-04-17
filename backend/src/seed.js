const mongoose = require("mongoose");
const Issue = require("./models/Issue");
const User = require("./models/User");
require("dotenv").config();

const categories = ["Hostel", "Classroom", "Facilities", "IT Services"];
const statuses = ["New", "In Progress", "Resolved", "Closed"];
const locations = [
  "Building A, Floor 2",
  "Main Library, Study Area",
  "Hostel Block C",
  "Computer Lab 3",
  "Cafeteria",
  "Sports Complex",
  "Admin Building",
  "Parking Lot",
  "Auditorium",
  "Medical Center",
];

const sampleIssues = [
  {
    title: "Broken Water Fountain",
    description:
      "The water fountain on the second floor is not working properly. Water pressure is very low.",
    category: "Facilities",
    location: "Building A, Floor 2",
    isSensitive: false,
    comments: [
      {
        userName: "John Doe",
        content: "This has been reported multiple times. Please fix it soon.",
        date: new Date("2024-03-15"),
      },
      {
        userName: "Admin",
        content:
          "Maintenance team has been notified. Will be fixed by tomorrow.",
        date: new Date("2024-03-16"),
      },
    ],
  },
  {
    title: "Air Conditioning Issue",
    description:
      "AC in classroom 203 is not cooling properly. Temperature is too high.",
    category: "Classroom",
    location: "Main Library, Study Area",
    isSensitive: false,
    comments: [
      {
        userName: "Sarah Smith",
        content:
          "This is affecting our study sessions. Please address this issue.",
        date: new Date("2024-03-10"),
      },
    ],
  },
  {
    title: "WiFi Connectivity Problems",
    description:
      "Poor WiFi signal in the computer lab. Connection keeps dropping.",
    category: "IT Services",
    location: "Computer Lab 3",
    isSensitive: false,
    comments: [
      {
        userName: "IT Support",
        content:
          "We are aware of the issue and working on improving the signal strength.",
        date: new Date("2024-03-12"),
      },
    ],
  },
  {
    title: "Hostel Room Maintenance",
    description: "Leaking pipe in room 305 causing water damage.",
    category: "Hostel",
    location: "Hostel Block C",
    isSensitive: true,
    comments: [
      {
        userName: "Maintenance",
        content: "Plumber has been assigned. Will be fixed within 24 hours.",
        date: new Date("2024-03-14"),
      },
    ],
  },
  {
    title: "Library Book Return System",
    description: "Automated book return system is not functioning properly.",
    category: "Facilities",
    location: "Main Library, Study Area",
    isSensitive: false,
    comments: [
      {
        userName: "Librarian",
        content:
          "System is under maintenance. Please return books at the counter.",
        date: new Date("2024-03-11"),
      },
    ],
  },
  {
    title: "Cafeteria Food Quality",
    description: "Food quality has deteriorated in the past week.",
    category: "Facilities",
    location: "Cafeteria",
    isSensitive: true,
    comments: [
      {
        userName: "Cafeteria Manager",
        content: "We are investigating the issue and will improve the quality.",
        date: new Date("2024-03-13"),
      },
    ],
  },
  {
    title: "Sports Equipment Maintenance",
    description: "Several gym equipment need repair or replacement.",
    category: "Facilities",
    location: "Sports Complex",
    isSensitive: false,
    comments: [
      {
        userName: "Sports Coordinator",
        content: "New equipment has been ordered. Will be installed next week.",
        date: new Date("2024-03-09"),
      },
    ],
  },
  {
    title: "Parking Space Issue",
    description: "Insufficient parking space during peak hours.",
    category: "Facilities",
    location: "Parking Lot",
    isSensitive: false,
    comments: [
      {
        userName: "Security",
        content: "Additional parking area is being planned.",
        date: new Date("2024-03-08"),
      },
    ],
  },
  {
    title: "Projector Malfunction",
    description: "Projector in auditorium is not working properly.",
    category: "Facilities",
    location: "Auditorium",
    isSensitive: false,
    comments: [
      {
        userName: "Technical Support",
        content: "New projector has been ordered. Temporary solution in place.",
        date: new Date("2024-03-07"),
      },
    ],
  },
  {
    title: "Medical Center Equipment",
    description: "Some medical equipment needs immediate replacement.",
    category: "Facilities",
    location: "Medical Center",
    isSensitive: true,
    comments: [
      {
        userName: "Medical Staff",
        content: "New equipment will be installed by the end of this month.",
        date: new Date("2024-03-06"),
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing issues
    await Issue.deleteMany({});
    console.log("Cleared existing issues");

    // Create a test admin user if not exists
    let adminUser = await User.findOne({ email: "admin@example.com" });
    if (!adminUser) {
      adminUser = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      });
      await adminUser.save();
      console.log("Created admin user");
    }

    // Create issues with random data
    const issues = await Promise.all(
      sampleIssues.map(async (issueData) => {
        const issue = new Issue({
          ...issueData,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          upvotes: Math.floor(Math.random() * 20),
          downvotes: Math.floor(Math.random() * 5),
          date: new Date(
            2024,
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 28) + 1
          ),
          reporterId: adminUser._id,
          comments: issueData.comments.map((comment) => ({
            ...comment,
            userId: adminUser._id,
          })),
        });
        return issue.save();
      })
    );

    console.log(`Created ${issues.length} issues`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
