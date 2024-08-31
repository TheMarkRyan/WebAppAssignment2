# **Assignment 2 - Web API**

**Name:** Mark Ryan

## **Features**

This API was extended beyond the labs to include the following features:

- **Successfully connected Movies-API with my App and MongoDB**
  - Successfully forged connection between my React App from Assignment 1 and the Movies-API from the labs.
  - Successfully connected to MongoDB to store information remotely.
- **New Endpoints:**
  - Added multiple endpoints for managing user profiles.
  - New endpoints for managing user-specific movie watchlists and favorites.
- **MongoDB Integration:**
  - Integrated MongoDB for storing user profiles and watchlists.
  - New users are automatically updated to MongoDB and as movies are added to their watchlist they become viewable on MongoDB.
- **Enhanced Authentication:**
  - JWT-based authentication for protecting user-specific routes.
  - Validation of usernames and passwords during registration and login.
- **Dark Mode Support:**
  - Implemented dark mode support in the front-end, making the UI responsive to user preferences.
- **Profile Management:**
  - Added front-end support for users to update their profiles, including uploading a profile picture and editing their bio.
- **CSS Improvements**
  - Made some CSS improvements, notably to the Login / Signup pages.

## **Setup Requirements**

To run the app locally, ensure the following steps are taken:

1. Clone the repository.
2. Install dependencies using npm install.
3. Ensure MongoDB is running locally or provide a MongoDB Atlas connection string.
4. Configure the .env file as detailed below.

## **API Configuration**

Before running the API, ensure you have a .env file in the root of your project with the following variables:

**NODEENV=development**

**PORT=8080**

**HOST=localhost mongoDB=mongodb+srv://20098241:<20098241@webapp2assignment2clust.m1bacwx.mongodb.net>/**

**seedDb=true**

**secret=ilikecake**

## **API Design**

Here's an overview of the API endpoints:

- **/api/movies**
  - **GET**: Fetch a list of movies.
- **/api/movies/**
  - **GET**: Fetch details of a single movie by its ID.
- **/api/movies/**

**/reviews**

- - **GET**: Get all reviews for a specific movie.
    - **POST**: Add a new review to a movie.
- **/api/users**
  - **POST**: Register a new user.
- **/api/users/login**
  - **POST**: Login to the application.
- **/api/users/favorites**
  - **POST**: Add a movie to the user's favorites.
  - **GET**: Get the user's favorite movies. \*Not fully working – was having issues\*
- **/api/users/watchlist**
  - **POST**: Add a movie to the user's watchlist. \*Not fully working – was having issues\*
  - **GET**: Get the user's watchlist.

## **Security and Authentication**

This API uses JWT for authentication. Users must log in to obtain a token, which they must include in the Authorization header of protected routes.

**Protected Routes:**

- /api/users/favorites
- /api/users/watchlist

These routes can only be accessed by authenticated users.

I made it so that the first page shown is a login/signup page so basically all pages are protected as aresult. Users must login or signup before proceeding.

## **Integrating with React App**

The React app is fully integrated with this API:

- **Movies Pages:** Lists of movies (e.g., trending, latest, top-rated) are fetched from the API.
- **Movie Details Page:** Displays detailed information about a movie, including reviews, recommended movies, and similar movies.
- **Actor Pages:** Allows searching for actors, displaying their details and filmography.
- **Watchlist and Favorites:** Users can add movies to their watchlist or favorites, and the frontend reflects these changes.

**Dark/Light Mode:** A toggle switch is available in the app header, allowing users to switch between dark and light modes. This preference is stored locally.

## **Independent Learning**

For this assignment, I explored several advanced topics, including:

- **React Query:** Implemented for efficient state management and data synchronization between the frontend and the backend.
- **JWT Authentication:** Added to secure API endpoints and manage user sessions.
- **Mongoose Validation:** Implemented validation logic in Mongoose schemas to ensure data integrity.

**References:**

Used Chat-GPT for resolving errors, explaining error messages, fixing syntax issues etc.
