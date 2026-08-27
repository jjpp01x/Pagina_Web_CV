#!/usr/bin/env python3
"""Genera los tres CV en PDF (ES/EN/DE) que se descargan desde la web.

Existe porque los PDF anteriores se generaron con ReportLab en una sesion
suelta el 2026-07-17 y el script no se guardo en ningun sitio: quedaron tres
binarios sin fuente, imposibles de corregir. Afirmaban cosas falsas durante
meses (certificacion AWS que no se tiene, aleman A2-B1, Davos como residencia)
precisamente porque nadie podia reeditarlos.

Uso:
    python3 scripts/generar-cv.py

Escribe public/docs/CV_Jose_Palacios_{ES,EN,DE}.pdf.

REGLA: los datos verificables viven en src/content/persona.ts. Este script
lleva su propia copia porque Python no puede importar TypeScript, asi que
comprobar_coherencia() aborta si las dos se separan. Si cambias un dato,
cambialo en persona.ts Y aqui, o el script se niega a generar nada.
"""

import re
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "public" / "docs"
PERSONA_TS = RAIZ / "src" / "content" / "persona.ts"

# --- Datos comunes a los tres idiomas -------------------------------------

CONTACTO = {
    "nombre": "José Palacios Beortegui",
    "email": "palaciosbeortegui@gmail.com",
    "telefono": "+41 762 276 752",
    "web": "josepalacios.site",
    "linkedin": "linkedin.com/in/jose-palacios-beortegui",
    "github": "github.com/jjpp01x",
}

# El repo del portfolio se llama Pagina_Web_CV. Los PDF anteriores enlazaban
# github.com/jjpp01x/portfolio, que da 404: un enlace muerto en un CV.
REPO_WEB = "github.com/jjpp01x/Pagina_Web_CV"
REPO_HEIERLING = "github.com/jjpp01x/heierling"
REPO_TICKETING = "github.com/jjpp01x/Ski-resort-ticketing-system"

CIUDAD = {"ES": "Zúrich, Suiza", "EN": "Zurich, Switzerland", "DE": "Zürich, Schweiz"}

# Certificaciones que SI se poseen. AWS no esta: esta en curso y una
# credencial no obtenida se comprueba en el registro publico de AWS.
CERTIFICACIONES = {
    "ES": "Claude Code in Action · Claude Code 101 · Claude 101 · Introduction to Claude "
          "Cowork (Anthropic, 2026, verificables) · Responsible Prompting (Santander Open "
          "Academy, 2026) · Alemán A1.1 (Lingoda, 2026) · Salesforce Trailhead (en curso)",
    "EN": "Claude Code in Action · Claude Code 101 · Claude 101 · Introduction to Claude "
          "Cowork (Anthropic, 2026, verifiable) · Responsible Prompting (Santander Open "
          "Academy, 2026) · German A1.1 (Lingoda, 2026) · Salesforce Trailhead (in progress)",
    "DE": "Claude Code in Action · Claude Code 101 · Claude 101 · Introduction to Claude "
          "Cowork (Anthropic, 2026, verifizierbar) · Responsible Prompting (Santander Open "
          "Academy, 2026) · Deutsch A1.1 (Lingoda, 2026) · Salesforce Trailhead (laufend)",
}

IDIOMAS = {
    "ES": "Español (nativo) · Inglés (C1) · Alemán (A1.1 certificado, Lingoda 2026; A1.2 en curso)",
    "EN": "Spanish (native) · English (C1) · German (A1.1 certified, Lingoda 2026; A1.2 in progress)",
    "DE": "Spanisch (Muttersprache) · Englisch (C1) · Deutsch (A1.1 zertifiziert, Lingoda 2026; A1.2 laufend)",
}

