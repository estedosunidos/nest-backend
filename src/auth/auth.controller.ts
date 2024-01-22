import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto,UpdateAuthDto,LoginDto, ReGISTERAuthDto } from './dto/index';
import { AuthGuard } from './guards/auth/auth.guard';
import { Auth } from './entities/auth.entity';
import { LoginResponse } from './interfaces/login-response';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  login(@Body() LoginDto:LoginDto){
    return this.authService.login(LoginDto)
  }
  @Post('/register')
  registe(@Body() RegistreDTO:ReGISTERAuthDto){
    return this.authService.registe(RegistreDTO)
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll( @Request() eq:Request) {
    const auth=eq['Auth']
    return auth
  }
  @UseGuards(AuthGuard)
  @Get('/check-token')
  checkToken(@Request() req:Request):LoginResponse{
    const auth=req['Auth'] as Auth
    console.log(auth)
    return{
      auth:auth,
      token:this.authService.getJwt({id:auth._id})

    }



  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
