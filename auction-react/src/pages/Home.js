import React, { useContext } from 'react';
import { Container, Grid } from '@mui/material';
import Card from '../components/Card';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import { SettingsContext } from '../server/SettingsProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Home.css';
import BrowseMore from '../components/BrowseMore';
import ContactUs from '../components/Contactus';

// The Home component is the main landing page of the application. 
// It displays a Carousel at the top, followed by three Card components in a grid.
// The settings are fetched from SettingsContext to be used in the component.
// At the end of the page, the BrowseMore and Footer components are displayed.
const Home = () => {
  const settings = useContext(SettingsContext);

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Carousel />
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <>
          <h3 className="section_title_cards">Bid, Buy, and Sell: Explore a World of Possibilities at our Auction Platform.</h3>
          <h6 className="section_text_cards" style={{ marginBottom: '50px' }}> Find Unique Items to Buy or Sell in our Vibrant Auction Community</h6>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Card />
            </Grid>
            <Grid item>
              <Card />
            </Grid>
            <Grid item>
              <Card />
            </Grid>
          </Grid>
        </>
        <BrowseMore/>
        <ContactUs/>
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
