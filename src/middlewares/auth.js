export function isUser(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   return res.status(401).json({
      code: "UNAUTHENTICATED",
      message: "Failed Authentication",
   });
}

export function isAdmin(req, res, next) {
   if (req.session?.user?.roles?.includes("Admin")) {
      return next();
   }
   return res.status(403).json({
      code: "UNAUTHORIZED",
      message: "You do not have permission to access this resource.",
   });
}

export function isCartOwner(req, res, next) {
   if (req.session?.user?.cart == req.params.cid) {
      return next();
   }
   return res.status(403).json({
      code: "UNAUTHORIZED",
      message: "You do not have permission to access this resource.",
   });
}