CV = {
    "ES": {
        "titular": "Estudiante de Ingeniería Informática — Jr. en AI, Data & Cloud",
        "secciones": ["PERFIL", "PROYECTOS TÉCNICOS", "FORMACIÓN Y CERTIFICACIONES",
                      "EXPERIENCIA PROFESIONAL", "COMPETENCIAS E IDIOMAS"],
        "perfil": "Graduado en Business Management (2025), actualmente cursando Ingeniería "
                  "Informática. Combino experiencia práctica en cadena de suministro e "
                  "inventarios con un portfolio técnico creciente en bases de datos, "
                  "desarrollo de software y cloud. Busco oportunidades junior en AI, Data & Tech.",
        "proyectos": [
            ("Sistema gestor de inventario — Heierling GmbH", "PostgreSQL 16 · Docker · Python · 2026",
             "Diseño completo de base de datos para un fabricante suizo de botas de esquí: modelo E/R, "
             "esquema relacional con funciones, trigger, vista e índices; permisos por rol y auditoría. "
             f"Desplegado con Docker Compose (PostgreSQL + Python 3.11/psycopg2). {REPO_HEIERLING}"),
            ("Sistema de ticketing de esquí — doble implementación", "C17 · Python · SQLite · 2025–2026",
             "Aplicación desarrollada dos veces — en C (~1.500 líneas) y Python — con persistencia "
             "SQLite, roles admin/agente (RBAC), auditoría, cancelación con soft delete, export "
             f"CSV/JSON y tests unitarios. {REPO_TICKETING}"),
            ("Portfolio web personal", "Next.js · TypeScript · MDX · 2026",
             "Web trilingüe (ES/EN/DE) con export estático y publicación por GitHub Actions; 100/100 "
             "en Lighthouse de escritorio (rendimiento, accesibilidad, buenas prácticas y SEO). "
             f"josepalacios.site · {REPO_WEB}"),
        ],
        "formacion": [
            ("BSc (Hons) Applied Computing (Ingeniería Informática)",
             "CESTE / University of Wales Trinity Saint David · 2025 – 2028 (previsto) · Level 4 completado"),
            ("BA (Hons) Business Management",
             "CESTE / University of Wales Trinity Saint David · 2021 – 2025"),
        ],
        "experiencia": [
            ("Fundador — Epokan (proyecto propio)", "Desde ago. 2026 · epokan.com",
             ["Formación en IA para empresas: diseño de la oferta, la web y el material comercial"]),
            ("Agente de Ventas — Heierling GmbH", "Davos, Suiza · Oct. 2025 – Abr. 2026",
             ["Atención personalizada a clientes internacionales de más de 15 nacionalidades (inglés y alemán)",
              "Gestión de procesos de inventario y reposición mediante sistemas internos",
              "Enfoque data-driven para optimizar recomendaciones de producto y la operativa diaria"]),
            ("Analista de Logística — Inditex (Zara)", "Zaragoza, España · Dic. 2021 – Feb. 2022",
             ["Procesamiento de mercancía entrante y saliente: recepción, organización de stock y reposición",
              "Operación de sistemas TPV y control de inventario en un entorno de alto volumen"]),
            ("Encargado de Compras y Logística — El Corte Inglés", "Zaragoza, España · Jul. 2021 – Sep. 2021",
             ["Coordinación de aprovisionamiento y logística entrante, asegurando la disponibilidad de stock",
              "Aplicación de principios Lean y uso de sistemas de inventario y ERP"]),
            ("Especialista en Ventas Minoristas — El Corte Inglés", "Zaragoza, España · Feb. 2020 – Ago. 2020",
             ["Ventas y captación de clientes en múltiples categorías, contribuyendo a los objetivos de venta"]),
            ("Operaciones de Logística — El Corte Inglés", "Zaragoza, España · Dic. 2019 – Ene. 2020",
             ["Recepción y procesamiento de entregas de proveedores en temporada alta; enrutado y seguimiento de inventario"]),
        ],
        "competencias": [
            ("Tecnología", "Python · SQL (PostgreSQL, SQLite) · C · HTML/CSS/JavaScript · Docker · Git/GitHub · AWS Cloud · Data Analytics"),
            ("Negocio", "Cadena de suministro y logística · Gestión de proyectos · Sistemas ERP · Estrategia de negocio"),
            ("Idiomas", IDIOMAS["ES"]),
        ],
        "label_cert": "Certificaciones",
    },
    "EN": {
        "titular": "Computer Engineering Student — Junior AI, Data & Cloud",
        "secciones": ["PROFILE", "TECHNICAL PROJECTS", "EDUCATION & CERTIFICATIONS",
                      "PROFESSIONAL EXPERIENCE", "SKILLS & LANGUAGES"],
        "perfil": "Business Management graduate (2025) currently completing a Computer "
                  "Engineering degree, combining hands-on experience in supply chain and "
                  "inventory operations with a growing technical portfolio in databases, "
                  "software development and cloud. Seeking junior opportunities in AI, Data & Tech.",
        "proyectos": [
            ("Inventory Management System — Heierling GmbH", "PostgreSQL 16 · Docker · Python · 2026",
             "Full database design for a Swiss ski-boot manufacturer: E/R model, relational schema with "
             "functions, trigger, view and indexes; role-based permissions and operation auditing. "
             f"Deployed with Docker Compose (PostgreSQL + Python 3.11/psycopg2). {REPO_HEIERLING}"),
            ("Ski Ticketing System — dual implementation", "C17 · Python · SQLite · 2025–2026",
             "Ticketing application built twice — in C (~1,500 LOC) and Python — with SQLite persistence, "
             "admin/agent roles (RBAC), audit trail, soft-delete cancellations, CSV/JSON export and unit "
             f"tests. {REPO_TICKETING}"),
            ("Personal portfolio website", "Next.js · TypeScript · MDX · 2026",
             "Trilingual (ES/EN/DE) site with static export and GitHub Actions deployment; 100/100 desktop "
             f"Lighthouse across performance, accessibility, best practices and SEO. josepalacios.site · {REPO_WEB}"),
        ],
        "formacion": [
            ("BSc (Hons) Applied Computing (Computer Engineering)",
             "CESTE / University of Wales Trinity Saint David · 2025 – 2028 (expected) · Level 4 completed"),
            ("BA (Hons) Business Management",
             "CESTE / University of Wales Trinity Saint David · 2021 – 2025"),
        ],
        "experiencia": [
            ("Founder — Epokan (own venture)", "Since Aug 2026 · epokan.com",
             ["AI training for companies: offering, website and commercial material"]),
            ("Sales Agent — Heierling GmbH", "Davos, Switzerland · Oct 2025 – Apr 2026",
             ["Personalised consultations for international clients from 15+ nationalities (English & German)",
              "Managed inventory and stock replenishment through internal systems",
              "Data-driven approach to optimise product recommendations and daily operations"]),
            ("Logistics Analyst — Inditex (Zara)", "Zaragoza, Spain · Dec 2021 – Feb 2022",
             ["Processed inbound and outbound merchandise: receiving, stock organisation and replenishment",
              "Operated POS systems and inventory control in a high-volume environment"]),
            ("Purchasing & Logistics Coordinator — El Corte Inglés", "Zaragoza, Spain · Jul 2021 – Sep 2021",
             ["Coordinated procurement and inbound logistics, ensuring stock availability",
              "Applied Lean principles to optimise warehouse flows; used inventory and ERP systems"]),
            ("Retail Sales Specialist — El Corte Inglés", "Zaragoza, Spain · Feb 2020 – Aug 2020",
             ["Customer acquisition and sales across multiple product categories, contributing to sales targets"]),
            ("Logistics Operations — El Corte Inglés", "Zaragoza, Spain · Dec 2019 – Jan 2020",
             ["Received and processed supplier deliveries during peak season; product routing and inventory tracking"]),
        ],
        "competencias": [
            ("Tech", "Python · SQL (PostgreSQL, SQLite) · C · HTML/CSS/JavaScript · Docker · Git/GitHub · AWS Cloud · Data Analytics"),
            ("Business", "Supply chain & logistics · Project management · ERP systems · Business strategy"),
            ("Languages", IDIOMAS["EN"]),
        ],
        "label_cert": "Certifications",
    },
    "DE": {
        "titular": "Informatikstudent — Junior-Positionen in AI, Data & Cloud",
        "secciones": ["PROFIL", "TECHNISCHE PROJEKTE", "AUSBILDUNG & ZERTIFIZIERUNGEN",
                      "BERUFSERFAHRUNG", "KENNTNISSE & SPRACHEN"],
        "perfil": "Absolvent in Business Management (2025), derzeit im Informatikstudium. "
                  "Kombiniert praktische Erfahrung in Supply Chain und Lagerwirtschaft mit "
                  "einem wachsenden technischen Portfolio in Datenbanken, Softwareentwicklung "
                  "und Cloud. Auf der Suche nach Junior-Stellen in AI, Data & Tech.",
        "proyectos": [
            ("Warenwirtschaftssystem — Heierling GmbH", "PostgreSQL 16 · Docker · Python · 2026",
             "Vollständiger Datenbankentwurf für einen Schweizer Skischuhhersteller: E/R-Modell, "
             "relationales Schema mit Funktionen, Trigger, View und Indizes; rollenbasierte "
             "Berechtigungen und Auditierung. Bereitstellung mit Docker Compose (PostgreSQL + "
             f"Python 3.11/psycopg2). {REPO_HEIERLING}"),
            ("Ski-Ticketing-System — doppelte Implementierung", "C17 · Python · SQLite · 2025–2026",
             "Anwendung zweimal entwickelt — in C (~1.500 Zeilen) und Python — mit SQLite-Persistenz, "
             "Admin-/Agent-Rollen (RBAC), Audit-Trail, Soft-Delete-Stornierungen, CSV/JSON-Export und "
             f"Unit-Tests. {REPO_TICKETING}"),
            ("Persönliche Portfolio-Website", "Next.js · TypeScript · MDX · 2026",
             "Dreisprachige Website (ES/EN/DE) mit statischem Export und Deployment über GitHub Actions; "
             "100/100 im Desktop-Lighthouse für Performance, Barrierefreiheit, Best Practices und SEO. "
             f"josepalacios.site · {REPO_WEB}"),
        ],
        "formacion": [
            ("BSc (Hons) Applied Computing (Informatik)",
             "CESTE / University of Wales Trinity Saint David · 2025 – 2028 (erwartet) · Level 4 abgeschlossen"),
            ("BA (Hons) Business Management",
             "CESTE / University of Wales Trinity Saint David · 2021 – 2025"),
        ],
        "experiencia": [
            ("Gründer — Epokan (eigenes Projekt)", "Seit Aug. 2026 · epokan.com",
             ["KI-Schulungen für Unternehmen: Angebot, Website und Vertriebsmaterial"]),
            ("Verkaufsberater — Heierling GmbH", "Davos, Schweiz · Okt. 2025 – Apr. 2026",
             ["Persönliche Beratung internationaler Kunden aus über 15 Nationalitäten (Englisch & Deutsch)",
              "Verwaltung von Inventarprozessen und Nachbestellung über interne Systeme",
              "Datengestützter Ansatz zur Optimierung von Produktempfehlungen und Tagesabläufen"]),
            ("Logistikanalyst — Inditex (Zara)", "Zaragoza, Spanien · Dez. 2021 – Feb. 2022",
             ["Bearbeitung ein- und ausgehender Ware: Annahme, Bestandsorganisation und Auffüllung",
              "Bedienung von Kassensystemen und Bestandskontrolle in umsatzstarker Umgebung"]),
            ("Einkaufs- und Logistikkoordinator — El Corte Inglés", "Zaragoza, Spanien · Jul. 2021 – Sep. 2021",
             ["Koordination von Beschaffung und eingehender Logistik; Lean-Prinzipien und ERP-Systeme"]),
            ("Einzelhandels-Verkaufsspezialist — El Corte Inglés", "Zaragoza, Spanien · Feb. 2020 – Aug. 2020",
             ["Kundengewinnung und Verkauf über mehrere Produktkategorien hinweg"]),
            ("Logistikbetrieb — El Corte Inglés", "Zaragoza, Spanien · Dez. 2019 – Jan. 2020",
             ["Annahme und Bearbeitung von Lieferantenlieferungen in der Hochsaison; Produktleitung und Bestandsverfolgung"]),
        ],
        "competencias": [
            ("Technik", "Python · SQL (PostgreSQL, SQLite) · C · HTML/CSS/JavaScript · Docker · Git/GitHub · AWS Cloud · Data Analytics"),
            ("Business", "Supply Chain & Logistik · Projektmanagement · ERP-Systeme · Geschäftsstrategie"),
            ("Sprachen", IDIOMAS["DE"]),
        ],
        "label_cert": "Zertifizierungen",
    },
}

