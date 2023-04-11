import openai
import nbformat
from nbformat.v4 import output, new_output, new_notebook, new_code_cell
from openai.api_key import API_KEY
import os

print(os.environ['HOME'])

openai.api_key = API_KEY

def annotate_notebook(notebook_path):
    # Load the notebook from the specified file path
    with open(notebook_path, "r") as f:
        nb = nbformat.read(f, as_version=4)

    # Loop through each code cell in the notebook
    for cell in nb.cells:
        if cell.cell_type == "code":
            # Extract the code from the cell
            code = cell.source

            # Submit the code to GPT-3 for annotation
            prompt = "annotate this python code without changing anything not in comments\n" + code
            response = openai.Completion.create(
                engine="davinci-codex",
                prompt=prompt,
                max_tokens=1024,
                n=1,
                stop=None,
                temperature=0.7,
            )

            # Extract the annotated code from the GPT-3 response
            annotated_code = response.choices[0].text.strip()

            # Replace the original code in the cell with the annotated code
            cell.source = annotated_code

            # Clear the output of the cell
            cell.outputs = []

    # Write the annotated notebook to a new file
    new_nb = new_notebook(cells=nb.cells)
    with open("annotated_" + notebook_path, "w") as f:
        nbformat.write(new_nb, f)

# Example usage:
annotate_notebook("example_notebook.ipynb")