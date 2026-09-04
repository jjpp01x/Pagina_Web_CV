# LinkedIn — hecho, pendiente y textos listos

> **Cerrado el 2026-09-04 por la tarde**, salvo Destacados. Ver el estado por bloque abajo.

**Fecha:** 2026-09-04. Acompaña a `2026-09-04-seo-entidad-multipropiedad-design.md`.

Estrategia y contexto en la memoria `project_posicionamiento_linkedin`.

---

## Hecho y verificado en el perfil

| Elemento | Valor |
|---|---|
| Titular (inglés) | `Tech & Business Risk Analysis \| AI governance · EU AI Act Art. 4 · data preparation \| Python · SQL · PostgreSQL \| I test on a real legal document corpus \| Open to Tech Analyst & Research Roles (CH/EU)` — 200/220 |
| «Acerca de» (inglés) | Reescrito entero. **Se retiró la afirmación de tener las certificaciones de AWS**, que no se tienen: son la promoción `AIF2CLOUD` a examinar antes del 30-sep-2026 |
| Experiencia | `Data & Digitalisation Assistant` · Gabinete Jurídico Hispanidad SL · ago. 2026 · Zaragoza |
| Experiencia | `Founder` · CorpusProof · ago. 2026 · Zúrich |
| Experiencia | `Founder` · Epokan · ago. 2026 · Zúrich |

**Dos trampas confirmadas al hacerlo**, ya registradas en `reference_linkedin_admin_gotchas`:

- **El titular se sobrescribe solo.** Cada puesto nuevo lo reemplazó por «Founder en
  Epokan». Por eso el titular se pone **el último**, después de todos los puestos.
- **El formulario no registra lo escrito si aún está cargando.** El primer intento de
  Epokan quedó en blanco, y otro guardó *septiembre* pese a haber puesto agosto. Hay que
  releer siempre después de guardar.

Y una tercera nueva: **al pegar en «Acerca de», el editor descarta las líneas vacías**.
Se resuelve pegando un texto cuyas líneas de separación lleven un espacio.

---

## Pendiente

### 1. Idiomas — HECHO

El perfil dice **«Alemán · Competencia básica profesional»**. `persona.ts` es explícito:
A1.1 certificado (Lingoda, abr-2026), A1.2 en curso, y *«NO es A2 ni B1, y no se declara
uso profesional diario»*. Es el mismo tipo de sobredeclaración que el AWS.

**Cambiado a «Competencia básica»** y verificado tras recargar. Coincide ya con la
certificación de Lingoda, que en la seccion de certificaciones estaba bien declarada
como «Alemán A1.1»: el perfil se contradecía a sí mismo.

### 2. Certificaciones — COMPROBADO, sin AWS

Las seis declaradas son correctas: Responsible Prompting (Santander), Introduction to
Claude cowork, Claude code 101, Claude Code in Action (Anthropic), Alemán A1.1 (Lingoda)
y el curso de ISSEP. **Ninguna de AWS**: la afirmación falsa vivía solo en el texto del
«Acerca de», ya retirada.

**Pendiente de decisión de José:** el curso de ISSEP sigue aquí, pero `persona.ts` dice
que lo retiró del CV el 2026-08-21 por decisión propia. Si esa decisión sigue en pie,
hay que quitarlo también de LinkedIn.

### 3. «Acerca de» en español y alemán — HECHO

Las tres versiones reescritas y verificadas tras recargar. La española tenía el mismo
problema que la inglesa: Heierling en presente, siete meses después de terminar.

**Marco de cada idioma — no son traducciones la una de la otra:**

| Versión | Audiencia | Enfoque |
|---|---|---|
| Inglés | Reclutadores de Zúrich | Analista que busca equipo. No dice «Founder» en el titular |
| Alemán | Reclutadores suizos germanófonos | **Mismo marco que el inglés**, no el español |
| Español | Despachos y asesorías, clientes de Epokan | Fundador por delante. Cierra con contacto comercial, no con «open to roles» |

### 4. Sección Destacados — CREADA PERO VACÍA

**LinkedIn no genera la vista previa de ningún enlace.** Diagnosticado antes de
abandonar: las etiquetas OG están completas en `/en/`, `/en.html` y `/`; `LinkedInBot`
recibe 200; la imagen OG responde 200 como `image/png` de 43 KB; y **falla igual con
`epokan.com`**, otro dominio en otro proveedor. Es su generador de vistas previas, no
los sitios. Se cerró sin guardar para no dejar una entrada rota.

Reintentar mas tarde con estos cuatro:

Cuatro enlaces, en este orden:

1. **josepalacios.site** — «Deep tech analyst — articles, projects and CV».
   *Forty-four articles on AI governance, evaluation and data preparation, in Spanish,
   English and German.* Va primero: cada clic es tráfico al dominio propio.
2. **epokan.com/informe/** — «Four Spanish court rulings that sanctioned unsupervised AI
   use». *What Article 4 of the EU AI Act already requires, and the self-check list.*
   El informe, no la home: son 2.428 palabras de contenido original.
3. **corpusproof.com** — «CorpusProof — is your archive ready for an AI to use it?».
   *Five metrics on a sample of your documents. Runs locally; nothing leaves your machine.*
4. **github.com/jjpp01x** — «Six deep-tech tools, all public». *AI safety incidents, due
   diligence, readiness scoring, model card auditing, signal detection.*

---

## Sin verificar

La **fecha de inicio en Gabinete Jurídico** se puso «agosto de 2026» en LinkedIn y en
`persona.ts`, por coherencia con la relación con la SL. **José no la ha confirmado.** Si
es otra, se corrige en los dos sitios.
