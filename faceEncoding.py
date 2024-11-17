import os
import cv2
import face_recognition
import pickle

# Directory containing the images
def faceEncode(imgae_dir,output_file):

    image_directory = imgae_dir

    # Dictionary to store face encodings with corresponding image IDs
    face_encodings_dict = {}

    # Loop through all files in the image directory
    for filename in os.listdir(image_directory):
        # Check if the file is a JPEG image (can modify if other formats are used)
        if filename.endswith(".jpg") or filename.endswith(".jpeg") or filename.endswith(".png"):
            image_id = os.path.splitext(filename)[0]  # Extract the image ID (without extension)
            image_path = os.path.join(image_directory, filename)
            
            # Load the image using OpenCV
            image = cv2.imread(image_path)
            
            # Convert the image from BGR (OpenCV format) to RGB (required by face_recognition)
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Find all face locations in the image
            face_locations = face_recognition.face_locations(rgb_image)
            
            # Compute the face encodings for the found face(s)
            face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
            
            if face_encodings:
                # Store the first face encoding with the image ID
                face_encodings_dict[image_id] = face_encodings[0]
                print(f"Processed {filename} successfully!")
            else:
                print(f"No faces found in {filename}")

    # Save the encodings to a file (using pickle for serialization)
    with open(output_file, 'wb') as f:
        pickle.dump(face_encodings_dict, f)
    # print(face_encodings_dict)
    print(f"Face encodings saved to {output_file}")
