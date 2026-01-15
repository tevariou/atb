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
from models import MAX_TEXT_LENGTH, BikeSize
import logging

logger = logging.getLogger("uvicorn.error")


MODEL = "gemini-3-flash-preview"

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
    # The image parameter is already a file-like object, so we don't need to open it again
    pil_image = Image.open(image)
    
    try:
        # Resize image while maintaining aspect ratio
        width, height = pil_image.size
        if width > max_size or height > max_size:
            # Calculate new dimensions
            if width > height:
                new_width = max_size
                new_height = int(height * (max_size / width))
            else:
                new_height = max_size
                new_width = int(width * (max_size / height))
            
            # Resize the image
            resized_image = pil_image.resize((new_width, new_height), Image.Resampling.LANCZOS)
            logger.info(f"Resized image from {width}x{height} to {new_width}x{new_height} for cost optimization")
        else:
            resized_image = pil_image
            logger.info(f"Image size {width}x{height} is already optimal")
        
        prompt = """
            This image contains a bike geometry chart. Please extract the table and output a JSON array of bike size objects.
            If a field is not present in the image or the value is missing, set it to null.
            Actual and effective seat tube angle get the same value if a single value is provided for the seat tube angle.
        """

        # Generate content using Gemini
        response = await client.aio.models.generate_content(
            model=MODEL,
            contents=[
                prompt,
                resized_image
            ],
            config={
                "response_mime_type": "application/json",
                "response_schema": list[BikeSize],
            },
        )

        # Ensure we return proper Pydantic models
        return response.parsed
        
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        return None
    finally:
        # Always close the image to free up memory
        pil_image.close()

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
        This text contains bike geometry information. Please extract the table and output a JSON array of bike size objects.
        If a field is not present in the text or the value is missing, set it to null.

        Some information about the bike geometry:
        Actual and effective seat tube angle get the same value if a single value is provided for the seat tube angle. 
        
        Text content:
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
