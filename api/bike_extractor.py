# bike_geometry_extractor.py
#
# Description:
# This script extracts bike geometry data from an image of a manufacturer's chart.
# It uses Google's Gemini multimodal model to directly extract structured data
# from the image, mapping measurement names to standardized field names.
#
# This script is designed to run efficiently and accurately using AI vision.

from PIL import Image
from google import genai
from pydantic import BaseModel

class BikeField(BaseModel):
    value: float | None
    unit: str | None

class BikeSize(BaseModel):
    size: str
    stack: BikeField | None
    reach: BikeField | None
    head_tube: BikeField | None
    head_tube_angle: BikeField | None
    chain_stay: BikeField | None
    actual_seat_tube_angle: BikeField | None
    effective_seat_tube_angle: BikeField | None
    seat_tube: BikeField | None
    bottom_bracket_drop: BikeField | None
    front_center: BikeField | None
    wheel_base: BikeField | None
    fork_axle_to_crown: BikeField | None
    fork_offset: BikeField | None
    fork_travel: BikeField | None
    fork_sag: BikeField | None
    crank_length: BikeField | None
    crank_q_factor: BikeField | None
    spacers: BikeField | None
    stem_length: BikeField | None
    stem_angle: BikeField | None
    seat_offset: BikeField | None
    handlebar_width: BikeField | None
    handlebar_reach: BikeField | None
    handlebar_rise: BikeField | None
    tire_front_width: BikeField | None
    tire_rear_width: BikeField | None
    wheel_front_diameter: BikeField | None
    wheel_rear_diameter: BikeField | None


def extract_bike_geometry_from_image(image_path, max_size=1024):
    """
    Extract bike geometry data from an image using Gemini multimodal model.
    
    Args:
        image_path (str): Path to the bike geometry chart image
        max_size (int): Maximum width/height for image resizing (default: 1024)
    
    Returns:
        list: Array of bike size objects with geometry measurements
    """
    # Initialize Gemini client
    client = genai.Client()
    
    # Load and resize the image for cost effectiveness
    image = Image.open(image_path)
    
    try:
        # Resize image while maintaining aspect ratio
        width, height = image.size
        if width > max_size or height > max_size:
            # Calculate new dimensions
            if width > height:
                new_width = max_size
                new_height = int(height * (max_size / width))
            else:
                new_height = max_size
                new_width = int(width * (max_size / height))
            
            # Resize the image
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
            print(f"Resized image from {width}x{height} to {new_width}x{new_height} for cost optimization")
        else:
            print(f"Image size {width}x{height} is already optimal")
        
        prompt = """
            This image contains a bike geometry chart. Please extract the table and output a JSON array. If a field is not present in the image or the value is missing, set it to null.
            Actual and effective seat tube angle get the same value if a single value is provided for the seat tube angle.
        """

        # Generate content using Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite-preview-06-17",
            contents=[
                prompt,
                image
            ],
            config={
                "response_mime_type": "application/json",
                "response_schema": list[BikeSize],
            },
        )

        return response.text
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return None
    finally:
        # Always close the image to free up memory
        image.close()

def extract_bike_geometry_from_text(text_content, max_size=3000):
    """
    Extract bike geometry data from text content using Gemini.
    
    Args:
        text_content (str): Text content containing bike geometry information
    
    Returns:
        list: Array of bike size objects with geometry measurements
    """
    # Initialize Gemini client
    client = genai.Client()
    
    text_content = text_content.strip()
    text_content = text_content[:max_size]

    prompt = f"""
        This text contains bike geometry information. Please extract the table and output a JSON array. If a field is not present in the text or the value is missing, set it to null.
        Actual and effective seat tube angle get the same value if a single value is provided for the seat tube angle.
        {text_content[:max_size]}
    """

    try:
        print("Extracting bike geometry data from text using Gemini...")
        
        # Generate content using Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite-preview-06-17",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": list[BikeSize],
            },
        )

        return response.text
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return None

if __name__ == "__main__":
    IMAGE_PATH = "geo.png"
    INPUT_TEXT = """
        44	49	52	54	56	58	61
        Longueur manivelles	165mm	165mm	170mm	172.5mm	172.5mm	175mm	175mm
        Largeur de cintre	360mm	380mm	400mm	420mm	420mm	440mm	440mm
        Longueur de potence	70mm	80mm	90mm	100mm	100mm	110mm	110mm
        Largeur de selle	155mm	155mm	155mm	143mm	143mm	143mm	143mm
        Longueur de tige de selle	380mm	380mm	380mm	380mm	380mm	450mm	450mm
        Stack	543mm	549mm	566mm	585mm	605mm	630mm	665mm
        Reach	353mm	363mm	370mm	381mm	389mm	397mm	403mm
        Longueur de douille de direction	90mm	90mm	105mm	122mm	140mm	168mm	202mm
        Angle de direction	69.3°	70.8°	71.5°	72.3°	73°	73°	73.5°
        Boîte de pédalier - sol	269mm	269mm	269mm	270mm	270mm	271mm	271mm
        B-B Drop	80mm	80mm	80mm	78mm	78mm	78mm	78mm
        Chasse	62mm	61mm	57mm	57mm	54mm	76mm	66mm
        Longueur de fourche	375mm	375mm	375mm	375mm	375mm	375mm	375mm
        Déport de fourche	52mm	52mm	52mm	47mm	47mm	47mm	47mm
        Boîte de pédalier – axe roue avant	587mm	593mm	598mm	604mm	620mm	631mm	589mm
        Longueur bases	418mm	418mm	418mm	420mm	420mm	423mm	423mm
        Empattement	994mm	992mm	988mm	1005mm	1012mm	1031mm	1042mm
        Longueur tube horizontal	503mm	523mm	534mm	550mm	569mm	584mm	600mm
        Hauteur cadre à l’entrejambe	686mm	719mm	747mm	766mm	787mm	809mm	847mm
        Longueur de tube de selle	365mm	410mm	445mm	465mm	485mm	505mm	545mm
        Angle de Tube de selle	75°	74°	74°	74°	73.5°	73.5°	73.5°
    """
    
    print("Extracting bike geometry data using Gemini...")
    data_from_image = extract_bike_geometry_from_image(IMAGE_PATH)
    data_from_text = extract_bike_geometry_from_text(INPUT_TEXT)
    
    if data_from_image:
        print("\nExtracted data from image:")
        print(data_from_image)
    else:
        print("Failed to extract data from image.")

    if data_from_text:
        print("\nExtracted data from text:")
        print(data_from_text)
    else:
        print("Failed to extract data from text.")

