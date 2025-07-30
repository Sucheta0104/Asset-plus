import Home from "./pages/Home";
import About from "./pages/About";
import SignUpForm from "./pages/SignUpForm";
import SignIn from "./pages/SignIn";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import DashboardPage from "./components/Dashboard/DashboardPage";
import Assets from "./components/Dashboard/Assets";
import Assignment from "./components/Dashboard/Assignment";
import Maintainance from "./components/Dashboard/Maintainance";
import Vendor from "./components/Dashboard/Vendor";
import Reports from "./components/Dashboard/Reports";
import { ToastContainer } from 'react-toastify';
import AssignmentHistory from "./components/Dashboard/AssignmentHistory";
import Addasset from "./components/Dashboard/Addasset";
import RegistrationPage  from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Pricing" element={<Pricing />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<RegistrationPage/>}/>

        {/* Dashboard Layout with nested routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="assets">
            <Route index element={<Assets/>}/>
            <Route path="addasset" element={<Addasset/>}/>
            </Route> 
          <Route path="assignment">
            <Route index element={<Assignment />} />
            <Route path="assignmenthistory" element={<AssignmentHistory />} />
          </Route>
          <Route path="maintainance" element={<Maintainance />} />
          <Route path="vendor" element={<Vendor />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
