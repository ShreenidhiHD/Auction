import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticatedRoute from './utils/AuthenticatedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserHome from './pages/User/UserHome';
import UserProfile from './pages/User/UserProfile';
import Dashboard from './pages/User/Dashboard';
import SettingsProvider from './server/SettingsProvider';
import ForgetPassword from './pages/ForgetPassword';
import CompleteProfile from './pages/User/CompleteProfile';
import ListItem from './pages/User/ListItem';
import ViewAuction from './pages/User/ViewAuction';
import UserAuctions from './pages/User/UserAuctions';
import AuctionBids from './pages/User/AuctionBids';
import MyBids from './pages/User/MyBids';
import UpdateAuction from './pages/User/UpdateAuction';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminAuctions from './pages/Admin/AdminAuctions';
import AdminManagerList from './pages/Admin/AdminManagerList';
import AdminReportedAccounts from './pages/Admin/AdminReportedAccounts';
import AdminCreateCreateManager from './pages/Admin/AdminCreateManager';
import AssignedTasks from './pages/Manager/AssignedTasks';


// The App component wraps the entire application and sets up routing for all pages.
// It also provides settings to all components using the SettingsProvider.
function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/userhome" element={<AuthenticatedRoute><UserHome /></AuthenticatedRoute>} />
            <Route path="/userprofile" element={<AuthenticatedRoute><UserProfile /></AuthenticatedRoute>} />
            <Route path="/listitem" element={<AuthenticatedRoute><ListItem /></AuthenticatedRoute>} />
            <Route path="/dashboard" element={<AuthenticatedRoute><Dashboard /></AuthenticatedRoute>} />
            <Route path="/userauctions" element={<AuthenticatedRoute><UserAuctions /></AuthenticatedRoute>} />
            <Route path="/viewauction/:id/:product_name" element={<AuthenticatedRoute><ViewAuction /></AuthenticatedRoute>} />
            <Route path="/completeprofile" element={<AuthenticatedRoute skipProfileCheck><CompleteProfile /></AuthenticatedRoute>} />
            <Route path="/auction/bids/:id/:auction_name" element={<AuthenticatedRoute><AuctionBids /></AuthenticatedRoute>} />
            <Route path="/mybids" element={<AuthenticatedRoute><MyBids /></AuthenticatedRoute>} />
            <Route path="/admindashboard" element={<AuthenticatedRoute><AdminDashboard /></AuthenticatedRoute>} />
            <Route path="/auctions/update_auction/:id" element={<AuthenticatedRoute><UpdateAuction /></AuthenticatedRoute>} />
            <Route path="/adminauctions" element={<AuthenticatedRoute><AdminAuctions /></AuthenticatedRoute>} />
            <Route path="/adminmanagerlist" element={<AuthenticatedRoute><AdminManagerList /></AuthenticatedRoute>} />
            <Route path="/adminreportedaccounts" element={<AuthenticatedRoute><AdminReportedAccounts/></AuthenticatedRoute>} />
            <Route path="/admincreatemanager" element={<AuthenticatedRoute><AdminCreateCreateManager/></AuthenticatedRoute>} />
            <Route path="/adminusers" element={<AuthenticatedRoute><AdminUsers /></AuthenticatedRoute>} />

            <Route path="/assignedtasks" element={<AuthenticatedRoute><AssignedTasks/></AuthenticatedRoute>} />
            
          </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;

// The App component wraps the entire application and sets up routing for all pages.
// It also provides settings to all components using the SettingsProvider.
// Navbar is always rendered at the top, while other components are rendered based on the current route.
// The AuthenticatedRoute is used for routes that should only be accessible to authenticated users.