import React from 'react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">

      {/* HERO SECTION */}
      <section className="relative w-full h-[600px] flex flex-col items-center justify-center bg-slate-900 bg-[url('/imgs/pharm.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Trouvez vos médicaments en un clic</h1>
          <p className="text-xl md:text-2xl text-gray-200 font-medium mb-12">Comparez les prix, vérifiez la disponibilité et commandez en toute sécurité auprès de nos 150+ pharmacies partenaires.</p>
        </div>

        {/* SEARCH WIDGET */}
        <div className="absolute -bottom-20 w-full max-w-6xl px-4 z-20">
          <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-10 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-emerald-900 mb-3 ml-1">Nom du médicament</label>
                <input type="text" placeholder="Ex: Paracétamol, Vitamine C..." className="w-full bg-gray-50 border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400" />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-emerald-900 mb-3 ml-1">Localisation</label>
                <input type="text" placeholder="Votre ville ou quartier" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400" />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-emerald-900 mb-3 ml-1 text-center">Qté</label>
                <input type="number" defaultValue={1} min={1} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-lg text-center focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
            </div>

            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all text-xl shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.3)] hover:-translate-y-0.5">
              Rechercher maintenant
            </button>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="text-sm font-bold text-gray-400">Recherches fréquentes :</span>
              {['Doliprane', 'Vitamine C', 'Test COVID', 'Masques', 'Sirop'].map((tag) => (
                <span key={tag} className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl cursor-pointer hover:bg-emerald-100 transition-all border border-emerald-100/50">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-32"></div>

      {/* SUGGESTIONS SECTION */}
      <section className="max-w-[1600px] mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Services & Suggestions</h2>
            <p className="text-xl text-gray-500">Tout ce dont vous avez besoin pour votre santé au quotidien.</p>
          </div>
          <button className="hidden md:block text-emerald-600 font-bold border-b-2 border-emerald-600 pb-1 hover:text-emerald-700 transition-colors">Voir tout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: 'Pharmacies de garde', desc: "Trouvez instantanément les pharmacies ouvertes 24h/24 autour de vous.", icon: "🏪", color: "bg-emerald-100", textColor: "text-emerald-600" },
            { title: 'Réserve de Médicaments', desc: "Réservez vos produits et récupérez-les sans attendre en pharmacie.", icon: "💊", color: "bg-blue-100", textColor: "text-blue-600" },
            { title: 'Livraison Rapide', desc: "Faites-vous livrer vos ordonnances à domicile en moins de 60 minutes.", icon: "🚚", color: "bg-orange-100", textColor: "text-orange-600" }
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div>
                <div className={`${card.color} ${card.textColor} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner`}>{card.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{card.title}</h3>
                <p className="text-lg text-gray-500 leading-relaxed mb-8">{card.desc}</p>
              </div>
              <button className="w-fit bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-2xl transition-colors">Détails</button>
            </div>
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="w-full bg-emerald-600 py-24 my-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-[1600px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-white text-center">
            {[
              { val: '150+', label: 'Pharmacies partenaires' },
              { val: '24/7', label: 'Service de garde' },
              { val: '10k+', label: 'Utilisateurs actifs' },
              { val: '-15%', label: 'D\'économie moyenne' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-6xl font-black mb-4 tracking-tighter">{stat.val}</span>
                <span className="text-emerald-50 text-lg font-bold opacity-80 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-[1600px] mx-auto px-6 py-24">
        <h2 className="text-4xl font-black text-center text-gray-900 mb-20 tracking-tight">Comment ça marche ?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { step: '01', title: 'Recherchez', desc: 'Saisissez le nom du médicament et votre localisation pour voir les stocks disponibles.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> },
            { step: '02', title: 'Sélectionnez', desc: 'Comparez les prix et choisissez la pharmacie la plus proche de chez vous.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
            { step: '03', title: 'Commandez', desc: 'Passez commande en toute sécurité et recevez une confirmation instantanée.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg> },
            { step: '04', title: 'Livraison', desc: "Recevez vos produits chez vous ou récupérez-les en pharmacie sans attendre.", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg> }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-[3rem] p-12 shadow-[0_10px_50px_rgba(0,0,0,0.03)] border border-gray-100 text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <span className="absolute -top-10 -right-10 text-[12rem] font-black text-gray-50 opacity-40 group-hover:text-emerald-50 transition-all duration-500 pointer-events-none leading-none">{item.step}</span>
              <div className="text-emerald-600 mb-10 flex justify-center relative z-10">{item.icon}</div>
              <h3 className="font-bold text-gray-900 text-2xl mb-6 relative z-10">{item.title}</h3>
              <p className="text-gray-500 text-lg leading-relaxed relative z-10">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="w-full bg-slate-900 py-32 overflow-hidden relative">
        <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-black text-white mb-10 tracking-tight leading-tight">Pourquoi faire confiance à <span className="text-emerald-500">DOTO</span> ?</h2>
            <div className="space-y-10">
              {[
                { title: 'Transparence totale', desc: 'Accédez aux prix réels et comparez avant d\'acheter.' },
                { title: 'Qualité certifiée', desc: 'Toutes nos pharmacies partenaires sont agréées par l\'Ordre des Pharmaciens.' },
                { title: 'Données sécurisées', desc: 'Vos données de santé sont cryptées et protégées selon les normes RGPD.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 flex-shrink-0 mt-1">✓</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="w-full aspect-square bg-emerald-600/10 rounded-[4rem] border border-emerald-500/20 flex items-center justify-center overflow-hidden shadow-2xl">
              <img src="/imgs/pharm.jpg" alt="Pharmacy Professional" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl max-w-xs">
              <p className="text-emerald-600 font-black text-3xl mb-1">98%</p>
              <p className="text-gray-900 font-bold text-lg">de satisfaction client</p>
              <p className="text-gray-500 text-sm mt-2">Basé sur plus de 5000 avis vérifiés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="max-w-[1600px] mx-auto px-6 py-32">
        <div className="bg-emerald-600 rounded-[4rem] p-16 md:p-24 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="relative z-10 md:w-2/3 text-center md:text-left mb-12 md:mb-0">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Prêt à simplifier votre santé ?</h2>
            <p className="text-emerald-50 text-xl md:text-2xl mb-12 font-medium opacity-90 max-w-2xl">Rejoignez des milliers de patients et profitez d'un accès simplifié aux médicaments de qualité.</p>
            <button className="bg-white text-emerald-600 hover:bg-emerald-50 font-black py-6 px-12 rounded-[2rem] text-2xl transition-all shadow-xl hover:-translate-y-1">
              Commencer maintenant
            </button>
          </div>
          <div className="relative z-10 w-64 h-64 bg-white/10 backdrop-blur-xl rounded-[3rem] flex items-center justify-center border border-white/20 shadow-inner">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-32 h-32 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
             </svg>
          </div>
        </div>
      </section>

    </div>
  );
}
