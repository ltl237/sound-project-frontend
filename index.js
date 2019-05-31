console.log("hello world")
const playlistUrl = "http://localhost:3000/api/v1/playlists"
const albumUrl = "http://localhost:3000/api/v1/albums"
const classificationsUrl = "http://localhost:3000/api/v1/classifications"
const outerDiv = document.querySelector("#outer-div")
outerDiv.className = "ui link stackable cards centered"
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

	const createPlaylistDiv = document.createElement("div")
	createPlaylistDiv.innerHTML = `
	  <p class="image">
	    <img src="https://lastfm-img2.akamaized.net/i/u/174s/3017b2f31110e4f6de45a212fe93b4a3.png">
	  </p>
	  <div class="content">
	    <p class="header">Create A Playlist!</p>
	  </div>
	`
	createPlaylistDiv.classList = "ui card"
	createPlaylistDiv.onclick = function() {
    createPlaylistModal()
  }

	outerDiv.appendChild(createPlaylistDiv)
}

function addPlaylistCardToDom(classificationObject){

	if (!document.querySelector(`#playlist-id-${classificationObject.playlist.id}`)) {

		const playlistDiv = document.createElement("div")
		// debugger
		console.log(classificationObject.album.album_image)
		playlistDiv.innerHTML = `
		  <p class="image">
			<img src="${classificationObject.album.album_image}">
		  </p>
		  <div class="content">
		    <p class="header" href="">${classificationObject.playlist.title}</p>
		  </div>`

		playlistDiv.id = `playlist-id-${classificationObject.playlist.id}`
		playlistDiv.classList = "ui card"
		outerDiv.appendChild(playlistDiv)

		playlistDiv.onclick = function() {
      handlePlaylistCardClick(classificationObject)
      outerModal.style.display = "block"
    }
  }
}


function handlePlaylistCardClick(classificationObject) {
  fetch(classificationsUrl)
	.then(res => res.json())
	.then(classificationsData => {
    const playlistId = classificationObject.playlist.id
    const albumsAndClassifications = []
    const playlistDict = {}
		classificationsData.forEach(function(c){
      if (c.playlist.id === playlistId) {
        albumsAndClassifications.push({album: c.album, classification: c})
      }
    })
		albumsAndClassifications.sort((a, b) => (a.classification.votes > b.classification.votes) ? -1 : 1)
    addAlbumListToModal(classificationObject, albumsAndClassifications)
  })
}

function sortAlbumDivs(classificationObject){
	console.log("Sorting")
	fetch(classificationsUrl)
	.then(res => res.json())
	.then(allClassificationData => {
		const playlistId = classificationObject.playlist.id
		const albumsAndClassifications = []
    const playlistDict = {}
  		allClassificationData.forEach(function(c){
        if (c.playlist.id === playlistId) {
          albumsAndClassifications.push({album: c.album, classification: c})
        }
      })
		outerModal.innerHTML = ""
		albumsAndClassifications.sort((a, b) => (a.classification.votes > b.classification.votes) ? -1 : 1)
    addAlbumListToModal(classificationObject, albumsAndClassifications)
	})
}

