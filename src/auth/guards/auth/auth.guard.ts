import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { jwtPayload } from 'src/auth/interfaces/jwt.payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService:JwtService , private authservice:AuthService){

  }
   async canActivate(context: ExecutionContext,): Promise<boolean> {
    const request=context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if(!token){
      throw new UnauthorizedException('There is no beaer token available')
    }
    try{
      const payload= this.jwtService.verifyAsync<jwtPayload>(
        token,{secret:process.env.JWT_SECRET}
      )
      const auth = await this.authservice.findUserById((await payload).id)
      if(!auth) throw new UnauthorizedException('User does not exist')
      if(!auth.isActive) throw new UnauthorizedException('User  is not active')
      request['Auth']=auth

    }catch(err){
      throw new UnauthorizedException()
     
    }
    return true

    }
    private extractTokenFromHeader(request:Request):string | undefined{
      const [type,token]=request.headers['authorization']?.split(' ') ?? [];
      return type === 'Bearer' ? token:undefined;
  
    }

  } 