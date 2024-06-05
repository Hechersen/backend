URL

http://localhost:8080/realtimeproducts
http://localhost:8080/api/products/
http://localhost:8080/api/products/view
test
http://localhost:8080/api/products?sort=asc
dos elementos por pagina
http://localhost:8080/api/products?limit=2

el carritooo
http://localhost:8080/carts/666083d11f227df42acc14d0

1-clonar repo de mi otro github -> npm install
2-npm install mongoose-paginate-v2
3-hasta aca funciona todo
4-modificaremos routes/products.js
5-modificaremos el productManager
6-modificaremos product.js
7-tambien modificamos app.js
8-hasta aqui todo ok


ahora todo lo de los carritos
1-modificamos nuestro archivo carts.js
2-creamos el handlebar
3-modificamos app.js para agregar el endpoint
4-falto modificar el model del cart
5-cartManager

pruebas con el carrito

1-lo creamos:
curl -X POST http://localhost:8080/api/carts
resultado
D:\endback>curl -X POST http://localhost:8080/api/carts
{"products":[],"_id":"666083d11f227df42acc14d0","__v":0}

2-agregamos algun producto

curl -X POST http://localhost:8080/api/carts/666083d11f227df42acc14d0/products -H "Content-Type: application/json" -d "{\"productId\": \"6657446f86330251e6f2bf81\", \"quantity\": 1}"
resultado
D:\endback>curl -X POST http://localhost:8080/api/carts/666083d11f227df42acc14d0/products -H "Content-Type: application/json" -d "{\"productId\": \"6657446f86330251e6f2bf81\", \"quantity\": 1}"
{"_id":"666083d11f227df42acc14d0","products":[{"product":"6657446f86330251e6f2bf81","quantity":1,"_id":"666087fc1f227df42acc14d5"}],"__v":1}

3-verificar carrito
curl http://localhost:8080/api/carts/666083d11f227df42acc14d0
resultado
D:\endback>curl http://localhost:8080/api/carts/666083d11f227df42acc14d0
{"_id":"666083d11f227df42acc14d0","products":[{"product":{"_id":"6657446f86330251e6f2bf81","title":"Buzo","price":100,"code":"1","__v":0,"id":"6657446f86330251e6f2bf81"},"quantity":1,"_id":"666087fc1f227df42acc14d5"}],"__v":1}   