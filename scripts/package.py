#!/usr/bin/python3

import os
from pathlib import Path
import re
import shutil
import subprocess

project_dir = Path(__file__).parent.parent
artifacts_dir = project_dir / 'web-ext-artifacts'
dist_dir = project_dir / 'dist'


def get_file_version(filename):
    pattern = r'jam_player-([0-9]+.[0-9]+.[0-9]+).zip'
    res = re.match(pattern, filename)
    if not res:
        return
    version = res.group(1)
    return version


def move_output(suffix):
    for filename in os.listdir(artifacts_dir):
        full_path = os.path.join(artifacts_dir, filename)
        if os.path.isfile(full_path):
            version = get_file_version(filename)
            if not version:
                continue
            new_path = artifacts_dir / f'jam_player-{version}-{suffix}.zip'
            shutil.move(full_path, new_path)


shutil.rmtree(dist_dir, ignore_errors=True)
subprocess.run(['pnpm', 'package:firefox'], check=True)
move_output('firefox')
shutil.rmtree(dist_dir, ignore_errors=True)
subprocess.run(['pnpm', 'package:chrome'], check=True)
move_output('chrome')
