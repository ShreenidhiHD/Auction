import React, { useContext, useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, Card, CardContent } from '@mui/material';
import { SettingsContext } from '../../server/SettingsProvider';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Home.css';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';



const CompleteProfile = () => {
    const navigate = useNavigate();
    const [pincodeError, setPincodeError] = useState('');
    const settings = useContext(SettingsContext);
    const [emailError, setEmailError] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [whatsappError, setWhatsappError] = useState('');
    useEffect(() => {
        
      const fetchProfile = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            // Handle unauthenticated state
            return;
          }
  
          const response = await axios.get('http://localhost:8000/api/user/profile', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
         
          const { name, mobile, email, whatsapp, address, pincode } = response.data;
          setName(name || ''); // Set default value as empty string if null
          setMobile(mobile || '');
          setEmail(email || '');
          setWhatsapp(whatsapp || '');
          setAddress(address || '');
          setPincode(pincode || '');
          setIsEdit(true);
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchProfile();
    }, []);
  
    const handleInputChange = (event, setState) => {
      setState(event.target.value);
    };
     
    const submitForm = (event) => {
      event.preventDefault();
  
      const profileData = {
        name,
        mobile,
        email,
        whatsapp,
        address,
        pincode,
      };
  
      axios
        .put('http://localhost:8000/api/user/profile', profileData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        .then((response) => {
        setMessage('Profile updated successfully');
        setMessageType('success');
          console.log(response);
          setTimeout(() => {
            setMessage('');
            setMessageType('');
            window.location.href = '/UserHome';
          }, 3000);
          
        })
        .catch((error) => {
         setMessage('Failed to update profile');
        setMessageType('error');
          console.log(error);
           // Clear the message after 3 seconds
        setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
        });
    };
  

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', justifyContent: '',marginTop: 10, alignItems: 'center', minHeight: '100vh' }}>
        {/* Render the alert based on the message type */}
      {message && (
        <Alert severity={messageType === 'success' ? 'success' : 'error'}>
          {message}
        </Alert>
      )}

      <Card sx={{ width: '100%', padding: '2rem' }}>
      <CardContent>
        <h2 class="text-center mb-4">Complete Profile</h2>
        <form onSubmit={submitForm} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField label="Name" variant="outlined" value={name} onChange={(event) => handleInputChange(event, setName)} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={4}>
       <TextField 
                label="Mobile" 
                variant="outlined" 
                value={mobile} 
                onChange={(event) => {
                  const pattern = new RegExp("^\\d{10}$");
                  if (!pattern.test(event.target.value)) {
                    setMobileError("Mobile number should be exactly 10 digits");
                  } else {
                    setMobileError("");
                  }
                  handleInputChange(event, setMobile);
                }} 
                fullWidth 
                required 
                error={mobileError !== ''}
                helperText={mobileError}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
            <TextField 
                label="Email" 
                variant="outlined" 
                value={email} 
                onChange={(event) => {
                  const pattern = new RegExp("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$");
                  if (!pattern.test(event.target.value)) {
                    setEmailError("Please enter a valid email");
                  } else {
                    setEmailError("");
                  }
                  handleInputChange(event, setEmail);
                }} 
                fullWidth 
                required 
                error={emailError !== ''}
                helperText={emailError}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
        
              <TextField 
                label="Whatsapp" 
                variant="outlined" 
                value={whatsapp} 
                onChange={(event) => {
                  const pattern = new RegExp("^\\d{10}$");
                  if (!pattern.test(event.target.value)) {
                    setWhatsappError("Whatsapp number should be exactly 10 digits");
                  } else {
                    setWhatsappError("");
                  }
                  handleInputChange(event, setWhatsapp);
                }} 
                fullWidth 
                required 
                error={whatsappError !== ''}
                helperText={whatsappError}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Address" variant="outlined" value={address} onChange={(event) => handleInputChange(event, setAddress)} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={4}>
          

                <TextField 
                  label="Pincode" 
                  variant="outlined" 
                  value={pincode} 
                  onChange={(event) => {
                    const pattern = new RegExp("^\\d{6}$");
                    if (!pattern.test(event.target.value)) {
                      setPincodeError("Pincode should be exactly 6 digits");
                    } else {
                      setPincodeError("");
                    }
                    handleInputChange(event, setPincode);
                  }} 
                  fullWidth 
                  required 
                  error={pincodeError !== ''}
                  helperText={pincodeError}
                />

            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary" sx={{ mr: 5, width: 200 }}>Update</Button>
            </Grid>
          </Grid>
        </form>
        </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default CompleteProfile;
