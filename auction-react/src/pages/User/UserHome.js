import React, { useContext } from 'react';
import { Container, Grid } from '@mui/material';
import Card from '../../components/Card';
import Carousel from '../../components/Carousel';
import Footer from '../../components/Footer';
import { SettingsContext } from '../../server/SettingsProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Home.css';
import BrowseMore from '../../components/BrowseMore';

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
          <h3 className="section_title_cards">Transforming Food Waste: Donate or Trade for a Purposeful Cause</h3>
          <h6 className="section_text_cards" style={{ marginBottom: '50px' }}>Food Donations: Share the Blessings, Feed the Hungry</h6>
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
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
