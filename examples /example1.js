dotaWatch = require("../")
const util = require("util")
const moment = require("moment");

watchDota = new dotaWatch("9EE0308EB3D7573B7C161FAD3E303A94","g2gva07838zwvg3qg7wac463t7fxru")

runtest()

function runtest(){
console.log("running test at: "+moment().format("dd MMMM Do HH:mm:ss"))

//get Pro Players
watchDota.getProPlayers().then(function(players){
	//console.log(util.inspect(players,false,null))
}).catch(function(error){
	console.log("error: "+ error)
})

//get Heros
watchDota.getHeros().then(function(heros){
	//console.log(util.inspect(heros,false,null))
}).catch(function(error){
	console.log("error: "+ error)
})

//get EconItems
watchDota.getEconItem().then(function(econItem){
	//console.log(util.inspect(econItem,false,null))
}).catch(function(error){
	console.log("error: "+ error)
})

//get Leagues
watchDota.getLeagues().then(function(leagues){
	//console.log(util.inspect(leagues,false,null))
}).catch(function(error){
	console.log("error: "+ error)
})


//initialization
watchDota.initialize().then(function(){

	//get upcoming games
	watchDota.getUpcomingGames(1563353353).then(function(upcomingGames){
		//console.log(util.inspect(upcomingGames,false,null))
	}).catch(function(error){
		console.log("error: "+ error)
	})

	//get live pub games
	watchDota.getLivePubGames(0).then(function(livePubGames){
		//console.log(util.inspect(livePubGames,false,null))


		var allPromise = []
		//get scoreboard
		for (var i = 0; i < livePubGames.length; i++) {
			allPromise.push(watchDota.getScoreboard(livePubGames[i]['serverSteamId']))
		}
		Promise.all(allPromise).then(function(result){
			//console.log(util.inspect(result,false,null))
		}).catch(function(error){
			console.log("error: "+ error)
		})


	}).catch(function(error){
		console.log("error: "+ error)
	})

	//get live league games
	watchDota.getLiveLeagueGames(0).then(function(liveLeagueGames){
		//console.log(util.inspect(liveLeagueGames,false,null))
	}).catch(function(error){
		console.log("error: "+ error)
	})



}).catch(function(error){
	console.log("error: "+ error)
})

setTimeout(function(){
	runtest()
},1* 60 * 1000);
}

