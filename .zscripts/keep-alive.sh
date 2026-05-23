#!/bin/bash
while true; do
  if ! pgrep -f "next dev" > /dev/null 2>&1; then
    echo "$(date): Restarting Next.js..." >> /home/z/my-project/.zscripts/keep-alive.log
    cd /home/z/my-project && npx next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
    sleep 10
  fi
  sleep 3
done
