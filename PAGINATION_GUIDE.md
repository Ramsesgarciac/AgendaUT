# Guía de Paginación de Actividades

## 📋 Resumen de Cambios

Se ha implementado paginación en los endpoints de actividades para optimizar el rendimiento del sistema y reducir el tamaño de las respuestas de la API.

### Problema Anterior
- El endpoint `GET /api/actividades` retornaba **TODAS** las actividades de una vez
- Esto causaba transferencias de datos de ~96 MB
- Tiempos de carga de ~22 segundos

### Solución Implementada
- Paginación con límite predeterminado de **50 actividades** por página
- Respuestas optimizadas con metadata de paginación
- Límite máximo configurable de 100 registros por página

---

## 🔧 Endpoints Actualizados

### 1. GET /api/actividades
**Obtener todas las actividades (paginado)**

#### Parámetros de Query:
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de registros por página (default: 50, máximo: 100)

#### Ejemplos de Uso:

```bash
# Primera página con 50 actividades (default)
GET /api/actividades

# Primera página con 50 actividades (explícito)
GET /api/actividades?page=1&limit=50

# Segunda página con 50 actividades
GET /api/actividades?page=2&limit=50

# Primera página con 20 actividades
GET /api/actividades?page=1&limit=20

# Tercera página con 100 actividades
GET /api/actividades?page=3&limit=100
```

#### Formato de Respuesta:

```json
{
  "data": [
    {
      "id": 1,
      "asunto": "Ejemplo de actividad",
      "descripcion": "Descripción de la actividad",
      "fechaLimite": "2025-12-31T00:00:00.000Z",
      "area": { ... },
      "userCreate": { ... },
      "status": { ... },
      "documentos": [ ... ],
      "comentarios": [ ... ],
      "coleccionComentarios": [ ... ]
    },
    // ... más actividades (hasta 50 por defecto)
  ],
  "meta": {
    "total": 500,        // Total de actividades en la base de datos
    "page": 1,           // Página actual
    "limit": 50,         // Límite por página
    "totalPages": 10     // Total de páginas disponibles
  }
}
```

---

### 2. GET /api/actividades/area/:areaId
**Obtener actividades por área (paginado)**

#### Parámetros:
- `areaId` (path): ID del área
- `page` (query, opcional): Número de página (default: 1)
- `limit` (query, opcional): Cantidad de registros por página (default: **10**, máximo: 100)

#### Ejemplos de Uso:

```bash
# Primera página con 10 actividades (default)
GET /api/actividades/area/5

# Segunda página con 10 actividades
GET /api/actividades/area/5?page=2

# Primera página con 30 actividades
GET /api/actividades/area/5?page=1&limit=30
```

#### ⚠️ Nota Importante:
Este endpoint tiene un límite por defecto de **10 actividades** (en lugar de 50) para optimizar la carga inicial por área. Esto permite cargar múltiples áreas sin sobrecargar el sistema.

---

### 3. GET /api/actividades/user/:userId
**Obtener actividades por usuario (paginado)**

#### Parámetros:
- `userId` (path): ID del usuario
- `page` (query, opcional): Número de página (default: 1)
- `limit` (query, opcional): Cantidad de registros por página (default: 50, máximo: 100)

#### Ejemplos de Uso:

```bash
# Primera página de actividades del usuario 10
GET /api/actividades/user/10

# Segunda página de actividades del usuario 10
GET /api/actividades/user/10?page=2&limit=50

# Primera página con 25 actividades del usuario 10
GET /api/actividades/user/10?page=1&limit=25
```

---

## 🎯 Validaciones Implementadas

### Validación de Parámetros:
- `page` debe ser mayor a 0
- `limit` debe estar entre 1 y 100
- Si los parámetros no son válidos, se retorna un error `400 Bad Request`

### Ejemplos de Errores:

```bash
# Error: página inválida
GET /api/actividades?page=0
# Respuesta: 400 - "El número de página debe ser mayor a 0"

# Error: límite inválido
GET /api/actividades?limit=150
# Respuesta: 400 - "El límite debe estar entre 1 y 100"
```

---

## 💡 Recomendaciones de Uso

### Para el Frontend:

1. **Carga Inicial**: Solicitar la primera página al cargar la vista
   ```javascript
   const response = await fetch('/api/actividades?page=1&limit=50');
   const { data, meta } = await response.json();
   ```

2. **Paginación**: Usar los datos de `meta` para implementar controles de paginación
   ```javascript
   // Verificar si hay más páginas
   const hasNextPage = meta.page < meta.totalPages;
   const hasPrevPage = meta.page > 1;
   
   // Calcular número de página siguiente/anterior
   const nextPage = meta.page + 1;
   const prevPage = meta.page - 1;
   ```

3. **Scroll Infinito**: Cargar más páginas automáticamente
   ```javascript
   let currentPage = 1;
   
   async function loadMore() {
     currentPage++;
     const response = await fetch(`/api/actividades?page=${currentPage}&limit=50`);
     const { data, meta } = await response.json();
     
     // Agregar datos a la lista existente
     activities.push(...data);
     
     // Verificar si hay más páginas
     if (currentPage >= meta.totalPages) {
       // No hay más páginas
     }
   }
   ```

4. **Indicador de Progreso**: Mostrar al usuario cuántos registros hay en total
   ```javascript
   // Ejemplo: "Mostrando 1-50 de 500 actividades"
   const from = (meta.page - 1) * meta.limit + 1;
   const to = Math.min(meta.page * meta.limit, meta.total);
   console.log(`Mostrando ${from}-${to} de ${meta.total} actividades`);
   ```

---

## 📊 Beneficios de Rendimiento

### Antes de la Paginación:
- ❌ Transferencia de datos: ~96 MB
- ❌ Tiempo de carga: ~22 segundos
- ❌ Todas las actividades cargadas de una vez

### Después de la Paginación:
- ✅ Transferencia de datos: ~2-5 MB por página (dependiendo del límite)
- ✅ Tiempo de carga: ~1-2 segundos por página
- ✅ Carga bajo demanda (solo lo necesario)
- ✅ Mejor experiencia de usuario
- ✅ Menor consumo de memoria en el cliente

---

## 🔄 Ordenamiento

Las actividades se retornan ordenadas por ID descendente (las más recientes primero).

---

## 📝 Notas Adicionales

- Los endpoints que retornan una sola actividad (`GET /api/actividades/:id`) **NO** están paginados
- La paginación es **opcional**: si no se especifican parámetros, se usan los valores por defecto
- El límite máximo de 100 registros por página es una medida de seguridad para evitar sobrecargas

---

## 🚀 Próximos Pasos Recomendados

1. **Actualizar el Frontend**: Modificar las llamadas a la API para manejar la nueva estructura de respuesta
2. **Implementar UI de Paginación**: Agregar controles de navegación entre páginas
3. **Caché**: Considerar implementar caché en el frontend para páginas ya visitadas
4. **Filtros Adicionales**: Agregar filtros por fecha, estado, etc. junto con la paginación
