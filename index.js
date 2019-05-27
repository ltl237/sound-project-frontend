console.log("hello world")
const playlistUrl = "http://localhost:3000/api/v1/playlists"
const albumUrl = "http://localhost:3000/api/v1/albums"
const classificationsUrl = "http://localhost:3000/api/v1/classifications"
const outerDiv = document.querySelector("#outerDiv")


fetch(playlistUrl)
.then(res => res.json())
.then(playlistData => handleAllPlaylistData(playlistData))

function handleAllPlaylistData(playlistData){
	const keys = Object.keys(playlistData)
	console.log(playlistData)

	for (let i = keys.length - 1; i >= 0; i--) {
		console.log(playlistData[keys[i]])

		// debugger 
		const playlistDiv = document.createElement("div")
		const playlistH3 = document.createElement("h3")
		playlistH3.innerText = playlistData[keys[i]].playlistTitle
		playlistDiv.id = `playlist-${playlistData[keys[i]].playlistID}`

		playlistDiv.appendChild(playlistH3)
		outerDiv.appendChild(playlistDiv)

		addAlbumsToPlaylist({albums: playlistData[keys[i]].albums, playlistID: playlistData[keys[i]].playlistID})
		debugger
	}


	// debugger
}

function addAlbumsToPlaylist(albumsAndPlaylists) {
	const playlistDiv = document.querySelector(`#playlist-${albumsAndPlaylists['playlistID']}`)

	console.log(albumsAndPlaylists)
	// debugger
	const outerAlbumModal = document.createElement("div")
	outerAlbumModal.className = "modal"
	const xbutton = document.createElement("span")
	xbutton.innerText = "x"
	xbutton.className = "close"

	xbutton.onclick = function() {
		outerAlbumModal.style.display = "none"
	}
	outerAlbumModal.appendChild(xbutton)
	
	albumsAndPlaylists.albums[0].forEach((album) => {
		const albumDiv = document.createElement("div")
		const albumP = document.createElement("p")
		albumP.innerText = album.title + " by " + album.artist
		albumDiv.appendChild(albumP)
		outerAlbumModal.appendChild(albumDiv)
		// playlistDiv.appendChild(albumDiv)
		playlistDiv.onclick = function() {
		  outerAlbumModal.style.display = "block";
		}

		outerDiv.appendChild(outerAlbumModal)
		window.onclick = function(event) {
		  if (event.target == outerAlbumModal) {
		    outerAlbumModal.style.display = "none";
		  }
		}
	})

}









