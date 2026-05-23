#!/bin/bash
while true; do
  if ! ss -tlnp | grep -q ":3000"; then
    cd /home/z/my-project
    npx next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
    sleep 8
  fi
  sleep 5
done
