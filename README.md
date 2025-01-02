# Weather App

Welcome to the Weather App! This web application provides real-time weather information and a seven-day forecast for any location worldwide. It is built using Node.js, Express, MongoDB, and Bootstrap for a clean and responsive design.

## Features

*   **Search Functionality**: Use the search bar on the homepage to find weather information for any location worldwide.
    
    *   Autocompletion: As you type more than two characters, the top ten suggestions will appear, powered by the Awesomplete library.
        
*   **Current Location Weather**: Automatically displays the current weather for your location if location services are enabled.
    
*   **Recent Searches**: Displays the last five searches in a "Recent Searches" module. Each entry is clickable and navigates to a detailed weather page.
    
*   **Detailed Weather Page**:
    
    *   Shows current weather and a seven-day forecast for the selected location.
        
    *   Includes a blue button to return to the homepage.
        
*   **Session Tracking**: Each user is assigned a unique cookie ID to track their session. Recent searches are stored and retrieved from MongoDB Atlas based on this ID.
    

## Live Demo

Check out the live app here: [Weather App](https://weather-app-node-p1xu.onrender.com/)

_Note: The live app runs on a free account, so the first request may be slow while the app is deployed._

## Video Overview

Watch the YouTube video walkthrough of the project: [Weather App Demo](https://youtu.be/7pM5iE9gZBM)

## Technologies Used

*   **Frontend**:
    
    *   Bootstrap: For responsive and user-friendly design.
        
    *   Awesomplete: For real-time autocomplete suggestions in the search bar.
        
*   **Backend**:
    
    *   Node.js and Express: For handling server-side logic and API requests.
        
    *   MongoDB Atlas: For storing and managing user session data and recent searches.
        
*   **APIs**:
    
    *   [Open-Meteo Weather and Forecast API](https://open-meteo.com/en/docs): Provides real-time weather data and seven-day forecasts.
        
    *   [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api): Provides location-based geocoding data.
        

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) installed
    
*   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account set up
    

### Installation

1.  Clone the repository:
    
    git clone https://github.com/your-username/weather-app.git
    
    cd weather-app
    
2.  Install dependencies:
    
    npm install
    
3.  Set up your environment variables:
    
    *   Create a `.env` file in the root directory.
        
    *   Add the following variables:
        
        PORT\=3000
        
        MONGO\_URI\=your\_mongodb\_atlas\_connection\_string
        
4.  Run the application:
    
    npm start
    
5.  Open your browser and navigate to `http://localhost:3000`.
    

## Future Enhancements

*   Add user authentication to save recent searches across multiple devices.
    
*   Implement additional weather data like air quality and sunrise/sunset times.
    
*   Enhance the autocomplete feature with additional filtering options.
    
