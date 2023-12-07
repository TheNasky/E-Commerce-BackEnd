import { response } from "../config/utils/response.js";
import UsersService from "../services/usersService.js";

export const createUser = async (req, res) => {
   const { firstName, lastName, email, password } = req.body;
   const service = await UsersService.createUser(firstName, lastName, email, password);
   if (service.status === 201) {
      req.session.user = {
         _id: service.payload.userCreated._id,
         email: service.payload.userCreated.email,
         firstName: service.payload.userCreated.firstName,
         lastName: service.payload.userCreated.lastName,
         // cart: service.payload.userCreated.cart,
         roles: service.payload.userCreated.roles,
      };
      if (service.payload?.vfToken != 0) {
         req.session.user.vfToken = service.payload.vfToken;
         // Send verification email
         // todo: await mailsServices.sendVerificationEmail(service.payload..email, service.payload..vfToken);
      }
   }
   const { payload, ...strippedService } = service;
   return response(res, strippedService);
};

export const loginUser = async (req, res) => {
   const { email, password } = req.body;
   const service = await UsersService.loginUser(email, password);
   console.log(service);
   console.log(service.payload.user);
   if (service.payload.user) {
      req.session.user = {
         _id: service.payload.user._id,
         email: service.payload.user.email,
         firstName: service.payload.user.firstName,
         lastName: service.payload.user.lastName,
         age: service.payload.user.age,
         cart: service.payload.user.cart,
         roles: service.payload.user.roles,
      };
      if (service.payload.vfToken != 0) {
         req.session.user.vfToken = service.payload.vfToken;
      }
   }

   const { payload, ...strippedService } = service;
   return response(res, strippedService);
};

export const logout = (req, res) => {
   req.session.destroy((err) => {
      if (err) {
         return res.status(500).json({ error: "Failed to end session" });
      }
      return res.status(200).json({ success: true, message: "Logged out"});
   });
};

export const getSession = (req, res) => {
   return res.status(200).json(req.session);
};

export const getUsers = async (req, res) => {
   const service = await UsersService.getUsers();
   return response(res, service);
};
export const getUser = async (req, res) => {
   const { id } = req.params;
   const service = await UsersService.getUser(id);
   return response(res, service);
};
export const deleteUser = async (req, res) => {
   const { id } = req.params;
   const service = await UsersService.deleteUser(id);
   return response(res, service);
};

export const updateUser = async (req, res) => {
   const { id } = req.params;
   const updatedProperties = req.body;
   const service = await UsersService.updateUser(id, updatedProperties);
   return response(res, service);
};

export const blockUser = async (req, res) => {
   const { id } = req.params;
   const service = await UsersService.blockUser(id);
   return response(res, service);
};

export const unblockUser = async (req, res) => {
   const { id } = req.params;
   const service = await UsersService.unblockUser(id);
   return response(res, service);
};

export const requestPasswordReset = async (req, res) => {
   const { email } = req.body;
   const service = await UsersService.requestPasswordReset(email);
   req.session.destroy();
   return response(res, service);
};

export const verifyPasswordResetToken = async (req, res) => {
   const { email, resetToken } = req.params;
   const service = await UsersService.verifyPasswordResetToken(email, resetToken);
   req.session.destroy();
   return response(res, service);
};

export const resetPassword = async (req, res) => {
   const { email, resetToken, newPassword } = req.body;
   const service = await UsersService.resetPassword(email, resetToken, newPassword);
   req.session.destroy();
   return response(res, service);
};
