# Introduction

**Jam Player** is a Firefox extension which speeds up game jam playtesting. Add game jam games into a queue and play then in sequence without jumping through many links manually.

Features:

- Add/remove game jam games from itch.io page directly
- Opens rating page automatically when game is closed
- Play next game in queue button in rating page
- Saving queue between browser restarts and reboots

# Building

Development setup:

```sh
pnpm install
pnpm start:firefox
```

Packaging:

```sh

pnpm install
pnpm package:firefox
```

Environment setup inside Ubuntu Docker container:

To launch basic Ubuntu container:

```sh
docker run -it ubuntu:latest /bin/bash
```

And then inside container:

```sh
# Build user setup (skip if you already have user)
apt-get update && apt-get install -y sudo
passwd ubuntu # Set your own password
su - ubuntu
# Source & pnpm installation
sudo apt-get install curl git nodejs -y
curl -fsSL https://get.pnpm.io/install.sh | sh -
source /home/ubuntu/.bashrc
git clone https://github.com/ELginas/jam-player.git
cd jam-player
pnpm install
pnpm package:firefox
# Verify installation
# Note: everywhere where jam_player-0.1.1.zip is replace version with current version
ls -l /home/ubuntu/jam-player/web-ext-artifacts/jam_player-0.1.1.zip
```

## Verification

Sadly .zip file can't be verified by SHA256 because every package run generates a slightly different ZIP file binary representation likely due to concurrency. But it is possible to verify checksums of extracted files:

```sh
sudo apt-get install unzip -y
unzip /home/ubuntu/jam-player/web-ext-artifacts/jam_player-0.1.1.zip -d /tmp/jam-player
find /tmp/jam-player -type f -exec sha256sum {} \; > checksums.txt
sort checksums.txt -o checksums.txt
cat checksums.txt
```

And you can compare original .zip file and your manually packaged .zip file checksums (this runs inside outside of Docker):

```sh
# Get container ID (e.g. 63a8f7398d42)
docker container ls
docker cp 63a8f7398d42:/home/ubuntu/jam-player/checksums.txt ~/checksums.txt
diff -s ~/checksums.txt checksums-orig.txt
```
