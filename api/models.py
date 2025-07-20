from pydantic import BaseModel, Field
from enum import Enum

MAX_TEXT_LENGTH = 3000

class BikeGeometryTextRequest(BaseModel):
    text: str = Field(..., max_length=MAX_TEXT_LENGTH)

class Unit(str, Enum):
    cm = "cm"
    mm = "mm"
    deg = "deg"

class BikeField(BaseModel):
    value: float | None
    unit: Unit | None

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
