from typing import Annotated

from fastapi import FastAPI, UploadFile, Query
from bike_extractor import extract_bike_geometry_from_image, extract_bike_geometry_from_text
from cache import async_cache

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/bike-geometry/image/")
@async_cache
async def bike_geometry_from_image(image: UploadFile):
    return await extract_bike_geometry_from_image(image.file)

@app.post("/bike-geometry/text/")
@async_cache
async def bike_geometry_from_text(text: Annotated[str | None, Query(max_length=3000)]):
    return await extract_bike_geometry_from_text(text)
