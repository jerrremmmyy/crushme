import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Confidentialite() {
  return (
    <div className="mx-auto min-h-dvh max-w-lg px-4 py-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary"
      >
        <ArrowLeft size={16} />
        Retour
      </Link>

      <h1 className="mb-6 text-2xl font-bold">
        Politique de confidentialité
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            1. Responsable du traitement
          </h2>
          <p>
            Le responsable du traitement des données est [NOM / SOCIÉTÉ],
            joignable à sapegenerate@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            2. Données collectées
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Email :</strong> pour l&apos;authentification et la
              communication
            </li>
            <li>
              <strong>Données de paiement :</strong> traitées exclusivement
              par Stripe (nous ne stockons aucune donnée bancaire)
            </li>
            <li>
              <strong>Historique d&apos;analyses :</strong> texte des
              réponses générées (score, suggestions). Jamais les images.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            3. Images et captures d&apos;écran
          </h2>
          <p>
            <strong>
              Les images envoyées ne sont JAMAIS stockées sur nos serveurs.
            </strong>{" "}
            Elles sont envoyées directement à l&apos;API d&apos;analyse
            (Anthropic), traitées en mémoire, puis immédiatement supprimées.
            Nous ne conservons aucune copie.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            4. Finalités du traitement
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Fournir le service d&apos;analyse</li>
            <li>Gérer votre compte et abonnement</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            5. Base légale
          </h2>
          <p>
            Le traitement est fondé sur l&apos;exécution du contrat (article
            6.1.b du RGPD) et votre consentement (article 6.1.a du RGPD).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            6. Durée de conservation
          </h2>
          <p>
            Vos données sont conservées tant que votre compte est actif. En
            cas de suppression de compte, vos données sont effacées sous 30
            jours.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            7. Sous-traitants
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Supabase :</strong> hébergement de la base de données
              (UE)
            </li>
            <li>
              <strong>Stripe :</strong> traitement des paiements (certifié
              PCI-DSS)
            </li>
            <li>
              <strong>Anthropic :</strong> analyse d&apos;images par IA (USA)
              — les images ne sont pas conservées par Anthropic pour
              l&apos;entraînement
            </li>
            <li>
              <strong>Vercel :</strong> hébergement du site (réseau mondial)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            8. Vos droits (RGPD)
          </h2>
          <p>Vous disposez des droits suivants :</p>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement (« droit à l&apos;oubli »)</li>
            <li>Droit à la portabilité</li>
            <li>Droit d&apos;opposition</li>
            <li>Droit à la limitation du traitement</li>
          </ul>
          <p className="mt-2">
            Pour exercer ces droits, contactez-nous à sapegenerate@gmail.com.
          </p>
          <p className="mt-2">
            Vous pouvez également introduire une réclamation auprès de la
            CNIL (cnil.fr).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            9. Cookies
          </h2>
          <p>
            CrushMe utilise uniquement des cookies strictement nécessaires
            au fonctionnement du service (authentification, session). Aucun
            cookie publicitaire ou de tracking n&apos;est utilisé.
          </p>
        </section>
      </div>
    </div>
  );
}
