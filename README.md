# Catalogo De Productos Con IA

Aplicacion frontend desarrollada con Angular para visualizar un catalogo de productos, con busqueda, filtros, ordenamiento y detalle por producto. Incluye una integracion de Inteligencia Artificial para generar descripciones dinamicas desde un backend seguro.

## 1. Descripcion del proyecto
Este proyecto simula una experiencia de tienda en linea moderna.

La aplicacion permite:
- Consumir productos desde una fuente externa (FakeStore API).
- Navegar por un listado de productos con experiencia responsive.
- Buscar, filtrar y ordenar productos.
- Ver detalle de cada producto.
- Generar una descripcion con IA mediante el boton "Generar descripcion con IA".

El objetivo es presentar una solucion tecnica clara, escalable y orientada a experiencia de usuario.

## 2. Tecnologias utilizadas
- Angular (Standalone Components + Routing)
- TypeScript
- RxJS
- CSS (Responsive Design / Mobile First)
- Node.js (backend intermedio para IA)
- Gemini API (`@google/genai`)
- Testing con Vitest (y stack de pruebas de Angular)

## 3. Instalacion
Clona el repositorio e instala dependencias:

```bash
npm install
```

## 4. Ejecucion del proyecto
Ejecuta frontend y backend por separado.

Frontend (Angular):

```bash
ng serve
```

Backend IA (Node.js):

```bash
npm run ai-server
```

Frontend disponible en:

```bash
http://localhost:4200
```

Backend IA disponible en:

```bash
http://localhost:3001
```

## 5. Funcionalidades principales
- Listado de productos consumidos desde FakeStore API
- Filtros por categoria
- Busqueda en tiempo real
- Ordenamiento por precio (ascendente/descendente)
- Vista de detalle de producto
- Generacion de descripcion con IA
- Fallback automatico a `assets/mock-products.json` cuando FakeStore falla o agota el timeout

## 6. IA 
- Se integro IA real utilizando Gemini API.
- Se implemento un backend en Node.js para proteger la API Key.
- En entorno local, si se configura correctamente `.env` con la API key, la generacion funciona con IA real.
- En entorno de despliegue (por ejemplo Vercel), la funcionalidad de IA utiliza un fallback controlado, ya que no se exponen credenciales sensibles en el frontend.

Variables esperadas en entorno local:

```bash
PORT=3001
GEMINI_API_KEY=tu_api_key
ALLOWED_ORIGIN=http://localhost:4200
AI_RATE_LIMIT_PER_MINUTE=20
```

## 7. Problemas y decisiones tecnicas
- FakeStore API presentó intermitencias, por lo que se implementó un fallback con productos locales para garantizar disponibilidad y continuidad de la aplicación.
- Se configura timeout de 5 segundos al consumir FakeStore para evitar esperas excesivas y activar fallback de forma controlada.
- Se priorizó una arquitectura preparada para producción, considerando seguridad, escalabilidad y desacoplamiento de servicios.
- Se adopto arquitectura modular por `features` para mantener escalabilidad y legibilidad.
- Se uso `signals` para manejo de estado reactivo en vistas clave.
- Se separo frontend/backend para la capa de IA y seguridad de credenciales.

## 8. Testing
Se implementaron pruebas para validar:
- Renderizado de componentes
- Filtros y busqueda
- Interacciones de usuario (incluyendo flujo de generación de IA con manejo de estados)
- Servicio de productos con consumo remoto y fallback local

Ejecucion de pruebas:

```bash
ng test
```

## 9. UI/UX
- Enfoque Responsive Design (Mobile First) 📱
- Layout adaptable a mobile, tablet y desktop
- Manejo claro de estados de `loading` y `error`
- Catalogo con tarjetas modernas, filtros accesibles y detalle bien jerarquizado

## 10. Seguridad
- La API key no se expone en el frontend.
- Se utiliza backend intermedio para consumir Gemini.
- El archivo `.env` se encuentra ignorado en git.

## 11. Posibles mejoras
- Deploy completo con backend productivo
- Persistencia de datos (favoritos, historico o preferencias)
- Mejoras adicionales de UI y microinteracciones
- Cache de resultados de IA para optimizar latencia y costos

## 12. Autor
Gerardo Barrón Duarte
