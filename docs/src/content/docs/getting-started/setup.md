---
title: Setup
description: A guide in my new Starlight docs site.
---

## Docker compose
```
version: '3.6'

services:
  proxy:
    container_name: proxy
    image: traefik:v2.9
    restart: always
    labels:
      - 'traefik.enable=true' 
      - "traefik.http.routers.proxy.rule=Host(`proxy.localhost`)"
    command:
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --api.insecure=true 
      - --providers.docker
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - rmnet

  database:
    container_name: database
    build: ./database
    restart: always
    labels:
      - "traefik.enable=true"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=user
      - MONGO_INITDB_ROOT_PASSWORD=pass
      - MONGO_INITDB_DATABASE=test
    ports:
      - "27017:27017"
    volumes:
      - type: bind
        source: ./database/data
        target: /data/db
    networks:
      - rmnet

  backend:
    container_name: backend
    restart: always
    build: ./backend
    ports: 
      - "3030:8080"
    labels:
      - "traefik.enable=true"
      # - "traefik.http.routers.edge-dataops-ui.rule=Host(`edge.localhost`)"
    environment:
      - AUTH_SECRET=bezkoder-secret-key
      - MONGO_URI=mongodb://user:pass@database:27017
      - BROKER_URL=mqtt://mqtt:1883
      - BROKER_USERNAME=
      - BROKER_PASSWORD=
    depends_on:
      - proxy
    networks:
      - rmnet

  mqtt:
    container_name: mqtt
    user: "1000:1000"
    restart: always
    build: ./mqtt
    ports:
      - "1883:1883"
      - "1884:1884"
    volumes:
      - ./mqtt/data:/mqtt/
    depends_on:
      - proxy
    networks:
      - rmnet

  frontend:
    container_name: frontend
    build: ./frontend
    restart: always
    ports:
      - "3000:3000"
    labels:
      - 'traefik.enable=true' 
      # - "traefik.http.routers.frontend.rule=Host(`api.localhost`)"
    environment:
      - REACT_APP_SERVER_URL=http://localhost:3030
    networks:
      - rmnet

  docs:
    container_name: docs
    build: ./docs
    restart: always
    labels:
      - 'traefik.enable=true' 
      # - "traefik.http.routers.edge-dataops-docs.rule=Host(`api.localhost`)"
    ports:
      - "8881:8888"
    networks:
      - rmnet

networks:
  rmnet:
    driver: bridge

```