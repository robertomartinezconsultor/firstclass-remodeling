#!/bin/zsh
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <backup-timestamp|latest>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_ROOT="$PROJECT_DIR/.backups"
SNAPSHOT_ROOT="$BACKUP_ROOT/snapshots"
TARGET="$1"

if [[ "$TARGET" == "latest" ]]; then
  SOURCE_DIR="$BACKUP_ROOT/latest/project"
else
  SOURCE_DIR="$SNAPSHOT_ROOT/$TARGET/project"
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Backup not found: $TARGET"
  exit 1
fi

rsync -a \
  --delete \
  --exclude ".backups" \
  --exclude ".git" \
  "$SOURCE_DIR/" "$PROJECT_DIR/"

echo "Restore complete from: $TARGET"
