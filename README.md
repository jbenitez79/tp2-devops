VOID company
Back-End Development Test - League of Legends Integration

Welcome, we need to test your abilities in back-end development, for that, please ensure to have created a Riot Account, in https://developer.riotgames.com/

RULES:
The test MUST be in Nest.js with PostgreSQL and TypeORM.
The project needs to have an architecture based on: Controllers, Services, Repositories and Entities.
Unit testing and integration testing is a bonus point but not required.
Caching techniques are bonus points but not required.
The delivery must have a Postman collection and the source code.

SCOPE:
For the project you will have to develop a medium sized set of endpoints integrating with https://developer.riotgames.com/apis
Each endpoint needs to receive a summoner name and a summoner region.

1) Get recent matches for a player paginated by a size and a limit.
a) Detailed with Infos like champion used, win, kda, kills, csPerMinute, runes, assists, spells…
b) Filter by queueId:
RANKED_SOLO_5x5: 420,
RANKED_FLEX_SR: 440,
NORMAL_BLIND_PICK: 430,
NORMAL_DRAFT_PICK: 400,
ARAM: 450,
ALL: 0

2) Summary for a player:
a) Current Rank: Name and Image
b) Current League Points
c) Wins, Losses, KDA, average of CSPerMinute, average of Vision Score
d) Filter by queueId:
RANKED_SOLO_5x5: 420,
RANKED_FLEX_SR: 440,
NORMAL_BLIND_PICK: 430,
NORMAL_DRAFT_PICK: 400,
ARAM: 450,
ALL: 0

3) Leaderboards for already calculated summoner name and summoner region:
a) For each player that was requested on endpoint for matches or summary, calculate his position (Top #1, Top #2…) on these criteria:
League Points
Win Rate
b) The endpoint for this task must be the return of the current position, example:
{ leaguePoints: { top: 3 }, winRate: { top: 9 } }

EXPECTED RESULTS:
1) Postman Collection with all routes working (any errors on any route will discount points for each route not working).
2) Source Code.
