# sky-test

Banco de Datos: MongoDB
Port: 3000
Nome do banco: sky-test

Express, JWT, bcryptjs para as senhas, utilização de metodos asincronos

# Routes:

POST: /signup

{
	"nome": "Reynaldo",
	"email": "layme.reynaldo@icloud.com",
	"senha": "123456",
	"telefones": [
		{
			"numero":"948441515",
			"ddd":"11"
		}
	]
}

POST: /signin

{
	"email": "layme.reynaldo@icloud.com",
	"senha": "123456"
}

GET: /buscar/:userId

nome do header do token: authorization
Valor nesse formato: Bearer { eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkOGMzYzJlNGUyZTRlMTBiNGM2M2JjOSIsImlhdCI6MTU2OTQ3MjcxOCwiZXhwIjoxNTY5NDc0NTE4fQ.ft07TkklE3O_1WwWT5JJkH0F6W6u8bPcVz6BqWqHReA }

