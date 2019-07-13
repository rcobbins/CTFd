from marshmallow import fields
from CTFd.schemas.challenges import ChallengeSchema
from CTFd.models import ma, RFP
from CTFd.utils import string_types


class RFPSchema(ma.ModelSchema):
    challenge = fields.Nested(ChallengeSchema, only=["name", "category", "value"])

    class Meta:
        model = RFP
        include_fk = True
        dump_only = ("id",)

    views = {
        "admin": [
            "score",
            "provided",
            "ip",
            "challenge_id",
            "challenge",
            "user",
            "team",
            "date",
            "type",
            "id",
        ],
        "user": ["challenge_id", "challenge", "score", "user", "team", "date", "type", "id"],
    }

    def __init__(self, view=None, *args, **kwargs):
        if view:
            if isinstance(view, string_types):
                kwargs["only"] = self.views[view]
            elif isinstance(view, list):
                kwargs["only"] = view

        super(RFPSchema, self).__init__(*args, **kwargs)
