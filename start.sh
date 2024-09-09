#!/bin/bash

if [[ ! -f "rs_keyfile" ]]; then
openssl rand -base64 756 > rs_keyfile
chmod 400 rs_keyfile
fi

docker compose up -d

sleep 5
docker exec -it mongo1 mongosh --username surajkarna --password secured --authenticationDatabase admin --eval '
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017", "priority": 2 },
    { _id: 1, host: "mongo2:27017" }
  ]
}) 
'