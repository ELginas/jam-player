<p align="center">
  <img src="https://github.com/user-attachments/assets/8ee1abdc-0714-4dcf-af4b-ddef7e15022d" />
</p>

https://github.com/user-attachments/assets/12549cc0-555c-4e47-b564-97d1f8ef4e8d

**Jam Player** is a Firefox & Chrome extension which speeds up game jam playtesting. Add game jam games into a queue and play then in sequence without jumping through many links manually.

Features:

- Add/remove game jam games from itch.io page directly
- Opens rating page automatically when game is closed
- Play next game in queue button in rating page
- Saving queue between browser restarts and reboots
- Firefox container support

# Installation

## Firefox

### Method 1

1. Download a bit out of date version from [addons.firefox.org](https://addons.mozilla.org/en-US/firefox/addon/jam-player/)

### Method 2

1. Install [`jam-player-{version}-firefox.zip`](https://github.com/ELginas/jam-player/releases) to Firefox Developer Edition
   1. Download [`jam-player-{version}-firefox.zip`](https://github.com/ELginas/jam-player/releases)
   2. Go to `about:config` and set `xpinstall.signatures.required` to false
   3. In Firefox open Hamburger (3 lines) button at top right corner > Add-ons and themes > Extensions > Cog/settings icon > Install Add-on From File... and select downloaded file.

https://github.com/user-attachments/assets/92939532-2349-4540-9877-0d6cb37edb35

## Chrome

1. Download [`jam-player-{version}-chrome.zip`](https://github.com/ELginas/jam-player/releases)
2. In Chrome open 3 dots at top right corner > Extensions > Manage Extensions
3. Click a switch at top right corner to enable Developer mode
4. Drag and drop downloaded file to Extensions window

https://github.com/user-attachments/assets/e8937110-f9b6-4c2f-aa64-f9b426cab88b

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