# --- Cerrojo contra la deriva de datos ------------------------------------

PROHIBIDO = [
    (r"A2\s*[–-]\s*B1", "declara aleman A2-B1; el nivel real es A1.1 + A1.2 en curso"),
    (r"AWS[- ]?(Certified|zertifiziert)", "declara una certificacion AWS que esta en curso"),
    (r"Certificado AWS", "declara una certificacion AWS que esta en curso"),
    (r"(Residente en|Based in|Wohnhaft in)\s+Davos", "declara Davos como residencia actual"),
]


def comprobar_coherencia() -> None:
    """Aborta si estos datos no cuadran con persona.ts o si reaparece un dato falso."""
    ts = PERSONA_TS.read_text(encoding="utf-8")
    fallos = []

    if CONTACTO["email"] not in ts:
        fallos.append(f"el correo {CONTACTO['email']} no aparece en persona.ts")
    if "A1.1 certificado" not in ts:
        fallos.append("persona.ts ya no dice 'A1.1 certificado' para el aleman")

    for lang, datos in CV.items():
        texto = " ".join([
            datos["titular"], datos["perfil"], CERTIFICACIONES[lang], IDIOMAS[lang],
            CIUDAD[lang],
            " ".join(t + s + d for t, s, d in datos["proyectos"]),
            " ".join(t + s + " ".join(l) for t, s, l in datos["experiencia"]),
        ])
        for patron, motivo in PROHIBIDO:
            if re.search(patron, texto, re.IGNORECASE):
                fallos.append(f"[{lang}] {motivo}")

    if fallos:
        print("generar-cv: NO se genera nada. Datos incoherentes:", file=sys.stderr)
        for f in fallos:
            print(f"  - {f}", file=sys.stderr)
        sys.exit(1)


