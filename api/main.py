from typing import Annotated

from fastapi import FastAPI, UploadFile, Query
from bike_extractor import (
    extract_bike_geometry_from_image,
    extract_bike_geometry_from_text,
)
from cache import async_cache, MAX_TEXT_LENGTH

app = FastAPI()


@app.post("/bike-geometry/image/")
@async_cache
async def bike_geometry_from_image(image: UploadFile):
    return await extract_bike_geometry_from_image(image.file) or []


@app.post("/bike-geometry/text/")
@async_cache
async def bike_geometry_from_text(
    text: Annotated[str | None, Query(max_length=MAX_TEXT_LENGTH)],
):
    return await extract_bike_geometry_from_text(text) or []
