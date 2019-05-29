console.log("hello world")
const playlistUrl = "http://localhost:3000/api/v1/playlists"
const albumUrl = "http://localhost:3000/api/v1/albums"
const classificationsUrl = "http://localhost:3000/api/v1/classifications"
const outerDiv = document.querySelector("#outer-div")

///// FETCH ALL PLAYLISTS
fetch(playlistUrl)
.then(res => res.json())
.then(playlistData => createPlaylistCard(playlistData))


///// CREATE PLAYLIST CARD
function createPlaylistCard(playlistData){

	makeCreateDiv()

	const keys = Object.keys(playlistData)

	for (let i = 0; i < keys.length; i++) {

		const playlistDiv = document.createElement("div") // div for whole playlist
		playlistDiv.id = `playlist-${playlistData[keys[i]].playlistID}`

		const playlistH3 = document.createElement("h3") // title of playlist
		playlistH3.innerText = playlistData[keys[i]].playlistTitle

		const playlistModal = document.createElement("div") // modal for indv playlist
		playlistModal.className = ("modal")

		// const xbutton = document.createElement("span") // exit button for playlist modal
		// xbutton.innerText = "x"
		// xbutton.className = "close"
		//
		// xbutton.onclick = function() {
		// 	playlistModal.style.display = "none"
		// }

		// click away close modal
		window.onclick = function(event) {
		  if (event.target === playlistModal) {
		    playlistModal.style.display = "none";
		  }
		}

		// playlist on click expand modal
		playlistDiv.onclick = function() {
		  playlistModal.style.display = "block";
		}

		const albumsWrapper = document.createElement("div") // list of all albums on playlist
		albumsWrapper.className = ("albums-wrapper")

		playlistDiv.appendChild(playlistH3)
		playlistDiv.appendChild(playlistModal)
			playlistModal.appendChild(albumsWrapper)
			// playlistModal.appendChild(xbutton)
		outerDiv.appendChild(playlistDiv) // add whole playlist div to outer div

		addAlbumsToPlaylist({albums: playlistData[keys[i]].albums, playlistID: playlistData[keys[i]].playlistID})
	}
}

///// ADD ALBUMS TO PLAYLIST CARD
function addAlbumsToPlaylist(playlistObj) {

	const playlistDiv = document.querySelector(`#playlist-${playlistObj['playlistID']}`)
	const playlistModal = playlistDiv.querySelector('.modal')
	const wrapper = playlistDiv.querySelector('.albums-wrapper')

	playlistObj.albums.forEach((album) => {
		const singleAlbumDiv = document.createElement("div")
		const albumP = document.createElement("p")

		albumP.innerText = album.title + " by " + album.artist

		singleAlbumDiv.appendChild(albumP)
		singleAlbumDiv.dataset.albumId = album.id

		wrapper.appendChild(singleAlbumDiv)

		playlistDiv.onclick = function() {
		  playlistModal.style.display = "block";
		}
	})
}