# --- Maquetacion ----------------------------------------------------------

TINTA = colors.HexColor("#1a1a1a")
SUAVE = colors.HexColor("#555555")
LINEA = colors.HexColor("#bbbbbb")

E = {
    "nombre": ParagraphStyle("nombre", fontName="Helvetica-Bold", fontSize=17, leading=20, textColor=TINTA),
    "titular": ParagraphStyle("titular", fontName="Helvetica", fontSize=10, leading=13, textColor=SUAVE, spaceAfter=3),
    "contacto": ParagraphStyle("contacto", fontName="Helvetica", fontSize=8, leading=11, textColor=SUAVE),
    "seccion": ParagraphStyle("seccion", fontName="Helvetica-Bold", fontSize=9, leading=11, textColor=TINTA, spaceBefore=9, spaceAfter=2),
    "cuerpo": ParagraphStyle("cuerpo", fontName="Helvetica", fontSize=8.5, leading=11.5, textColor=TINTA, alignment=TA_JUSTIFY),
    "puesto": ParagraphStyle("puesto", fontName="Helvetica-Bold", fontSize=8.7, leading=11, textColor=TINTA, spaceBefore=4),
    "meta": ParagraphStyle("meta", fontName="Helvetica-Oblique", fontSize=8, leading=10, textColor=SUAVE),
    "vineta": ParagraphStyle("vineta", fontName="Helvetica", fontSize=8.5, leading=11, textColor=TINTA, leftIndent=8),
}


