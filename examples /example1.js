dotaWatch = require("../")
const util = require("util")
const moment = require("moment");

watchDota = new dotaWatch("your steam api key","your twitch api key")

console.log("running test at: "+moment().format("dd MMMM Do HH:mm:ss"))

//get Pro Players
watchDota.getProPlayers().then(function(players){
	console.log(util.inspect(players,false,null))
}).catch(function(error){
	console.log("error: "+ error)
})

//get Heros
watchDota.getHeros().then(function(heros){
	console.log(util.inspect(heros,false,null))
}).catch(function(error){
	console.log("error: "+ error)
})

//get EconItems
watchDota.getEconItem().then(function(econItem){
	console.log(util.inspect(econItem,false,null))
}).catch(function(error){
	console.log("error: "+ error)
})

//get Leagues
watchDota.getLeagues().then(function(leagues){
	console.log(util.inspect(leagues,false,null))
}).catch(function(error){
	console.log("error: "+ error)
})


//initialization
watchDota.initialize().then(function(){

	//get upcoming games
	watchDota.getUpcomingGames(1563353353).then(function(upcomingGames){
		console.log(util.inspect(upcomingGames,false,null))
	}).catch(function(error){
		console.log("error: "+ error)
	})

	//get live pub games
	watchDota.getLivePubGames(0).then(function(livePubGames){
		console.log(util.inspect(livePubGames,false,null))


		var allPromise = []
		//get scoreboard
		for (var i = 0; i < livePubGames.length; i++) {
			allPromise.push(watchDota.getScoreboard(livePubGames[i]['serverSteamId']))
		}
		Promise.all(allPromise).then(function(result){
			console.log(util.inspect(result,false,null))
		}).catch(function(error){
			console.log("error: "+ error)
		})


	}).catch(function(error){
		console.log("error: "+ error)
	})

	//get live league games
	watchDota.getLiveLeagueGames(0).then(function(liveLeagueGames){
		console.log(util.inspect(liveLeagueGames,false,null))
	}).catch(function(error){
		console.log("error: "+ error)
	})



}).catch(function(error){
	console.log("error: "+ error)
})


