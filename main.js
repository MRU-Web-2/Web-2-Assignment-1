document.addEventListener("DOMContentLoaded", function() {
    const galleriesURL = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";
    
    
    document.querySelector('').style.display = 'none';
    fetch(galleriesURL)
        .then( r => r.json())
        .then( galleries => {
            document.querySelector('').style.display = 'none';
            const galleriesArray = [];
            galleriesArray.push(...galleries);
            for (let g of galleriesArray) {
                console.log(g);
            }
            console.log(galleriesArray.length)
        })
        .catch( err => console.error(err));
});