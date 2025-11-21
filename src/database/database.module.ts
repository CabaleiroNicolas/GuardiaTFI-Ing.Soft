import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'PG_POOL',
      useFactory: async () => {
        return new Pool({
          user: 'postgres',        // tu usuario
          host: 'localhost',
          database: 'guardia_tfi',     // tu base de datos
          password: '1234',
          port: 5432,
        });
      },
    },
  ],
  exports: ['PG_POOL'],
})
export class DatabaseModule {}
