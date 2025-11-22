import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'PG_POOL',
      useFactory: async () => {
        return new Pool({
          user: 'test',
          host: 'localhost',
          database: 'guardia_bd',
          password: 'test',
          port: 5432,
        });
      },
    },
  ],
  exports: ['PG_POOL'],
})
export class DatabaseModule {}
