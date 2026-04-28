# Allay 3D Implementation Guide

Esta guía detalla la implementación desde cero del componente 3D del Allay (Minecraft) utilizando Vanilla Three.js integrado en React (Astro).

## 1. Arquitectura del Modelo 3D y Sistema de UV Mapping

El Allay no es un modelo pre-renderizado cargado desde un archivo `.gltf` o `.obj`, sino que está construido dinámicamente utilizando geometrías primitivas de Three.js (`BoxGeometry` y `PlaneGeometry`). Esto permite que el modelo pese apenas unos pocos kilobytes y sea extremadamente rápido de renderizar.

### Estructura de Nodos
La jerarquía del modelo está diseñada para facilitar la animación procedural:
- **`allayGroup` (Grupo Raíz)**: Contiene todo. Al mover esto en Y, simulamos el vuelo (bobbing) sin afectar la rotación interna.
  - **`Head` (Mesh)**: Caja de 5x5x5. Mapeada en la esquina superior izquierda de la textura.
  - **`Body` (Mesh)**: Caja central a la que se adjuntan el resto de las extremidades.
    - **`RightArmGroup` / `LeftArmGroup`**: Pivotes en los hombros. Dentro contienen las cajas de los brazos desplazadas para que la rotación se haga desde arriba (como un esqueleto real).
    - **`WingGroupR` / `WingGroupL`**: Planos 2D. Pivotes desplazados a la espalda del cuerpo.

### UV Mapping Personalizado
Los modelos de Minecraft usan texturas 2D planas con coordenadas exactas de píxeles. Dado que la textura del Allay es de 32x32 píxeles, implementamos funciones personalizadas:
- `applyMinecraftUV()`: Recibe coordenadas (X, Y) y dimensiones (W, H, D). Despliega automáticamente las caras `Top, Bottom, Right, Front, Left, Back` replicando el comportamiento del motor de render de Minecraft.
- `applyPlaneUV()`: Asigna un recorte 2D de la textura a los planos de las alas, haciendo uso del Alpha (transparencia) que ya viene en el PNG.

## 2. Sistema de Animaciones (Procedural)

Las animaciones se logran mediante funciones trigonométricas (`Math.sin()`) aplicadas en el ciclo `requestAnimationFrame`, usando el tiempo (`clock.getElapsedTime()`) como variable continua.

- **Bobbing (Flotación):** Se aplica una onda sinusoidal simple a la posición `Y` del `allayGroup`.
- **Fluttering (Aleteo):** Se modifica la rotación `Y` de cada `WingGroup`, con un desfase angular entre el ala izquierda y la derecha para un movimiento más natural.
- **Organic Tilt (Inclinación de vuelo):** El cuerpo tiene una rotación leve continua en `X`, y el `allayGroup` entero pivota levemente en `Y` para simular la resistencia aerodinámica.
- **Arm Idle:** Los brazos rotan suavemente en fase opuesta para dar vida a la pose de espera.
- **Head Tracking:** Pequeños movimientos en el cuello que lo hacen parecer más orgánico.
- **Partículas:** Se incluye un pequeño sistema `THREE.Points` alrededor del modelo que simula el polvo mágico característico del Allay, cuyo color varía en base a la skin seleccionada.

## 3. Agregar una nueva Skin

Añadir una nueva skin es sumamente sencillo. Dentro del componente `AllayThree.jsx`, busca el array `ALLAY_SKINS`:

```javascript
const ALLAY_SKINS = [
    { id: 'classic', name: 'Classic Allay', path: '/skins/allay/allay-on-planetminecraft-com.png' },
    { id: 'tu_skin', name: 'Nombre de tu Skin', path: '/ruta/a/tu_skin.png' }
];
```
Asegúrate de que la textura sea de proporciones cuadradas, idealmente 32x32 o 64x64 píxeles. El componente automáticamente aplicará el filtro de escalado `THREE.NearestFilter` para preservar el estilo "Pixel Art".

## 4. Modificar o Crear Nuevas Animaciones

Si necesitas cambiar el comportamiento del vuelo, puedes ajustar los parámetros predeterminados en el estado `animParams`:

```javascript
const [animParams, setAnimParams] = useState({
    bobbingAmplitude: 0.15, // Altura de la flotación
    bobbingSpeed: 2.0,      // Velocidad de flotación
    wingSpeed: 15.0,        // Rapidez del aleteo
    wingAngle: 0.8,         // Amplitud de la rotación de las alas
    armSwingSpeed: 1.5,
    armSwingAmplitude: 0.2,
    // ...
});
```

Si deseas modificar la curva de animación, dirígete a la función `animate()` dentro del `useEffect` principal y edita el código matemático. Ejemplo, para hacer que el cuerpo gire en círculos en lugar de inclinarse, puedes cambiar:
`body.rotation.y = time * 0.5;`

## 5. Herramienta de Calibración / Modo DEV

El componente integra un panel oculto "DEV CONTROLS" al hacer clic en su respectivo botón en la interfaz. Este panel permite:
- Modificar en tiempo real las coordenadas (X, Y) y dimensiones (W, H) de las alas y brazos para calzar perfectamente si la textura de una skin utiliza coordenadas diferentes a las estándar.
- Ajustar velocidades de animación para pruebas.

## 6. Rendimiento y Mejores Prácticas

- **Instanciación:** El componente puede montarse múltiples veces en la misma página y operará de manera independiente. Cada ciclo de animación y contexto WebGL se limpia correctamente al desmontarse en el `return () => {}` del `useEffect`.
- **Re-renders:** Se optó por separar la creación de la escena (en el primer `useEffect`) de la actualización de la textura. Esto previene parpadeos violentos al cambiar de skin. Solo modificamos la propiedad `.map` del `Material` existente.
- **Recursos:** El modelo es extremadamente eficiente ya que comparte la misma geometría para todos los brazos y alas de manera instanciada conceptualmente y utiliza un único Material y Textura para todo el cuerpo.
