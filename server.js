// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://redpers.nl/wp-json/wp/v2';

// const data_c = await fetchJson('https://fdnd.directus.app/items/person/40')

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('./public/'))

app.use(express.urlencoded({extented:true}))

// Maak een GET route voor de index
app.get('/', function (request, response) {
  // Haal alle personen uit de WHOIS API op
  const postsUrl = `${apiUrl}/posts`;
  const usersUrl = `${apiUrl}/users`;
  const catagoriesUrl = `${apiUrl}/catagory`
  Promise.all([fetchJson(postsUrl), fetchJson(usersUrl), fetchJson(catagoriesUrl)])
  .then(([postsData, usersData, catagoryData]) => {
      // Render index.ejs and pass the fetched data as 'posts' and 'users' variables
      response.render('index.ejs', { posts: postsData, users: usersData, catagory: catagoryData  });
  })
  .catch((error) => {
    // Handle error if fetching data fails
    console.error('Error fetching data:', error);
    response.status(500).send('Error fetching data');
});

})


app.get('/posts/:id', function (request, response) {
  // Fetch the post with the given id from the API
  const postId = request.params.id;

  fetchJson(`${apiUrl}/posts/${postId}`)
  .then((apiData) => {
      // Render post.ejs and pass the fetched data as 'post' variable
      response.render('posts.ejs', { post: apiData  });
  })
  .catch((error) => {
      // Handle error if fetching data fails
      console.error('Error fetching data:', error);
      response.status(404).send('Post not found');
  });
});




// Maak een POST route 
console.log("yes1")
app.post('/', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /

  console.log(request.body)
  
 

  // fetch('https://fdnd.directus.app/items/person/' + request.params.id, {
  //     method: 'PATCH',
  //     body: JSON.stringify({
  //       custom: apiResponse.data.custom
  //     }),
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8'
  //     }
  //   }).then((patchResponse) => {
  //     // Redirect naar de persoon pagina
  //     response.redirect(303, '/detail/' + request.params.id)
  //   })
  // })
  

  response.redirect(303, '/');
});


// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8004)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log('Server is running on port 8004')
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
