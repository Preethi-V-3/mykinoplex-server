# mykinoplex-server
MyKinoplex backend API project

This project aims at providing an API service for movie booking website, where the organiser/admin can perform CRUD operations on movies, theaters and showtimes. 

#########################################################

This is a NodeJs project. Run `npm init` to download all the required packages to run this code. 

`npm run dev` will start the server in development mode. Open http://localhost:3001/ to test the connection.

Before starting the server, set up the MongoDB server, if running locally.

To set up the replica set of the MongoDB locally, follow the below steps: (Do not close any of the terminal after setting up the server for successful DB transactions)

1. Stop the default mongod server from services if setup before. Replicaset database is created as db transactions are performed in some of the queries

2. Start server with different terminals for each port. Run the following commands each in different terminals-

`mongod --replSet "rs-mykinoplex" --bind_ip systemid --port 27017 --dbpath /mongo/data/db1 --logpath /mongo/logs/db1.log --oplogSize 128`

`mongod --replSet "rs-mykinoplex" --bind_ip systemid --port 27018 --dbpath /mongo/data/db2 --logpath /mongo/logs/db2.log --oplogSize 128`

`mongod --replSet "rs-mykinoplex" --bind_ip systemid --port 27019 --dbpath /mongo/data/db3 --logpath /mongo/logs/db3.log --oplogSize 128`

3. Start the client terminal by running the following command in a new terminal `mongo --host systemid:27017`

4. Run `rs.status()` to check if the replica set is initialised.

5. If no initialisation is done, run the follwing command to create ad initialise the replica set.

`rs.initiate( { _id : "rs-mykinoplex", members: [{ _id: 0, host: "systemid:27017" },{ _id: 1, host: "systemid:27018" },{ _id: 2, host: "systemid:27019" }]})`

6. Run `rs.status()` again to make the initialisation is succesfully done.

7. After setting up the replicaset, create user for the database `mykinoplex` for auth operations using the command `db.createUSer({ user: "username", pwd: "password", roles: [{ role: "dbAdmin", db: "mykinoplex"}]})`. If the database doesnot exist, create one using `use mykinoplex` and then run the above command in the mongo shell.

8. You are all set to perform database operations using the API.