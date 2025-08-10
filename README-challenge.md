# 🧪 OlaClick Backend Challenge - NestJS Edition

## 🎯 Objetivo

Diseñar e implementar una API RESTful que gestione órdenes de un restaurante utilizando el stack:

- **Node.js + TypeScript**
- **NestJS (arquitectura modular y principios SOLID)**
- **Sequelize (ORM)**
- **PostgreSQL** como base de datos
- **Redis** para cache
- **Docker** para contenerización

---

## 📌 Requerimientos Funcionales

### 1. Listar todas las órdenes
- Endpoint: `GET /orders`
- Devuelve todas las órdenes con estado diferente de `delivered`.
- Resultado cacheado en **Redis** por 30 segundos.

### 2. Crear una nueva orden
- Endpoint: `POST /orders`
- Inserta una nueva orden en estado `initiated`.
- Estructura esperada:
  ```json
  {
    "clientName": "Ana López",
    "items": [
      { "description": "Ceviche", "quantity": 2, "unitPrice": 50 },
      { "description": "Chicha morada", "quantity": 1, "unitPrice": 10 }
    ]
  }

### 3. Avanzar estado de una orden
Endpoint: `POST /orders/:id/advance`

Progreso del estado:

`initiated → sent → delivered`

Si llega a `delivered`, debe eliminarse de la base de datos y del caché.

### 4. Ver detalle de una orden
Endpoint: `GET /orders/:id`

Muestra la orden con todos sus detalles e items.

### 🧱 Consideraciones Técnicas
- Estructura modular con NestJS (modules, controllers, services, repositories)
- Uso de principios SOLID
- ORM: Sequelize con PostgreSQL
- Uso de DTOs y Pipes para validaciones
- Integración con Redis para cache de consultas
- Manejo de errores estructurado (filtros de excepción, status codes)
- Contenerización con Docker
- Al menos una prueba automatizada con Jest (e2e o unit test)

### 📦 Estructura sugerida
```
src/
├── orders/
│   ├── dto/
│   ├── entities/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── orders.module.ts
├── app.module.ts
├── main.ts
```

### 📘 Extras valorados
- Uso de interceptors para logging o transformación de respuestas
- Jobs con `@nestjs/schedule` para depuración de órdenes antiguas (bonus)
- Uso de ConfigModule para manejar variables de entorno

### 🚀 Entrega
1. Haz un fork de este repositorio (o crea uno nuevo).
2. Implementa tu solución y enviala con un push o enviandonos el enlace del repositorio publico.
3. Incluye un README.md con:
- Instrucciones para correr con docker o docker-compose
- Cómo probar endpoints (Postman, Swagger, cURL)
- Consideraciones técnicas

❓ Preguntas adicionales 
- ¿Cómo desacoplarías la lógica de negocio del framework NestJS?
- ¿Cómo escalarías esta API para soportar miles de órdenes concurrentes?
- ¿Qué ventajas ofrece Redis en este caso y qué alternativas considerarías?

¡Buena suerte y disfruta el reto! 🚀
