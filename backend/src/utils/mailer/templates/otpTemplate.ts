/**
 * OTP Email Template - Kulture
 */

export const otpTemplate = (
    firstName: string,
    otpCode: string
) => {
    return `
    <!DOCTYPE html>
    <html lang="fr">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Vérification Kulture</title>

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
                -webkit-font-smoothing: antialiased;
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

            .tagline {
                margin-top: 10px;
                font-size: 15px;
                color: #1f2937;
                font-weight: 600;
            }

            .icon-header {
                width: 48px;
                margin-bottom: 15px;
            }

            .content {
                padding: 45px 35px;
                text-align: center;
            }

            h1 {
                color: #ffffff;
                font-size: 28px;
                margin-bottom: 20px;
            }

            p {
                font-size: 15px;
                line-height: 1.8;
                color: #d1d5db;
                margin-bottom: 18px;
            }

            .highlight {
                color: #facc15;
                font-weight: 700;
            }

            .otp-wrapper {
                margin: 35px 0;
            }

            .otp-box {
                display: inline-block;
                background: #1f2937;
                border: 2px dashed #facc15;
                border-radius: 16px;
                padding: 22px 35px;
            }

            .otp-code {
                font-size: 42px;
                letter-spacing: 12px;
                font-weight: 900;
                color: #facc15;
            }

            .security-box {
                margin-top: 30px;
                background: rgba(250, 204, 21, 0.08);
                border: 1px solid rgba(250, 204, 21, 0.15);
                border-radius: 12px;
                padding: 18px;
            }

            .security-box p {
                margin: 0;
                font-size: 14px;
                color: #fde68a;
            }

            .footer {
                background: #0b1220;
                padding: 30px;
                text-align: center;
                border-top: 1px solid rgba(255,255,255,0.05);
            }

            .footer p {
                font-size: 13px;
                color: #9ca3af;
                margin-bottom: 10px;
            }

            .footer-links {
                margin-top: 15px;
            }

            .footer-links a {
                color: #facc15;
                text-decoration: none;
                margin: 0 8px;
                font-size: 13px;
            }

            @media only screen and (max-width: 600px) {

                .content {
                    padding: 35px 24px;
                }

                h1 {
                    font-size: 24px;
                }

                .otp-code {
                    font-size: 32px;
                    letter-spacing: 8px;
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

                <div class="logo">
                    KULTURE
                </div>

                <div class="tagline">
                    Révéler et propulser la culture africaine
                </div>

            </div>

            <div class="content">

                <img src="https://img.icons8.com/fluency-systems-filled/96/facc15/lock.png" alt="Sécurité" class="icon-header" />

                <h1>
                    Vérification sécurisée
                </h1>

                <p>
                    Bonjour <span class="highlight">${firstName}</span>,
                </p>

                <p>
                    Utilisez le code ci-dessous pour confirmer votre identité
                    et accéder à votre espace Kulture.
                </p>

                <div class="otp-wrapper">

                    <div class="otp-box">

                        <div class="otp-code">
                            ${otpCode}
                        </div>

                    </div>

                </div>

                <p>
                    Ce code est valable pendant
                    <span class="highlight">10 minutes</span>.
                </p>

                <div class="security-box">

                    <p>
                        Ne partagez jamais ce code avec une autre personne.
                        Kulture ne vous demandera jamais votre code par téléphone
                        ou sur les réseaux sociaux.
                    </p>

                </div>

                <p style="margin-top: 30px; font-size: 14px; color: #9ca3af;">

                    Si vous n’êtes pas à l’origine de cette demande,
                    vous pouvez ignorer cet e-mail en toute sécurité.

                </p>

            </div>

            <div class="footer">

                <p>
                    © 2026 Kulture — La plateforme dédiée aux artistes,
                    événements et expériences culturelles africaines.
                </p>

                <p>
                    Billetterie • Artistes • Crowdfunding • Œuvres • Musique
                </p>

                <div class="footer-links">
                    <a href="#">Instagram</a>
                    <a href="#">TikTok</a>
                    <a href="#">Facebook</a>
                    <a href="#">X</a>
                </div>

            </div>

        </div>

    </body>

    </html>
    `;
};
