# Cradle

## deploy on AWS
- Step-1: install docker
  ```
  sudo apt-get update
  sudo apt  install docker.io
  ```
- create docker container
  ```
  docker run -d -it --name npm_build -v /:/TOP nvcr.io/nvidia/pytorch:21.03-py3
  ```

- enter the container
  ```
  docker exec -it npm_build bash
  ```

- go to working directory and clone the repo
  ```
  e.g.,
  cd /TOP/home/ubuntu/
  git clone  https://github.com/KatieHYT/cradle-vite/
  ```

- install and build
  ```
  cd cradle-vite
  npm install
  npm run build
  ```

- exit `npm_build` container and go to working directory
  ```
  cd /home/ubuntu/cradle-vite
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