///// CARD TO CREATE NEW PLAYLIST
function makeCreateDiv(){
	const playlistDiv = document.createElement("div")
	outerDiv.appendChild(playlistDiv)
	const playlistDivContent = document.createElement("h3")
	playlistDivContent.innerText = "Create a playlist!"
	playlistDiv.appendChild(playlistDivContent)
	playlistDiv.id = "playlist-create"

	const outerListModal = document.createElement("div")
	outerListModal.className = "modal"
	outerListModal.id = "create-modal"
	const albumWrapper = document.createElement("div")
	albumWrapper.className = "modal-wrapper"

	outerDiv.appendChild(outerListModal)
	const xbutton = document.createElement("span")
	xbutton.innerText = "x"
	xbutton.className = "close"

	xbutton.onclick = function() {
		outerListModal.style.display = "none"
	}
	outerListModal.appendChild(albumWrapper)
	outerListModal.appendChild(xbutton)
	playlistDiv.onclick = function() {
	  outerListModal.style.display = "block";
	}
	window.onclick = function(event) {
	  if (event.target == outerListModal) {
	    outerListModal.style.display = "none";
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

	artistSearchButton.addEventListener("click", () => {
		const select = document.querySelector("#select")
		while (select.firstChild) {
			select.removeChild(select.firstChild)
		}
		searchAlbumsForThisArtist()
	})
	const select = document.createElement("select")
	select.id = "select"
	const albumsDiv = document.createElement("div")
	albumsDiv.className = "albums-div"
	const saveButton = document.createElement("button")
	saveButton.innerText = "SAVE"
	saveButton.id = ('save-button')


	saveButton.addEventListener("click", () => {
		createPlaylistInDb();
		// put card on dom
	})

	albumWrapper.appendChild(createForm)
	albumWrapper.appendChild(titleInput)
	albumWrapper.appendChild(artistToSearchInput)
	albumWrapper.appendChild(select)
	albumWrapper.appendChild(albumsDiv)
	albumWrapper.appendChild(artistSearchButton)
	albumWrapper.appendChild(saveButton)
}

///// SEARCH BY ARTIST FEATURE
function searchAlbumsForThisArtist(event) {

	let artistStringInput = document.querySelector(".artist-to-search-input").value
	let mutatedArtistString = artistStringInput.replace(/\s+/g, '');

	fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${mutatedArtistString}&api_key=56db8dc89ddf7721c47c718da7786420&format=json&limit=15"`)
	.then(res => res.json())
	.then(albumData => putAlbumsInDropDown(albumData["topalbums"].album))

}

///// ADD SEARCH RESULTS TO DROPDOWN SELECT
function putAlbumsInDropDown(albumData) {

	const albumsDiv = document.querySelector(".albums-div")
	const select = document.querySelector("#select") // select dropdown for albums
	const placeholderOption = document.createElement("option") // placeholder first option on dropdown
	placeholderOption.innerText = "Choose an album"

	// create dropdown options
	select.appendChild(placeholderOption)
	albumData.forEach(album => {
		const newOption = document.createElement("option")
		newOption.dataset.artistName = album.artist.name
		newOption.value = album.name
		newOption.innerText = album.name
		select.appendChild(newOption)
	})

	select.addEventListener("change", () => {

		const selOption = select.options[select.selectedIndex]
		let firstOption = select.options[0]
		// disables placeholder first option
		if (selOption !== firstOption) {
			const newAlbum = document.createElement("div")
			const newH4 = document.createElement("h4")
			newAlbum.appendChild(newH4)
			newH4.innerText = selOption.value

			// on selection, create album in database
			createAlbumInDb(selOption, newH4)

			albumsDiv.appendChild(newAlbum)
			for(let i = 0; i < event.target.length; i++){
				if (event.target[i].value == selOption.value){
					event.target[i].remove()
				}
			}
		}
	})
}

///// CREATE ALBUM IN DATABASE
function createAlbumInDb(selOpt, h4Div){
	let artist = selOpt.dataset.artistName
	let title = selOpt.value

	fetch("http://localhost:3000/api/v1/albums", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			artist: artist,
			title: title
		})
	})
	.then(resp => resp.json())
	.then(data => h4Div.dataset.albumId = (`${data.id}`))
}

///// CREATE PLAYLIST IN DATABASE
function createPlaylistInDb(){
	const playlistName = document.querySelector('.title-input')

	fetch(playlistUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			title: playlistName.value
		})
	})
	.then(resp => resp.json())
	.then(function(data) {
	 	createClassificationsInDb(data)
	})
}

///// CREATE CLASSIFICATIONS IN DATABASE
function createClassificationsInDb(data){
	const albumsList = document.querySelector('.albums-div')
	const title = data.title
	const playlistId = data.id
	const albumIds = []

	for (let item of albumsList.children) {
		albumIds.push(item.firstChild.dataset.albumId)
	}

	albumIds.forEach(function(albumId) {
		fetch(classificationsUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				playlist_id: playlistId,
				album_id: albumId
			})
		})
	 })
}
