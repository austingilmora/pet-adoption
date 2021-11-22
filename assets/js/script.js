var searchedBreed = document.querySelector("#breed-name");
var modal = document.querySelector("#no-input");
var searchButton = document.querySelector(".search-button");
var dogInfoEl = document.querySelector(".dog-info");

var formSubmitHandler = function(event) {
    event.preventDefault();
    //get breed
    var breed = searchedBreed.value.trim();

    //if there is an input
    if(breed) {
        // clear old search container
        clearChildren(dogInfoEl);
        
        //get random pic of breed
        getDogPic(breed);
        // get wiki article
        getWiki(breed);
        
        
        //clear old search
        searchedBreed.value = "";
        
        
    } else {
        modal.style.display = "block";
    }
};

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

var clearChildren = function(parent) {
    // kill all the children 
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

searchButton.addEventListener("click", formSubmitHandler)