FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project

ADD . /app

WORKDIR /app

# Sync the project
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked

CMD ["uv", "run", "uvicorn", "main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
