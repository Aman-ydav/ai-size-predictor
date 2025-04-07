# AI Size Predictor

Basically, this is a class assignment that we have to make for under our curriculum.
An AI-powered clothing size prediction system that helps users find their perfect fit across different brands.

## Features

- AI-powered size prediction based on body measurements
- Visual representation of measurements
- Brand size comparisons
- Confidence scores for predictions
- Responsive design for all devices

## Project Structure

```
ai-size-predictor/
├── index.html          # Home page
├── about.html          # About page
├── how-it-works.html   # How it works page
├── predict.html        # Size prediction page
├── styles.css          # CSS styles
├── script.js           # Frontend JavaScript
├── server.js           # Node.js backend server
└── package.json        # Project dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-size-predictor.git
   cd ai-size-predictor
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```
   npm start
   ```
   The server will run at http://localhost:3000

2. Open the application in your browser:
   - For local development, you can use a simple HTTP server:
     ```
     npx http-server
     ```
   - Then open http://localhost:8080 in your browser

## How to Use

1. Navigate to the "Predict Size" page
2. Enter your body measurements (height, weight, chest, waist, hips)
3. Select your gender
4. Click "Predict Size" to get your size recommendation
5. View your predicted size, confidence score, and brand comparisons

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- AI: Machine Learning (Random Forest)
- Data Visualization: Chart.js
