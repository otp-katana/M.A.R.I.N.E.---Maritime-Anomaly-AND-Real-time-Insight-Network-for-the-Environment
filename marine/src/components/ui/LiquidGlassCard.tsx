import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import bgDarkImage from '@/assets/bg-cosmic_horizon.jpg'
import bgLightImage from '@/assets/bg-cosmic_horizon-light.jpg'
import { cx } from '@/utils/cx'
import styles from './LiquidGlassCard.module.css'

const VERTEX_SHADER = `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec3 iResolution;
  uniform vec4 iMouse;
  uniform sampler2D iChannel0;
  uniform sampler2D iChannel1;

  uniform vec2 uViewport;
  uniform vec4 uCardRect;
  uniform vec2 uDarkImageResolution;
  uniform vec2 uLightImageResolution;
  uniform float uLightMode;

  vec2 backgroundUv(vec2 uv, vec2 imgRes) {
    vec2 screenPixel = vec2(
      uCardRect.x + uv.x * uCardRect.z,
      uCardRect.y + (1.0 - uv.y) * uCardRect.w
    );

    float scale = max(
      uViewport.x / imgRes.x,
      uViewport.y / imgRes.y
    );

    vec2 displayedSize = imgRes * scale;
    vec2 crop = (displayedSize - uViewport) * 0.5;

    vec2 imageUv = (screenPixel + crop) / displayedSize;

    return vec2(imageUv.x, 1.0 - imageUv.y);
  }

  vec4 sampleDark(vec2 uv) {
    return texture2D(
      iChannel0,
      clamp(backgroundUv(uv, uDarkImageResolution), 0.001, 0.999)
    );
  }

  vec4 sampleLight(vec2 uv) {
    return texture2D(
      iChannel1,
      clamp(backgroundUv(uv, uLightImageResolution), 0.001, 0.999)
    );
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    const float SAMPLE_RANGE = 4.0;
    const float SAMPLE_OFFSET = 0.5;

    vec2 uv = fragCoord / iResolution.xy;
    vec2 m2 = uv - vec2(0.5);
    vec2 lensUv = uv + m2 * 0.012;

    if (uLightMode < 0.5) {
      vec4 baseColor = sampleDark(uv);
      vec4 refracted = vec4(0.0);
      float total = 0.0;

      for (float x = -SAMPLE_RANGE; x <= SAMPLE_RANGE; x++) {
        for (float y = -SAMPLE_RANGE; y <= SAMPLE_RANGE; y++) {
          vec2 offset = vec2(x, y) * SAMPLE_OFFSET / iResolution.xy;
          refracted += sampleDark(lensUv + offset);
          total += 1.0;
        }
      }

      refracted /= total;
      vec3 lighting = clamp(refracted.rgb, 0.0, 1.0);
      vec3 darkGlass = mix(baseColor.rgb, lighting, 0.88);
      fragColor = vec4(darkGlass, 1.0);
    } else {
      vec4 baseColor = sampleLight(uv);
      vec4 refracted = vec4(0.0);
      float total = 0.0;

      for (float x = -SAMPLE_RANGE; x <= SAMPLE_RANGE; x++) {
        for (float y = -SAMPLE_RANGE; y <= SAMPLE_RANGE; y++) {
          vec2 offset = vec2(x, y) * SAMPLE_OFFSET / iResolution.xy;
          refracted += sampleLight(lensUv + offset);
          total += 1.0;
        }
      }

      refracted /= total;
      vec3 lighting = clamp(refracted.rgb, 0.0, 1.0);
      vec3 lightGlass = mix(baseColor.rgb, lighting, 0.88);
      lightGlass = mix(lightGlass, vec3(0.95, 0.98, 1.0), 0.14);
      fragColor = vec4(lightGlass, 1.0);
    }
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`

type GlassSurfaceEntry = {
  element: HTMLElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
}

