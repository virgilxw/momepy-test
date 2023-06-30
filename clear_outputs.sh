#!/bin/bash

# Get the directory path of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Set the notebook directory to the location of the script
NOTEBOOK_DIR="$SCRIPT_DIR"

# Function to recursively search for IPython Notebook files and clear their outputs
function clear_outputs() {
    local dir="$1"
    for file in "$dir"/*; do
        if [[ -d "$file" ]]; then
            # Recurse into subdirectories
            clear_outputs "$file"
        elif [[ -f "$file" && "${file##*.}" == "ipynb" ]]; then
            # Check if the file is ignored
            if ! git check-ignore -q "$file"; then
                # Clear the outputs of non-ignored IPython Notebook files
                jupyter nbconvert --ClearOutputPreprocessor.enabled=True --inplace "$file"
            fi
        fi
    done
}

# Change to the specified directory
cd "$NOTEBOOK_DIR" || exit

# Call the function to clear outputs recursively
clear_outputs .