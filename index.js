console.log("hello world")
const playlistUrl = "http://localhost:3000/api/v1/playlists"
const albumUrl = "http://localhost:3000/api/v1/albums"
const classificationsUrl = "http://localhost:3000/api/v1/classifications"
const outerDiv = document.querySelector("#outer-div")
const outerModal = document.querySelector("#outer-modal")
const createPlaylistDiv = document.querySelector("#playlist-create")


makeCreateDiv()
fetchAllClassifications()

// closes modal on off click, resets modal html
window.onclick = function(event) {
	  if (event.target == outerModal) {
	    outerModal.style.display = "none";
      outerModal.innerHTML = ""
	  }
}

function fetchAllClassifications(){
  fetch(classificationsUrl)
  .then(resp => resp.json())
  .then(classes => {

    classes.forEach(function(classi){
      addPlaylistCardToDom(classi)
    })

  })
}

// "create new playlist" card
function makeCreateDiv(){
	const playlistDiv = document.createElement("div")
	outerDiv.appendChild(playlistDiv)
	const playlistDivContent = document.createElement("h3")
	playlistDivContent.innerText = "Create a playlist!"
	playlistDiv.appendChild(playlistDivContent)
	playlistDiv.id = "playlist-create"

  playlistDiv.onclick = function() {
    createPlaylistModal()
  }
}

function addPlaylistCardToDom(classificationObject){

  if (!document.querySelector(`#playlist-id-${classificationObject.playlist.id}`)) {
    const playlistDiv = document.createElement("div")
  	outerDiv.appendChild(playlistDiv)
  	const playlistDivContent = document.createElement("h3")
    playlistDivContent.innerText = (classificationObject.playlist.title)
    playlistDiv.appendChild(playlistDivContent)
    playlistDiv.id = (`playlist-id-${classificationObject.playlist.id}`)

    playlistDiv.onclick = function() {
      outerModal.innerHTML = ""
      handlePlaylistCardClick(classificationObject)
      outerModal.style.display = "block"
    }
  }
}


function handlePlaylistCardClick(classificationObject) {
    fetch(classificationsUrl)
  	.then(res => res.json())
  	.then(playlistData => {
      const playlistId = classificationObject.playlist.id
      const playlistAlbums = []
  		playlistData.forEach(function(c){
        if (c.playlist.id === playlistId) {
          playlistAlbums.push(c.album)

        }
      })
      addAlbumListToModal(classificationObject, playlistAlbums)
    })
}

function addAlbumListToModal(classificationObject, playlistAlbums){

  console.log(arguments)
  const playlistWrapper = document.createElement("div")
  const playlistTitle = document.createElement("h3")
  playlistTitle.innerText = (classificationObject.playlist.title)
  playlistWrapper.appendChild(playlistTitle)

  playlistAlbums.forEach(function(album){
    const indvAlbumDiv = document.createElement("div")
    const indvAlbumH4 = document.createElement("h4")
    indvAlbumDiv.id = (`album-id-${album.id}`)
    indvAlbumH4.innerText = album.title

    const upVote = document.createElement("button")
		upVote.className = "vote-button"
		upVote.dataset.albumId = album.id
		upVote.innerText = "👍"
		// upVote.onclick = () => increaseVote(album.id)

		const downVote = document.createElement("button")
		downVote.className = "vote-button"
		downVote.id = "down-vote"
		downVote.innerText = "👎"

    outerModal.appendChild(playlistWrapper)

    indvAlbumDiv.appendChild(upVote)
    indvAlbumDiv.appendChild(downVote)
    indvAlbumDiv.appendChild(indvAlbumH4)

    if (!document.querySelector(`#album-id-${album.id}`)){
      playlistWrapper.appendChild(indvAlbumDiv)
    }

  })

}



function createPlaylistModal(){
  outerModal.style.display = "block";


	const albumWrapper = document.createElement("div")
	albumWrapper.className = "modal-wrapper"

	outerModal.appendChild(albumWrapper)

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
    console.log("YOU CLICKED SAVE")
    createPlaylistInDb();
    outerModal.style.display = "none"
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
	.then(albumData => putAlbumsInDropDown(albumData["topalbums"]))
}

///// ADD SEARCH RESULTS TO DROPDOWN SELECT
function putAlbumsInDropDown(albumData) {

	const albumsDiv = document.querySelector(".albums-div")
	const select = document.querySelector("#select") // select dropdown for albums
	const placeholderOption = document.createElement("option") // placeholder first option on dropdown
	placeholderOption.innerText = "Choose an album"

	// create dropdown options
	select.appendChild(placeholderOption)
	albumData.album.forEach(album => {
		const newOption = document.createElement("option")
		newOption.dataset.artistName = album.artist.name
    newOption.dataset.albumImg = album.image[2]["#text"]

		newOption.value = album.name
		newOption.innerText = album.name
		select.appendChild(newOption)
	})

	select.addEventListener("change", () => {

		const selOption = select.options[select.selectedIndex]
		let firstOption = select.options[0]
		// debugger
		// disables placeholder first option
		if (selOption !== firstOption) {
			const newAlbum = document.createElement("div")
			const newH4 = document.createElement("h4")
			newAlbum.appendChild(newH4)
			newH4.innerText = selOption.value
			// debugger
			// on selection, create album in database
			// createAlbumInDb(selOption, newH4)
			let artist = selOption.dataset.artistName
			let title = selOption.value
		  	let albumImg = selOption.dataset.albumImg
		  // debugger
		  console.log(albumImg)
			fetch("http://localhost:3000/api/v1/albums", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					albumImg: albumImg,
					artist: artist,
					title: title

				})
			})
			.then(resp => resp.json())
			.then(data => {
				// debugger
				newAlbum.dataset.albumId = (`${data.id}`)
			})

			//
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
//// not working to put image url in database fuck that
function createAlbumInDb(selOpt, h4Div){
	let artist = selOpt.dataset.artistName
	let title = selOpt.value
  	let albumImg = selOpt.dataset.albumImg
  // debugger
	fetch("http://localhost:3000/api/v1/albums", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			albumImg: albumImg,
			artist: albumImg,
			title: title

		})
	})
	.then(resp => resp.json())
	.then(data => {
		// debugger
		h4Div.dataset.albumId = (`${data.id}`)
	})
	// debugger

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
	.then(function(playlistObject) {
	 	createClassificationsInDb(playlistObject)
	})
}

///// CREATE CLASSIFICATIONS IN DATABASE
function createClassificationsInDb(playListObject){
	const albumsList = document.querySelector('.albums-div')
	const title = playListObject.title
	const playlistId = playListObject.id
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
		.then(resp => resp.json())
		.then(function(classificationObject) {
		  if (!document.querySelector(`#playlist-id-${classificationObject.playlist.id}`)) {
        addPlaylistCardToDom(classificationObject)
      }
		})
	 })

}