class SharedLiquidGlassEngine {
  private entries = new Set<GlassSurfaceEntry>()
  private glCanvas: HTMLCanvasElement | null = null
  private gl: WebGLRenderingContext | null = null
  private program: WebGLProgram | null = null
  private darkTexture: WebGLTexture | null = null
  private lightTexture: WebGLTexture | null = null
  private uniforms: {
    resolution: WebGLUniformLocation | null
    mouse: WebGLUniformLocation | null
    darkTexture: WebGLUniformLocation | null
    lightTexture: WebGLUniformLocation | null
    viewport: WebGLUniformLocation | null
    cardRect: WebGLUniformLocation | null
    darkImageResolution: WebGLUniformLocation | null
    lightImageResolution: WebGLUniformLocation | null
    lightMode: WebGLUniformLocation | null
  } | null = null

  private darkImage: HTMLImageElement | null = null
  private lightImage: HTMLImageElement | null = null
  private darkReady = false
  private lightReady = false
  private rafId = 0
  private running = false
  private isLight = false
  private themeObserver: MutationObserver | null = null

  register(element: HTMLElement, canvas: HTMLCanvasElement): () => void {
    const entry: GlassSurfaceEntry = {
      element,
      canvas,
      ctx: canvas.getContext('2d'),
    }

    this.entries.add(entry)
    this.start()

    return () => {
      this.entries.delete(entry)
      if (this.entries.size === 0) {
        this.stop()
      }
    }
  }

  private syncTheme() {
    this.isLight = document.documentElement.getAttribute('data-theme') === 'light'
  }

  private initThemeObserver() {
    if (this.themeObserver) return
    this.syncTheme()
    this.themeObserver = new MutationObserver(() => this.syncTheme())
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
  }

  private createPlaceholderTexture(gl: WebGLRenderingContext, rgba: [number, number, number, number]): WebGLTexture | null {
    const texture = gl.createTexture()
    if (!texture) return null

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array(rgba),
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return texture
  }

