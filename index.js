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

		const playlistDiv = document.createElement("div")
		const playlistH3 = document.createElement("h3")
		playlistH3.innerText = playlistData[keys[i]].playlistTitle
		playlistDiv.id = `playlist-${playlistData[keys[i]].playlistID}`

		playlistDiv.appendChild(playlistH3)
		outerDiv.appendChild(playlistDiv)

		addAlbumsToPlaylist({albums: playlistData[keys[i]].albums, playlistID: playlistData[keys[i]].playlistID})
	}
}

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
		// createClassifcation();
		// createPlaylistCard();
	})


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
	// let artistStringInputTag = document.querySelector(".artist-to-search-input")

	const albumsDiv = document.querySelector(".albums-div")
	const select = document.querySelector("#select") // select dropdown for albums
	const blankFirstOption = document.createElement("option") // placeholder first option on dropdown
	blankFirstOption.innerText = "Choose an album"

	// create dropdown options
	select.appendChild(blankFirstOption)
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


		// bug fix for select registering change event duplicates
		if (selOption !== firstOption) {
			// console.log(selOption.value)
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
	.then(data => h4Div.id = (`h4-${data.id}`))

}

function createPlaylistInDb(){
	const albumsList = document.querySelector('.albums-div')
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
		// createClassifications(data) (lorenzo to do tues night)
		createPlaylistCard(data) // (mallory to do tues night)
	})

	function

	// to access album ids for classification creation
	// for (let item of albumsList.children) {
	// console.log(item.firstChild.dataset.albumId)
	// }
}


function createPlaylistCard(playlistObj) {
	const playlistDiv = document.createElement("div")
	const playlistH3 = document.createElement("h3")
	const title = playlistObj.title

	playlistH3.innerText = title

	const outerListModal = document.querySelector('.albumDiv')

	playlistDiv.appendChild(playlistH3)
	outerListModal.appendChild(playlistDiv)

	outerDiv.appendChild(outerListModal)
	debugger

	// refactor??
	// let allAlbums = document.querySelectorAll("h4[id^='h4-']")
	// for (let album of allAlbums) {
	//
	// }

	// addAlbumsToPlaylist({albums: playlistData[keys[i]].albums, playlistID: playlistObj.id})

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
