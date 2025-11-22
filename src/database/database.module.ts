import { Module, Global, OnApplicationBootstrap, Inject, Logger } from '@nestjs/common';
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
          database: 'guardia_db',
          password: 'test',
          port: 5432,
        });
      },
    },
  ],
  exports: ['PG_POOL'],
})

export class DatabaseModule implements OnApplicationBootstrap {

  constructor(@Inject('PG_POOL') private pool: Pool) {}

  private readonly logger = new Logger(DatabaseModule.name);
  
  async onApplicationBootstrap() {

    this.logger.log('Iniciando verificación de conexión a PostgreSQL...');
    try {
      const result = await this.pool.query('SELECT current_database()');
      this.logger.log(
        `✅ Conexión a PostgreSQL verificada. Conectado a: ${result.rows[0].current_database}`,
      );

    } catch (error) {
      this.logger.error(
        '❌ ERROR CRÍTICO: Fallo al conectar con PostgreSQL.',
        error.message,
      );
     
      process.exit(1);
    }
  }
}
