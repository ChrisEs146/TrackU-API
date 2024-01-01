## TrackU API

The API was created using Node js, Express and MongoDb with Mongoose.

It allows users to create an account and perform a set of actions like signing in, updating the username, changing the password and deleting the account.

The TrackU API allows its users to add personal projects. In order to add a new project the user must provide a title and a description. Each project will have the following fields:

- **Title**: Provided by the user on creation.
- **Description**: Provided by the user on creation.
- **Date**: Auto-generated.
- **Status**: Set by default to "Not Started".
- **Progress**: Set by default to 0;

A project can be edited or deleted, but it can also have updates, these updates are small insights about the project's progress. In order to add an update the user must provide a title and a description.

The API manages authentication using jwt Tokens. When the user signs in, the API responds with an access token and stores a refresh token in a httpOnly cookie. Once the access token expires the user can request a new access token by calling the **/refresh** endpoint.