  private initGl(): boolean {
    if (this.gl && this.program && this.uniforms) return true

    const glCanvas = document.createElement('canvas')
    const gl = glCanvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    })

    if (!gl) {
      console.warn('WebGL is not supported.')
      return false
    }

    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Liquid Glass Shader Error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) return false

    const program = gl.createProgram()
    if (!program) return false

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Liquid Glass Program Error:', gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return false
    }

    gl.useProgram(program)

    const buffer = gl.createBuffer()
    if (!buffer) return false

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const darkTexture = this.createPlaceholderTexture(gl, [7, 11, 25, 255])
    const lightTexture = this.createPlaceholderTexture(gl, [235, 244, 255, 255])
    if (!darkTexture || !lightTexture) return false

    this.glCanvas = glCanvas
    this.gl = gl
    this.program = program
    this.darkTexture = darkTexture
    this.lightTexture = lightTexture
    this.uniforms = {
      resolution: gl.getUniformLocation(program, 'iResolution'),
      mouse: gl.getUniformLocation(program, 'iMouse'),
      darkTexture: gl.getUniformLocation(program, 'iChannel0'),
      lightTexture: gl.getUniformLocation(program, 'iChannel1'),
      viewport: gl.getUniformLocation(program, 'uViewport'),
      cardRect: gl.getUniformLocation(program, 'uCardRect'),
      darkImageResolution: gl.getUniformLocation(program, 'uDarkImageResolution'),
      lightImageResolution: gl.getUniformLocation(program, 'uLightImageResolution'),
      lightMode: gl.getUniformLocation(program, 'uLightMode'),
    }

    const darkImg = new Image()
    this.darkImage = darkImg
    darkImg.onload = () => {
      if (!this.gl || !this.darkTexture) return
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.darkTexture)
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        darkImg,
      )
      this.darkReady = true
    }
    darkImg.onerror = () => {
      console.error('Liquid Glass dark background image could not be loaded.')
    }
    darkImg.src = bgDarkImage

    const lightImg = new Image()
    this.lightImage = lightImg
    lightImg.onload = () => {
      if (!this.gl || !this.lightTexture) return
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.lightTexture)
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        lightImg,
      )
      this.lightReady = true
    }
    lightImg.onerror = () => {
      console.error('Liquid Glass light background image could not be loaded.')
    }
    lightImg.src = bgLightImage

    return true
  }

  private start() {
    if (this.running) return
    this.initThemeObserver()
    if (!this.initGl()) return
    this.running = true
    this.renderLoop()
  }

  private stop() {
    this.running = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  private renderLoop = () => {
    if (!this.running) return

    const gl = this.gl
    const glCanvas = this.glCanvas
    const program = this.program
    const uniforms = this.uniforms
    const darkImage = this.darkImage
    const lightImage = this.lightImage

    const activeReady = this.isLight ? this.lightReady : this.darkReady

    if (gl && glCanvas && program && uniforms && darkImage && lightImage && activeReady) {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      gl.useProgram(program)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, this.darkTexture)
      gl.uniform1i(uniforms.darkTexture, 0)

      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, this.lightTexture)
      gl.uniform1i(uniforms.lightTexture, 1)

      gl.uniform2f(uniforms.viewport, vw, vh)
      gl.uniform2f(
        uniforms.darkImageResolution,
        darkImage.naturalWidth || 1,
        darkImage.naturalHeight || 1,
      )
      gl.uniform2f(
        uniforms.lightImageResolution,
        lightImage.naturalWidth || 1,
        lightImage.naturalHeight || 1,
      )
      gl.uniform4f(uniforms.mouse, 0, 0, 0, 0)
      gl.uniform1f(uniforms.lightMode, this.isLight ? 1.0 : 0.0)

      for (const entry of this.entries) {
        const rect = entry.element.getBoundingClientRect()

        if (
          rect.width < 1 ||
          rect.height < 1 ||
          rect.bottom <= 0 ||
          rect.top >= vh ||
          rect.right <= 0 ||
          rect.left >= vw
        ) {
          continue
        }

        const width = Math.max(1, Math.round(rect.width * dpr))
        const height = Math.max(1, Math.round(rect.height * dpr))

        if (glCanvas.width < width || glCanvas.height < height) {
          glCanvas.width = Math.max(glCanvas.width, width)
          glCanvas.height = Math.max(glCanvas.height, height)
        }

        gl.viewport(0, 0, width, height)
        gl.uniform3f(uniforms.resolution, width, height, 1)
        gl.uniform4f(uniforms.cardRect, rect.left, rect.top, rect.width, rect.height)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        if (entry.canvas.width !== width || entry.canvas.height !== height) {
          entry.canvas.width = width
          entry.canvas.height = height
        }

        if (entry.ctx) {
          entry.ctx.clearRect(0, 0, width, height)
          entry.ctx.drawImage(
            glCanvas,
            0,
            glCanvas.height - height,
            width,
            height,
            0,
            0,
            width,
            height,
          )
        }
      }
    }

    this.rafId = requestAnimationFrame(this.renderLoop)
  }
}

const liquidGlassEngine = new SharedLiquidGlassEngine()

export function LiquidGlassLayer({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return

    return liquidGlassEngine.register(parent, canvas)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cx(styles.shaderCanvas, className)}
      aria-hidden="true"
    />
  )
}

interface LiquidGlassCardProps {
  as?: ElementType
  padding?: 'default' | 'none' | 'sm' | 'md' | 'lg' | 'compact'
  interactive?: boolean
  glow?: boolean
  children?: ReactNode
  className?: string
  contentClassName?: string
}

export function LiquidGlassCard({
  as: Tag = 'div',
  padding = 'default',
  interactive = false,
  glow = false,
  children,
  className,
  contentClassName,
}: LiquidGlassCardProps) {
  return (
    <Tag
      className={cx(
        styles.liquidCard,
        interactive && styles.interactive,
        glow && styles.glow,
        className,
      )}
    >
      <LiquidGlassLayer />

      <div className={cx(styles.content, styles[`pad_${padding}`], contentClassName)}>
        {children}
      </div>
    </Tag>
  )
}