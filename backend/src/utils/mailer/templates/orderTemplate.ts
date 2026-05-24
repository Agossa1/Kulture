
/**
 * Order Confirmation Email Template - Kulture
 */

export const orderConfirmationTemplate = (
    firstName: string,
    orderId: string,
    totalAmount: number
) => {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirmation de commande - Kulture</title>

        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                background-color: #0f172a;
                padding: 30px 15px;
                color: #e5e7eb;
            }

            .container {
                max-width: 620px;
                margin: auto;
                background: #111827;
                border-radius: 18px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.06);
            }

            .header {
                background: linear-gradient(135deg, #facc15, #f59e0b);
                padding: 45px 30px;
                text-align: center;
            }

            .logo {
                font-size: 34px;
                font-weight: 900;
                color: #111827;
                letter-spacing: 1px;
            }

            .subtitle {
                margin-top: 10px;
                font-size: 15px;
                color: #1f2937;
                font-weight: 500;
            }

            .icon-welcome {
                width: 64px;
                margin-bottom: 20px;
            }

            .content {
                padding: 40px 32px;
                text-align: center;
            }

            h1 {
                font-size: 28px;
                margin-bottom: 20px;
                color: #ffffff;
            }

            p {
                font-size: 15px;
                line-height: 1.8;
                color: #d1d5db;
                margin-bottom: 18px;
            }

            .order-box {
                margin: 30px 0;
                padding: 24px;
                background: #1f2937;
                border-radius: 14px;
                border: 1px solid rgba(255,255,255,0.05);
            }

            .order-id {
                display: inline-block;
                background: rgba(250, 204, 21, 0.15);
                color: #facc15;
                padding: 8px 16px;
                border-radius: 999px;
                font-size: 13px;
                font-weight: 700;
                margin-bottom: 18px;
            }

            .amount {
                font-size: 32px;
                font-weight: 800;
                color: #ffffff;
                margin-top: 10px;
            }

            .highlight {
                color: #facc15;
                font-weight: 700;
            }

            .btn {
                display: inline-block;
                margin-top: 25px;
                background: linear-gradient(135deg, #facc15, #f59e0b);
                color: #111827 !important;
                text-decoration: none;
                padding: 15px 28px;
                border-radius: 10px;
                font-weight: 800;
                font-size: 15px;
            }

            .divider {
                height: 1px;
                background: rgba(255,255,255,0.08);
                margin: 35px 0;
            }

            .footer {
                padding: 30px;
                background: #0b1220;
                text-align: center;
            }

            .footer p {
                font-size: 13px;
                color: #9ca3af;
                margin-bottom: 10px;
            }

            .socials {
                margin-top: 15px;
            }

            .socials a {
                color: #facc15;
                text-decoration: none;
                margin: 0 8px;
                font-size: 13px;
            }

            @media only screen and (max-width: 600px) {
                .content {
                    padding: 30px 22px;
                }

                h1 {
                    font-size: 24px;
                }

                .amount {
                    font-size: 26px;
                }

                .logo {
                    font-size: 28px;
                }
            }
        </style>
    </head>

    <body>

        <div class="container">

            <div class="header">
                <div class="logo">KULTURE</div>
                <div class="subtitle">
                    La plateforme qui révèle la culture africaine
                </div>
            </div>

            <div class="content">

                <img src="https://img.icons8.com/fluency-systems-filled/96/facc15/ok.png" alt="Succès" class="icon-welcome" />

                <h1>Merci ${firstName}</h1>

                <p>
                    Votre commande a bien été confirmée sur 
                    <span class="highlight">Kulture</span>.
                </p>

                <p>
                    Vous participez désormais à la valorisation des artistes,
                    événements et expériences culturelles africaines.
                </p>

                <div class="order-box">

                    <div class="order-id">
                        COMMANDE #${orderId.substring(0, 8).toUpperCase()}
                    </div>

                    <p>
                        Montant total payé
                    </p>

                    <div class="amount">
                        ${totalAmount.toLocaleString()} FCFA
                    </div>

                </div>

                <p>
                    Votre paiement a été validé avec succès.
                    Vous recevrez très bientôt les détails de votre achat,
                    vos tickets ou votre accès numérique.
                </p>

                <a href="#" class="btn">
                    Voir ma commande
                </a>

                <div class="divider"></div>

                <p style="font-size: 14px; color: #9ca3af;">
                    Besoin d’aide ? Notre équipe support reste disponible
                    pour vous accompagner à tout moment.
                </p>

            </div>

            <div class="footer">

                <p>
                    © 2026 Kulture — Révéler, connecter et propulser la culture africaine.
                </p>

                <p>
                    Billetterie • Artistes • Crowdfunding • Œuvres • Expériences
                </p>

                <div class="socials">
                    <a href="#">Instagram</a>
                    <a href="#">Facebook</a>
                    <a href="#">TikTok</a>
                    <a href="#">X</a>
                </div>

            </div>

        </div>

    </body>
    </html>
    `;
};
