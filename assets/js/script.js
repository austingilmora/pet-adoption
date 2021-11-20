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
        //getPic(breed);
        // get wiki article
        getWiki(breed);
        
        
        //clear old search
        searchedBreed.value = "";
        
        
    } else {
        modal.style.display = "block"
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

var clearChildren = function(parent) {
    // kill all the children 
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

searchButton.addEventListener("click", formSubmitHandler)