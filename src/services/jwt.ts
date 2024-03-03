import { User } from "@prisma/client";
import { prismaClient } from "../clients";
import JWT from 'jsonwebtoken';
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
const JWT_SECRET=process.env.JWT_SECRET;
export class JWTService {
    public static  generateTokenForUser(user:User){
        const payload={
            id:user?.id,
            email:user?.email,
        };
        const token=JWT.sign(payload,JWT_SECRET);
        return token;
    }

}