function addAlbumListToModal(classificationObject, albumsAndClassifications){

	const playlistHeader = document.createElement("div")
	const playlistWrapper = document.createElement("div")

	playlistWrapper.className = "ui cards centered modal-wrapper"

	playlistHeader.innerHTML = `
	<div id ="onmodal-playlist-${classificationObject.playlist.id}">
		<h2>${classificationObject.playlist.title}</h2>
	</div>`

	albumsAndClassifications.forEach(function(obj) {
		const {album, classification} = obj
		const indvAlbumDiv = document.createElement("div")
		indvAlbumDiv.classList = "ui card"
    indvAlbumDiv.id = (`album-id-${album.id}`)

		indvAlbumDiv.innerHTML = `
		<div>
		<h4 class="header">${album.title}</h4>
		<img class="ui small left floated image" src="${album.album_image}">
		<div>`

		const voteDiv = document.createElement("div")
		voteDiv.className= "voting-div"
		voteDiv.innerHTML = `
		<span>
			<p> VOTES:</p>
			<p id="votes-${classification.id}">${classification.votes}</p>
			<span class="upvote vote-button ui teal basic circular button" data-album-id="${album.id}" id="upvote-${classification.id}">👍</span>
			<span class="downvote vote-button ui violet basic circular button" data-album-id="${album.id}" id="downvote-${classification.id}">👎</span>
			</span>`

		indvAlbumDiv.appendChild(voteDiv)

		playlistWrapper.appendChild(indvAlbumDiv)
		outerModal.appendChild(playlistHeader)
		outerModal.appendChild(playlistWrapper)

		const upVote = indvAlbumDiv.querySelector(".upvote")
		upVote.onclick = () => upOrDownVote(classification, 1)

		const downVote = indvAlbumDiv.querySelector(".downvote")
		downVote.onclick = () => upOrDownVote(classification, -1)

    let allPTags = document.querySelectorAll("p[id^='votes-']")
    let votesAndTheirDiv = {}
    let orderedVotesAndDiv = {}
    if (!document.querySelector(`#album-id-${album.id}`)){
      playlistWrapper.appendChild(indvAlbumDiv)
    }
    allPTags.forEach((pTag) => {
    	votesAndTheirDiv[parseInt(pTag.innerText)] = pTag.parentElement.parentElement
    })
    Object.keys(votesAndTheirDiv).sort().forEach(key => {
	  orderedVotesAndDiv[parseInt(key)] = votesAndTheirDiv[parseInt(key)];
		})
  })
}

function upOrDownVote(classificationObject, votesToAdd){

	let votesP = document.querySelector(`#votes-${classificationObject.id}`)
	classificationObject.votes = parseInt(votesP.innerText) + votesToAdd

	fetch(classificationsUrl + `/${classificationObject.id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify({
			id: classificationObject.id,
			votes: classificationObject.votes
		})
	}).then(() => {
		votesP.innerText = classificationObject.votes

		sortAlbumDivs(classificationObject)
	})
}

function createPlaylistModal(){
  outerModal.style.display = "block";

	const albumWrapper = document.createElement("div")
	albumWrapper.className = "modal-wrapper"
	outerModal.appendChild(albumWrapper)

	const formDiv = document.createElement("div")
	formDiv.innerHTML = `
		<div class="ui big input">
			<input type="text" class="title-input" placeholder="PLAYLIST NAME">
		</div>
		<div class="ui big input">
			<input class="artist-to-search-input" placeholder="ARTIST NAME">
		</div>
		<div>
			<select id="select" class="ui dropdown"></select>
		</div>
		<div class="albums-div"> </div>
		<button id="search-button">SEARCH</button>
		<button id="save-button">SAVE</button>`

		albumWrapper.appendChild(formDiv)
		const artistSearchButton = formDiv.querySelector("#search-button")

	artistSearchButton.addEventListener("click", () => {
		const select = document.querySelector("#select")
		while (select.firstChild) {
			select.removeChild(select.firstChild)
		}
		searchAlbumsForThisArtist()
	})

	const saveButton = formDiv.querySelector("#save-button")
	saveButton.addEventListener("click", () => {
    createPlaylistInDb();
    outerModal.style.display = "none"

	})
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

		if (selOption !== firstOption) {
			const newAlbum = document.createElement("div")
			const newH4 = document.createElement("h4")
			newAlbum.appendChild(newH4)
			newH4.innerText = selOption.value
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

	let album_image = selOpt.dataset.albumImg
	let artist = selOpt.dataset.artistName
	let title = selOpt.value
	if (selOpt.dataset.albumImg === "") {
  		album_image = "https://lastfm-img2.akamaized.net/i/u/174s/2ce29f74a6f54b8791e5fdacc2ba36f5.png"
	}
	fetch(albumUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			artist: artist,
			title: title,
      		album_image: album_image
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

	outerModal.innerHTML = ""

	albumIds.forEach(function(albumId) {
		fetch(classificationsUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				playlist_id: playlistId,
				album_id: albumId,
				votes: 0
			})
		})
		.then(resp => resp.json())
		.then(function(classificationObject) {
		  if (!document.querySelector(`#playlist-id-${classificationObject.playlist.id}`)) {
				// console.log("before addPlaylistCardToDom", classificationObject.album.album_image)
        addPlaylistCardToDom(classificationObject)
      }
		})
	 })
}
