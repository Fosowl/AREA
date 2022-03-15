
# Create an account (curl)

`curl -X POST http://127.0.0.1:5000/api/user/register -H 'Content-Type: application/json' -d '{"pseudo":"qu35t", "email": "qu35t@area.epitech", "password":"helloitsme"}' | jq .`

# Show all accounts (curl)

`curl -X GET http://127.0.0.1:5000/api/user/ -H 'Content-Type: application/json' | jq .`

# User Info (curl)

`curl -X GET http://127.0.0.1:5000/api/user/ID -H 'Content-Type: application/json' | jq .`


# Delete a user (curl)

`curl -X DELETE http://127.0.0.1:5000/api/user/ID -H 'Content-Type: application/json' | jq`

# Update user (curl)

`curl -X PUT http://127.0.0.1:5000/api/user/ID -H 'Content-Type: application/json' -d '{"firstName":"alexis2", "phoneNumber": "0606060660606"}' | jq .`

# Login (curl)

`curl -X POST http://127.0.0.1:5000/api/user/login -H 'Content-Type: application/json' -d '{"email":"qu35t2@area.epitech", "password": "helloitsme"}' | jq .`