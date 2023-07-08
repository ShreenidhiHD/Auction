import React, { useState, useEffect } from 'react';

// Create a context for settings
export const SettingsContext = React.createContext(null);

const SettingsProvider = ({ children }) => {
  // Define state for settings and error
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);

  // Use useEffect to fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch settings from the API
        const response = await fetch('http://localhost:8000/api/settings');
        const data = await response.json();

        // Update the settings state
        setSettings(data);
      } catch (error) {
        // If an error occurs, update the error state
        setError(error.message);
      }
    };

    // Call the fetchSettings function
    fetchSettings();
  }, []); // Dependency array is empty, so this effect runs once on mount

  // If there's an error, display an error message
  if (error) {
    return <div>Error fetching settings: {error}</div>;
  }

  // If settings are not yet loaded, display a loading message
  if (!settings) {
    return <div>Loading...</div>;
  }

  // Once settings are loaded, provide them to the child components through context
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};

// Export SettingsProvider for use in other components
export default SettingsProvider;





// This React component, SettingsProvider, is a context provider that fetches application settings from an API and makes them available to all child components through React context.
// When the SettingsProvider component is first rendered, it initiates an API call to fetch settings data. This is done within a useEffect hook to ensure it only runs once when the component is first mounted.
// This fetched data is then stored in a state variable, settings, via the setSettings function. If there is an error during the fetch process, the error message is stored in a separate state variable, error, using the setError function.
// Until the data is successfully fetched, the component will return a loading message. If an error occurs during data fetch, it will return an error message. Once the data has been successfully fetched, it will be made accessible to child components through the SettingsContext.Provider.
// This design pattern is useful when you want to fetch data once and make it available to multiple components, regardless of where they are in the component tree. This avoids the need to prop drill (passing data through intermediate components) and ensures that the data fetch logic is only written once, in the context provider, and not duplicated across components.