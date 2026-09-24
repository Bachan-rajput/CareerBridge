import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Jobs from "./components/Jobs";
import JobDetails from "./components/JobDetails";
import MyApplications from "./components/MyApplications";
import Profile from "./components/Profile";
import RecruiterDashboard from "./components/RecruiterDashboard";
import PostJob from "./components/PostJob";
import MyJobs from "./components/MyJobs";
import EditJob from "./components/EditJob";
import ReceivedApplications from "./components/ReceivedApplications";

function App() {
  const path = window.location.pathname;

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isLoggedIn = !!localStorage.getItem("token");

  if (path === "/register") {
    return <Register />;
  }

  if (path === "/dashboard") {
    if (!user) {
      return <Login />;
    }

    if (user.role === "recruiter") {
      return <RecruiterDashboard />;
    }

    return <Dashboard />;
  }

  if (path === "/jobs") {
    return <Jobs />;
  }

  if (path === "/job-details") {
    return <JobDetails />;
  }

  if (path === "/applications") {
    if (!isLoggedIn || user?.role !== "student") {
      return <Login />;
    }

    return <MyApplications />;
  }

  if (path === "/profile") {
    if (!isLoggedIn) {
      return <Login />;
    }

    return <Profile />;
  }

  if (path === "/post-job") {
    if (!isLoggedIn || user?.role !== "recruiter") {
      return <Login />;
    }

    return <PostJob />;
  }

  if (path === "/my-jobs") {
    if (!isLoggedIn || user?.role !== "recruiter") {
      return <Login />;
    }

    return <MyJobs />;
  }

  if (path === "/edit-job") {
    return <EditJob />;
  }

  if (path === "/received-applications") {
    return <ReceivedApplications />;
  }

  return <Login />;
}

export default App;
