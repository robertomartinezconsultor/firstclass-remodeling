# Auto Backup

This project now includes a rotating local backup system.

## What it does

- Creates a full project snapshot every 10 minutes
- Stores backups in `.backups/snapshots/<timestamp>`
- Updates `.backups/latest` to the newest snapshot
- Keeps the newest 432 snapshots by default

## Important paths

- Backup script: `scripts/backup_project.sh`
- Restore script: `scripts/restore_backup.sh`
- LaunchAgent template: `launchd/com.firstclassremodelingtx.autobackup.plist`
- Snapshots: `.backups/snapshots/`
- Logs: `.backups/logs/backup.log`

## Manual commands

Run a backup now:

```sh
./scripts/backup_project.sh
```

Restore the latest snapshot:

```sh
./scripts/restore_backup.sh latest
```

Restore a specific snapshot:

```sh
./scripts/restore_backup.sh 2026-03-31_19-10-00
```

## Notes

- The backup excludes `.backups`, `.git`, and `.DS_Store`
- The scheduled macOS agent runs every 600 seconds
- If the project path changes, update the plist paths before reloading it
