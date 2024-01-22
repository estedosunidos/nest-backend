import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './entities/auth.entity';
import { Model } from 'mongoose';
import * as bcryptjs from'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './interfaces/jwt.payload';
import { LoginResponse } from './interfaces/login-response';
import { ReGISTERAuthDto,CreateAuthDto,UpdateAuthDto,LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>, private jwt:JwtService) {}

  async create(createAuthDto: CreateAuthDto)  {
    try {
      const { password, ...AuthData } = createAuthDto
        //1 -ENcriptar la contraseña
       const createdAuth = new this.authModel({
       ...AuthData,
          password: bcryptjs.hashSync(password, 10),
        });
           //2- Guardar ek usuario
        await createdAuth.save();
        return(
          {
            statusCode: HttpStatus.CREATED,
            message: 'Usuario creado correctamente',
            data: createdAuth,
          }
        )
      
    } catch (error) {
      if(error.code ===1100){
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Email already exists',
        }, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Something went wrong',
      }, HttpStatus.BAD_REQUEST);
      
    }
    //3- Genera jwt
    // const createdAuth = new this.authModel(createAuthDto);
    // return createdAuth.save();
  }
  async login(LoginDto: LoginDto):Promise<LoginResponse> {
    // Desestructura el objeto DTO para obtener el email y la contraseña
    const { email, password } = LoginDto;
  
    // Encuentra el usuario en la base de datos
    const Auth = await this.authModel.findOne({ email });
  
    // Verifica si el usuario existe
    if (!Auth) {
      throw new UnauthorizedException('Invalid credentials - email');
    }
  
    // Compara la contraseña ingresada con la almacenada en la base de datos
    const isPasswordValid = bcryptjs.compareSync(password, Auth.password);
  
    // Verifica si la contraseña es válida
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials - password');
    }
  
    // Extrae la propiedad 'password' del objeto usuario (evita enviarla al cliente)
    const { password:_, ...rest } = Auth.toJSON();
  
    // Retorna el usuario (sin la contraseña) y el token JWT
    return {
      auth: Auth,
      token:this.getJwt({id:Auth.id})
    };
  }
  async registe(ReGISTERAuthDto:ReGISTERAuthDto):Promise<LoginResponse>{
   console.log("ww")
    const Auth=await this.create(ReGISTERAuthDto)
    console.log({Auth})
    return {
      auth:Auth.data,
      token:this.getJwt({id:Auth.data.id})
    }

  }
  
  findAll():Promise<Auth[]> {
    return this.authModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  getJwt(payload:jwtPayload){
    const token = this.jwt.sign(payload)
    return token

  }
  findUserById(id:string){
    const auth=this.authModel.findById(id)
    console.log(auth)
    return auth
  

  }
}
