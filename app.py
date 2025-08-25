from flask import Flask, render_template, request, redirect, flash
from supabase_config import supabase
import pandas as pd
import os
import sys

# Detectar entorno empaquetado
if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS
else:
    base_path = os.path.abspath(".")

# Rutas de plantillas y estáticos
template_folder = os.path.join(base_path, "templates")
static_folder = os.path.join(base_path, "static")

# Inicializar Flask correctamente
app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)
app.secret_key = "clave_secreta"

# Función para actualizar valores
def actualizar_valores():
    registros = supabase.table("registros").select("*").execute().data
    grupos = {}
    for r in registros:
        key = f"{r['fecha']}_{r['socio_id']}"
        grupos.setdefault(key, []).append(r)

    for grupo in grupos.values():
        n = len(grupo)
        for r in grupo:
            try:
                total = (r["kg_totales"] * r["vr_kilo"]) + (r["fletes"] / n)
                valor_por_animal = total / r["cantidad"]
                supabase.table("registros").update({
                    "total": total,
                    "valor_por_animal": valor_por_animal
                }).eq("id", r["id"]).execute()
            except Exception as e:
                print(f"[ERROR] ID={r.get('id')}: {e}")

# Ruta principal
@app.route("/", methods=["GET", "POST"])
def index():
    socios = supabase.table("socios").select("id", "nombre").order("nombre").execute().data
    tipos_catalogo = supabase.table("tipos_catalogo").select("id", "nombre").eq("activo", True).order("nombre").execute().data
    mapa_tipos = {t["id"]: t["nombre"] for t in tipos_catalogo}

    socio_id_param = request.args.get("socio_id")
    fecha_param = request.args.get("fecha", "")

    if request.method == "POST":
        socio_id = request.form.get("socio_id", "")
        fecha = request.form.get("fecha", "")

        try:
            cantidad_total = int(request.form["cantidad"])
            kg_totales = float(request.form["kg_totales"])
            vr_kilo = float(request.form["vr_kilo"])
            fletes = float(request.form["fletes"])
            comision = float(request.form["comision"])

            similares = supabase.table("registros").select("*").eq("fecha", fecha).eq("socio_id", socio_id).execute().data
            n = len(similares) + 1
            total = (kg_totales * vr_kilo) + (fletes / n)
            valor_por_animal = total / cantidad_total

            nuevo_registro = {
                "fecha": fecha,
                "socio_id": socio_id,
                "cantidad": cantidad_total,
                "kg_totales": kg_totales,
                "vr_kilo": vr_kilo,
                "fletes": fletes,
                "comision": comision,
                "valor_por_animal": valor_por_animal,
                "total": total
            }

            resultado = supabase.table("registros").insert(nuevo_registro).execute().data

            if not resultado or not resultado[0].get("id"):
                flash("❌ Supabase no devolvió datos válidos tras el insert", "danger")
                return redirect(f"/?socio_id={socio_id}&fecha={fecha}")

            registro_id = resultado[0]["id"]
            flash("✅ Registro guardado correctamente", "success")

            index = 0
            while True:
                tipo_id_raw = f"tipo_id[{index}]"
                cantidad_raw = f"cantidad_tipo[{index}]"

                if tipo_id_raw not in request.form and cantidad_raw not in request.form:
                    break

                tipo_id = request.form.get(tipo_id_raw)
                cantidad_tipo = request.form.get(cantidad_raw)
                notas = request.form.get(f"nota_tipo[{index}]")

                if not tipo_id or not cantidad_tipo:
                    index += 1
                    continue

                desglose = {
                    "registro_id": registro_id,
                    "socio_id": socio_id,
                    "tipo": tipo_id,
                    "cantidad": int(cantidad_tipo),
                    "notas": notas or None
                }

                try:
                    supabase.table("tipo_ganado").insert(desglose).execute()
                except Exception as e:
                    print(f"❌ Error al guardar desglose tipo {tipo_id}:", e)
                index += 1

            actualizar_valores()

        except Exception as e:
            flash(f"❌ Error al guardar registro: {e}", "danger")

        return redirect(f"/?socio_id={socio_id}&fecha={fecha}")

    response = supabase.table("registros").select("*").eq("socio_id", socio_id_param).execute().data if socio_id_param else []

    mapa_socios = {s["id"]: s for s in socios}
    for r in response:
        s = mapa_socios.get(r.get("socio_id"))
        r["socio_nombre"] = f'👤 {s["nombre"]}' if s else "👤 Desconocido"

    try:
        df = pd.DataFrame(response)
        df.drop(columns=[c for c in ["id", "inserted_at"] if c in df.columns], inplace=True)

        columnas_ordenadas = ["fecha", "socio", "cantidad", "kg_totales", "vr_kilo", "fletes", "comision", "valor_por_animal", "total"]
        df = df[[col for col in columnas_ordenadas if col in df.columns]]

        df = df.rename(columns={
            "fecha": "Fecha", "socio": "Socio", "cantidad": "Cantidad",
            "kg_totales": "KG Totales", "vr_kilo": "Valor por Kilo",
            "fletes": "Fletes", "comision": "Comisión",
            "valor_por_animal": "Valor por Animal", "total": "Total"
        })

        for campo in ["Valor por Animal", "Total"]:
            df[campo] = df[campo].apply(lambda x: "${:,.0f}".format(x) if pd.notnull(x) else "")

        df["Fecha"] = pd.to_datetime(df["Fecha"], errors="coerce")
        df = df.sort_values(by="Fecha", ascending=False)

        tabla_html = df.to_html(classes="excel-style", index=False, escape=False)
        gran_total_valor = sum([r["total"] for r in response if r.get("total")])
        gran_total_row = f"""<tr><td colspan="{len(df.columns)-1}" style="text-align:right;font-weight:bold;">Gran Total</td><td style="font-weight:bold;">${gran_total_valor:,.0f}</td></tr>"""
        tabla_html = tabla_html.replace("</table>", f"{gran_total_row}</table>")
    except Exception as e:
        print("⚠️ Error en la tabla:", e)
        tabla_html = "<p>No hay registros disponibles.</p>"

    resumenes = []
    for socio in socios:
        socio_id = socio["id"]
        nombre = socio["nombre"]

        if socio_id_param and str(socio_id) != str(socio_id_param):
            continue

        registros_query = supabase.table("registros").select("*").eq("socio_id", socio_id)
        if fecha_param:
            registros_query = registros_query.eq("fecha", fecha_param)
        registros = registros_query.execute().data

        cantidad_total = sum(r.get("cantidad", 0) for r in registros)
        ingresos_total = sum(r.get("total", 0) for r in registros)

        desglose_raw = supabase.table("tipo_ganado").select("tipo, cantidad").eq("socio_id", socio_id).execute().data

        desglose = {}
        for item in desglose_raw:
            tipo_id = item.get("tipo")
            cantidad = item.get("cantidad", 0)
            nombre_tipo = mapa_tipos.get(tipo_id, f"(desconocido {tipo_id})")
            desglose[nombre_tipo] = desglose.get(nombre_tipo, 0) + cantidad

        desglose_list = [{"tipo": t, "cantidad": c} for t, c in desglose.items()]

        resumenes.append({
            "nombre": nombre,
            "cantidad": cantidad_total,
            "ingresos": ingresos_total,
            "desglose": desglose_list
        })

    return render_template(
        "index.html",
        table=tabla_html,
        socios=socios,
        tipos_catalogo=tipos_catalogo,
        resumenes=resumenes,
        socio_id_param=socio_id_param,
        fecha_param=fecha_param
    )

@app.route("/crear_socio", methods=["POST"])
def crear_socio():
    nombre = request.form["nombre"].strip().upper()
    if not nombre:
        return "⚠️ Nombre vacío", 400

    existentes = supabase.table("socios").select("nombre").eq("nombre", nombre).execute().data
    if existentes:
        return "⚠️ Ya existe un socio con ese", 400

    supabase.table("socios").insert({"nombre": nombre}).execute()
    return redirect("/")

def iniciar_app():
    print("🚀 Servidor Flask corriendo en 8088")
    app.run(host='0.0.0.0', port=8088, debug=False)

if __name__ == "__main__":
    iniciar_app()















