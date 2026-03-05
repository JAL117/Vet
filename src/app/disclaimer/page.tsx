import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

export const metadata = {
  title: "Aviso Legal - VetCalc",
  description: "Aviso legal y descargo de responsabilidad de VetCalc",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Volver al inicio
        </Link>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Aviso Legal y Descargo de Responsabilidad
        </h1>
        <p className="mb-8 text-muted">
          Ultima actualizacion: Marzo 2026
        </p>

        <Disclaimer className="mb-10" />

        <div className="space-y-10">
          {/* Proposito */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              1. Proposito de la Herramienta
            </h2>
            <div className="rounded-lg border border-border bg-surface p-5 text-base leading-relaxed text-foreground">
              <p>
                VetCalc es una herramienta de apoyo disenada para asistir a
                profesionales medicos veterinarios en la realizacion de calculos
                clinicos comunes. Su objetivo es agilizar procesos de calculo y
                servir como referencia rapida en la practica veterinaria diaria.
              </p>
              <p className="mt-3">
                Esta herramienta <strong>no reemplaza</strong> el juicio clinico
                profesional, la formacion academica ni la experiencia del medico
                veterinario. Los resultados proporcionados deben considerarse
                siempre como estimaciones que requieren validacion profesional.
              </p>
            </div>
          </section>

          {/* Limitaciones */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              2. Limitaciones
            </h2>
            <div className="rounded-lg border border-border bg-surface p-5 text-base leading-relaxed text-foreground">
              <ul className="list-inside list-disc space-y-2">
                <li>
                  Los calculos se basan en formulas generalmente aceptadas en la
                  literatura veterinaria, pero pueden no aplicarse a todos los
                  casos clinicos.
                </li>
                <li>
                  Los valores de referencia proporcionados son orientativos y
                  pueden variar segun el laboratorio, la region geografica y las
                  caracteristicas individuales del paciente.
                </li>
                <li>
                  Las dosis de medicamentos pueden variar segun el estado
                  clinico del paciente, interacciones farmacologicas y otros
                  factores que esta herramienta no contempla.
                </li>
                <li>
                  Los calculos nutricionales son estimaciones basadas en
                  promedios y no sustituyen una evaluacion nutricional completa.
                </li>
                <li>
                  La herramienta no contempla todas las especies animales ni
                  todas las condiciones clinicas posibles.
                </li>
              </ul>
            </div>
          </section>

          {/* Responsabilidad Profesional */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              3. Responsabilidad Profesional
            </h2>
            <div className="rounded-lg border border-border bg-surface p-5 text-base leading-relaxed text-foreground">
              <p>
                El uso de VetCalc es exclusivamente responsabilidad del
                profesional medico veterinario que lo utiliza. Al usar esta
                herramienta, el usuario acepta que:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>
                  Es su responsabilidad verificar todos los resultados antes de
                  aplicarlos en la practica clinica.
                </li>
                <li>
                  Las decisiones clinicas deben basarse en una evaluacion
                  integral del paciente y no unicamente en los resultados de
                  esta herramienta.
                </li>
                <li>
                  VetCalc, sus desarrolladores y colaboradores no asumen
                  responsabilidad alguna por danos directos o indirectos
                  derivados del uso de esta herramienta.
                </li>
                <li>
                  El usuario debe contar con la licencia y certificacion
                  profesional correspondiente para ejercer la medicina
                  veterinaria en su jurisdiccion.
                </li>
              </ul>
            </div>
          </section>

          {/* Privacidad de Datos */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              4. Privacidad de Datos
            </h2>
            <div className="rounded-lg border border-border bg-surface p-5 text-base leading-relaxed text-foreground">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clipRule="evenodd"
                  />
                </svg>
                Procesamiento 100% local
              </div>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  <strong>Todos los calculos se realizan directamente en
                  su navegador.</strong> Ningun dato es enviado a servidores
                  externos.
                </li>
                <li>
                  No se recopila, almacena ni transmite informacion personal,
                  datos de pacientes ni resultados de calculos.
                </li>
                <li>
                  La unica informacion almacenada localmente es la preferencia
                  de tema visual (claro/oscuro), guardada en el almacenamiento
                  local de su navegador.
                </li>
                <li>
                  Los documentos PDF generados se crean localmente en su
                  dispositivo y no son almacenados ni transmitidos por VetCalc.
                </li>
              </ul>
            </div>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              5. Contacto
            </h2>
            <div className="rounded-lg border border-border bg-surface p-5 text-base leading-relaxed text-foreground">
              <p>
                Si tiene preguntas, sugerencias o desea reportar un error en los
                calculos, puede comunicarse con nosotros a traves de:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>
                  Correo electronico:{" "}
                  <span className="font-medium text-primary">
                    contacto@vetcalc.app
                  </span>
                </li>
                <li>
                  Repositorio del proyecto:{" "}
                  <span className="font-medium text-primary">
                    github.com/vetcalc
                  </span>
                </li>
              </ul>
              <p className="mt-3 text-sm text-muted">
                Agradecemos especialmente los reportes de errores en formulas o
                valores de referencia, ya que nos ayudan a mejorar la precision
                de la herramienta para toda la comunidad veterinaria.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted">
          <p>VetCalc - Herramienta de apoyo para profesionales veterinarios</p>
        </div>
      </div>
    </div>
  );
}
