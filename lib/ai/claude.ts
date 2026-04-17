import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Tu es l'assistant IA d'Uprising Studio MTL, une agence de prospection et croissance numérique basée à Montréal.
Tu aides à analyser les prospects, générer des emails de prospection personnalisés, et optimiser les campagnes outreach.
Tu parles en français québécois, tu es direct et orienté résultats.
Tu as accès aux données de l'agence : prospects, clients, campagnes, territoires.`;

export async function askAssistant(question: string, contextData?: string) {
  const messages: Anthropic.MessageParam[] = [];

  if (contextData) {
    messages.push({
      role: "user",
      content: `Contexte des données: ${contextData}\n\nQuestion: ${question}`,
    });
  } else {
    messages.push({ role: "user", content: question });
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  const content = response.content[0];
  return content.type === "text" ? content.text : "";
}

export async function generateProspectingEmail(prospect: {
  nom: string;
  categorie?: string | null;
  ville?: string | null;
}) {
  return askAssistant(
    `Génère un email de prospection court (3-4 phrases) pour ${prospect.nom}, une entreprise de ${prospect.categorie || "services"} à ${prospect.ville || "Montréal"}.
    Mets en valeur nos services de sites web Framer orientés conversion et nos automatisations IA.
    Ton direct, québécois, pas de bullshit. Objet + corps.`
  );
}
