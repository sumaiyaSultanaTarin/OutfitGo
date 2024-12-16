import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/jwt.strategy';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.register({
            secret: 'JWT_SECRET',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [JwtStrategy],
    exports: [JwtModule],
})
export class AuthModule {}
