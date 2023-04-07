class PermissionsByActionMixin:
    """
    Mixin that allows configuring permission classes for specific actions. To
    use this, define a `permission_classes_by_action` field on your class, with
    keys corresponding to the various actions. If the specified action is
    defined in the dictionary, it will use that value as the list of permission
    classes instead. Otherwise, the default `permission_classes` field is used.

    To ensure security, the default `permission_classes` value should be as
    strict as possible, with lower requirements for security defined in
    `permission_classes_by_action`.
    """

    def get_permissions(self):
        if self.action not in self.permission_classes_by_action:
            return [perm() for perm in self.permission_classes]

        return [perm() for perm in self.permission_classes_by_action[self.action]]
