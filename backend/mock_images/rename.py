import os

# Small file to rename all images in a directory to use numbers, move this inside
# the directory where the renaming needs to be done

for root, dirs, files in os.walk("."):
    files = [file for file in files if not file.endswith(".py")]
    for i, name in enumerate(files):
        extension = name.split(".")[-1]
        or_path = os.path.join(root, name)
        ne_path = os.path.join(root, str(i)) + "." + extension
        os.rename(or_path, ne_path)
