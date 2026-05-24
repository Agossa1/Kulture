
/**
 * Welcome Email Template - Kulture
 */

export const welcomeTemplate = (
    firstName: string
) => {

    return `
    <!DOCTYPE html>
    <html lang="fr">

    <head>

        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Bienvenue sur Kulture</title>

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
                max-width: 640px;
                margin: auto;
                background: #111827;
                border-radius: 18px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.06);
            }

            .hero {
                background: linear-gradient(135deg, #facc15, #f59e0b);
                padding: 60px 35px;
                text-align: center;
            }

            .logo {
                font-size: 38px;
                font-weight: 900;
                color: #111827;
                letter-spacing: 2px;
            }

            .tagline {
                margin-top: 12px;
                font-size: 16px;
                color: #1f2937;
                font-weight: 600;
            }

            .hero-title {
                margin-top: 35px;
                font-size: 34px;
                font-weight: 900;
                color: #111827;
                line-height: 1.2;
            }

            .hero-text {
                margin-top: 18px;
                font-size: 17px;
                line-height: 1.8;
                color: #1f2937;
            }

            .content {
                padding: 45px 35px;
            }

            h2 {
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

            .highlight {
                color: #facc15;
                font-weight: 700;
            }

            .feature-icon-img {
                width: 32px;
                margin-bottom: 10px;
            }

            .features {
                margin-top: 40px;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 18px;
            }

            .feature-card {
                background: #1f2937;
                border-radius: 14px;
                padding: 22px;
                border: 1px solid rgba(255,255,255,0.05);
            }

            .feature-icon {
                font-size: 28px;
                margin-bottom: 14px;
            }

            .feature-title {
                color: #ffffff;
                font-size: 16px;
                font-weight: 700;
                margin-bottom: 10px;
            }

            .feature-description {
                color: #9ca3af;
                font-size: 14px;
                line-height: 1.7;
            }

            .cta-section {
                margin-top: 45px;
                text-align: center;
            }

            .btn {
                display: inline-block;
                padding: 16px 32px;
                background: linear-gradient(135deg, #facc15, #f59e0b);
                color: #111827 !important;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 800;
                font-size: 15px;
                box-shadow: 0 10px 20px rgba(250,204,21,0.15);
            }

            .divider {
                height: 1px;
                background: rgba(255,255,255,0.06);
                margin: 45px 0;
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
                margin-top: 16px;
            }

            .footer-links a {
                color: #facc15;
                text-decoration: none;
                margin: 0 8px;
                font-size: 13px;
            }

            @media only screen and (max-width: 640px) {

                .features {
                    grid-template-columns: 1fr;
                }

                .hero {
                    padding: 50px 25px;
                }

                .content {
                    padding: 35px 24px;
                }

                .hero-title {
                    font-size: 28px;
                }

                .logo {
                    font-size: 32px;
                }

            }

        </style>

    </head>

    <body>

        <div class="container">

            <div class="hero">

                <div class="logo">
                    KULTURE
                </div>

                <div class="tagline">
                    Révéler et propulser la culture africaine
                </div>

                <div class="hero-title">
                    Bienvenue dans l’univers Kulture
                </div>

                <div class="hero-text">
                    Découvrez les artistes, événements,
                    œuvres et expériences qui font vibrer
                    la culture africaine moderne.
                </div>

            </div>

            <div class="content">

                <h2>
                    Bonjour ${firstName}
                </h2>

                <p>
                    Nous sommes ravis de vous accueillir sur
                    <span class="highlight">Kulture</span>,
                    la plateforme qui connecte les passionnés
                    de culture, les artistes et les créateurs africains.
                </p>

                <p>
                    Votre compte est maintenant actif.
                    Vous pouvez commencer à explorer des événements,
                    soutenir des projets, découvrir des artistes
                    et vivre des expériences culturelles uniques.
                </p>

                <div class="features">

                    <div class="feature-card">

                        <div class="feature-icon">
                            <img src="https://img.icons8.com/fluency-systems-filled/48/facc15/ticket.png" class="feature-icon-img" />
                        </div>

                        <div class="feature-title">
                            Billetterie intelligente
                        </div>

                        <div class="feature-description">
                            Achetez vos tickets d’événements
                            rapidement et en toute sécurité.
                        </div>

                    </div>

                    <div class="feature-card">

                        <div class="feature-icon">
                            <img src="https://img.icons8.com/fluency-systems-filled/48/facc15/microphone.png" class="feature-icon-img" />
                        </div>

                        <div class="feature-title">
                            Découverte d’artistes
                        </div>

                        <div class="feature-description">
                            Explorez les talents émergents
                            et les grandes figures culturelles.
                        </div>

                    </div>

                    <div class="feature-card">

                        <div class="feature-icon">
                            <img src="https://img.icons8.com/fluency-systems-filled/48/facc15/rocket.png" class="feature-icon-img" />
                        </div>

                        <div class="feature-title">
                            Soutien aux projets
                        </div>

                        <div class="feature-description">
                            Participez au financement
                            de projets créatifs et culturels.
                        </div>

                    </div>

                    <div class="feature-card">

                        <div class="feature-icon">
                            <img src="https://img.icons8.com/fluency-systems-filled/48/facc15/musical-notes.png" class="feature-icon-img" />
                        </div>

                        <div class="feature-title">
                            Musique & œuvres
                        </div>

                        <div class="feature-description">
                            Découvrez albums, morceaux,
                            contenus exclusifs et créations originales.
                        </div>

                    </div>

                </div>

                <div class="cta-section">

                    <a href="#" class="btn">
                        Explorer Kulture
                    </a>

                </div>

                <div class="divider"></div>

                <p style="font-size: 14px; color: #9ca3af; text-align: center;">

                    Merci de faire partie de cette nouvelle génération
                    qui valorise et propulse la culture africaine.

                </p>

            </div>

            <div class="footer">

                <p>
                    © 2026 Kulture — La plateforme dédiée aux artistes,
                    événements et expériences culturelles africaines.
                </p>

                <p>
                    Billetterie • Artistes • Crowdfunding • Musique • Œuvres
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