def seccion(titulo):
    return [Paragraph(titulo, E["seccion"]),
            HRFlowable(width="100%", thickness=0.6, color=LINEA, spaceBefore=1, spaceAfter=3)]


def construir(lang):
    d = CV[lang]
    s = d["secciones"]
    f = []

    f.append(Paragraph(CONTACTO["nombre"], E["nombre"]))
    f.append(Paragraph(d["titular"], E["titular"]))
    f.append(Paragraph(" · ".join([
        CONTACTO["email"], CONTACTO["telefono"], CIUDAD[lang],
        CONTACTO["web"], CONTACTO["linkedin"], CONTACTO["github"],
    ]), E["contacto"]))

    f += seccion(s[0])
    f.append(Paragraph(d["perfil"], E["cuerpo"]))

    f += seccion(s[1])
    for titulo, stack, desc in d["proyectos"]:
        f.append(Paragraph(titulo, E["puesto"]))
        f.append(Paragraph(stack, E["meta"]))
        f.append(Paragraph(desc, E["cuerpo"]))

    f += seccion(s[2])
    for titulo, meta in d["formacion"]:
        f.append(Paragraph(titulo, E["puesto"]))
        f.append(Paragraph(meta, E["meta"]))
    f.append(Spacer(1, 3))
    f.append(Paragraph(f"<b>{d['label_cert']}:</b> {CERTIFICACIONES[lang]}", E["cuerpo"]))

    f += seccion(s[3])
    for titulo, meta, logros in d["experiencia"]:
        f.append(Paragraph(titulo, E["puesto"]))
        f.append(Paragraph(meta, E["meta"]))
        for l in logros:
            f.append(Paragraph(f"– {l}", E["vineta"]))

    f += seccion(s[4])
    for etiqueta, valor in d["competencias"]:
        f.append(Paragraph(f"<b>{etiqueta}:</b> {valor}", E["cuerpo"]))

    return f


def main():
    comprobar_coherencia()
    SALIDA.mkdir(parents=True, exist_ok=True)
    for lang in ("ES", "EN", "DE"):
        ruta = SALIDA / f"CV_Jose_Palacios_{lang}.pdf"
        doc = SimpleDocTemplate(
            str(ruta), pagesize=A4,
            leftMargin=15 * mm, rightMargin=15 * mm,
            topMargin=13 * mm, bottomMargin=12 * mm,
            title=f"CV — {CONTACTO['nombre']}", author=CONTACTO["nombre"],
        )
        doc.build(construir(lang))
        print(f"generar-cv: {ruta.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
