import os
import subprocess

current_directory = os.getcwd()

for file in os.listdir(current_directory):
    if file.endswith(".ipynb"):
        subprocess.check_call(['jupyter', 'nbconvert', '--clear-output', '--inplace', file], cwd=current_directory)