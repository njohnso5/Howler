# Howler

![image](https://github.com/FirebombDragon/PortfolioProjects/assets/91640916/658a1321-d104-4132-9e9b-a30fa4012ea9)

### Features
Users can create accounts and log in to the application.  After logging in, they will see all "howls" from all users that they follow.  The user can use the textbox and Howl button to make their own howls, which will be shared with all users that follow them.  The user can also click other users' names to check their profiles, including all users they follow as well as all of their "howls".  The user can then click their name to change back to their home page.

### User Authentication
Users are required to log in to the system by providing a username and password.  User information is stored in json files.  Stored passwords are securely hashed along with a salt that is also stored in the database.  When a user logs in, their password is hashed with the same salt and compared to the one in the database.  If they match, then the system will create a custom token containing the current user and store it as a cookie.  To utilize any other page or API route for our system, the user's browser must provide a valid cookie.  Before performing any action, a middleware function ensures that the caller provides a valid cookie.

### Pages
<b>Login:</b> Users can provide their username and password to log in.  Click "Register" to create a new account.<br>
<b>Register:</b> Create a new user profile by specifying name, username, and password.<br>
<b>Home Page:</b> Shows all posts from the current user and users they follow.  Type in the textbox and click "Howl" to create a new post.<br>
<b>Profile Page:</b> Based on the id in the query, shows the profile of a user including users they follow and posts that they created.<br>
Users can navigate between Home Page and all Profile Pages by clicking on the username links.  Click "Log out" on the navbar to log out.

### API Endpoints:
| Method | Route | Description |
|--|--|-------------------------|
| POST | `/login` | Receives a username and password, verifies user and creates a token |
| POST | `/logout` | Logs out a user |
| POST | `/users` | Creates a new account and returns the new object |
| GET | `/users/current` | Retrieves the user object for the currently logged in user |
| GET | `/follows/:userid` | Gets all users followed by the given user |
| GET | `/howls/followed` | Gets all howls for the home page |
| GET | `/howls/:userid` | Gets all howls from a given user |
| GET | `/users/:userid` | Gets a specific user's information |
| POST | `/follows` | Adds a user to the current user's follow list |
| DELETE | `/follows/:userid` | Removes a user from the current user's follow list |
| POST | `/howls` | Creates a howl and links it to the current user |

























