# Cradle

## deploy on AWS
- Step-1: install docker
  ```
  sudo apt-get update
  sudo apt  install docker.io
  ```
- Step-2: build docker image
  ```
  docker build -t apache-container .
  ```

- Step-3: run docker container
  ```
  docker run -d -p 80:80 --name my-apache-container apache-container
  ```

- Step-4:
  Go check `cradle.wiki`

## npm run (for dev testing)
- Step-1:  
  Clone this repository and `cd` to `cradle-vite`.

- Step-2: 
  Create your `.env`file
  ```
  BACKEND_URL="https://xxxxxxxxxxxxxxxxxxx"
  GOOGLE_MAP_API_KEY="xxxxxxxxxxxxxx"
  ```
   
- Step-3:  
  Install dependency
  ```
  npm install
  ```
- Step-4:
  Run the service
  ```
  npm run dev -- --port CUSTOM_PORT
  ```

