// Esta clase se encarga de levantar el contexto de NestJS para que se puedan usar los modulos y servicios en los STEPS

import { BeforeAll, AfterAll, Before } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export let app: INestApplication;
//let dataSource: DataSource;

BeforeAll(async () => {
    
  // Carga variables de entorno de test
  process.env.NODE_ENV = 'test';

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();

  //dataSource = app.get(DataSource);
});

/* // Limpiar DB antes de cada escenario
Before(async () => {
  const entities = dataSource.entityMetadatas.map(
    (e) => `"${e.tableName}"`
  );
  for (const table of entities) {
    await dataSource.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
  }
});

AfterAll(async () => {
  await app.close();
}); */
