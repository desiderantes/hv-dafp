# Formato Único Hoja de Vida - Persona Natural (DAFP Colombia)

> **English version?** [Click here](README.md)

Esta es una Aplicación Web Progresiva (PWA) moderna y 100% offline diseñada para diligenciar, autocalcular, previsualizar e imprimir en PDF el **Formato Único de Hoja de Vida - Persona Natural** del DAFP (*Departamento Administrativo de la Función Pública de Colombia*, Leyes 190 de 1995, 489 y 443 de 1998).

Creé este sitio porque la plantilla original es vieja y carente, y no es un formulario rellenable. También quería aprender a usar Vite, React moderno, Bun, y practicar el uso de IA en proyectos personales.

> **CAVEAT UTILITOR:** Esta aplicación es como un 60% slop de IA. No recordaba mucho de mis tiempos con React, así que tuve que construir la mayor parte en tándem con Google Antigravity.
> Algunas decisiones técnicas fueron mías (usar Bun, hacerla PWA), mientras que para otras confié en la IA y le pedí corregir lo que estuviera mal con sus decisiones iniciales (por ejemplo, intentó usar un Vite muy viejo).
> Creo que usar IA puede inhibir el aprendizaje de programación, pero este proyecto no era sobre aprender React, sino sobre aprender a usar herramientas de IA y solucionar una necesidad real para un par de amigos.

---

## 🌟 Características Principales

- **Fidelidad con el Formato Oficial**: Maquetación basada en la plantilla existente del DAFP a lo largo de 3 páginas fijas y páginas adicionales dinámicas de experiencia laboral.
- **Paginación Dinámica de Empleos**: Genera automáticamente nuevas páginas de experiencia laboral al hacer clic en `Añadir Empleo`, manteniendo el encabezado `EMPLEO ACTUAL` anclado en la posición #1 de la Página 2 y `EMPLEO ANTERIOR` en las páginas posteriores.
- **Cálculo Automático en Tiempo Real del Tiempo de Experiencia**: La Sección 4 (*TIEMPO TOTAL DE EXPERIENCIA*) es 100% no editable y calcula automáticamente los tiempos acumulados para Servidor Público, Sector Privado y Trabajo Independiente, usando dinámicamente la "fecha del día" para empleos vigentes.
- **PWA 100% Offline-First**: Instalable en dispositivos móviles y de escritorio, funcionando completamente sin conexión gracias a Service Workers de Workbox y guardado automático en `localStorage`.
- **Fácil Impresión/Exportación a PDF**: Estilos `@media print` con preservación exacta de colores de fondo (`-webkit-print-color-adjust: exact`).
- **Firma Digital Interactiva**: Modal flotante para dibujar, limpiar o subir imágenes de firmas digitales directamente sobre el documento.
- **Barra de Herramientas UI**: Control de zoom personalizado (50% a 200%), carga de datos de ejemplo, exportación/importación en formato JSON y limpiado rápido.

---

## 🛠️ Stack

| Categoría | Tecnología |
|---|---|
| **Runtime y Gestor de Paquetes** | [Bun](https://bun.sh/) (v1.3.14) |
| **Framework Frontend** | React 18 con TypeScript |
| **Herramienta de Construcción** | Vite 5 |
| **Estilos y Arquitectura CSS** | CSS Nativo con Variables CSS (`:root`) |
| **Iconos e Interacciones** | Lucide React y `canvas-confetti` |
| **Motor PWA** | `vite-plugin-pwa` con Workbox Service Worker |
| **Tipografía** | Google Fonts (`Arimo` compatible métricamente con Arial, e `Inter` para la interfaz). |

---

## 🚀 Instrucciones de Uso

### Requisitos Previos

Bun. Probablemente funcione con otros runtimes, pero sólo lo he probado con Bun.

```bash
bun --version
```

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/desiderantes/hv-dafp.git
   cd hv-dafp
   ```

2. Instala las dependencias:
   ```bash
   bun install
   ```

### Desarrollo

Inicia el servidor de desarrollo local con recarga rápida (HMR):

```bash
bun run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Compilación para Producción

Genera la versión optimizada de producción y los archivos PWA:

```bash
bun run build
```

La salida compilada se generará en la carpeta `dist/`.

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
