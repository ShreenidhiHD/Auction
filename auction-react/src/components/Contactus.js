import React from 'react';
import { Container, Typography, Grid, Card, CardContent, TextField, Button } from '@mui/material';

const ContactUs = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const recipientEmail = 'example@example.com';
    const subject = formData.get('subject');
    const message = formData.get('message');
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '40px', marginBottom: '40px',maxWidth: '100%',}}>
      <Card style={{ backgroundColor: '#f9f9f9' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" style={{ marginBottom: '16px', color: '#333' }}>
                Contact Us
              </Typography>
              <Typography variant="subtitle1" style={{ marginBottom: '16px' }}>
                Headquarters:
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '16px' }}>
                123 Street, City, Country
              </Typography>
              <Typography variant="subtitle1" style={{ marginBottom: '16px' }}>
                Email:
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '16px' }}>
                example@example.com
              </Typography>
              <Typography variant="subtitle1" style={{ marginBottom: '16px' }}>
                Phone:
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '16px' }}>
                +123 456 789
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  style={{ marginBottom: '16px' }}
                  
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  style={{ marginBottom: '16px' }}
                 
                />
                <TextField
                  label="Subject"
                  variant="outlined"
                  fullWidth
                  style={{ marginBottom: '16px' }}
                  name="subject"
                 
                />
                <TextField
                  label="Message"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  style={{ marginBottom: '16px' }}
                  name="message"
                  
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ display: 'block', margin: '0 auto' }}
                  type="submit"
                >
                  Submit
                </Button>
              </form>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ContactUs;
