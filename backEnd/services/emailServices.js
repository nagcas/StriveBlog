import mailgun from 'mailgun-js';

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

export const sendEmail = async (to, subject, htmlContent) => {
  const data = {
    from: "Strive Blog <strive-blog@info.com>",
    to,
    subject,
    html: htmlContent,
  };

  try {
    // Invia l'email usando Mailgun
    const response = await mg.messages().send(data);
    console.log("Email inviata con successo:", response);
    return response; // Restituisce la risposta di Mailgun
  } catch (error) {
    // Gestione degli errori
    console.error("Errore nell'invio dell'email:", error);
    throw error; // Rilancia l'errore per permettere la gestione esterna
  }
};