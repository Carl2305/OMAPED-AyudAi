# 🧩 FRONTWEBAYUDAI

Aplicación web para **gestionar beneficiarios de ayuda social** con conexión a un **modelo de clasificación automática** basado en inteligencia artificial.  
El sistema permite visualizar, registrar y administrar beneficiarios, integrando un backend Node.js y servicios de IA para optimizar la toma de decisiones.

---

## 🚀 Tecnologías principales

- **Angular** 19.2.15 (Framework principal)
- **Node.js** v22.20.0 (Entorno de ejecución)
- **TypeScript** (Lenguaje base)
- **Angular Material** (Interfaz y componentes visuales)
- **Express** (Servidor SSR)
- **RxJS** (Programación reactiva)
- **Karma** y **Jasmine** (Pruebas unitarias)

---

## ⚙️ Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [Node.js v22.20.0](https://nodejs.org/)
- [Angular CLI v19.2.15](https://angular.dev/tools/cli)
- Un navegador web moderno (Chrome, Edge, Firefox)

---

## 🧭 Estructura del proyecto

```
front-web-ayudai/
│
├── src/                      # Código fuente principal
│   ├── app/                  # Módulos y componentes Angular
│   ├── assets/               # Recursos estáticos (imágenes, íconos, etc.)
│   └── environments/         # Configuración por entorno (environment.ts)
│
├── dist/                     # Archivos generados tras la compilación
├── package.json              # Configuración de scripts y dependencias
└── angular.json              # Configuración del proyecto Angular
```

---

## 💻 Ejecución local

### Servidor de desarrollo
Inicia el servidor local con:
```bash
npm start
```
Por defecto, la aplicación estará disponible en:  
👉 [http://localhost:4200](http://localhost:4200)

### Modos de ejecución
Puedes iniciar el proyecto en distintos entornos:

```bash
npm run start:dev       # Desarrollo
npm run start:staging   # Staging
npm run start:prod      # Producción
```

---

## 🏗️ Compilación

Para generar los archivos de distribución:

```bash
npm run build
```

O bien, según el entorno:
```bash
npm run build:dev
npm run build:staging
npm run build:prod
```

Los artefactos generados se almacenan en la carpeta `dist/`.

---

## 🧪 Pruebas unitarias

Ejecuta las pruebas con **Karma** y **Jasmine**:

```bash
npm test
```

Los resultados se mostrarán en consola y en el navegador configurado.

---

## 🌐 Renderizado del lado del servidor (SSR)

Para ejecutar el proyecto con SSR (Angular Universal + Express):

```bash
npm run build:serve:dev
```

O, por entorno:
```bash
npm run build:serve:staging
npm run build:serve:prod
```

Esto ejecutará el servidor desde:
```
dist/front-web-ayudai/server/server.mjs
```

---

## ☁️ Despliegue en Azure

El proyecto está configurado para **desplegarse en Microsoft Azure**.  
Durante el proceso de despliegue:
- Se compila el proyecto con `npm run build:prod`
- Los archivos del directorio `dist/` se publican como artefactos del sitio
- Azure ejecuta el servidor SSR configurado con Node.js

*(Los detalles del pipeline y configuración específica de Azure no se incluyen en este documento.)*

---

## 👨‍💻 Autores

- **Carlos Mogollon**  
- **Carlos Vera**

**Institución:** Universidad Peruana de Ciencias Aplicadas (UPC)

---

## 🧾 Licencia

Este proyecto está licenciado bajo la **MIT License**.  
Consulta el archivo [LICENSE](LICENSE) para más información.

---

## 🧱 Estado del proyecto

🔧 **En desarrollo**  
Actualizaciones y mejoras en curso para la integración completa con el modelo de clasificación automatizada.

---

## 📚 Recursos adicionales

- [Documentación oficial de Angular CLI](https://angular.dev/tools/cli)
- [Angular Material Components](https://material.angular.io/)
- [Guía de pruebas con Karma y Jasmine](https://karma-runner.github.io/latest/index.html)

---

> 💡 *Este README fue generado y adaptado para mantener una documentación clara, técnica y fácilmente mantenible para el equipo de desarrollo.*
