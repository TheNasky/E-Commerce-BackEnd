export function isLoggedIn(req, res, next) {
   if (req.session?.user) {
      return next();
   }
   return res.status(403).json({
      success: false,
      code: "UNAUTHORIZED",
      message: "You must log in to access this resource.",
   });
}
export function isAdmin(req, res, next) {
   if (req.session?.user?.roles?.includes("Admin")) {
      return next();
   }
   return res.status(403).json({
      success: false,
      code: "UNAUTHORIZED",
      message: "You do not have permission to access this resource.",
   });
}
