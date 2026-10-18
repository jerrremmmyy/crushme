import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CGV() {
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
        Conditions Générales de Vente
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            1. Objet
          </h2>
          <p>
            Les présentes CGV régissent les conditions d&apos;utilisation et
            d&apos;abonnement au service CrushMe, un service d&apos;analyse
            de conversations par intelligence artificielle.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            2. Tarifs et abonnements
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Essai :</strong> 2 € pour 3 jours, puis 10 €/semaine
              automatiquement
            </li>
            <li>
              <strong>Mensuel :</strong> 25 €/mois
            </li>
          </ul>
          <p className="mt-2">
            Les prix sont indiqués en euros TTC. Le paiement est effectué via
            Stripe. Les moyens de paiement acceptés sont : carte bancaire,
            Apple Pay et Google Pay.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            3. Droit de rétractation
          </h2>
          <p>
            Conformément à l&apos;article L221-28 du Code de la consommation,
            le droit de rétractation ne peut être exercé pour les contrats de
            fourniture de contenu numérique non fourni sur un support matériel
            dont l&apos;exécution a commencé avec l&apos;accord du
            consommateur. Toutefois, vous pouvez résilier votre abonnement à
            tout moment.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            4. Résiliation
          </h2>
          <p>
            Vous pouvez résilier votre abonnement à tout moment, en un clic,
            depuis votre espace client ou via le portail Stripe. La
            résiliation prend effet à la fin de la période en cours. Aucun
            remboursement prorata n&apos;est effectué.
          </p>
          <p className="mt-2">
            Conformément au décret n° 2023-417 du 30 mai 2023, la résiliation
            en ligne est disponible en 3 clics maximum depuis la page Compte.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            5. Service
          </h2>
          <p>
            CrushMe utilise l&apos;intelligence artificielle pour analyser
            des captures d&apos;écran de conversations. Les images envoyées ne
            sont jamais stockées : elles sont traitées en mémoire puis
            immédiatement supprimées. Seul le texte des réponses générées est
            conservé si l&apos;utilisateur le souhaite.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            6. Limitation de responsabilité
          </h2>
          <p>
            Les réponses générées par l&apos;IA sont des suggestions et ne
            constituent en aucun cas des conseils professionnels. L&apos;éditeur
            ne saurait être tenu responsable de l&apos;utilisation faite par
            l&apos;utilisateur des suggestions fournies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            7. Conditions d&apos;âge
          </h2>
          <p>
            Le service est strictement réservé aux personnes âgées de 18 ans
            et plus. En utilisant le service, vous certifiez avoir au moins 18
            ans.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text-primary">
            8. Droit applicable
          </h2>
          <p>
            Les présentes CGV sont régies par le droit français. En cas de
            litige, les tribunaux français seront seuls compétents.
          </p>
        </section>
      </div>
    </div>
  );
}
