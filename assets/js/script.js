var searchedBreed = document.querySelector("#breed-name");
var modal = document.querySelector("#no-input");
var searchButton = document.querySelector(".search-button");
var dogInfoEl = document.querySelector(".dog-info");
var favoriteDogEl = document.querySelector(".favorite-dogs");
var savedDogs = [];

var formSubmitHandler = function(event) {
    event.preventDefault();
    //get breed
    var breed = searchedBreed.value.trim();

    //if there is an input
    if(breed) {
        loadDog(breed);
        
        //clear old search
        searchedBreed.value = "";
        
        return breed;
        
    } else {
        // modal.style.display = "block";
    }
    return breed;
};

var loadDog = function(breed) {
    clearChildren(dogInfoEl);
        
    //get random pic of breed
    getDogPic(breed);
    // get wiki article
    getWiki(breed);
        
    makeFaveButton(breed);
}

var getWiki = function(breed) {
    var url = "https://en.wikipedia.org/w/api.php"; 

    var params = {
        action: "opensearch",
        search: breed + "(dog)",
        limit: "1",
        namespace: "0",
        format: "json"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    fetch(url).then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
        .then(function(data) {
            //get array with wiki link
            var wiki = data[3];
            //take link out of array
            var wikiLink = wiki[0];
            //break up the link
            var brokenWikiLink = wikiLink.split(".")
            //make it mobile link
            var mobileWikiLink = brokenWikiLink[0] + ".m." + brokenWikiLink[1] + "." + brokenWikiLink[2];
            //make an iframe
            var wikiBox = document.createElement("iframe");
            //give the iframe the right source
            wikiBox.src = mobileWikiLink;
            //put the iframe on the page
            dogInfoEl.appendChild(wikiBox);
    })
        .catch(function(error){console.log(error);});
};

const getDogPic = function(breed) {
    const dogPicUrl = "https://dog.ceo/api/breed/" + breed + "/images/random";

    fetch(dogPicUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    // create img element
                    const dogPicEl = document.createElement('img');
                    // set img src to data
                    dogPicEl.setAttribute('src', data.message);

                    // append to container div
                    dogInfoEl.appendChild(dogPicEl);
                });
            } else {
                console.log("Sorry, that breed was not found!");
            }
        })
        .catch(function(error) {
            console.log('Error encountered: ' + error);
        })

};

var makeFaveButton = function(breed) {
    //make fave button
    var faveButton = document.createElement("button");
    // button says add to favorites
    faveButton.textContent = "Add to Favorites!";
    //button does makeFave function
    faveButton.addEventListener("click", makeFave(breed));
    //button goes to the page
    dogInfoEl.appendChild(faveButton);
};

var makeFave = function(breed) {
    loadFaves();
    
    //if there are no instances of that breed in favorites
    if (savedDogs.indexOf(breed) === -1) {
        //put the breed in favorites
        savedDogs.push(breed);
        //make a button
        var dogButton = document.createElement("button");
        // button says breed selected
        dogButton.innerHTML = "<h2>" + breed + "</h2>"
        //button does loadDog function with the text inside the button
        dogButton.addEventListener("click", function(event) {loadDog(event.target.textContent)});
        // add the button to fav list
        favoriteDogEl.appendChild(dogButton);
        //save new list of favorites to local storage
        localStorage.setItem("savedDogs", JSON.stringify(savedDogs));
    } 
};

var loadFaves = function() {
    //load old favorite dogs
    var faves = localStorage.getItem("savedDogs");
    //if there are no favorites, don't do anything
    if (!faves) {
        return false;
    }
    //if there are, load them as saved dogs array
    else {
        savedDogs = JSON.parse(faves);
    }
}

var loadFaveButtons = function() {
    //for each of the favorite dogs in the array
    for (let i = 0; i < savedDogs.length; i++) {
        //make a button
        var dogButton = document.createElement("button");
        //set the text as the breed name
        dogButton.innerHTML = "<h2>" + savedDogs[i] + "</h2>"
        // make the button to the loadDog function on a click
        dogButton.addEventListener("click", function(event) {loadDog(event.target.textContent)});
        //put the button in the favorite dog list
        favoriteDogEl.appendChild(dogButton);
    }
}

var clearChildren = function(parent) {
    // kill all the children 
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

loadFaves();
loadFaveButtons();
searchButton.addEventListener("click", formSubmitHandler);