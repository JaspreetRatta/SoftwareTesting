import "antd/dist/antd.min.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "./resourses/global.css";
import "font-awesome/css/font-awesome.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tour from "./pages/Tour";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

import Profile from "./pages/Profile";
import ContactForm from "./pages/ContactForm";

import AddMemory from "./Diary/AddMemory";
import MemoryList from "./Diary/MemoryList";
import ShowMore from "./Diary/showmore";

import AdminBookingsTourr from "./pages/Admin/booktour";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import { useSelector } from "react-redux";
import AdminHome from "./pages/Admin/AdminHome";
import AdminBuses from "./pages/Admin/AdminBuses";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminTour from "./pages/Admin/TourPage/AdminTour";
import CreateTour from "./pages/Admin/TourPage/CreateTour";
import House from "./pages/House";
import BookNow from "./pages/BookNow";
import ShowBus from "./pages/BusPages/ShowBus";
import BookingsTour from "./pages/BookingsTour";
import Bookings from "./pages/Bookings";
import AdminBookings from "./pages/Admin/AdminBookings";
import AdminCoupons from "./pages/Admin/AdminCoupons";
import SingleTourCard from "./components/SingleTourCard";

import EmployeeManagement from "./pages/Admin/EmployeeManagement";
import TeamManagement from "./pages/Admin/TeamManagement";
import TaskManagement from "./pages/Admin/TaskManagement";
import AdminWorkers from "./pages/Admin/AdminWorkers";

import WorkerTasks from "./components/WorkerTasks";
import WorkerProfile from "./components/WorkerProfile";
import Reports from "./pages/Admin/Reports";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <div>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route
            path="/bus"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tour"
            element={
              <ProtectedRoute>
                <Tour />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tour/:id"
            element={
              <ProtectedRoute>
                <SingleTourCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-now/:id"
            element={
              <ProtectedRoute>
                <BookNow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/show-bus/:id"
            element={
              <ProtectedRoute>
                <ShowBus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookingsTour"
            element={
              <ProtectedRoute>
                <BookingsTour />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <House />
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/src/pages/Profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/src/Diary/AddMemory"
            element={
              <ProtectedRoute>
                <AddMemory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/src/Diary/MemoryList"
            element={
              <ProtectedRoute>
                <MemoryList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/src/Diary/showmore/:id"
            element={
              <ProtectedRoute>
                <ShowMore />
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/src/pages/ContactForm"
            element={
              <ProtectedRoute>
                <ContactForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/AdminHome"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/buses"
            element={
              <ProtectedRoute>
                <AdminBuses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tour"
            element={
              <ProtectedRoute>
                <AdminTour />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tour/create"
            element={
              <ProtectedRoute>
                <CreateTour />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute>
                <EmployeeManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/workers"
            element={
              <ProtectedRoute>
                <AdminWorkers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/teams"
            element={
              <ProtectedRoute>
                <TeamManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tasks"
            element={
              <ProtectedRoute>
                <TaskManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/worker/tasks" element={<WorkerTasks />} />
          <Route path="/worker/profile" element={<WorkerProfile />} />
          <Route path="/reports" component={Reports} />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/admin/booktour"
            element={
              <ProtectedRoute>
                <AdminBookingsTourr />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResetPassword"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute>
                <AdminCoupons />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
