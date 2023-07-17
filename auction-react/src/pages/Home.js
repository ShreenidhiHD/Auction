import { Container, Grid } from '@mui/material';
import Card from '../components/Card';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import { SettingsContext } from '../server/SettingsProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Home.css';
import axios from 'axios';
import BrowseMore from '../components/BrowseMore';
import React, { useContext, useState, useEffect } from 'react';

// The Home component is the main landing page of the application. 
// It displays a Carousel at the top, followed by three Card components in a grid.
// The settings are fetched from SettingsContext to be used in the component.
// At the end of the page, the BrowseMore and Footer components are displayed.
const Home = () => {
  const settings = useContext(SettingsContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/unittest')
      .then(response => {
        setData(response.data.donation);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Carousel />
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <>
          <h3 className="section_title_cards">Transforming Food Waste: Donate or Trade for a Purposeful Cause</h3>
          <h6 className="section_text_cards" style={{ marginBottom: '50px' }}>Food Donations: Share the Blessings, Feed the Hungry</h6>
          <Grid container spacing={2} justifyContent="center">
          {data && data.slice(0, 3).map((item, index) => (
            <Grid item key={index}>
              <Card item={item} />
            </Grid>
          ))}

          </Grid>
        </>
        <BrowseMore/>
      </Container>
      <Footer />
    </div>
  );
};


export default Home;
