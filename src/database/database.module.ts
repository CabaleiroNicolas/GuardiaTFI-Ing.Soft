import { Module, Global, OnApplicationBootstrap, Inject, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'PG_POOL',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return new Pool({
          user: configService.get<string>('DB_USER') || 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          database: configService.get<string>('DB_NAME') || 'guardia_db',
          password: configService.get<string>('DB_PASSWORD') || 'test',
          port: configService.get<number>('DB_PORT') || 5432,
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

      await this.executeInitScript();

    } catch (error) {
      this.logger.error(
        '❌ ERROR CRÍTICO: Fallo al conectar con PostgreSQL.',
        error.message,
      );
     
      process.exit(1);
    }
  }

  private async executeInitScript() {

    const initScriptPath = path.resolve(__dirname, '..', '..', 'dist', 'database', 'schema', '000_schema_inicial.sql');
    
    let sqlScript: string;
    try {
        sqlScript = fs.readFileSync(initScriptPath, 'utf8');

    } catch (readError) {
        this.logger.warn(`⚠️ Archivo SQL inicial no encontrado en ${initScriptPath}. Saltando inicialización.`);
        // No salimos si no se encuentra el archivo, ya que puede ser opcional
        return; 
    }

    //Ejecutar todas las sentencias del script
    // Usamos pool.query() que maneja scripts multilínea en pg
    await this.pool.query(sqlScript);
    this.logger.log('✨ Script de inicialización ejecutado satisfactoriamente.');
  }
}
