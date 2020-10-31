document.addEventListener("DOMContentLoaded", function() {
    const galleriesURL = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";
    
    document.querySelector('.lds-spinner').style.display = "inline-block";
    const mainContent = document.querySelectorAll('.main');
    for (let m of mainContent) {
        m.style.display = "none";
    }
    fetch(galleriesURL)
        .then( r => r.json() )
        .then( galleries => {
            document.querySelector('#spinner1').style.display = 'none';
            document.querySelector('.list > .main').style.display = "block";
            const galleriesArray = [];
            galleriesArray.push(...galleries);
            makeGalleriesAtList(galleries);
            console.log(document.querySelector('#listOfGalleries'));
        })
        .catch( err => console.error(err) );

});

function makeGalleriesAtList(gals) {
    for (let g of gals) {
        let li = document.createElement('li');
        console.log(g);
        li.textContent = g.GalleryName;
        li.value = g.GalleryID;
        document.querySelector('#listOfGalleries').appendChild(li);
    }
}