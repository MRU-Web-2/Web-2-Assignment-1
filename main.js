var map;
function initMap() {
    console.log("Test");
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
                console.log("Test");
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
                            
                        })
                        .catch( err => console.error(err) )

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

    artist.textContent = "Artist";
    title.textContent = "Title";
    year.textContent = "Year";

    head.appendChild(painting);
    head.appendChild(artist);
    head.appendChild(title);
    head.appendChild(year);
    table.appendChild(head);

    for (let p of paintings) {
        console.log(p);
    }
}