# League of Legends REST API

This project is a RESTful API that utilizes the League of Legends API to retrieve game data. It is built using Node.js, NestJS, TypeORM, PostgreSQL, and TypeScript. The architecture follows the MVC (Model-View-Controller) pattern with additional components such as Services, Repositories and Entities.

**Note: The project is not meant to be used. It is an example project of a third party API integration**

## Features

1. **Recent Matches**:
   - Retrieves recent matches for a player with pagination options.
   - Provides detailed information about each match, including the champion used, win status, KDA (kills, deaths, assists), CS per minute, runes, assists, and spells.

2. **Player Summary**:
   - Fetches a summary of a player's statistics.
   - Displays the current rank with name and image.
   - Shows the player's current league points, wins, losses, KDA, average CS per minute, and average vision score.

3. **Leaderboards**:
   - Calculates the position of each player based on specific criteria.
   - The criteria include League Points and Win Rate.
   - Returns the current position of a player in the leaderboard.

## Setup and Usage

1. Clone the repository and navigate to the project directory.
2. Install the needed dependencies.
3. Configure the PostgreSQL database connection by providing the necessary credentials in the .env file. (there's a sample.env)
4. Configure your league of legends developer API key (https://developer.riotgames.com/)

Run the following command to start the application:
`npm run start`

The API endpoints can be accessed using a tool like Postman. You can import the provided Postman collection to test the available endpoints.

## Caching

The project incorporates request caching to improve performance and reduce the number of requests made to the League of Legends API. This caching mechanism helps minimize the response time for subsequent requests.

## API Endpoints

1. **POST /player/recentMatches**
   - Retrieves recent matches for a player with pagination support.
2. **POST /player/summary**
   - Fetches a summary of a player's statistics.
3. **POST /player/leaderboard**
   - Calculates the position of a player in the leaderboards based on League Points and Win Rate.

## Contributing

Contributions are **NOT welcome**. If you encounter any issues or have suggestions for improvements, please **DON'T open** an issue or submit a pull request.

## License

MIT License

Copyright (c) [2023] [Lautaro Colella]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
