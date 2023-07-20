import { Container, Grid } from '@mui/material';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import { SettingsContext } from '../server/SettingsProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Home.css';
import axios from 'axios';
import BrowseMore from '../components/BrowseMore';
import React, { useContext, useState, useEffect } from 'react';
import BiddingCard from '../components/Card';

const Home = () => {
  const settings = useContext(SettingsContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/show_auctionhome');
        setData(response.data?.rows || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Carousel />
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <>
          <h3 className="section_title_cards">Auctions</h3>
          <h6 className="section_text_cards" style={{ marginBottom: '50px' }}>Food Donations: Share the Blessings, Feed the Hungry</h6>
          <Grid container spacing={2} justifyContent="center">
          {data && data.slice(0, 3).map((item, index) => (
              <Grid item xs={4} sm={4} md={4}  key={index}>
                <BiddingCard item={item} />
              </Grid>
            ))}
          </Grid>
        </>
        <BrowseMore />
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
