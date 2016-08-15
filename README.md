#Simple Node Authentication Scaffolding

##Steps to use

1. Clone or fork the repo
2. run npm i
3. Fire up a mysql server on localhost with the default port
4. Create a database named authentication
5. Create the following table:
    ```sql
        CREATE TABLE users (
            username VARCHAR(25),
            hashedPassword VARCHAR(128),
            email VARCHAR(30)
        );
    ```