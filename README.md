## Description

This is full-stack chat app that is built with MERN stack and Material UI. Socket.IO is used for the real-time message broadcasting.

### Features
#### -Real-time updates to the user lists, chat list, messages
#### -Gloabal chat for all users
#### -Direct messaging between users
#### -Persist chat history in both global and DM channel.
#### -Delete & Edit chat
#### -User authentication features using JWT tokens.

### Usage

```
1. Clone the repo
2. Move into the root directory of the project and execute `npm install` for the installation of server side dependencies and then run `npm run client-install` for the installation of FE side dependencies
3. This apo uses MongoDB as its Database. Make sure you installed it on your machine. If there is authentication involved, please edit `mongoURI` in the `config/keys.js` file.
4. Execute `npm run dev`. If this command fails, execute `npm install -g concurrently` and then running the `dev` command.

```
