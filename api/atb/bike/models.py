from decimal import Decimal

from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.core import validators
from django.db import models


class AngleField(models.DecimalField):
    def __init__(
        self,
        verbose_name=None,
        name=None,
        max_digits=None,
        decimal_places=None,
        **kwargs,
    ) -> None:
        kwargs["validators"] = [
            validators.MinValueValidator(Decimal(0)),
            validators.MaxValueValidator(Decimal(90)),
        ]
        super().__init__(
            verbose_name,
            name,
            max_digits=4 if max_digits is None else max_digits,
            decimal_places=2 if decimal_places is None else decimal_places,
            **kwargs,
        )


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Component(models.Model):
    class StatusChoices(models.TextChoices):
        PRIVATE = ("private", "Private")
        PUBLIC = ("public", "Public")
        AWAITING_APPROVAL = ("awaiting_approval", "Awaiting approval")
        PUBLISHED = ("published", "Published")
        REJECTED = ("rejected", "Rejected")

    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    model = models.CharField(max_length=100, blank=True)
    size = models.CharField(max_length=100, blank=True)
    gtin = models.PositiveBigIntegerField(
        null=True, unique=True, validators=[validators.MaxValueValidator(10**14 - 1)]
    )
    mpn = models.CharField(max_length=100, null=True)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.TextField(
        choices=StatusChoices.choices, default=StatusChoices.PRIVATE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        constraints = [
            models.UniqueConstraint(
                fields=["brand", "mpn", "size"],
                name="%(app_label)s_%(class)s_unique_brand_mpn_size",
            ),
        ]
        ordering = ["-updated_at"]


class Rider(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    inseam = models.PositiveSmallIntegerField()
    upper_leg = models.PositiveSmallIntegerField()
    foot = models.PositiveSmallIntegerField()
    arm = models.PositiveSmallIntegerField()
    spine = models.PositiveSmallIntegerField()


class Pedal(Component):
    stack_height = models.PositiveSmallIntegerField()
    pedal_center = models.PositiveSmallIntegerField()


class Cassette(Component):
    gears = ArrayField(models.PositiveSmallIntegerField())


class Bike(Component):
    cassette = models.ForeignKey(Cassette, on_delete=models.SET_NULL, null=True)
    pedal = models.ForeignKey(Pedal, on_delete=models.SET_NULL, null=True)

    front_center = models.PositiveSmallIntegerField(blank=True, default=0)
    wheelbase = models.PositiveSmallIntegerField(blank=True, default=0)
    spacers = models.PositiveSmallIntegerField(blank=True, default=0)
    max_front_wheel_diameter = models.PositiveSmallIntegerField(default=0)
    max_rear_wheel_diameter = models.PositiveSmallIntegerField(default=0)


class Handlebar(models.Model):
    bike = models.OneToOneField(
        Bike, on_delete=models.CASCADE, related_name="handlebar"
    )
    width = models.PositiveSmallIntegerField()
    rise = models.PositiveSmallIntegerField()
    reach = models.PositiveSmallIntegerField()
    backsweep = AngleField()
    upsweep = AngleField()
    drop_flare = AngleField()
    drop_flare_out = AngleField()
    drop_width = models.PositiveSmallIntegerField()


class ExternalHeadset(models.Model):
    bike = models.OneToOneField(
        Bike, on_delete=models.CASCADE, related_name="external_headset"
    )
    upper_cup_stack_height = models.PositiveSmallIntegerField()
    lower_cup_stack_height = models.PositiveSmallIntegerField()


class Frame(models.Model):
    bike = models.OneToOneField(Bike, on_delete=models.CASCADE, related_name="frame")
    reach = models.PositiveSmallIntegerField()
    stack = models.PositiveSmallIntegerField()
    chainstay = models.PositiveSmallIntegerField()
    head_tube = models.PositiveSmallIntegerField()
    head_tube_angle = AngleField()
    actual_seat_tube_angle = AngleField()
    effective_seat_tube_angle = AngleField()
    seat_tube = models.PositiveSmallIntegerField()
    bb_drop = models.PositiveSmallIntegerField()


class Fork(models.Model):
    bike = models.OneToOneField(Bike, on_delete=models.CASCADE, related_name="fork")
    offset = models.PositiveSmallIntegerField()
    crown_to_axle = models.PositiveSmallIntegerField()
    steerer_tube = models.PositiveSmallIntegerField()
    travel = models.PositiveSmallIntegerField()


class Saddle(models.Model):
    bike = models.OneToOneField(Bike, on_delete=models.CASCADE, related_name="saddle")
    offset = models.PositiveSmallIntegerField()


class Seatpost(models.Model):
    bike = models.OneToOneField(Bike, on_delete=models.CASCADE, related_name="seatpost")
    length = models.PositiveSmallIntegerField()
    offset = models.PositiveSmallIntegerField()


class Crank(models.Model):
    bike = models.OneToOneField(Bike, on_delete=models.CASCADE, related_name="crank")
    length = models.PositiveSmallIntegerField()
    q_factor = models.PositiveSmallIntegerField()


class TireSet(models.Model):
    bike = models.OneToOneField(Bike, on_delete=models.CASCADE, related_name="tireset")
    front_diameter = models.PositiveSmallIntegerField()
    front_width = models.PositiveSmallIntegerField()
    rear_diameter = models.PositiveSmallIntegerField()
    rear_width = models.PositiveSmallIntegerField()


class WheelSet(models.Model):
    bike = models.OneToOneField(Bike, on_delete=models.CASCADE, related_name="wheelset")
    front_diameter = models.PositiveSmallIntegerField()
    rear_diameter = models.PositiveSmallIntegerField()


class Chainring(models.Model):
    bike = models.OneToOneField(
        Bike, on_delete=models.CASCADE, related_name="chainring"
    )
    gears = ArrayField(models.PositiveSmallIntegerField())


class Stem(models.Model):
    bike = models.OneToOneField(Bike, on_delete=models.CASCADE, related_name="stem")
    length = models.PositiveSmallIntegerField()
    angle = AngleField()
    steerer_height = models.PositiveSmallIntegerField()
