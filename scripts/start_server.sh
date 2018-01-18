#!/bin/bash
run()
{
    cd /webapps/nexus-assistant/
    nohup npm start >logfile.txt 2>&1 </dev/null &
    return 0
}

run
echo end script
