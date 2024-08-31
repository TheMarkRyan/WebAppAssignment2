# Assignment 2 - Web API

**Name:** Mark Ryan

## Features

This API was extended beyond the labs to include the following features:

- **Successful Integration:**
  - Successfully connected Movies-API with my App and MongoDB.
  - Successfully forged a connection between my React App from Assignment 1 and the Movies-API from the labs.
  - Successfully connected to MongoDB to store information remotely.

- **New Endpoints:**
  - Added multiple endpoints for managing user profiles.
  - New endpoints for managing user-specific movie watchlists and favorites.

- **MongoDB Integration:**
  - Integrated MongoDB for storing user profiles and watchlists.
  - New users are automatically updated to MongoDB, and as movies are added to their watchlist, they become viewable on MongoDB.

- **Enhanced Authentication:**
  - JWT-based authentication for protecting user-specific routes.
  - Validation of usernames and passwords during registration and login.

- **Dark Mode Support:**
  - Implemented dark mode support in the front-end, making the UI responsive to user preferences.

- **Profile Management:**
  - Added front-end support for users to update their profiles, including uploading a profile picture and editing their bio.

- **CSS Improvements:**
  - Made some CSS improvements, notably to the Login / Signup pages.

## Setup Requirements

To run the app locally, ensure the following steps are taken:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Ensure MongoDB is running locally or provide a MongoDB Atlas connection string.
4. Configure the `.env` file as detailed below.

## API Configuration

Before running the API, ensure you have a `.env` file in the root of your project with the following variables:

```bash
NODE_ENV=development
PORT=8080
HOST=localhost
mongoDB=mongodb+srv://20098241:20098241@webapp2assignment2clust.m1bacwx.mongodb.net/
seedDb=true
secret=ilikecake

 
