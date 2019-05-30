console.log("hello world")
const playlistUrl = "http://localhost:3000/api/v1/playlists"
const albumUrl = "http://localhost:3000/api/v1/albums"
const classificationsUrl = "http://localhost:3000/api/v1/classifications"
const outerDiv = document.querySelector("#outer-div")
outerDiv.className = "ui link stackable cards"
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
	    <img src="https://lastfm-img2.akamaized.net/i/u/174s/80daaf62c7fbbf6ddaa143030b684e12.png">
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
		console.log(classificationObject.album.albumImg)
		playlistDiv.innerHTML = `
		  <p class="image">
			<img src="${classificationObject.album.albumImg}">
		  </p>
		  <div class="content">
		    <p class="header" href="">${classificationObject.playlist.title}</p>
		  </div>
		`

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
          // playlistDict[c.classification.id] = c.album

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
  		albumsAndClassifications.sort((a, b) => (a.classification.votes > b.classification.votes) ? -1 : 1)
      addAlbumListToModal(classificationObject, albumsAndClassifications)
	})
}

function addAlbumListToModal(classificationObject, albumsAndClassifications){

	// debugger
  const playlistWrapper = document.createElement("div")
  const playlistTitle = document.createElement("h4")

  playlistTitle.innerText = (classificationObject.playlist.title)
  playlistWrapper.id = `onmodal-playlist-${classificationObject.playlist.id}`
  playlistWrapper.appendChild(playlistTitle)
  // debugger
  albumsAndClassifications.forEach(function(obj){
  	const {album, classification} = obj
  	// debugger
    const indvAlbumDiv = document.createElement("div")
    const indvAlbump = document.createElement("p")
		// indvAlbumDiv.classList = "ui card horizontal"
    indvAlbumDiv.id = (`album-id-${album.id}`)
    indvAlbump.innerText = album.title

    const votingDiv = document.createElement("div")
    const votesP = document.createElement("p")
    votesP.innerText = classification.votes
    votesP.id = `votes-${classification.id}`
	votingDiv.className = "voting-div"
	votingDiv.appendChild(votesP)
	// debugger
	console.log("votesP", votesP)
    const upVote = document.createElement("button")
	upVote.className = "upvote vote-button"
	upVote.dataset.albumId = album.id
	upVote.innerText = "👍"
	upVote.id = `downvote-${classification.id}`
	console.log("VOTES BEFORE:", classification.votes)
	upVote.onclick = () => upOrDownVote(classification, 1)
	// if(event.target)
	const downVote = document.createElement("button")
	downVote.className = "downvote vote-button"
	downVote.id = `downvote-${classification.id}`
	downVote.onclick = () => upOrDownVote(classification, -1)
	downVote.innerText = "👎"
	// debugger
    outerModal.appendChild(playlistWrapper)
    indvAlbumDiv.appendChild(indvAlbump)
    votingDiv.appendChild(upVote)
    votingDiv.appendChild(downVote)
    indvAlbumDiv.appendChild(votingDiv)
    // debugger

    let allPTags = document.querySelectorAll("p[id^='votes-']")
    let votesAndTheirDiv = {}
    let orderedVotesAndDiv = {}
    if (!document.querySelector(`#album-id-${album.id}`)){
      playlistWrapper.appendChild(indvAlbumDiv)
    }
    allPTags.forEach((pTag) => {
    	votesAndTheirDiv[parseInt(pTag.innerText)] = pTag.parentElement.parentElement
    	// votesAndTheirDiv[pTag] = pTag.parentElement.parentElement
    })
    // let keysArray = Object.keys(votesAndTheirDiv).sort()
    // let newA = []
    // keysArray.map(key => {
    // 	newA.push(parseInt(key))
    // 	// debugger
    // })

    Object.keys(votesAndTheirDiv).sort().forEach(key => {
	  orderedVotesAndDiv[parseInt(key)] = votesAndTheirDiv[parseInt(key)];
	  // debugger
	})

    // debugger
  })

}

function upOrDownVote(classificationObject, votesToAdd){
	let votesP = event.target.parentElement.firstChild
	// let newVoteValue = parseInt(votesP.innerText) + votesToAdd
	classificationObject.votes = parseInt(votesP.innerText) + votesToAdd
	// debugger
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

		let thingToRemove = document.querySelector("div[id^='onmodal-playlist'")
		thingToRemove.remove()
		// debugger
		sortAlbumDivs(classificationObject)
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
    // console.log("YOU CLICKED SAVE")
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
		console.log(newOption.dataset.albumImg)
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
//// not working to put image url in database fuck that
function createAlbumInDb(selOpt, h4Div){

	let album_image = selOpt.dataset.albumImg
	let artist = selOpt.dataset.artistName
	let title = selOpt.value
	// debugger
	if (selOpt.dataset.albumImg === "") {
  	album_image = "https://lastfm-img2.akamaized.net/i/u/174s/2ce29f74a6f54b8791e5fdacc2ba36f5.png"
	}

	fetch("http://localhost:3000/api/v1/albums", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			artist: artist,
			title: title,
      albumImg: album_image
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
				console.log("before addPlaylistCardToDom", classificationObject.album.albumImg)
        addPlaylistCardToDom(classificationObject)
      }
		})
	 })

}
