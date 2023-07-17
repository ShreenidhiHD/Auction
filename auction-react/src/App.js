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
           
            <Route path="/completeprofile" element={<AuthenticatedRoute skipProfileCheck><CompleteProfile /></AuthenticatedRoute>} />

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