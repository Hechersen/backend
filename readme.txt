Nueva ruta para ver usuarios en json: http://localhost:8080/api/users (ver nombre completo)
Nueva ruta para cambio de rol de 'user' a 'premium': http://localhost:8080/users/admin
Eliminar usuarios funciona OK y muestra la notificación adecuada
Eliminar usuarios inactivos funciona OK y manda mail: curl -X POST http://localhost:8080/api/users/delete-inactive
Vista administrativa funciona todo OK.
Eliminar producto creado por usuario premium y recibir mail funciona OK.
Corregir errores y revisar.
Vista y proceso de compra (checkout)
Manejo de productos en tiempo real.
Despliegue en Railway.

Archivos de test: loggerTest.js / testEmail.js
Script de actualización: updateLastConnection.js

adminCoder@coder.com
adminCod3r123