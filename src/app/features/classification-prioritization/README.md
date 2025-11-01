# Componente de Clasificación y Priorización de Beneficiarios

## Descripción
Componente que implementa una tabla con paginación del lado del servidor para gestionar y clasificar beneficiarios del sistema OMAPED.

## Características Implementadas

### ✅ Paginación del lado del servidor
- Navegación entre páginas (Anterior/Siguiente)
- Selección de tamaño de página (10, 20, 50, 100 items)
- Indicador de rango de items mostrados (ej: "1-20 de 100")
- Números de página con ellipsis para muchas páginas
- Deshabilitación automática de botones cuando no hay más páginas

### ✅ Tabla de Beneficiarios
- Columnas: Tipo Doc., Número Documento, Nombre Completo, Tipo de Discapacidad, Edad, Servicios Básicos, Acciones
- Diseño responsive y adaptable a dispositivos móviles
- Hover effects en filas
- Badges estilizados para tipos de documento y discapacidad

### ✅ Estados de la UI
- **Loading**: Spinner animado mientras se cargan los datos
- **Error**: Mensaje de error con botón de reintento
- **Empty**: Estado vacío cuando no hay beneficiarios
- **Success**: Tabla con datos y controles de paginación

### ✅ Acciones por Beneficiario
- **Ver detalles** (ícono de ojo)
- **Editar** (ícono de lápiz)
- **Clasificar prioridad** (ícono de estrella)

## Estructura de Archivos

```
classification-prioritization/
├── components/
│   └── classification-prioritization/
│       ├── classification-prioritization.component.ts    # Lógica del componente
│       ├── classification-prioritization.component.html  # Template
│       ├── classification-prioritization.component.scss  # Estilos
│       └── classification-prioritization.component.spec.ts
├── services/
│   └── classification-prioritization.service.ts         # Servicio HTTP
└── ...

core/models/beneficiary/
└── beneficiary-list-item.interface.ts                   # Interfaces de datos
```

## Modelos de Datos

### BeneficiaryListItem
```typescript
interface BeneficiaryListItem {
  tipoDocumento: string;
  numeroDocumento: string;
  nombreCompleto: string;
  tipoDiscapacidad: string;
  serviciosBasicos: string | null;
  edad: number;
}
```

### PagedResponse<T>
```typescript
interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
```

### API Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  errors: string[];
}
```

## Servicio

### ClassificationPrioritizationService

#### Método: getBeneficiariesPaged()
```typescript
async getBeneficiariesPaged(
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PagedResponse<BeneficiaryListItem>>>
```

**Parámetros:**
- `pageNumber`: Número de página (comienza en 1)
- `pageSize`: Cantidad de items por página

**Endpoint:** `GET /beneficiarios/list?pageNumber={pageNumber}&pageSize={pageSize}`

## Componente TypeScript

### Propiedades Principales

```typescript
// Datos
beneficiaries: BeneficiaryListItem[]

// Paginación
currentPage: number
pageSize: number
totalCount: number
totalPages: number
hasPreviousPage: boolean
hasNextPage: boolean

// Estados
isLoading: boolean
errorMessage: string
```

### Métodos Principales

- `loadBeneficiaries()`: Carga los datos del servidor
- `goToPage(page: number)`: Navega a una página específica
- `previousPage()`: Página anterior
- `nextPage()`: Página siguiente
- `changePageSize(event)`: Cambia el tamaño de página
- `getPageNumbers()`: Calcula los números de página a mostrar
- `getDisplayRange()`: Retorna el rango de items (ej: "1-20 de 100")

## Estilos

El componente sigue el diseño del proyecto con:
- **Fuente**: Poppins (usada en gob.pe)
- **Color primario**: #2563eb (azul)
- **Sombras**: Refinadas y sutiles
- **Responsive**: Totalmente adaptable a móviles
- **Animaciones**: Transiciones suaves

### Variables SCSS
```scss
$primary-color: #2563eb;
$primary-hover: #1d4ed8;
$secondary-color: #6b7280;
$border-color: #d1d5db;
$error-color: #dc2626;
$success-color: #10b981;
```

## Uso

El componente se carga automáticamente al inicializarse. Los datos se obtienen del servidor y se actualizan cada vez que cambia la página o el tamaño de página.

### Cambiar de página
```typescript
// Los usuarios pueden:
- Hacer clic en "Anterior" o "Siguiente"
- Hacer clic en un número de página específico
- Cambiar el tamaño de página en el selector
```

## Configuración del API

Asegúrate de tener configurada la URL del API en el archivo de entorno:

```typescript
// environments/environment.ts
export const environment = {
  apiUrl: 'http://tu-api.com/api'
};
```

El endpoint esperado es: `GET /beneficiarios/list`

## Próximas Mejoras

- [ ] Implementar funcionalidad de los botones de acción (Ver, Editar, Clasificar)
- [ ] Agregar filtros de búsqueda
- [ ] Agregar ordenamiento por columnas
- [ ] Exportar datos a Excel/PDF
- [ ] Agregar selección múltiple de beneficiarios
- [ ] Implementar clasificación automática con IA

## Compatibilidad

- ✅ Angular 17+
- ✅ TypeScript
- ✅ Responsive Design
- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
