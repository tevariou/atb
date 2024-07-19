from decimal import Decimal
from django.db import models
from django.core import validators
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User


class AngleField(models.DecimalField):
    def __init__(
        self,
        verbose_name=None,
        name=None,
        max_digits=None,
        decimal_places=None,
        **kwargs,
    ) -> None:
        kwargs["validators"] = [validators.MinValueValidator(Decimal(0.01)), validators.MaxValueValidator(Decimal(89.99))]
        super().__init__(
            verbose_name,
            name,
            max_digits=4 if max_digits is None else max_digits,
            decimal_places=2 if decimal_places is None else decimal_places,
            **kwargs
        )


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Component(models.Model):
    class StatusChoices(models.TextChoices):
        WAITING_APPROVAL = ("waiting_approval", "Waiting approval")
        APPROVED = ("approved", "Approved") 
        REJECTED = ("rejected", "Rejected")

    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    model = models.CharField(max_length=100, blank=True)
    gtin = models.PositiveBigIntegerField(null=True, unique=True, validators=[validators.MaxValueValidator(10**14-1)])
    mpn = models.CharField(max_length=100, null=True)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    is_public = models.BooleanField(default=False)
    status = models.TextField(
        choices=StatusChoices.choices, default=StatusChoices.WAITING_APPROVAL
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        constraints = [
            models.UniqueConstraint(fields=["brand", "mpn"], name="%(app_label)s_%(class)s_unique_brand_mpn"),
        ]


class Saddle(Component):
    stack_height = models.PositiveSmallIntegerField()
    offset = models.PositiveSmallIntegerField()


class Seatpost(Component):
    length = models.PositiveSmallIntegerField()
    offset = models.PositiveSmallIntegerField()


class Crank(Component):
    length = models.PositiveSmallIntegerField()
    q_factor = models.PositiveSmallIntegerField()


class Pedal(Component):
    stack_height = models.PositiveSmallIntegerField()
    crank_to_pedal_center = models.PositiveSmallIntegerField()


class Tire(Component):
    diameter = models.PositiveSmallIntegerField()
    width = models.PositiveSmallIntegerField()


class Wheel(Component):
    diameter = models.PositiveSmallIntegerField()


class Chainring(Component):
    gears = ArrayField(models.PositiveSmallIntegerField())


class Cassette(Component):
    gears = ArrayField(models.PositiveSmallIntegerField())


class Stem(Component):
    length = models.PositiveSmallIntegerField()
    angle = AngleField()
    stack_height = models.PositiveSmallIntegerField()


class ExternalHeadsetUpperCup(Component):
    stack_height = models.PositiveSmallIntegerField()


class ExternalHeadsetLowerCup(Component):
    stack_height = models.PositiveSmallIntegerField()


class Handlebar(Component):
    width = models.PositiveSmallIntegerField()
    rise = models.PositiveSmallIntegerField()
    reach = models.PositiveSmallIntegerField()


class Frame(Component):
    reach = models.PositiveSmallIntegerField()
    stack = models.PositiveSmallIntegerField()
    chainstay = models.PositiveSmallIntegerField()
    head_tube = models.PositiveSmallIntegerField()
    head_tube_angle = AngleField()
    actual_seat_tube_angle = AngleField()
    effective_seat_tube_angle = AngleField()
    seat_tube = models.PositiveSmallIntegerField()
    bb_drop = models.PositiveSmallIntegerField()


class Rider(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    inseam = models.PositiveSmallIntegerField()
    upper_leg = models.PositiveSmallIntegerField()
    foot = models.PositiveSmallIntegerField()
    arm = models.PositiveSmallIntegerField()
    spine = models.PositiveSmallIntegerField()


class Fork(Component):
    offset = models.PositiveSmallIntegerField()
    crown_to_axle = models.PositiveSmallIntegerField()


class Bike(Component):
    frame = models.ForeignKey(Frame, on_delete=models.SET_NULL, null=True)
    fork = models.ForeignKey(Fork, on_delete=models.SET_NULL, null=True)
    Handlebar = models.ForeignKey(Handlebar, on_delete=models.SET_NULL, null=True)
    external_headset_upper_cup = models.ForeignKey(ExternalHeadsetUpperCup, on_delete=models.SET_NULL, null=True)
    external_headset_lower_cup = models.ForeignKey(ExternalHeadsetLowerCup, on_delete=models.SET_NULL, null=True)
    stem = models.ForeignKey(Stem, on_delete=models.SET_NULL, null=True)
    chainring = models.ForeignKey(Chainring, on_delete=models.SET_NULL, null=True)
    cassette = models.ForeignKey(Cassette, on_delete=models.SET_NULL, null=True)
    front_tire = models.ForeignKey(Tire, on_delete=models.SET_NULL, null=True, related_name="front_tire")
    front_wheel = models.ForeignKey(Wheel, on_delete=models.SET_NULL, null=True, related_name="front_wheel")
    rear_tire = models.ForeignKey(Tire, on_delete=models.SET_NULL, null=True, related_name="rear_tire")
    rear_wheel = models.ForeignKey(Wheel, on_delete=models.SET_NULL, null=True, related_name="rear_wheel")

    front_center = models.PositiveSmallIntegerField(blank=True, default=0)
    wheelbase = models.PositiveSmallIntegerField(blank=True, default=0)
    spacers = models.PositiveSmallIntegerField(blank=True, default=0)
