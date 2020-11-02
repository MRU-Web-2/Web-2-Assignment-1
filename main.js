var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50, lng: -40},
        mapTypeId: 'satellite',
        zoom: 2
    });
}

function createMarker(map, latitude, longitude, city) {
    let imageLatLong = {lat:  latitude, lng: longitude };
    let marker = new google.maps.Marker({
        position: imageLatLong,
        title: city,
        map: map
    });
}


document.addEventListener("DOMContentLoaded", function() {
    const galleriesURL = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";

    

    document.querySelector('.lds-spinner').style.display = "inline-block";
    const mainContent = document.querySelectorAll('.main');
    for (let m of mainContent) {
        m.style.display = "none";
    }
    document.querySelector('#spinner3').style.display = 'block';
    
    fetch(galleriesURL)
        .then( r => r.json() )
        .then( galleries => {
            function initMap() {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: 50, lng: -40},
                    mapTypeId: 'satellite',
                    zoom: 2
                });
            }
            
            document.querySelector('#listOfGalleries').innerHTML = "";
            document.querySelector('#spinner1').style.display = 'none';
            document.querySelector('.list > .main').style.display = "block";
            makeGalleriesAtList(galleries);

            document.querySelector('#spinner3').style.display = 'none';
            addMarkers(galleries);
            document.querySelector('#map').style.display = "block";



            document.querySelector("#listOfGalleries").addEventListener("click", (e) => {
                if ( e.target.value ) {
                    document.querySelector('.info > .main').style.display = 'none';
                    document.querySelector('#spinner2').style.display = 'block';
                    document.querySelector('#spinner3').style.display = 'block';
                    document.querySelector('#spinner4').style.display = 'block';
                    document.querySelector('#map').style.display = "none";
                    document.querySelector('#Paintings').style.display = "none";
                    fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=${e.target.value}`)
                        .then( r => r.json() )
                        .then( paintings => {
                            document.querySelector('#galleryInfo').innerHTML = "";
                            document.querySelector('#spinner2').style.display = 'none';
                            document.querySelector('#spinner4').style.display = 'none';
                            document.querySelector('.info > .main').style.display = 'block';
                            let gallery = galleries.find( gallery => gallery.GalleryID == e.target.value);
                            
                            addGalleryInfo(gallery);
                      
                            map = new google.maps.Map(document.getElementById('map'), {
                                center: {lat: gallery.Latitude, lng: gallery.Longitude},
                                mapTypeId: 'satellite',
                                zoom: 18
                            });
                            map.setTilt(45);
                            createMarker( map, gallery.Latitude, gallery.Longitude, gallery.GalleryCity );
                            document.querySelector('#map').style.display = "block";
                            document.querySelector('#spinner3').style.display = 'none';

                            createTable(paintings);
                            document.querySelector('#Paintings').style.display = "block";

                            let newPaintings = paintings;
                            document.querySelector("#paintingsTable").addEventListener("click", (e) => {
                                /* https://www.w3schools.com/jsref/jsref_reverse.asp */
                                if (e.target.id == "Title") {
                                    newPaintings = paintings.sort( function (a, b) {
                                        return a.Title > b.Title ? 1 : -1;
                                    });
                                } else if (e.target.id == "Artist") {
                                    newPaintings = paintings.sort( function (a, b) {
                                        if (`${a.FirstName} ${a.LastName}` != `${b.FirstName} ${b.LastName}`) {
                                            return `${a.FirstName} ${a.LastName}` > `${b.FirstName} ${b.LastName}` ? 1 : -1;
                                        } else {
                                            return a.Title > b.Title ? 1 : -1;
                                        }
                                    });
                                } else if (e.target.id == "Year") {
                                    newPaintings = paintings.sort( function (a, b) {
                                        if (a.YearOfWork != b.YearOfWork) {
                                            return a.YearOfWork > b.YearOfWork ? 1 : -1;
                                        } else {
                                            return a.Title > b.Title ? 1 : -1;
                                        }
                                    });
                                }
                                createTable(newPaintings);

                                if ( e.target.id == "tableTitles") {
                                    let mainContent = document.querySelectorAll("#MAIN");
                                    for (let m of mainContent) {
                                        m.style.display = "none";
                                    }
                                    document.querySelector(".singlePainting").style.display = "block";

                                    for (let p of paintings) {
                                        if (p.PaintingID == e.target.value) {
                                            createSinglePainting(p);
                                        }
                                    }

                                    document.querySelector("#button").addEventListener("click", (e) => {
                                        let mainContent = document.querySelectorAll("#MAIN");
                                        for (let m of mainContent) {
                                            m.style.display = "block";
                                        }
                                        document.querySelector(".singlePainting").style.display = "none";
                                        
                                    });
                                }

                                
                            });

                        })
                        .catch( err => console.error(err) );

                }
            });
        })
        .catch( err => console.error(err) );

});


function makeGalleriesAtList(galleries) {
    for (let g of galleries) {
        let li = document.createElement('li');
        li.textContent = g.GalleryName;
        li.value = g.GalleryID;
        document.querySelector('#listOfGalleries').appendChild(li);
    }
}

function addMarkers(galleries) {
    for (let g of galleries) {
        createMarker( map, g.Latitude, g.Longitude, g.GalleryCity );
    }
}

 /* https://stackoverflow.com/questions/4365246/how-to-change-href-of-a-tag-on-button-click-through-javascript */
function addGalleryInfo(gallery) {
    let info = document.querySelector('#galleryInfo');
    let galleryName = document.createElement('li');
    let galleryNativeName = document.createElement('li');
    let galleryCity = document.createElement('li');
    let galleryAddress = document.createElement('li');
    let galleryCountry = document.createElement('li');
    let galleryWebsite = document.createElement('li');
    let a = document.createElement('a');
    galleryWebsite.appendChild(a);
    galleryWebsite.id = "listLink";

    galleryName.textContent = gallery.GalleryName;
    galleryNativeName.textContent = gallery.GalleryNativeName;
    galleryCity.textContent = gallery.GalleryCity;
    galleryAddress.textContent = gallery.GalleryAddress;
    galleryCountry.textContent = gallery.GalleryCountry;
    a.textContent = gallery.GalleryWebSite;
    a.href = gallery.GalleryWebSite;
    /* https://wordpress.com/forums/topic/how-to-open-custom-html-link-to-open-in-new-tab/#:~:text=You%20can%20make%20a%20HTML,this%20after%20the%20link%20address. 
    open in a new tab */
    a.target = "_blank";
    
    info.appendChild(galleryName);
    info.appendChild(galleryNativeName);
    info.appendChild(galleryCity);
    info.appendChild(galleryAddress);
    info.appendChild(galleryCountry);
    info.appendChild(galleryWebsite);
}

 /* https://www.w3schools.com/html/html_tables.asp */
function createTable(paintings) {
    let table = document.querySelector("#paintingsTable");
    table.innerHTML = "";
    let head = document.createElement('tr');
    let painting = document.createElement('th');
    let artist = document.createElement('th');
    let title = document.createElement('th');
    let year = document.createElement('th');

    head.id = "headOfTable";
    artist.textContent = "Artist";
    artist.id = "Artist";
    title.textContent = "Title";
    title.id = "Title";
    year.textContent = "Year";
    year.id = "Year";

    head.appendChild(painting);
    head.appendChild(artist);
    head.appendChild(title);
    head.appendChild(year);
    table.appendChild(head);

    for (let p of paintings) {
        let newHead = document.createElement('tr');
        let newPainting = document.createElement('td');
        let newArtist = document.createElement('td');
        let newTitle = document.createElement('td');
        let newYear = document.createElement('td');

        let img = document.createElement('img');
        img.src = `https://res.cloudinary.com/funwebdev/image/upload/w_75/art/paintings/square/${p.ImageFileName}`;
        newPainting.appendChild(img);
        newArtist.textContent = `${p.FirstName} ${p.LastName}`;
        newTitle.textContent = p.Title;
        newTitle.id = "tableTitles";
        newTitle.value = p.PaintingID;
        newYear.textContent = p.YearOfWork;

        newHead.appendChild(newPainting);
        newHead.appendChild(newArtist);
        newHead.appendChild(newTitle);
        newHead.appendChild(newYear);
        table.appendChild(newHead);
    }
}

function createSinglePainting(p) {
    let imageMain = document.querySelector("#image");
    imageMain.innerHTML = "";
    let main = document.querySelector('#singlePaintingContent');
    main.innerHTML = "";
    let h2 = document.createElement('h2');
    h2.textContent = p.Title;
    let button = document.createElement('button');
    button.type = "button";
    button.id = "button";
    button.textContent = "Close";
    let artistName = document.createElement('div');
    artistName.id = "subtitle";
    artistName.textContent = `${p.FirstName} ${p.LastName}`;
    let mainContent = document.createElement('div');
    mainContent.textContent = `${p.YearOfWork}, ${p.Medium}, ${p.Width}, ${p.Height}, ${p.CopyrightText}, ${p.GalleryName}, ${p.GalleryCity} `;
    let a = document.createElement('a');
    a.textContent = p.MuseumLink;
    a.href = p.MuseumLink;
    mainContent.appendChild(a);
    mainContent.appendChild(document.createTextNode(`, ${p.Description}`));


    let img = document.createElement('img');
    img.src = `https://res.cloudinary.com/funwebdev/image/upload/w_600/art/paintings/square/${p.ImageFileName}`;


    imageMain.appendChild(img);

    main.appendChild(h2);
    main.appendChild(artistName);
    main.appendChild(mainContent);
    main.appendChild(button);

    console.log(p);
}