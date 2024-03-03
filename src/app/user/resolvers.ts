import axios from 'axios'
import { prismaClient } from '../../clients';
import { JWTService } from '../../services/jwt';
interface GoogleTokenResult {
    iss?:string;
    nbf?:string;
    aus?:string;
    sub?:string;
    email?:string;
    email_verified?:string;
    azp?:string;
    name?:string;
    picture?:string;
    given_name?:string;
    family_name?:string;
    iat?:string;
    exp?:string;
    jti?:string;
    alg?:string;
    kid?:string;
    typ?:string;
}


const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
      const googleToken = token;
      const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
      googleOauthURL.searchParams.set('id_token', googleToken);
  
      try {
        const { data } = await axios.get(googleOauthURL.toString(), {
          responseType: 'json',
        });
  
        console.log(data);
  
        const user = await prismaClient.user.findUnique({
          where: { email: data.email },
        });
  
        if (!user) {
          await prismaClient.user.create({
            data: {
              email: data.email,
              firstname: data.given_name,
              lastname: data.family_name,
              profileImageURL: data.picture,
            },
          });
        }
  
        // Note the addition of `await` here
        const dbUser = await prismaClient.user.findUnique({
          where: { email: data.email },
        });
  
        if (!dbUser) throw new Error("Email not found");
  
        const userToken = JWTService.generateTokenForUser(dbUser);
  
        // Return or do something with userToken
        return { userToken };
      } catch (error) {
        console.error('Error during token verification:', error);
        throw new Error('Error during token verification');
      }
    },
  };
  



export const resolvers={queries};