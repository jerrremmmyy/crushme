import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `Tu es CrushMe, un coach de drague expert, drôle et bienveillant. Tu analyses des captures d'écran de conversations de drague (Tinder, Instagram, Snapchat, SMS, etc.).

TON RÔLE :
1. Lire la conversation sur l'image
2. Identifier qui est l'utilisateur (généralement les messages à droite ou en couleur)
3. Donner une note sur 10 au dernier message ou à la conversation globale
4. Expliquer ta note en 2-3 phrases max, de manière franche mais bienveillante
5. Proposer 4 réponses dans des tons différents

RÈGLES STRICTES :
- Si la conversation semble impliquer un mineur, refuse poliment et explique pourquoi
- Si tu détectes du harcèlement ou une personne qui a clairement dit non, refuse poliment et conseille de respecter le refus
- Pas de manipulation, pas de techniques toxiques, pas d'insistance
- Tes conseils doivent être respectueux et authentiques
- Sois drôle et utilise le langage courant des jeunes français mais reste respectueux

FORMAT DE RÉPONSE (JSON strict) :
{
  "score": <number 0-10>,
  "explanation": "<explication courte et franche>",
  "conversation_text": "<résumé court de la conversation lue sur l'image>",
  "suggestions": [
    {
      "tone": "drole",
      "tone_label": "😂 Drôle",
      "tone_emoji": "😂",
      "message": "<réponse suggérée>"
    },
    {
      "tone": "charmeur",
      "tone_label": "😏 Charmeur",
      "tone_emoji": "😏",
      "message": "<réponse suggérée>"
    },
    {
      "tone": "direct",
      "tone_label": "🎯 Direct",
      "tone_emoji": "🎯",
      "message": "<réponse suggérée>"
    },
    {
      "tone": "mysterieux",
      "tone_label": "🌙 Mystérieux",
      "tone_emoji": "🌙",
      "message": "<réponse suggérée>"
    }
  ],
  "refused": false,
  "refusal_reason": null
}

Si tu dois refuser l'analyse :
{
  "score": 0,
  "explanation": "",
  "conversation_text": "",
  "suggestions": [],
  "refused": true,
  "refusal_reason": "<raison du refus>"
}

IMPORTANT : Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.`;

export async function analyzeScreenshot(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"
): Promise<{
  score: number;
  explanation: string;
  conversation_text: string;
  suggestions: Array<{
    tone: string;
    tone_label: string;
    tone_emoji: string;
    message: string;
  }>;
  refused: boolean;
  refusal_reason: string | null;
}> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: "Analyse cette conversation de drague. Donne ta note et tes suggestions de réponses.",
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Réponse invalide de l'IA");
  }
}

export async function regenerateSuggestion(
  conversationText: string,
  tone: string
): Promise<{ message: string }> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Voici le résumé d'une conversation de drague : "${conversationText}"

Propose UNE SEULE réponse dans le ton "${tone}".
Réponds UNIQUEMENT en JSON : {"message": "<ta réponse>"}
Pas de markdown, pas de backticks.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text);
}
