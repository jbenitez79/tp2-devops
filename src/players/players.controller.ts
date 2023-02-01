import { Controller, Post, Body } from '@nestjs/common';
import { PlayersService } from './players.service';
import { Player } from './player.entity';

import { SummonerDto } from './dto/summoner.dto';
import { RecentMatchesDto } from './dto/recentMatches.dto';
import { SummaryDto } from './dto/summary.dto'

@Controller('player')
export class PlayersController {

	private continent: string 	= "";
	private americas: string[] 	= ["BR1", "LA1", "LA2", "NA1"];
	private asia: string[] 		= ["JP1", "KR", "PH2", "SG2", "TH2", "TW2", "VN2"];
	private europe: string[] 	= ["EUN1", "EUW1", "RU", "TR1"];
	private sea: string[] 		= ["OC1"];

	constructor(private playersService: PlayersService){}

	@Post('/recentMatches')
	async recentMatches(@Body() body: RecentMatchesDto){

		if(this.americas.includes(body.region)) 	this.continent = "americas";
		else if(this.asia.includes(body.region)) 	this.continent = "asia";
		else if(this.europe.includes(body.region)) 	this.continent = "europe";
		else if(this.sea.includes(body.region)) 	this.continent = "sea";
		else return "Error: Invalid region";
		
		if(body.queueId < 0 || body.queueId !== undefined && isNaN(body.queueId)){
			return "Error: invalid queueId";
		}
		if(body.limit < 0 || body.limit !== undefined && isNaN(body.limit)){
			return "Error: invalid limit";
		}

		const summoner_data = await this.playersService.getSummoner(body.region.toLowerCase(), body.username);
		if(!isNaN(summoner_data)) return "Couldn't retrieve summoner data.";
		
		const recentMatchsIds = await this.playersService.getRecentMatchesIds(summoner_data.puuid, this.continent, body.queueId, body.limit);
		if(!isNaN(recentMatchsIds)) return "Couldn't retrieve summoner matchs ids.";
		
		const matchInfo = await this.playersService.getMatchInfo(recentMatchsIds, this.continent, summoner_data.puuid);
		if(!isNaN(matchInfo)) return "Couldn't retrieve match information.";

		this.playersService.createPlayer(body.username, body.region.toLowerCase(), summoner_data.id);

		return matchInfo;
	}

	@Post('/summary')
	async summary(@Body() body: SummaryDto){
		if(this.americas.includes(body.region)) 	this.continent = "americas";
		else if(this.asia.includes(body.region)) 	this.continent = "asia";
		else if(this.europe.includes(body.region)) 	this.continent = "europe";
		else if(this.sea.includes(body.region)) 	this.continent = "sea";
		else return "Error: Invalid region";
		
		if(body.queueId < 0 || body.queueId !== undefined && isNaN(body.queueId)){
			return "Error: invalid queueId";
		}

		const summoner_data = await this.playersService.getSummoner(body.region.toLowerCase(), body.username);
		if(!isNaN(summoner_data)) return "Couldn't retrieve summoner data.";
		
		const recentMatchsIds = await this.playersService.getRecentMatchesIds(summoner_data.puuid, this.continent, body.queueId);
		if(!isNaN(recentMatchsIds)) return "Couldn't retrieve summoner matchs ids.";

		const matchInfo = await this.playersService.getMatchInfo(recentMatchsIds, this.continent, summoner_data.puuid);
		if(!isNaN(matchInfo)) return "Couldn't retrieve match information.";

		const rankInfo = await this.playersService.getRankInfo(body.region.toLowerCase(), summoner_data.id, matchInfo);
		if(!isNaN(rankInfo)) return "Couldn't retrieve summoner ranked information.";

		this.playersService.createPlayer(body.username, body.region.toLowerCase(), summoner_data.id);

		return rankInfo;
	}

	@Post('/leaderboard')
	leaderboard(@Body() body: SummonerDto){
		if(this.americas.includes(body.region) || 
			this.asia.includes(body.region) || 
			this.europe.includes(body.region) || 
			this.sea.includes(body.region)){

			return this.playersService.getPosition(body.username, body.region.toLowerCase());
		}
		return "Error: Invalid region";
	}
}
