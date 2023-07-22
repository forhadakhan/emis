# academy/validators

from django.core.exceptions import ValidationError

class Marksheet:
    def validate_attendance(value):
        if value > 10:
            raise ValidationError("Attendance cannot exceed 10.")

    def validate_assignment(value):
        if value > 20:
            raise ValidationError("Assignment score cannot exceed 20.")

    def validate_mid_term(value):
        if value > 30:
            raise ValidationError("Mid-term score cannot exceed 30.")

    def validate_final(value):
        if value > 40:
            raise ValidationError("Final score cannot exceed 40.")
