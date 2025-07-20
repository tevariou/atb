from typing import Annotated

from fastapi import FastAPI, UploadFile
from bike_extractor import (
    extract_bike_geometry_from_image,
    extract_bike_geometry_from_text,
)
from cache import async_cache
from fastapi.middleware.cors import CORSMiddleware
from models import BikeGeometryTextRequest, BikeSize
from fastapi.encoders import jsonable_encoder



app = FastAPI()

origins = [
    "https://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.post("/bike-geometry/image/")
@async_cache
async def bike_geometry_from_image(image: UploadFile) -> list[BikeSize]:
    result = await extract_bike_geometry_from_image(image.file)
    return jsonable_encoder(result) if result is not None else []


@app.post("/bike-geometry/text/")
@async_cache
async def bike_geometry_from_text(request: BikeGeometryTextRequest) -> list[BikeSize]:
    result = await extract_bike_geometry_from_text(request.text)
    return jsonable_encoder(result) if result is not None else []
