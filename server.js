// import Express library and activate it
import express from "express";
const app = express();


// Serve static files from /public folder (useful when running Node locally, optional on Vercel).
app.use(express.static('public'))
// Define index.html as the root explicitly (useful on Vercel, optional when running Node locally).
app.get('/', (req, res) => { res.redirect('/index.html') })



// listen for requests from the frontend
app.get("/picture/:chosenDate", (req, res) => {
    // assemble a url for NASA API
    let url = new URL('https://api.nasa.gov/planetary/apod')
    url.searchParams.set('date', req.params.chosenDate)     // chosenDate via the URL.
    url.searchParams.set('api_key', process.env.NASA_KEY)   // API key via environment variable.
    // Relay the results back to the frontend
    fetch(url)
        .then(response => response.json())
        .then(json => res.send(json))
});



const port = 3000
// app.listen(...): starts the web server and prints a message when it's ready.
// You can then open the URL in your browser to use the app locally.
app.listen(port, () => {
    console.log(`Express is live at http://localhost:${port}`)
})
