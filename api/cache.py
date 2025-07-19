from functools import wraps
from PIL import Image
import hashlib
import aioredis
from pydantic import BaseSettings
import logging
import json
from fastapi import UploadFile
import os

logger = logging.getLogger("uvicorn.error")

# Maximum length for text input when generating cache keys
MAX_TEXT_LENGTH = 3000


class Config(BaseSettings):
    # The default URL expects the app to run using Docker and docker-compose.
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")


config = Config()

redis = aioredis.from_url(config.redis_url)


def async_cache(func):
    @wraps(func)
    async def async_wrapper(*args, **kwargs):
        key = None
        if isinstance(args[0], UploadFile):
            try:
                image = Image.open(args[0].file)
                key = hashlib.md5(image.tobytes()).hexdigest()
                image.close()
            except Exception as e:
                logger.error(f"Error opening image: {e}")
        elif isinstance(args[0], str):
            key = hashlib.md5(args[0][:MAX_TEXT_LENGTH].strip().encode()).hexdigest()

        if key is not None:
            cached_result = await redis.get(key)
            if cached_result is not None:
                logger.info(f"Cache hit for key: {key}")
                try:
                    return json.loads(cached_result.decode("utf-8"))
                except (json.JSONDecodeError, UnicodeDecodeError) as e:
                    logger.error(f"Error deserializing cached result: {e}")
                    # If deserialization fails, continue to execute the function

        result = await func(*args, **kwargs)
        if result is not None and key is not None:
            try:
                json_result = json.dumps(result)
                await redis.set(key, json_result)
            except (TypeError, ValueError) as e:
                logger.error(f"Error serializing result to JSON: {e}")
        return result

    return async_wrapper
