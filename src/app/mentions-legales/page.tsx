import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MentionsLegales() {
  return (
    <div className="mx-auto min-h-dvh max-w-lg px-4 py-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary"
      >
        <ArrowLeft size={16} />
        Retour
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Mentions légales</h1>

      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            Éditeur du site
          </h2>
          <p>
            CrushMe est édité par [NOM DE LA SOCIÉTÉ / Prénom Nom]
            <br />
            [Forme juridique] au capital de [X] euros
            <br />
            Siège social : [Adresse]
            <br />
            SIRET : [Numéro SIRET]
            <br />
            RCS : [Ville] [Numéro RCS]
            <br />
            Directeur de la publication : [Nom]
            <br />
            Email : sapegenerate@gmail.com
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            Hébergement
          </h2>
          <p>
            Le site est hébergé par Vercel Inc.
            <br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
            <br />
            Site web : vercel.com
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des contenus présents sur le site CrushMe
            (textes, graphismes, logos, icônes, images, logiciels) est la
            propriété exclusive de l&apos;éditeur ou de ses partenaires et est
            protégé par les lois françaises et internationales relatives à la
            propriété intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            Conditions d&apos;accès
          </h2>
          <p>
            Le service CrushMe est réservé aux personnes majeures (18 ans
            et plus). L&apos;utilisateur s&apos;engage à ne pas utiliser le
            service à des fins de harcèlement ou de manipulation.
          </p>
        </section>
      </div>
    </div>
  );
}
