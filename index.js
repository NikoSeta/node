const fs = require ('fs')
const express = require('express');
const app = express();
const {Router} = express;
const router = Router();
const PORT = 8080

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/productos', router);
app.use('/', express.static(__dirname + '/public'))
app.get('/', function(req, res){
    res.sendFile(__dirname + "/public/index.html")
});
app.set('view engine', 'ejs')

const server = app.listen(`${PORT}`, ()=>{
    console.log(`Abre el link  para ver los productos usar este link http://localhost:${PORT}/productos `);
});


class Container{
    constructor(url){
        this.url = url
        this.contador= 0;
        this.array = []
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
    addProd(obj){
        try {
            this.array = this.getAll()
            this.contador ++;
            obj.id = this.contador
            this.array.push(obj)
            fs.writeFileSync(this.url, JSON.stringify(this.array))
        }
        catch (err) {
            console.log("No se pudo guardar el archivo")
        }
    }
    async modifyProd(id){
        let array = await this.getAll();
        let modifyProd = array.map(p => p.id === id ? { ...p, nombre: "Lapiz de color", precio: 11, url: " " } : p);
        fs.appendFileSync.splice(`${this.url}`, `${modifyProd}`);
        return 
    }
    async deleteById(id){
        let deleteId = await this.getAll();
        return deleteId.splice(2,`${id}`);
    }
}

let container = new Container('./productos.txt')

app.get('/productos', function(req, res){
    let productos = container.getAll()
    res.render('index',{
        productos: productos
    })
});

app.post('/productos', function(req, res){
    try {
        let newProducto = req.body
        container.addProd(newProducto)
        res.redirect("/productos")
        console.log(req.body);
    } catch (error) {
        console.log(error);
    }
});