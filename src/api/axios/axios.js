const axios = require('axios');
const { response } = require('express');

let datares = {};

axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2024-11-11')
.then(async (data) =>{
    console.log(data.data)
    datares = data.data
    axios.post('http://localhost:3000/api/apod', datares).then((response) =>{
    console.log(response)
})
})