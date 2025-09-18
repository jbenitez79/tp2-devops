import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

import { catchError } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

import { SummonerDto } from './dto/summoner.dto';


@Injectable()
export class PlayersService {

	private readonly LEAGUE_API_KEY = process.env.LEAGUE_API_KEY;
	private readonly DEFAULT_LIMIT = 5;

	config = {
		headers: {
			"X-Riot-Token": `${this.LEAGUE_API_KEY}`,
		},
	};

	constructor(
		private readonly httpService: HttpService,
		@InjectRepository(Player) private playerRepository: Repository<Player>
	){}

	async getSummoner(region: string, username: string): Promise<any> {

		const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}`;

		try {
			const response = await lastValueFrom(this.httpService.get<any>(url, this.config));
			return response.data;
		} catch (err: any) {
    		return err.response.status;
		}
	}
	
	async getRecentMatchesIds(puuid: string, continent: string, queueId: number, limit?: number): Promise<any> {

		limit = (limit === undefined || limit === 0) ? this.DEFAULT_LIMIT : limit;

		const params: string = (queueId === undefined) ? 
		`start=0&count=${limit}` : `queue=${queueId}&start=0&count=${limit}`;

		const url = `https://${continent}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?${params}`;

		try {
			const response = await lastValueFrom(this.httpService.get<any>(url, this.config));
			return response.data;
		} catch (err: any) {
    		return err.response.status;
		}
	}

	async getMatchInfo (recentMatchsIds: string[], continent: string, puuid: string): Promise<any> {

		let allMatchs: {}[] = [];

		for(let i = 0; i < recentMatchsIds.length; i++){

			const url = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${recentMatchsIds[i]}`;

			try{
				const response = await lastValueFrom(this.httpService.get<any>(url, this.config));

				let listOfPlayers: string[] = [];

				const 
				player_index = response.data.metadata.participants.indexOf(puuid),
				player_match_info = response.data['info']['participants'][player_index];

				const matchInfo: { 
					championName: string, 
					champLevel: number, 
					win: boolean, 
					kda: number, 
					kills: number, 
					deaths: number, 
					assists: number, 
					wardsPlaced: number, 
					wardsKilled: number, 
					visionScorePerMinute: number, 
					damageDealtToObjectives: number
				} = { 
					"championName": player_match_info['championName'],
					"champLevel": player_match_info['champLevel'],
					"win": player_match_info['win'],
					"kda": +parseFloat((player_match_info['challenges']['kda']).toFixed(5)),
					"kills": player_match_info['kills'],
					"deaths": player_match_info['deaths'],
					"assists": player_match_info['assists'],
					"wardsPlaced": player_match_info['wardsPlaced'],
					"wardsKilled": player_match_info['wardsKilled'],
					"visionScorePerMinute": +parseFloat((player_match_info['challenges']['visionScorePerMinute']).toFixed(5)),
					"damageDealtToObjectives": player_match_info['damageDealtToObjectives']
				};

				allMatchs.push(matchInfo);
			} catch (err: any) {
	    		return err.response.status;
			}
		}

		return allMatchs;
	}

	async getRankInfo (region: string, summonerId: string, matchinfo: any[]): Promise<any> {

		const url = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;

		try{
			const response = await lastValueFrom(this.httpService.get<any>(url, this.config));
			
			if(response.data[0] === undefined) return 404;

			const info = response.data[0];

			let 
			kda: number = 0,
			vision: number = 0;

			for(let i = 0; i < matchinfo.length; i++){
				kda += matchinfo[i].kda;
				vision += matchinfo[i].visionScorePerMinute;
			}

			const rank_info: {
				current_rank: string,
				league_points: number,
				wins: number,
				losses: number,
				average_kda: number,
				average_vision: number
			} = {
				"current_rank": info.tier + " " + info.rank,
				"league_points": info.leaguePoints,
				"wins": info.wins,
				"losses": info.losses,
				"average_kda": +parseFloat((kda / this.DEFAULT_LIMIT).toFixed(5)),
				"average_vision": +parseFloat((vision / this.DEFAULT_LIMIT).toFixed(5))
			}

			return rank_info;
		} catch (err: any) {
	    	return err.response.status;
		}

	}


	async getPosition(username: string, region: string){

		const players_by_LP = await this.playerRepository.find({
			where: { region: `${region}` },
			order: { league_points: 'DESC' },
			cache: true
		});
		const players_by_WR = await this.playerRepository.find({
			where: { region: `${region}` },
			order: { win_rate: 'DESC' },
			cache: true
		});

		let 
		position_by_lp: number = 1, 
		position_by_wr: number = 1, 
		found: boolean = false;

		for(let i = 0; i < players_by_LP.length; i++){
			if(players_by_LP[i].username === username){
				if(i !== 0){
					position_by_lp = i + 1;
				}
				found = true;
				break;
			}
		}
		for(let i = 0; i < players_by_WR.length; i++){
			if(players_by_WR[i].username === username){
				if(i !== 0){
					position_by_wr = i + 1;
				}
				found = true;
				break;
			}
		}

		if(!found) return "Summoner not found";

		const positions: {
			leaguePoints: string,
			winRate: string
		} = {
			"leaguePoints": `top: ${position_by_lp}`,
			"winRate": `top ${position_by_wr}`
		}

		return positions;
	}

	async createPlayer(username: string, region: string, summonerId: string) {

		const players = await this.playerRepository.find({
			cache: true
		})
		let player_exists: boolean = false;

		for(let i = 0; i < players.length; i++){
			if(players[i].username === `${username}`){
				player_exists = true;
				break;
			}
		}

		if(!player_exists){
			const url = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;

			try{
				const response = await lastValueFrom(this.httpService.get<any>(url, this.config));

				if(response.data[0] === undefined) return 404;

				const info = response.data[0],
				leaguePoints = this.calculateLP(info.tier, info.rank) + info.leaguePoints;

				const player: { username: string, region: string, league_points: number, win_rate: number } = {
					"username": info.summonerName,
					"region": region,
					"league_points": leaguePoints,
					"win_rate": Math.round(info.wins / (info.wins + info.losses) * 100)
				}

				const newPlayer = this.playerRepository.create(player);
				this.playerRepository.save(newPlayer);
			} catch (err: any) {
		    	return "Error: Couldn't add summoner to the leaderboard";
			}
		}
	}

	calculateLP(tier: string, rank: string): number {

		let totalLps = 0;

		if(rank === "III"){
			totalLps = 101;
		}
		else if(rank === "II"){
			totalLps = 202;
		}
		else if(rank === "I"){
			totalLps = 303;
		}

		if(tier === "BRONZE"){
			totalLps += 1000;
		}
		else if(tier === "SILVER"){
			totalLps += 2000;
		}
		else if(tier === "GOLD"){
			totalLps += 3000;
		}
		else if(tier === "PLATINUM"){
			totalLps += 4000;
		}
		else if(tier === "DIAMOND"){
			totalLps += 5000;
		}
		else if(tier === "MASTER"){
			totalLps += 6000;
		}
		else if(tier === "GRANDMASTER"){
			totalLps += 7000;
		}
		else if(tier === "CHALLENGER"){
			totalLps += 8000;
		}

		return totalLps;
	}
}