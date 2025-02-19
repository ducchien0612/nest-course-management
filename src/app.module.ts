// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Kết nối MongoDB
    MongooseModule.forRoot(process.env.MONGO_URI || ""),
    // MongooseModule.forRoot((process.env.MONGO_URI || ""), {
    //   connectionName: 'course-management',
    // }),
    // // Kết nối MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || ""),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      autoLoadEntities: true,
      synchronize: true, 
    }),
    UsersModule,
    CoursesModule,
    AuthModule,
    EnrollmentsModule,
  ],
})
export class AppModule {}
