#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_ROOT="$PROJECT_DIR/.backups"
SNAPSHOT_ROOT="$BACKUP_ROOT/snapshots"
LOG_ROOT="$BACKUP_ROOT/logs"
LATEST_LINK="$BACKUP_ROOT/latest"
KEEP_COUNT="${KEEP_COUNT:-432}"
TIMESTAMP="$(date +"%Y-%m-%d_%H-%M-%S")"
DEST_DIR="$SNAPSHOT_ROOT/$TIMESTAMP"
LOG_FILE="$LOG_ROOT/backup.log"

mkdir -p "$SNAPSHOT_ROOT" "$LOG_ROOT" "$DEST_DIR"

{
  printf '[%s] Starting backup\n' "$(date +"%Y-%m-%d %H:%M:%S")"

  rsync -a \
    --exclude ".backups" \
    --exclude ".git" \
    --exclude ".DS_Store" \
    "$PROJECT_DIR/" "$DEST_DIR/project/"

  cat > "$DEST_DIR/metadata.txt" <<EOF
timestamp=$TIMESTAMP
project_dir=$PROJECT_DIR
hostname=$(hostname)
EOF

  ln -sfn "$DEST_DIR" "$LATEST_LINK"

  old_snapshots=("${(@f)$(find "$SNAPSHOT_ROOT" -mindepth 1 -maxdepth 1 -type d | sort)}")
  snapshot_count="${#old_snapshots[@]}"

  if (( snapshot_count > KEEP_COUNT )); then
    prune_count=$(( snapshot_count - KEEP_COUNT ))
    for old_dir in "${old_snapshots[@]:0:prune_count}"; do
      rm -rf "$old_dir"
    done
  fi

  printf '[%s] Backup complete: %s\n' "$(date +"%Y-%m-%d %H:%M:%S")" "$DEST_DIR"
} >> "$LOG_FILE" 2>&1
