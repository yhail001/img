(function(){
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");

            const targetSectionId = button.dataset.id; // Get the section ID
            const targetSection = document.getElementById(targetSectionId);

            if (targetSection) {
                targetSection.scrollIntoView({behavior: 'smooth', block: 'start'}); // Smooth scroll to section
            }
        });
    });
})();


/* logos-slide stuff? literally no idea what this does*/
var original = document.querySelector('.logos-slide');
var copy = original.cloneNode(true);
original.parentNode.appendChild(copy);





//sitemap.xml

const express = require('express');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const fs = require('node:fs') // added by me
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

let sitemapCache = null

app.get('/sitemap.xml', async function (req, res) {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    if (sitemapCache) {
        console.log("from cache!");
        res.send(sitemapCache)
        return
    }

    try {
        const smStream = new SitemapStream({
            hostname: 'https://www.yohanneshaile.com/', // Replace with your website URL
        });
        const pipeline = smStream.pipe(createGzip());

        // Static URLs based on your HTML
        const urls = [
            { url: '/', changefreq: 'daily', priority: 1 },
            { url: '/#about', changefreq: 'monthly', priority: 0.8 },
            { url: '/#researchs', changefreq: 'monthly', priority: 0.8 },
            { url: '/#contact', changefreq: 'monthly', priority: 0.8 },
            { url: '/public/imgs2/Yohannes_Haile_Website.pdf', changefreq: 'monthly', priority: 0.5 }, // Link to your PDF, if necessary
        ];

        // Pipe your source stream (add your URLs to the sitemap)
        urls.forEach(url => {
            smStream.write(url)
        });
        smStream.end();

        // Cache the sitemap
        streamToPromise(pipeline).then(sm => {
          sitemapCache = sm
          fs.writeFileSync("./public/sitemap.xml", sm)
        })
        console.log("from fresh!");
        // Stream the sitemap
        pipeline.pipe(res).on('error', (e) => { throw e });

    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
