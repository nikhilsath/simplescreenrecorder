from PIL import Image
import os

# Open the original image
image_path = "alarm-clock.png"
image = Image.open(image_path)

# Define the sizes you need
sizes = {
    "16": (16, 16),
    "32": (32, 32),
    "48": (48, 48),
    "128": (128, 128)
}

# Create a directory for the icons if it doesn't exist
if not os.path.exists('icons'):
    os.makedirs('icons')

# Convert and save the images in the required sizes
for size_name, size in sizes.items():
    resized_image = image.resize(size, Image.LANCZOS)  # Use LANCZOS instead of ANTIALIAS
    resized_image.save(f"icons/icon{size_name}.png")

print("Icons have been created successfully.")
