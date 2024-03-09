 # MySchool Partner Program

my-school is a project developed with React and Node.js for the 2023/2024 coding and programming CT FBLA competition. 

## Project Screenshots

The MySchool program looks like this in a localhost development environment:

<img src="https://github.com/danctila/my-school/assets/134968796/cf278fd2-912d-40d3-9cd4-c2407b2c49e1" alt="myschool website 1" width="800"/>

<img src="https://github.com/danctila/my-school/assets/134968796/1215b8ca-5b17-4788-93df-9d64956aa194" alt="myschool website 2" width="800"/>

<img src="https://github.com/danctila/my-school/assets/134968796/b351848d-93f2-489c-982f-c4bba77a84d5" alt="myschool website 3" width="800"/>

<img src="https://github.com/danctila/my-school/assets/134968796/fb2ff9a4-9e10-4a89-863c-8948234d3e29" alt="myschool website 4" width="800"/>

<img src="https://github.com/danctila/my-school/assets/134968796/0441dddd-3490-48ac-9b89-1dea6990caac" alt="myschool website 5" width="800"/>

## Installation

### Prerequisites 

In order to run this project **you will need 3 applications installed** on your machine

#### 1 - Visual Studio Code
Install Microsofts Visual Studio Code IDE from [this website](https://code.visualstudio.com/ "this website")
<img src="https://github.com/danctila/my-school/assets/134968796/93371555-3f98-4708-b17d-56a4ab4233ea" alt="visual studio code website" width="800"/>
#### 2 - Node JS
Install Node JS from [this website](https://nodejs.org/en "this website") onto your machine to be able to run the start commands for the frontend and backend
<img src="https://github.com/danctila/my-school/assets/134968796/33019d6d-df2d-44c0-b1c6-4b314864650b" alt="nodejs website" width="800"/>
#### 3 - GitHub
-Install Git from [this website](https://gitforwindows.org/ "this website") onto your machine to be able to run the start commands for the frontend and backend.

-On this repository site (github.com), create an account that can be used to sign in in later steps.
<img src="https://github.com/danctila/my-school/assets/134968796/745c5652-6167-46ce-be89-baf9bfbb7177" alt="nodejs website" width="800"/>

### Usage
One you have installed the **necessary 3 applications**, follow these steps to run the project.

##### 1 - Create a folder
On your desktop, right click anywhere and create a folder named `mySchool`
<img src="https://github.com/danctila/my-school/assets/134968796/5b543547-f483-4f30-844b-86530b1875ab" alt="create folder" width="800"/>

##### 2 - Open in Visual Studio Code
Open Visual Studio Code and drag the folder you just created into the Visual Studio Code window to copy it into your workspace.
<img src="https://github.com/danctila/my-school/assets/134968796/ae20eebc-2c66-46d7-978d-a6edd6a4bdf4" alt="visual studio code workspace" width="800"/>

##### 2 - Clone this repository
In the Visual Studio Code search bar, type  `>Git: Clone` and press enter.
<img src="https://github.com/danctila/my-school/assets/134968796/a815b856-6cbf-43c1-8b05-878596040d21" alt="git clone prompt" width="800"/>

After pressing enter the search bar should prompt: "Provide repository URL or pick a repository source"
<img src="https://github.com/danctila/my-school/assets/134968796/bfe7f603-04fd-4d27-8b56-750ccd8db79d" alt="git clone" width="800"/>

Copy the repository clone link from the top of this repository page using the green 
`< > Code` button 
<img src="https://github.com/danctila/my-school/assets/134968796/7d3e516e-7aa6-4871-881a-715bb1b2a23e" alt="git clone" width="800"/>

After entering the link and pressing enter, choose the folder you created as the destination and click open.

##### 4 - Enter the Visual Studio Code terminal
In Visual Studio Code, use the command Ctrl + Shift + ` (backtick) to open a new terminal window

Alternatively, you can click on the terminal menu button at the top of the screen in the navigation bar and open a new terminal

<img src="https://github.com/danctila/my-school/assets/134968796/cbac4668-fe13-4815-be91-4ba78d97079c" alt="new terminal" width="800"/>

##### 5 - Start the backend
In the terminal window you just created, you should be located in the directory of your file. This means that at the end of the command line to the left of your cursor there should be `my-school>`, similar to below

<img src="https://github.com/danctila/my-school/assets/134968796/caede240-b0fa-421e-9b75-53c5174998c4" alt="terminal window" width="400"/>

Type these commands in this order into this new terminal window:
1. `cd backend`-> enter
2. `npm start`-> enter
3. In the backend folder, enter the file server.js and press `ctrl s` just to save the file

After these commands, the backend server should start and the site https://localhost:8081 should be prompted in the terminal. If the server is correctly configured, the terminal should say "listening..." 

##### 6 - Start the frontend

In the terminal window you just started the backend in, click the + button to create a new terminal. You should again be located in the my-school directory. 

<img src="https://github.com/danctila/my-school/assets/134968796/caede240-b0fa-421e-9b75-53c5174998c4" alt="terminal window" width="400"/>

Type the following commands in this order into this terminal window:
1.  `cd frontend` -> enter
2. `npm i` -> enter
3. `npm start` -> enter

After these commands, the frontend server should start and the site https://localhost:3000 should open in your browser. If it does not automatically open, navigate to that site in any browser.

If this is succesful, return to the frontend at http://localhost:3000 and the table should be filled with data. If it is not, refresh the page.

## Features
1. Enter search terms into the search input and dynamically receive data
2. Filter using five different methods of choice including alphabetically and by id number
3. Add and update users with custom preferences using validated input fields
4. Download a backup of the current database state to a text file using the download backup button
5. Fully validated data to stop duplicate entries

## Technologies
#### Frontend
The frontend was developed using React with JavaScript. The project was bootstrapped with create-react-app. The frontend uses Bootstrap and Chakra UI for custom styling as well as Axios for connection to the backend API.

#### Backend
The backend server was developed using Express.Js with Node. The server includes 5 endpoints for data collection and manipulation
1.  "/" for selecting all data from the database
2. "/user/:id" for selecting a single contact from the database which matches a provided id
3. "/create" for adding a contact to the database
4. "update/:id" for updating an existing contact in the database which matches a provided id
5. "/delete/:id" for deleting an existing contact in the databse which matches a provided id

#### Database
The database is a MySql database hosted on a Raspberry Pi 4. The database includes fields for id, name, type, resources, and contact for various contacts inputed to the database. The database is queried via the backend API endpoints and the createConnection() function in the backend to access the Raspberry Pi 4.

## Reflection

**- What was the context for this project?**

This project was developed for the 2023-2024 FBLA Coding and Programming Competition. The topic was to create a program that allows your Career and Technical Education Department to collect and store information about business and community partners. The program was required include information on at least 25 different partners (real or fictional), with details such as, but not limited to, the type of organization, resources available, and direct contact information for an individual. The program was also required to enable users to search and filter the information as needed.

**- What was built?**

The final project ended as a full stack web application using NodeJs and Express for the backend, React for the frontend, and MySql for database management. The backend includes a RESTful API which connects to the frontend to ultimately displays the database, hosted on a Raspberry Pi 4, on the frontend website.

