## TrackU API

API was created to be used in the [TrackU project](LinkGoesHere). It uses node js, express and MongoDb with mongoose. Feel free to check the [documentation](LinkGoesHere) and give it a try.

The API allows a user to create an account in the TrackU app and perform a set of actions like signing in, updating the username, changing the password and deleting the account.

With a valid account a user can add personal projects. In order to add a new project the user must enter a title and a description. Each project will have the following data:

- **Title**: Provided by the user on creation.
- **Description**: Provided by the user on creation.
- **Date**: Auto-generated.
- **Status**: Set by default to "Not Started".
- **Progress**: Set by default to 0;

A project can be edited or deleted, but it can also have updates, these updates are small insights about the project's progress. To add an update the user must provide a title and a description for the update.
