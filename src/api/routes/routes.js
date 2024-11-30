const express = require('express')

const router = express.Router()

router.get('/',(req, res) => {
    res.send({'get': 'this message send by get method'})
})

router.post('/',(req, res) =>{
    res.send({'post': 'this message send with post method'})
})

router
    .route('/:id')
    .get((req, res) => {
        let id = req.params.id
        res.send({'hello': id})
    })
    .put((req, res) => {

    })
    .delete((req, res) =>{

    })


module.exports = router