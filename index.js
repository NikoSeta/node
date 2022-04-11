const fs = require ('fs')
const express = require('express');
const {Router} = express;

const app = express();
const router = Router();
const PORT = 8080

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/productos', router);
app.use('/', express.static(__dirname + '/public'))
app.get('/', function(req, res){
    res.sendFile(__dirname + "/public/index.html")
});

const server = app.listen(`${PORT}`, ()=>{
    console.log(`Abre el link  http://localhost:${PORT} | Para ver los productos usar este link http://localhost:${PORT}/api/productos `);
});

class Container{
    constructor(url){
        this.url = url
    }
    getAll(){
        try {
            return JSON.parse(fs.readFileSync(`${this.url}`, "utf-8"))
        } catch (error) {
            throw new Error(error);
        }
    }
    getById(id){
            let arrayProductos =  this.getAll();
            return arrayProductos.find(producto => producto.id === id); 
    }
    addProd(){
        let newProd = {nombre: "cartuchera", precio: 275, url:" "}
        let array = this.getAll()
        let addNewProd = array.push(newProd)
        return addNewProd
    }
    async modifyProd(id){
        let array = await this.getAll();
        return array.map(p => p.id === id ? { ...p, nombre: "Lapiz de color", precio: 11, url: " " } : p)
    }
    async deleteById(id){
        let array = await this.getAll();
        return array.splice(id);
    }
}

let container = new Container('./productos.txt')



// en la ruta '/api/productos' trae todos los productos en formato json
router.get('/', (req, res) =>{
    res.send(container.getAll())
});

// get que traiga un producto por ID   '/api/productos/:id'
router.get('/:id', (req, res)=>{
    res.send(container.getById(req.params.id))
});

// POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.

router.post('/', (req, res)=>{
    res.send(container.addProd())
});

// PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
router.put('/:id', (req, res)=>{
    res.send(container.modifyProd(req.params.id))
});

//DELETE '/api/productos/:id' -> elimina un producto según su id.

router.delete('/:id', (req, res) =>{
    res.send(container.deleteById(req.params.id))
});




