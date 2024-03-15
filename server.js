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

app.use(express.urlencoded({extended:true}))

// Maak een GET route voor de index
app.get('/', function (request, response) {
  // Haal alle personen uit de WHOIS API op
  const postsUrl = `${apiUrl}/posts?per_page=27`;
  const usersUrl = `${apiUrl}/users`;
  const categoriesUrl = `${apiUrl}/category`;
  Promise.all([fetchJson(postsUrl), fetchJson(usersUrl), fetchJson(categoriesUrl)])
  .then(([postsData, usersData, categoryData]) => {
      // Render index.ejs and pass the fetched data as 'posts' and 'users' variables
      response.render('index.ejs', { posts: postsData, users: usersData, category: categoryData  });
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

// author route
app.get('/author/:id',function(req,res){
  // the data i need for this page
  const postsUrl = `${apiUrl}/posts?author=${req.params.id}`;
  const usersUrl = `${apiUrl}/users?include=${req.params.id}`;

  Promise.all([fetchJson(postsUrl), fetchJson(usersUrl), fetchJson(`${apiUrl}/author/${usersUrl}`)])
  .then(([postsData, usersData]) => {
      // Render colofon.ejs and pass the fetched data as 'posts' and 'users' variables
      // console.log("user", usersData, "posts", postsData)
      res.render('author.ejs', { posts: postsData, users: usersData[0] });
  })

  // Handle error if fetching data fails
  .catch((error) => {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  });

})

// TODO:
// Category endpoint: app.get('/category/:categoryID'....)
// Fetch https://redpers.nl/wp-json/wp/v2/posts?categories={based on params.categoryID from URL}

// Maak een POST route 

app.post('/', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /

  console.log(request.body)
  console.log("yes1")
 

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
