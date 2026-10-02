export const isSuperAdmin = (user) => {
  return (
    user?.is_superuser === true ||
    user?.role === "super_admin" ||
    user?.role === "superadmin"
  );
};

export const isSubAdmin = (user) => {
  return (
    user?.role === "sub_admin" ||
    user?.role === "subadmin"
  );
};

export const isNormalUser = (user) => {
  return (
    !isSuperAdmin(user) &&
    !isSubAdmin(user)
  );
};