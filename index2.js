console.log("hello world")
const playlistUrl = "http://localhost:3000/api/v1/playlists"
const albumUrl = "http://localhost:3000/api/v1/albums"
const classificationsUrl = "http://localhost:3000/api/v1/classifications"
const outerDiv = document.querySelector("#outerDiv")

// document.addEventListener("DOMContentLoaded", getPlaylists)

// function getPlaylists(){

// 	fetch(playlistUrl)
// 	.then(res => res.json())
// 	.then(playlistData => handleAllPlaylists(playlistData))


// }

// function handleAllPlaylists(playlistData) {
// 	playlistData.forEach(playlist => renderSinglePlaylist(playlist))

// }

// function renderSinglePlaylist(playlist){
// 	// debugger
// 	const playlistDiv = document.createElement("div")
// 	const playlistP = document.createElement("p")
// 	playlistP.innerText = playlist.title
// 	playlistDiv.appendChild(playlistP)
// 	outerDiv.appendChild(playlistDiv)


// }

fetch(classificationsUrl)
.then(res => res.json())
.then(classData => getPandA(classData))

function getPandA(classifications) {
	classifications.forEach((classification) => {
		// console.log(playlistUrl + `/${classification.playlist.id}`)
		
		// debugger
		fetch(playlistUrl + `/${classification.playlist.id}`)
		.then(res => res.json())
		.then(function(playlistData){
			slapPlaylistOnDOM(playlistData)
		})
		// .then((playlistData) => slapPlaylistOnDOM(playlistData))
		// const playlistDiv = document.querySelector(`#playlist-${classification.playlist.id}`)
		// console.log(`#playlist-${classification.playlist.id}`)

		// debugger
		// const playlistDiv = document.createElement("div")
		// playlistDiv.dataset.playlistId = playlist.id
		// playlistDiv.id = `playlist-${playlist.id}`
	})
	
	const playArray = document.querySelectorAll("div[id^='playlist-']")
	console.log("this",playArray)

	classifications.forEach((classification) => {
		fetch(albumUrl + `/${classification.album.id}`)
		.then(res => res.json())
		.then(albumData => slapAlbumOnDOM(albumData))
	})
}


function slapPlaylistOnDOM(playlist){
	let playlistDivCheck = document.querySelector(`#playlist-${playlist.id}`)
	console.log(playlistDivCheck)

	if (playlistDivCheck) {
		// console.log(playlistDivCheck)
	} else {
		const playlistDiv = document.createElement("div")
		playlistDiv.dataset.playlistId = playlist.id
		playlistDiv.id = `playlist-${playlist.id}`
		// const playlistDiv = document.querySelector(`playlist-${playlist.id}`)
		
		const playlistH2 = document.createElement("h2")
		playlistH2.innerText = playlist.title
		playlistDiv.appendChild(playlistH2)
		outerDiv.appendChild(playlistDiv)
	}
	// debugger

}

function slapAlbumOnDOM(album){
	const playlistDiv = document.querySelector("#outerDiv div h2").parentElement
	const albumDiv = document.createElement("div")
	const albumP = document.createElement("p")
	albumP.innerText = album.title + " -" + album.artist
	albumDiv.appendChild(albumP)
	playlistDiv.appendChild(albumDiv)


}





