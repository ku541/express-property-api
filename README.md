# Express Property API

## Endpoints

- /api/v1
    - /users
        - POST /
            - validate request
            - create user
    - /otp
        - POST /
            - validate request
            - read user by email
            - create otp
            - update user
            - send email
    - /tokens
        - POST
            - validate request
            - read user by email
            - verify otp
            - update user (unset otp)
            - create jwt

## To Do

- [] use native env instead of dotenv