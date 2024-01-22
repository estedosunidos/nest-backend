import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [AuthModule,ConfigModule.forRoot(),MongooseModule.forRoot('mongodb://127.0.0.1:27017/mean-db')],
  controllers: [],
  providers: [AppService],
})
export class AppModule {
  
}
