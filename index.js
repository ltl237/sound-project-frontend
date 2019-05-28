console.log("hello world")
const playlistUrl = "http://localhost:3000/api/v1/playlists"
const albumUrl = "http://localhost:3000/api/v1/albums"
const classificationsUrl = "http://localhost:3000/api/v1/classifications"
const outerDiv = document.querySelector("#outerDiv")


fetch(playlistUrl)
.then(res => res.json())
.then(playlistData => handleAllPlaylistData(playlistData))

function handleAllPlaylistData(playlistData){
	makeCreateDiv()

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
		// debugger
	}


	// debugger
}

function makeCreateDiv(){
	const playlistDiv = document.createElement("div")
	outerDiv.appendChild(playlistDiv)
	const playlistDivContent = document.createElement("h3")
	playlistDivContent.innerText = "Create a playlist !"
	playlistDiv.appendChild(playlistDivContent)
	playlistDiv.id = "playlist-create"

	const outerAlbumModal = document.createElement("div")
	outerAlbumModal.className = "modal"
	outerAlbumModal.id = "create-modal"
	const albumWrapper = document.createElement("div")
	albumWrapper.className = "modal-wrapper"
	outerDiv.appendChild(outerAlbumModal)
	const xbutton = document.createElement("span")
	xbutton.innerText = "x"
	xbutton.className = "close"

	xbutton.onclick = function() {
		outerAlbumModal.style.display = "none"
	}
	outerAlbumModal.appendChild(albumWrapper)
	outerAlbumModal.appendChild(xbutton)
	playlistDiv.onclick = function() {
	  outerAlbumModal.style.display = "block";
	}
	window.onclick = function(event) {
	  if (event.target == outerAlbumModal) {
	    outerAlbumModal.style.display = "none";
	  }
	}
	const createForm = document.createElement("form")
	const titleInput = document.createElement("input")
	titleInput.className = "title-input"
	titleInput.placeholder = "Title of Playlist"
	const artistToSearchInput = document.createElement("input")
	artistToSearchInput.className = "artist-to-search-input"
	artistToSearchInput.placeholder = "Search Albums of This Artist"
	const artistSearchButton = document.createElement("button")
	artistSearchButton.innerText = "SEARCH"
	// artistSearchButton.dataset.
	artistSearchButton.addEventListener("click", () => {
		const select = document.querySelector("#select")
		while (select.firstChild) {
			select.removeChild(select.firstChild)
		}
		// debugger
		searchAlbumsForThisArtist()
	})
	const select = document.createElement("select")
	select.id = "select"
	const albumsDiv = document.createElement("div")
	albumsDiv.className = "albums-div"
	const saveButton = document.createElement("button")
	saveButton.innerText = "SAVE"
	albumWrapper.appendChild(createForm)
	albumWrapper.appendChild(titleInput)

	albumWrapper.appendChild(artistToSearchInput)
	albumWrapper.appendChild(select)
	albumWrapper.appendChild(albumsDiv)
	albumWrapper.appendChild(artistSearchButton)
	albumWrapper.appendChild(saveButton)
}

function searchAlbumsForThisArtist(event) {

	let artistStringInput = document.querySelector(".artist-to-search-input").value
	let mutatedArtistString = artistStringInput.replace(/\s+/g, '');

	fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${mutatedArtistString}&api_key=56db8dc89ddf7721c47c718da7786420&format=json&limit=15"`)
	.then(res => res.json())
	.then(albumData => putAlbumsInDropDown(albumData["topalbums"].album))

}

function putAlbumsInDropDown(albumData) {
	console.log(albumData)
	// let artistStringInputTag = document.querySelector(".artist-to-search-input")
	const albumsDiv = document.querySelector(".albums-div")
	const select = document.querySelector("#select")
	const blankFirstOption = document.createElement("option")
	blankFirstOption.innerText = "Choose an album"
	select.appendChild(blankFirstOption)
	albumData.forEach(album => {
		const newOption = document.createElement("option")
		newOption.value = album.name
		newOption.innerText = album.name
		select.appendChild(newOption)
	})

	select.addEventListener("change", () => {
		let selOption = select.options[select.selectedIndex]
		let firstOption = select.options[0]
		if (selOption !== firstOption) {
			console.log(selOption.value)
			const newAlbum = document.createElement("div")
			const newH4 = document.createElement("h4")
			newAlbum.appendChild(newH4)
			newH4.innerText = selOption.value
			albumsDiv.appendChild(newAlbum)
			for(let i = 0; i < event.target.length; i++){
				if (event.target[i].value == selOption.value){
					event.target[i].remove()
					//just make it so every time you select album you have to press ok button, put the event listener on that instead of select ?
				}
			}
		}
		// debugger
	})

}




function addAlbumsToPlaylist(albumsAndPlaylists) {
	const playlistDiv = document.querySelector(`#playlist-${albumsAndPlaylists['playlistID']}`)

	console.log(albumsAndPlaylists)
	// debugger
	const outerAlbumModal = document.createElement("div")
	outerAlbumModal.className = "modal"
	const albumWrapper = document.createElement("div")
	albumWrapper.className = "albumDiv"

	const xbutton = document.createElement("span")
	xbutton.innerText = "x"
	xbutton.className = "close"

	xbutton.onclick = function() {
		outerAlbumModal.style.display = "none"
	}
	outerAlbumModal.appendChild(albumWrapper)
	outerAlbumModal.appendChild(xbutton)

	albumsAndPlaylists.albums[0].forEach((album) => {
		const singleAlbumDiv = document.createElement("div")
		const albumP = document.createElement("p")
		albumP.innerText = album.title + " by " + album.artist
		singleAlbumDiv.appendChild(albumP)
		singleAlbumDiv.dataset.albumId = album.id
		albumWrapper.appendChild(singleAlbumDiv)
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
