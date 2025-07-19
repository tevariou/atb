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
from cache import MAX_TEXT_LENGTH
import logging

logger = logging.getLogger("uvicorn.error")

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

MODEL = "gemini-2.5-flash-lite-preview-06-17"

async def extract_bike_geometry_from_image(image, max_size=768):
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
    image = Image.open(image)
    
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
            logger.info(f"Resized image from {width}x{height} to {new_width}x{new_height} for cost optimization")
        else:
            logger.info(f"Image size {width}x{height} is already optimal")
        
        prompt = """
            This image contains a bike geometry chart. Please extract the table and output a JSON array. If a field is not present in the image or the value is missing, set it to null.
            Actual and effective seat tube angle get the same value if a single value is provided for the seat tube angle.
        """

        # Generate content using Gemini
        response = await client.aio.models.generate_content(
            model=MODEL,
            contents=[
                prompt,
                image
            ],
            config={
                "response_mime_type": "application/json",
                "response_schema": list[BikeSize],
            },
        )

        return response.parsed
        
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        return None
    finally:
        # Always close the image to free up memory
        image.close()

async def extract_bike_geometry_from_text(text_content, max_size=MAX_TEXT_LENGTH):
    """
    Extract bike geometry data from text content using Gemini.
    
    Args:
        text_content (str): Text content containing bike geometry information
        max_size (int): Maximum size of the text content to process (default: MAX_TEXT_LENGTH)
    
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
        logger.info("Extracting bike geometry data from text using Gemini...")
        
        # Generate content using Gemini
        response = await client.aio.models.generate_content(
            model=MODEL,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": list[BikeSize],
            },
        )

        return response.parsed
        
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        return None
