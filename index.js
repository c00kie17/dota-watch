"use strict";
const winston = require("winston");
const request = require("request");
const vdf = require('vdfjs')
const moment = require("moment");
const gosu = require('gosugamers-api');
const async = require("async")
const lodash = require('lodash')
const JSONbig = require('json-bigint')({"storeAsString": true})
const teamHandler = require("./handlers/team")
const playerHandler = require("./handlers/player")
const twitchHandler = require("./handlers/twitch")
const leagueHandler = require("./handlers/league")
const heroHandler = require("./handlers/hero")
const matchHandler = require("./handlers/match")



module.exports = class dota {

	constructor(steamKey,twitchKey) {
		this.steamKey = steamKey
		this.twitchKey = twitchKey
		this.initialized = false
	}

	initialize(){
		var Dota = this
		return new Promise(function(complete,reject){
			Dota.getProPlayers().then(function(player){
				Dota.players = player
				Dota.getHeros().then(function(heros){
					Dota.heros = heros
					Dota.getLeagues().then(function(leagues){
						Dota.leagues = leagues
						Dota.getEconItem().then(function(items){
							Dota.econItems = items
							Dota.initialized = true
							complete()
						})
					})
				})
			}).catch(function(value){
				reject(value)
			})	
		})	
	}

	getProPlayers(){
		var Dota = this
		return new Promise(function(complete,reject){		
			request('https://api.steampowered.com/IDOTA2Fantasy_570/GetProPlayerList/v1/?key='+Dota.steamKey,function(error, response, body){
				if(error) reject(error)
				try{
					var body = JSON.parse(body)
				}catch(SyntaxError){
					reject(SyntaxError)
				}
				try{
					complete(body.player_infos)
				}catch(TypeError){
					reject(TypeError)
				}	
			})
		})	
	}

	getHeros(){
		var Dota = this
		return new Promise(function(complete,reject){	
			request('https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1/?key='+Dota.steamKey+'&language=en',function(error, response, body){
				if(error) reject(error)
				try{
					var body = JSON.parse(body)
				}catch(SyntaxError){
					reject(SyntaxError)
				}
				try{
					complete(body.result.heroes)
				}catch(TypeError){
					reject(TypeError)
				}
			})	
		})	
	}

	getEconItem(){
		var Dota = this
		return new Promise(function(complete,reject){
			request('https://api.steampowered.com/IEconItems_570/GetSchemaURL/v1//?key='+Dota.steamKey,function(error, response, body){
				if(error) reject(error)
				try{
					var body = JSON.parse(body)
				}catch(SyntaxError){
					reject(SyntaxError)
				}	
				request(body.result.items_game_url,function(vdferror, vdfresponse, vdfbody){
					complete(vdf.parse(vdfbody))
				})
			})
		})
	}

	getLeagues(){
		var Dota = this
		return new Promise(function(complete,reject){
			request('https://api.steampowered.com/IDOTA2Match_570/GetLeagueListing/v1/?key='+Dota.steamKey,function(error, response, body){
				if(error) reject(error)
				try{
					var body = JSON.parse(body)	
				}catch(SyntaxError){
					reject(SyntaxError)
				}	
				try{
					complete(body.result.leagues)
				}catch(TypeError){
					reject(TypeError)
				}
			})
		})	
	}

	getUpcomingGames(maxDate){
		var Dota = this
		var upcomingGames = []
		return new Promise(function(complete,reject){
			if(Dota.initialized){
				gosu.fetchMatchUrls('dota2', function(err, urls) {
					if(err){
						reject(err)
					}else if(urls == undefined){
						reject("not found")
					}else{
						gosu.parseMatches(urls,function(err,matches){
							if(err){
								reject(err)
							}
							async.eachSeries(matches, function (member, callback){
								if(member == undefined){
									callback()
								}else{
									if(member.status == "Upcoming" && (member.home['name'] != "To Be Decided" || member.away['name'] != "To Be Decided")){
										if(member.datetime <  maxDate){
											var allPromise = []
											var gameObj = {}
											gameObj['game'] = 'Dota 2'
											gameObj['type'] = 'Upcoming'
											gameObj['scoreboard'] = false
											gameObj['team1Name'] = member.home['name']
											gameObj['team2Name'] = member.away['name']
											gameObj['startTime'] = member.datetime
											var leagueName = member.url.split("/")[5]
											leagueName = leagueName.replace(/-/g, ' ')
											leagueName = leagueName.substr(leagueName.indexOf(" ") + 1);
											gameObj['leagueName'] = leagueName
											allPromise.push(teamHandler.getTeamTag(Dota.players,member.home['name'],"team1Tag"))
											allPromise.push(teamHandler.getTeamTag(Dota.players,member.away['name'],"team2Tag"))
											Promise.all(allPromise).then(function(result){
												for (var i = 0; i < result.length; i++) {
													gameObj[result[i].tag] = result[i].res
												}
												upcomingGames.push(gameObj)
												callback()
											})
											
										}else{
											callback()
										}	
									}else{
										callback()
									}
								}			
							},function(err){
								if(err)reject(err)
								complete(upcomingGames)
							})
						})
					}
					
				});
			}else{
				reject("initialization error")
			}	
		})
	}

	getLiveLeagueGames(minspectators){
		var Dota = this
		return new Promise(function(complete,reject){
			if(Dota.initialized){
				var livegames = []
				matchHandler.getAllLiveGames(Dota.steamKey).then(function(games){
					async.eachSeries(games, function (member, callback){
						if(member != undefined){
							if(member.spectators >= minspectators){
								if("team_name_radiant" in member || "team_name_dire" in member){
									var allPromises = []
									var gameObj = {}
									gameObj['game'] = "Dota 2"
									gameObj['serverSteamId'] = member.server_steam_id
									gameObj['lobbyId'] = member.lobby_id						
									gameObj['gameTimeMinutes'] = Math.floor(member.game_time/60)
									gameObj['gameTimeSeconds'] = member.game_time - (gameObj['gameTimeMinutes']*60)
									gameObj['team1Score'] = member.radiant_score
									gameObj['team2Score'] = member.dire_score
									gameObj['scoreboard'] = true
									gameObj['type'] = "League"
									gameObj['leagueId'] = member.league_id
									gameObj['team1Name'] = member.team_name_radiant
									gameObj['team2Name'] = member.team_name_dire
									gameObj['spectators'] = member.spectators
									gameObj['gameMode'] = member.game_mode
									gameObj['streamDetails'] = []
									allPromises.push(teamHandler.getTeamLogo(member.team_logo_radiant,Dota.steamKey,"team1Logo"))
									allPromises.push(teamHandler.getTeamLogo(member.team_logo_dire,Dota.steamKey,"team2Logo"))
									allPromises.push(leagueHandler.getLeagueName(member.league_id,Dota.leagues,Dota.econItems,"leagueName"))
									allPromises.push(leagueHandler.getLeagueLogo(member.league_id,Dota.leagues,Dota.econItems,Dota.steamKey,"leagueLogo"))
									allPromises.push(teamHandler.getTeamTag(Dota.players,member.team_name_radiant,"team1Tag"))
									allPromises.push(teamHandler.getTeamTag(Dota.players,member.team_name_dire,"team2Tag"))		
									Promise.all(allPromises).then(function(result){
										for (var i = 0; i < result.length; i++) {
											gameObj[result[i].tag] = result[i].res
										}
										livegames.push(gameObj)
										callback()
									})
								}else{
									callback()
								}		
							}else{
								callback()
							}
						}else{
							callback()
						}						
					},function(err){
						if(err)reject(err)
						complete(livegames)
					})					  						
				})
			}else{
				reject("initialization error")
			}	
		})	
	}

	getLivePubGames(minspectators){
		var Dota = this
		return new Promise(function(complete,reject){
			if(Dota.initialized){
				var livegames = []
				matchHandler.getAllLiveGames(Dota.steamKey).then(function(games){	
					async.eachSeries(games, function (member, callback){
						if(member != undefined){
							if(member.spectators >= minspectators){
								if(!("team_name_radiant" in member) && !("team_name_dire" in member)){
									var allPromises = []
									var gameObj = {}
									gameObj['game'] = "Dota 2"
									gameObj['serverSteamId'] = member.server_steam_id
									gameObj['lobbyId'] = member.lobby_id					
									gameObj['gameTimeMinutes'] = Math.floor(member.game_time/60)
									gameObj['gameTimeSeconds'] = member.game_time - (gameObj['gameTimeMinutes']*60)
									gameObj['team1Score'] = member.radiant_score
									gameObj['team2Score'] = member.dire_score
									gameObj['scoreboard'] = true
									gameObj['type'] = "Pub"	
									gameObj['averageMMR'] = member.average_mmr
									gameObj['spectators'] = member.spectators
									gameObj['gameMode'] = member.game_mode
									gameObj['streamDetails'] = []
									allPromises.push(playerHandler.ifProPlayerLiveGames(Dota.players,Dota.heros,member.players,"proPlayers"))
									Promise.all(allPromises).then(function(result){
										for (var i = 0; i < result.length; i++) {
											gameObj[result[i].tag] = result[i].res
										}
										twitchHandler.getPlayerStreamInfo(gameObj,Dota.twitchKey).then(function(value){
											var streams = []
											var allStreams = [].concat.apply([], value).unique()
											for (var i = 0; i < allStreams.length; i++) {
												var streamObj = {}
												streamObj['platform'] = "twitch"
												streamObj['viewers'] = allStreams[i].viewers
												streamObj['url'] = allStreams[i].channel.url
												streamObj['language'] = allStreams[i].channel.language
												gameObj['streamDetails'].push(streamObj)
											}
											livegames.push(gameObj)
											callback()
										})
										
									})
								}else{
									callback()
								}		
							}else{
								callback()
							}
						}else{
							callback()
						}						
					},function(err){
						if(err)reject(err)
						complete(livegames)
					})					  						
				})
			}else{
				reject("initialization error")
			}	
		})	
	}

	getScoreboard(gameid){
		var Dota = this
		return new Promise(function(complete,reject){
			request('https://api.steampowered.com/IDOTA2MatchStats_570/GetRealtimeStats/v1/?key='+Dota.steamKey+'&server_steam_id='+gameid, function (error, response, body) {
				if (error){
					reject(error)
				}
				try{
					var body = JSONbig.parse(body)
				}catch(SyntaxError){
					reject(SyntaxError)
				}
				if(body != undefined && "match" in body && "graphData" in body && "teams" in body && "buildings" in body){
					var match = body.match	
					var graphData = body.graph_data
					var teams = body.teams
					var buildings = body.buildings		
					var scoreboardObj = {}	
					scoreboardObj['server_steam_id'] = match.server_steam_id
					scoreboardObj['matchid'] = match.matchid
					scoreboardObj['gameTimeMinutes'] = Math.floor(match.game_time/60)
					scoreboardObj['gameTimeSeconds'] = match.game_time - (scoreboardObj['gameTimeMinutes']*60)
					scoreboardObj['gameMode'] = match.game_mode
					try{
 						scoreboardObj['goldGraph'] = graphData.graph_gold
 					}catch(TypeError){
 						console.log(body)
 					}	
					scoreboardObj['radiantBuildings'] = []
					scoreboardObj['direBuildings'] = []
					scoreboardObj['teams'] = []
					for (var i = 0; i < buildings.length; i++) {
						if(buildings[i].team != 0){
							var buildingObj = {}
							buildingObj['heading'] = buildings[i].heading
							buildingObj['x'] = buildings[i].x
							buildingObj['y'] = buildings[i].y
							buildingObj['tier'] = buildings[i].tier
							switch(buildings[i]['type']){
								case 0:
									buildingObj['type'] = "tower"
									break
								case 1:
									buildingObj['type'] = "barracks"
									break
								case 2:
									buildingObj['type'] = "ancient"
									break
							}			
							switch(buildings[i]['lane']){
								case 1:
									buildingObj['lane'] = "top"
									break
								case 2:
									buildingObj['lane'] = "middle"
									break
								case 3:
									buildingObj['lane'] = "bottom"
									break			
							}
							if(buildings[i].team == 3){
								scoreboardObj['direBuildings'].push(buildingObj)
							}else if(buildings[i].team == 2){
								scoreboardObj['radiantBuildings'].push(buildingObj)
							}
						}	
					}
					async.eachSeries(teams, function (teamMember, teamCallback){
						var allPromisesTeam = []
						var teamObj = {}
						teamObj['score'] = teamMember.score
						if(teamMember.team_name != ''){
							teamObj['teamName'] = team_name
							allPromisesTeam.push(teamHandler.getTeamTag(Dota.players,teamMember.team_name,"teamTag"))
							allPromisesTeam.push(teamHandler.getTeamLogo(teamMember.team_logo,Dota.steamKey,"teamLogo"))
						}
						teamObj['players'] = []
						async.eachSeries(teamMember.players, function (playerMember, playerCallback){
							var allPromisesPlayer = []
							var playerObj = {}
							playerObj['accountid'] = playerMember.accountid
							playerObj['name'] = playerMember['name']
							playerObj['level'] = playerMember.level
							playerObj['killCount'] = playerMember.kill_count
							playerObj['deathCount'] = playerMember.death_count
							playerObj['assistsCount'] = playerMember.assists_count
							playerObj['deniesCount'] = playerMember.denies_count
							playerObj['lhCount'] = playerMember.lh_count
							playerObj['gold'] = playerMember.gold
							playerObj['x'] = playerMember.x
							playerObj['y'] = playerMember.y
							allPromisesPlayer.push(playerHandler.ifProPlayer(Dota.players,playerMember.accountid,"proPlayer"))
							allPromisesPlayer.push(heroHandler.getHeroDetails(playerMember.heroid,Dota.heros,"heroDetails"))
							Promise.all(allPromisesPlayer).then(function(result){
								for (var i = 0; i < result.length; i++) {
									playerObj[result[i].tag] = result[i].res
								}
								teamObj['players'].push(playerObj)
								playerCallback()
							})
						},function(err){
							if(err)reject(err)
							Promise.all(allPromisesTeam).then(function(result){
								for (var i = 0; i < result.length; i++) {
									teamObj[result[i].tag] = result[i].res
								}
								if(teamMember.team_number == 2){
									teamObj['radiantTeam'] = teamObj
								}else if(teamMember.team_number == 2){
									teamObj['direTeam'] = teamObj
								}
								scoreboardObj['teams'].push(teamObj)
								teamCallback()
							})
						})
					},function(err){
						if(err)reject(err)
						complete(scoreboardObj)
					})
				}else{
					reject("undefined error")
				}	
			})
		})
	}	
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i]['_id'] === a[j]['_id'])
                a.splice(j--, 1);
        }
    }
    return a;
};





