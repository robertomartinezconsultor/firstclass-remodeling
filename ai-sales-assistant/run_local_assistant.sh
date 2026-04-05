#!/bin/zsh
cd "$(dirname "$0")"
python3 assistant_server.py --port "${1:-8791}"
