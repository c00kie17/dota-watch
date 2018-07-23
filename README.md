# dota-watch

![npm](https://img.shields.io/npm/v/dota-watch.svg) ![license](https://img.shields.io/npm/l/dota-watch.svg) ![github-issues](https://img.shields.io/github/issues/c00kie17/dota-watch.svg)  ![Circle CI build status](https://circleci.com/gh/c00kie17/dota-watch.svg?style=svg)
![stars](https://img.shields.io/github/stars/c00kie17/dota-watch.svg)


![nodei.co](https://nodei.co/npm/dota-watch.png?downloads=true&downloadRank=true&stars=true)




Fetch live and upcoming dota games with stream links


## Install

`npm install --save dota-watch`

## Examples
The `examples` directory contains an example file on how to interact with the module.

# API
all api calls except the constructor are promises. 

- [new dotaWatch](#new_dotaWatch)
- [.initialize()](#initialize_func)
- [_Non-Initialized functions_](#non_initialized)
  - [.getProPlayers()](#proPlayers)
  - [.getHeros()](#heros)
  - [.getEconItem()](#econ)
  - [.getLeagues()](#getLeagues)
 - [_Initialized functions_](#initialized) 
    - [.getUpcomingGames()](#upcoming)
    - [.getLivePubGames()](#live_pub)
    - [.getLiveLeagueGames()](#live_league)
    - [.getScoreboard()](#scoreboard)


<a name="new_dotaWatch"></a>
#### new dotaWatch(steamKey,twitchKey)
The dotaWatch client object is created

| Param | Type | Description |
| --- | --- | --- |
| steamKey | <code>string</code> | Your steam api key ,you can find more info about it <a href= "https://steamcommunity.com/login/home/?goto=%2Fdev%2Fapikey">here</a> |
| twitchKey | <code>string</code> | Your twitch api key ,you can find more info about it <a href= "https://dev.twitch.tv">here</a>  |

```javascript
var dotaWatch = new dotawatch("steamkey","twitchkey")
```

<a name="initialize_func"></a>
#### .initialize()
used to initialized the dotaWatch client, all function and divided into two parts as [Initialized](#initialized) and [Non-Initialized](#non_initialized) functions

```javascript
dotaWatch.initialize().then((res) => {
  ...
})
```

<a name="non_initialized"></a>
## Non-Initialized functions
these function can be used without initilization of the dotaWatch client

<a name="proPlayers"></a>
#### .getProPlayers()
get a list of all the pro players

```javascript
dotaWatch.getProPlayers().then((res) => {
  ...
})
```

<a name="heros"></a>
#### .getHeros()
gets a list of all the dota2 heros

```javascript
dotaWatch.getHeros().then((res) => {
  ...
})
```

<a name="econ"></a>
#### .getEconItem()
gets the econ item file containing all items available in the dota2 client. This API calls takes some time to complete as the data is huge. consider saving the data locally instead of calling this again.

```javascript
dotaWatch.getEconItem().then((res) => {
  ...
})
```

<a name="leagues"></a>
#### .getLeagues()
gets a list of all the Pro Leagues in dota2

```javascript
dotaWatch.getLeagues().then((res) => {
  ...
})
```

<a name="initialized"></a>
## Initialized functions
these function can be only used after initilization of the dotaWatch client has returned successfully 

<a name="upcoming"></a>
#### .getUpcomingGames(maxDate)
gets upcoming Pro Dota2 games

| Param | Type | Description |
| --- | --- | --- |
| maxDate | <code>int</code> | epoch timestamp in seconds, the max date till you want upcoming games |

```javascript
dotaWatch.getUpcomingGames(1563353353).then((res) => {
  ...
})
```


<a name="live_pub"></a>
#### .getLivePubGames(minSpectators)
get live Pub games

| Param | Type | Description |
| --- | --- | --- |
| minSpectators | <code>int</code> | minimum number of spectators a game should have to make it in the list |


```javascript
dotaWatch.getLivePubGames(0).then((res) => {
  ...
})
```

<a name="live_league"></a>
#### .getLiveLeagueGames(minSpectators)
get live League games

| Param | Type | Description |
| --- | --- | --- |
| minSpectators | <code>int</code> | minimum number of spectators a game should have to make it in the list |

```javascript
dotaWatch.getLiveLeagueGames(0).then((res) => {
  ...
})
```

<a name="scoreboard"></a>
#### .getScoreboard(serverSteamId)
gets the scoreboard of a specified game

| Param | Type | Description |
| --- | --- | --- |
| serverSteamId | <code>string</code> | the server steam id of the game you want the scoreboard |

```javascript
dotaWatch.getScoreboard("serverSteamId value").then((res) => {
  ...
})
```




## Contributing

Contributions welcome; Please submit all pull requests the against master branch. If your pull request contains JavaScript patches or features, you should include relevant unit tests. Please check the [Contributing Guidelines](contributng.md) for more details. Thanks!

## Author

c00kie17

## License

 - **MIT** : http://opensource.org/licenses/MIT
