# Gestion de Ordenes - Api NestJs

## Descripcion

Se realizo el desarrollo de una RESTful api para la gestion de ordenes en un restaurante. Se siguieron las mejores practicas de desarrollo y se respetaron los principios SOLID. Para el stack se utilizo:

- Postgres como base de datos
- Sequelize como ORM
- Redis como cache
- TypeScript como lenguaje principal
- NestJs como framework

## Consideraciones

Antes de realiar el montado del proyecto, asegurate de tener `postgres`, `node` y `redis` en tu maquina.
Existen alternativas cloud para postgres y redis como:

- postgres: [neondb](https://console.neon.tech/)
- redis: [redis-cloud](https://cloud.redis.io/)

## SetUp

1. Clonar el repositorio:
   ```
    git clone https://github.com/KemJiga/KemJiga-challenge-nodejs-2025.git
   ```
   ```
    cd KemJiga-challenge-nodejs-2025
   ```
2. Crear .env (sigue el ejemplo en .env.example).
3. Montar Docker

```
 docker-compose up --build
```

## Tests

Dentro del proyecto se incluyo una prueba unitaria para el controlador de las ordenes. Ademas, tambien se incluyo una coleccion postman con pruebas para todos los endpoints.

## Estructura del proyecto

```
postman/
src/
├── database/
│   ├── sequelize.ts
├── filters/
│   ├── http-exception.filter.ts
├── orders/
│   ├── dto/
│   ├── entities/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── orders.module.ts
├── pipes/
│   ├── validation.pipe.ts
├── redis/
│   ├── redis.module.ts
├── app.module.ts
├── main.ts
```

## Respuestas a preguntas adicionales

- ¿Cómo desacoplarías la lógica de negocio del framework NestJS?
  Implementaria una capa extra a la logica del negocio, para que los servicios sean agnosticos al framework. La logica seria implementada en archivos planos de typescript y luego invocados en los servicios del framework.

- ¿Cómo escalarías esta API para soportar miles de órdenes concurrentes?
  La mejor opcion seria escalado horizontal. Tener multiples instancias de la API siendo orquestadas por un balanceador de carga.

- ¿Qué ventajas ofrece Redis en este caso y qué alternativas considerarías?
  La principal ventaja de Redis es un eficiencia a la hora de realizar consultas, solo eso ya lo hace la mejor opcion. Existen alternativas como Memchached, pero aunque otorgue buen rendimiento y facilidad de uso, esta carece de persistencia de datos.
