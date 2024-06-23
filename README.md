# Roxiler Systems Task

Welcome to the Roxiler Systems Task repository! This project contains the frontend and backend implementations for a transaction management system, along with additional features such as search functionality, statistics display, and integration with external APIs for data visualization.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

This project was developed as a task for Roxiler Systems, aiming to provide a comprehensive transaction management system with data visualization capabilities. It includes both frontend (React) and backend (Node.js with Express) components, along with integration with external APIs for fetching transaction data and generating statistics and charts.

## Features

- **Transaction Management:**
  - View transactions with details such as title, description, price, category, sold status, and date of sale.
  - Pagination for navigating through large sets of transactions.
  - Search functionality to filter transactions based on title, description, or price.
  
- **Statistics and Charts:**
  - Display statistics for total sales amount, total sold items, and total not sold items for a selected month.
  - Visualize data using a bar chart representing item counts in different price ranges.
  - API endpoints to fetch transaction statistics and price range data.

- **API Integration:**
  - External API integration to fetch transaction data for visualization.
  - API endpoints developed for fetching statistics, price range data, and category-wise item counts.

## Technologies Used

- **Frontend:**
  - React
  - React Chart.js 2 (for charts)
  - React Paginate (for pagination)
  - Axios (for HTTP requests)

- **Backend:**
  - Node.js
  - Express
  - Axios (for fetching external API data)

- **Database:**
  - External JSON file (for transaction data)

## Setup Instructions

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SairajGulve09/Roxiler-Systems-Test.git
   cd Roxiler-Systems-Task
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# From the root directory of the project
cd server
npm start

# Open a new terminal tab or window
# From the root directory of the project
cd client
npm start


# Images:

![Screenshot 2024-06-23 125431](https://github.com/SairajGulve09/Roxiler-Systems-Test/assets/130494632/6111aef1-b48e-4594-9906-ec7c84635a59)
![Screenshot 2024-06-23 125404](https://github.com/SairajGulve09/Roxiler-Systems-Test/assets/130494632/8b1e0e86-928c-4a98-836e-16c5925218ff)
![Screenshot 2024-06-23 125352](https://github.com/SairajGulve09/Roxiler-Systems-Test/assets/130494632/5b87be78-730e-4ae2-99b1-b41c8d75b7c3)
