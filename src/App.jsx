import React, { useState, useEffect } from 'react';

// Dados iniciais simulados para as linhas de autocarros de Campo Grande/MS
const dadosIniciaisLinhas = [
  { id: "080", nome: "Terminal Bandeirantes / Aero Rancho", pontualidade: 62, atrasoMedio: 24, status: "Crítico", passageirosHora: 450, velocidade: 22, placa: "PIM-0801", rotaX: [20, 45, 70, 90], rotaY: [30, 40, 50, 75] },
  { id: "070", nome: "Terminal Bandeirantes / Gen. Osório", pontualidade: 88, atrasoMedio: 7, status: "Normal", passageirosHora: 310, velocidade: 40, placa: "PIM-0702", rotaX: [15, 30, 55, 80], rotaY: [70, 60, 50, 20] },
  { id: "020", nome: "Terminal Central / Terminal Guaicurus", pontualidade: 71, atrasoMedio: 16, status: "Atenção", passageirosHora: 520, velocidade: 31, placa: "PIM-0203", rotaX: [10, 40, 60, 85], rotaY: [20, 45, 55, 80] },
  { id: "051", nome: "Shopping / Bandeirantes", pontualidade: 94, atrasoMedio: 4, status: "Excelente", passageirosHora: 180, velocidade: 45, placa: "PIM-0514", rotaX: [85, 65, 45, 20], rotaY: [15, 35, 45, 60] },
  { id: "081", nome: "Terminal Bandeirantes / Nova Bahia", pontualidade: 55, atrasoMedio: 29, status: "Crítico", passageirosHora: 380, velocidade: 18, placa: "PIM-0815", rotaX: [30, 50, 70, 95], rotaY: [85, 65, 45, 25] },
  { id: "030", nome: "Terminal Hercules Maymone / Centro", pontualidade: 82, atrasoMedio: 9, status: "Normal", passageirosHora: 290, velocidade: 35, placa: "PIM-0306", rotaX: [50, 55, 60, 65], rotaY: [10, 35, 60, 90] }
];

// Alertas iniciais inseridos de forma colaborativa pela população
const alertasIniciais = [
  { id: 1, hora: "12:10", linha: "080", tipo: "Atraso grave", texto: "Avenida Afonso Pena congestionada. O autocarro demorou 25 minutos além do planeado.", autor: "Carlos M.", xpGanho: 15 },
  { id: 2, hora: "11:55", linha: "020", tipo: "Superlotação", texto: "Superlotado desde a saída do terminal Guaicurus.", autor: "Sandra R.", xpGanho: 15 },
  { id: 3, hora: "11:30", linha: "081", tipo: "Ar Desligado", texto: "Calor insuportável na linha 081 e janelas travadas.", autor: "Bruno S.", xpGanho: 15 }
];

// Cupões de parceiros para a gamificação na capital
const cuponsParceiros = [
  { id: "cupom1", titulo: "Salgado + Sumo de 200ml", parceiro: "Lanchonete Term. Bandeirantes", custo: 100, icone: "🍔", categoria: "Alimentação", codigo: "PIMAC-LANCHE-CG" },
  { id: "cupom2", titulo: "10% de Desconto na Cópia/Impressão", parceiro: "Copiadora Central UCDB/UFMS", custo: 150, icone: "📄", categoria: "Serviços", codigo: "PIMAC-COPIA-15" },
  { id: "cupom3", titulo: "Café Expresso Cortesia", parceiro: "Ponto do Café Afonso Pena", custo: 200, icone: "☕", categoria: "Alimentação", codigo: "PIMAC-CAFE-FREE" },
  { id: "cupom4", titulo: "Passe Unitário de Integração", parceiro: "Consórcio Guaicurus (Simulado)", custo: 400, icone: "🚌", categoria: "Transporte", codigo: "PIMAC-PASSE-VIP" }
];

// Contactos urgentes integrados
const contatosEmergencia = [
  { id: "1", nome: "AGETRAN (Trânsito e Transporte)", tel: "118", desc: "Fiscalização e sinalização de vias urbanas de Campo Grande", icone: "🚧" },
  { id: "2", nome: "Consórcio Guaicurus (Ouvidoria)", tel: "0800 647 0060", desc: "Reclamações diretas sobre frotas e atrasos graves", icone: "📞" },
  { id: "3", nome: "Polícia Militar do MS", tel: "190", desc: "Segurança e ocorrências de urgência em terminais", icone: "🚓" },
  { id: "4", nome: "Guarda Civil Metropolitana", tel: "153", desc: "Apoio, rondas e patrulhamento de património público", icone: "🛡️" }
];

// Terminais de Integração de Campo Grande/MS (Oitavo Botão!)
const terminaisIntegracao = [
  { id: "t1", nome: "Terminal Bandeirantes", localizacao: "Av. Bandeirantes", fluxo: "Muito Alto", linhasAtendidas: 14, status: "Operacional", icone: "🏫" },
  { id: "t2", nome: "Terminal Aero Rancho", localizacao: "Av. Thyrson de Almeida", fluxo: "Crítico", linhasAtendidas: 18, status: "Sobrecarga", icone: "🏫" },
  { id: "t3", nome: "Terminal Guaicurus", localizacao: "Av. Gury Marques", fluxo: "Alto", linhasAtendidas: 15, status: "Operacional", icone: "🏫" },
  { id: "t4", nome: "Terminal General Osório", localizacao: "Av. Coronel Antonino", fluxo: "Alto", linhasAtendidas: 16, status: "Operacional", icone: "🏫" },
  { id: "t5", nome: "Terminal Nova Bahia", localizacao: "Av. Cônsul Assaf Trad", fluxo: "Médio", linhasAtendidas: 11, status: "Operacional", icone: "🏫" },
  { id: "t6", nome: "Terminal Morenão", localizacao: "Av. Costa e Silva", fluxo: "Muito Alto", linhasAtendidas: 13, status: "Manutenção Parcial", icone: "🏫" },
  { id: "t7", nome: "Terminal Júlio de Castilho", localizacao: "Av. Júlio de Castilho", fluxo: "Médio", linhasAtendidas: 10, status: "Operacional", icone: "🏫" },
  { id: "t8", nome: "Terminal Hércules Maymone", localizacao: "Rua Joaquim Murtinho", fluxo: "Baixo", linhasAtendidas: 8, status: "Operacional", icone: "🏫" }
];

export default function App() {
  // Estados para gerir a aplicação com validação inteligente de dados antigos
  const [linhas, setLinhas] = useState(() => {
    const salvas = localStorage.getItem('pimac_linhas');
    if (salvas) {
      try {
        const dadosParseados = JSON.parse(salvas);
        if (Array.isArray(dadosParseados) && dadosParseados.length > 0 && dadosParseados[0].rotaX) {
          return dadosParseados;
        }
      } catch (e) {
        console.error("Erro ao carregar linhas:", e);
      }
    }
    return dadosIniciaisLinhas;
  });

  const [alertas, setAlertas] = useState(() => {
    const salvos = localStorage.getItem('pimac_alertas');
    if (salvos) {
      try {
        const dadosParseados = JSON.parse(salvos);
        if (Array.isArray(dadosParseados)) return dadosParseados;
      } catch (e) {
        console.error("Erro ao carregar alertas:", e);
      }
    }
    return alertasIniciais;
  });

  const [userProfile, setUserProfile] = useState(() => {
    const salvo = localStorage.getItem('pimac_profile');
    if (salvo) {
      try {
        return JSON.parse(salvo);
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
      }
    }
    return { nivel: 1, xp: 20, moedas: 120 };
  });

  const [cuponsResgatados, setCuponsResgatados] = useState(() => {
    const salvos = localStorage.getItem('pimac_cupons');
    if (salvos) {
      try {
        return JSON.parse(salvos);
      } catch (e) {
        console.error("Erro ao carregar cupons:", e);
      }
    }
    return [];
  });

  const [activeSection, setActiveSection] = useState('menu'); // Valor padrão 'menu' exibe a tela inicial de botões
  const [clima, setClima] = useState('sunny'); 
  const [filtroPesquisa, setFiltroPesquisa] = useState('');
  const [linhaSelecionada, setLinhaSelecionada] = useState(linhas[0] || dadosIniciaisLinhas[0]);
  const [mapTicks, setMapTicks] = useState(0); 
  const [selectedBus, setSelectedBus] = useState(null);
  const [chamandoContato, setChamandoContato] = useState(null);

  // Estados do Formulário de Denúncias
  const [novaLinhaRelato, setNovaLinhaRelato] = useState('080');
  const [novoTipoRelato, setNovoTipoRelato] = useState('Atraso grave');
  const [novoTextoRelato, setNovoTextoRelato] = useState('');
  const [novoAutorRelato, setNovoAutorRelato] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setMapTicks((prev) => (prev >= 100 ? 0 : prev + 0.4));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('pimac_linhas', JSON.stringify(linhas));
    localStorage.setItem('pimac_alertas', JSON.stringify(alertas));
    localStorage.setItem('pimac_profile', JSON.stringify(userProfile));
    localStorage.setItem('pimac_cupons', JSON.stringify(cuponsResgatados));
  }, [linhas, alertas, userProfile, cuponsResgatados]);

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 4000);
  };

  const lidarComEnvioRelato = (e) => {
    e.preventDefault();
    if (!novoTextoRelato.trim()) {
      mostrarToast("⚠️ Descreva o ocorrido para registar a denúncia.", "warning");
      return;
    }

    const agora = new Date();
    const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const novoAlerta = {
      id: Date.now(),
      hora: horaFormatada,
      linha: novaLinhaRelato,
      tipo: novoTipoRelato,
      texto: novoTextoRelato,
      autor: novoAutorRelato.trim() || "Cidadão Anónimo",
      xpGanho: 15
    };

    setAlertas([novoAlerta, ...alertas]);

    // Simula impacto no tráfego da linha após denúncia
    setLinhas(prev => prev.map(l => {
      if (l.id === novaLinhaRelato) {
        const novoAtraso = l.atrasoMedio + 5;
        const novaPontualidade = Math.max(30, l.pontualidade - 6);
        return { 
          ...l, 
          atrasoMedio: novoAtraso, 
          pontualidade: novaPontualidade, 
          status: novoAtraso > 20 ? "Crítico" : "Atenção" 
        };
      }
      return l;
    }));

    // Sistema de Pontuação e Recompensa do Cidadão
    setUserProfile(prev => {
      let novoXp = prev.xp + 25;
      let novoNivel = prev.nivel;
      if (novoXp >= 100) {
        novoXp -= 100;
        novoNivel += 1;
        mostrarToast(`🎉 EXCELENTE! Subiu para o Nível ${novoNivel}!`, 'level');
      }
      return {
        nivel: novoNivel,
        xp: novoXp,
        moedas: prev.moedas + 50
      };
    });

    setNovoTextoRelato('');
    setNovoAutorRelato('');
    mostrarToast("✅ Denúncia enviada! Ganhou +25 XP e +50 Moedas!");
  };

  const aplicarClima = (novoClima) => {
    setClima(novoClima);
    if (novoClima === 'rainy') {
      setLinhas(prev => prev.map(l => ({
        ...l,
        atrasoMedio: l.atrasoMedio + 12,
        pontualidade: Math.max(35, l.pontualidade - 18),
        velocidade: Math.max(12, l.velocidade - 10),
        status: "Crítico"
      })));
      mostrarToast("🌧️ Temporal Ativado: Tráfego lento e atrasos severos nas vias principais!", "info");
    } else if (novoClima === 'pico') {
      setLinhas(prev => prev.map(l => ({
        ...l,
        passageirosHora: Math.round(l.passageirosHora * 1.5),
        atrasoMedio: l.atrasoMedio + 6,
        pontualidade: Math.max(40, l.pontualidade - 10),
        status: l.atrasoMedio > 20 ? "Crítico" : "Atenção"
      })));
      mostrarToast("🚗 Hora de Ponta Ativada: Lotações e procuras máximas registadas!", "info");
    } else {
      setLinhas(dadosIniciaisLinhas);
      mostrarToast("☀️ Dia Normal Ativado: Métricas normais restabelecidas.");
    }
  };

  const resgatarCupom = (cupom) => {
    if (userProfile.moedas < cupom.custo) {
      mostrarToast("❌ Saldo de moedas insuficiente. Continue a auditar!", "warning");
      return;
    }

    setUserProfile(prev => ({ ...prev, moedas: prev.moedas - cupom.custo }));
    setCuponsResgatados([ { ...cupom, resgatadoEm: new Date().toLocaleDateString('pt-BR') }, ...cuponsResgatados ]);
    mostrarToast(`🎁 Cupão resgatado! Código: ${cupom.codigo}`);
  };

  const simularLigacao = (contato) => {
    setChamandoContato(contato);
    mostrarToast(`📞 A discar para ${contato.nome}...`);
  };

  const limparBancoDeDados = () => {
    localStorage.clear();
    setLinhas(dadosIniciaisLinhas);
    setAlertas(alertasIniciais);
    setUserProfile({ nivel: 1, xp: 20, moedas: 120 });
    setCuponsResgatados([]);
    setActiveSection('menu');
    mostrarToast("🧹 Base de dados do navegador limpa com sucesso.");
  };

  const calcularPosicaoOnibus = (rotaX, rotaY) => {
    if (!rotaX || !rotaY || rotaX.length === 0) return { x: 0, y: 0 };
    const index = Math.floor((mapTicks / 100) * (rotaX.length - 1));
    const nextIndex = (index + 1) % rotaX.length;
    const interpolado = (mapTicks / 100) * (rotaX.length - 1) - index;

    const x = rotaX[index] + (rotaX[nextIndex] - rotaX[index]) * interpolado;
    const y = rotaY[index] + (rotaY[nextIndex] - rotaY[index]) * interpolado;
    return { x, y };
  };

  const linhasFiltradas = linhas.filter(l => 
    l.id.includes(filtroPesquisa) || l.nome.toLowerCase().includes(filtroPesquisa.toLowerCase())
  );

  const totalCo2Evitado = alertas.length * 4.5;

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans p-4 md:p-6 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* OVERLAY DE SIMULAÇÃO DE LIGAÇÃO */}
      {chamandoContato && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-neutral-900 border border-emerald-500/30 p-8 rounded-3xl text-center max-w-sm w-full animate-pulse shadow-[0_0_50px_rgba(16,185,129,0.15)]">
            <span className="text-5xl block mb-4">📞</span>
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-bold">A Discar Integrado MS</p>
            <h3 className="text-xl font-black text-slate-100 mt-2">{chamandoContato.nome}</h3>
            <p className="text-lg font-mono text-emerald-400 mt-2">{chamandoContato.tel}</p>
            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">A estabelecer ligação segura de simulação de voz via PIMAC...</p>
            <button 
              onClick={() => setChamandoContato(null)} 
              className="mt-6 px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Desligar Chamada
            </button>
          </div>
        </div>
      )}

      {/* SISTEMA DE TOAST */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-5 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border animate-bounce ${
          toast.tipo === 'warning' ? 'bg-amber-950/90 border-amber-500 text-amber-300' : 
          toast.tipo === 'info' ? 'bg-blue-950/90 border-blue-500 text-blue-300' : 
          toast.tipo === 'level' ? 'bg-fuchsia-950/90 border-fuchsia-500 text-fuchsia-300' :
          'bg-slate-900/90 border-emerald-500 text-emerald-400'
        }`}>
          <span className="text-xl">📢</span>
          <span className="font-semibold text-sm text-center">{toast.msg}</span>
        </div>
      )}

      {/* -------------------- CABEÇALHO GERAL -------------------- */}
      {activeSection !== 'menu' && (
        <header className="max-w-7xl mx-auto mb-8 bg-neutral-950 border border-neutral-900 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <button 
            onClick={() => setActiveSection('menu')}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 font-extrabold text-xs uppercase tracking-wider rounded-xl transition duration-300 flex items-center gap-2 cursor-pointer"
          >
            <span>←</span> Voltar ao Menu Principal
          </button>
          
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 1000 700" className="w-10 h-auto rounded border border-neutral-800">
              <rect width="1000" height="700" fill="#0038A8" />
              <polygon points="0,0 550,700 0,700" fill="#009A44" />
              <polygon points="0,0 600,700 550,700" fill="#FFFFFF" />
              <polygon points="770,390 788,435 835,435 798,465 812,510 770,482 728,510 742,465 705,435 752,435" fill="#FFCD00" />
            </svg>
            <div>
              <span className="text-xs font-black tracking-wider text-emerald-400 block">PIMAC</span>
              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">MS Centralizado</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-slate-300">
              Nível {userProfile.nivel} • {userProfile.moedas} Mob
            </div>
          </div>
        </header>
      )}

      {/* -------------------- TELA INICIAL: MENU PRINCIPAL DE 8 BOTÕES -------------------- */}
      {activeSection === 'menu' && (
        <div className="animate-fadeIn max-w-7xl mx-auto">
          {/* BANDEIRA DO MATO GROSSO DO SUL NO TOPO */}
          <div className="text-center pt-4 mb-6">
            <svg viewBox="0 0 1000 700" className="w-32 md:w-40 h-auto mx-auto rounded-lg shadow-[0_0_25px_rgba(0,56,168,0.25)] border border-neutral-900 mb-4">
              <rect width="1000" height="700" fill="#0038A8" />
              <polygon points="0,0 550,700 0,700" fill="#009A44" />
              <polygon points="0,0 600,700 550,700" fill="#FFFFFF" />
              <polygon points="770,390 788,435 835,435 798,465 812,510 770,482 728,510 742,465 705,435 752,435" fill="#FFCD00" />
            </svg>

            {/* LOGÓTIPO PIMAC */}
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 glow-text-emerald">
              PIMAC
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] mt-2 font-semibold">
              Plataforma Integrada de Mobilidade e Auditoria Cidadã
            </p>
          </div>

          {/* PERFIL DO AUDITOR COMPACTO NA TELA PRINCIPAL */}
          <section className="max-w-4xl mx-auto mb-8 bg-neutral-900/30 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center font-black text-black shadow-md">
                <span className="text-[8px] absolute -top-1.5 -right-1.5 bg-fuchsia-600 text-white rounded-full px-1.5 py-0.5 font-bold">LVL</span>
                {userProfile.nivel}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Perfil do Auditor</p>
                <div className="flex items-center space-x-2 w-36 mt-1">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${userProfile.xp}%` }}></div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{userProfile.xp}/100 XP</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
                <span className="text-lg">🪙</span>
                <div>
                  <span className="text-[9px] text-amber-500/80 block font-bold tracking-widest">CRÉDITOS</span>
                  <span className="font-mono text-xs font-bold text-amber-400">{userProfile.moedas} Mob</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20">
                <span className="text-lg">🍃</span>
                <div>
                  <span className="text-[9px] text-blue-400 block font-bold tracking-widest">CO₂ EVITADO</span>
                  <span className="font-mono text-xs font-bold text-blue-400">-{totalCo2Evitado} kg</span>
                </div>
              </div>
            </div>
          </section>

          {/* GRELHA HARMÓNICA DE 8 BOTÕES (2 LINHAS DE 4 EM DESKTOP / 4 LINHAS DE 2 EM MOBILE) */}
          <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            
            {/* BOTÃO 1 - AZUL */}
            <button 
              onClick={() => setActiveSection('mapa')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-blue-900 bg-blue-950/10 hover:bg-blue-950/30 hover:border-blue-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">🗺️</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Mapa Interativo</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">Acompanhe rotas e frotas ativas ao vivo.</p>
              </div>
            </button>

            {/* BOTÃO 2 - VERDE */}
            <button 
              onClick={() => setActiveSection('frota')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-emerald-900 bg-emerald-950/10 hover:bg-emerald-950/30 hover:border-emerald-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">🚍</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Estado da Frota</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">Métricas e pontualidade de cada autocarro.</p>
              </div>
            </button>

            {/* BOTÃO 3 - AZUL */}
            <button 
              onClick={() => setActiveSection('denuncias')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-blue-900 bg-blue-950/10 hover:bg-blue-950/30 hover:border-blue-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">✍️</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Denúncias & Relatos</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">Registe reclamações ou problemas de lotação.</p>
              </div>
            </button>

            {/* BOTÃO 4 - VERDE (NOVA FUNCIONALIDADE - 8º BOTÃO!) */}
            <button 
              onClick={() => setActiveSection('terminais')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-emerald-900 bg-emerald-950/10 hover:bg-emerald-950/30 hover:border-emerald-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">🏫</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Terminais MS</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">Localização e estado operacional dos terminais.</p>
              </div>
            </button>

            {/* BOTÃO 5 - AZUL */}
            <button 
              onClick={() => setActiveSection('recompensas')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-blue-900 bg-blue-950/10 hover:bg-blue-950/30 hover:border-blue-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">🎁</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Recompensas</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">Consiga créditos por fiscalizar a cidade.</p>
              </div>
            </button>

            {/* BOTÃO 6 - VERDE */}
            <button 
              onClick={() => setActiveSection('loja')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-emerald-900 bg-emerald-950/10 hover:bg-emerald-950/30 hover:border-emerald-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">🎫</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Lojas e Cupões</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">Troque créditos por vantagens locais.</p>
              </div>
            </button>

            {/* BOTÃO 7 - AZUL */}
            <button 
              onClick={() => setActiveSection('contatos')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-blue-900 bg-blue-950/10 hover:bg-blue-950/30 hover:border-blue-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">📞</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Contatos Úteis</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">Telefones de urgência e ouvidorias.</p>
              </div>
            </button>

            {/* BOTÃO 8 - VERDE */}
            <button 
              onClick={() => setActiveSection('ambiental')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-emerald-900 bg-emerald-950/10 hover:bg-emerald-950/30 hover:border-emerald-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">🍃</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Impacto CO₂</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">Resultados ecológicos da fiscalização.</p>
              </div>
            </button>

          </section>
        </div>
      )}

      {/* -------------------- ECRÃS DINÂMICOS (NAVEGAÇÃO TOTAL) -------------------- */}
      {activeSection !== 'menu' && (
        <main className="max-w-7xl mx-auto animate-fadeIn mb-12">
          
          {/* ECRÃ 1: MAPA INTERATIVO */}
          {activeSection === 'mapa' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl shadow-xl">
                <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">📍 Monitor de Linhas e Veículos Ativos</h2>
                
                <div className="aspect-video bg-black rounded-xl border border-neutral-800 relative overflow-hidden flex items-center justify-center">
                  {/* SVG de Linhas do Mapa */}
                  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0V100M40 0V100M70 0V100M90 0V100" stroke="#475569" strokeWidth="0.5"/>
                    <path d="M0 20H100M0 50H100M0 80H100" stroke="#475569" strokeWidth="0.5"/>
                    {linhas.map(linha => {
                      const dPath = `M ${linha.rotaX.map((x, i) => `${x} ${linha.rotaY[i]}`).join(' L ')}`;
                      return (
                        <path 
                          key={linha.id} 
                          d={dPath} 
                          stroke={linha.id === "080" ? "#3b82f6" : "#10b981"} 
                          strokeWidth="0.8" 
                          strokeDasharray="2 3" 
                        />
                      );
                    })}
                  </svg>

                  {/* Renderizar autocarros móveis */}
                  {linhas.map(linha => {
                    const pos = calcularPosicaoOnibus(linha.rotaX, linha.rotaY);
                    const colorClass = linha.status === 'Crítico' ? 'bg-rose-500 shadow-rose-500/40' : 'bg-emerald-500 shadow-emerald-500/40';
                    return (
                      <button
                        key={linha.id}
                        onClick={() => setSelectedBus(linha)}
                        className={`absolute w-4.5 h-4.5 rounded-full border border-black flex items-center justify-center text-[7px] font-black text-black shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer ${colorClass}`}
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      >
                        {linha.id.slice(1)}
                      </button>
                    );
                  })}

                  {/* Painel do Autocarro Selecionado */}
                  {selectedBus && (
                    <div className="absolute bottom-4 right-4 bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-2xl max-w-xs text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-emerald-400">#Frota {selectedBus.id}</span>
                        <button onClick={() => setSelectedBus(null)} className="text-slate-500 hover:text-white">×</button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{selectedBus.nome}</p>
                      <p className="text-[9px] text-slate-300 font-mono mt-1">Velocidade: {selectedBus.velocidade} km/h • Placa: {selectedBus.placa}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Diagnóstico do Mapa</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pode clicar em qualquer ícone de autocarro para aceder aos metadados de velocidade e placa. Para testar o stress do mapa, use o painel climático abaixo.
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-850 text-xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Precisão Populacional</span>
                  <span className="text-emerald-400 font-extrabold text-sm">96.4% de correspondência ao vivo</span>
                </div>
              </div>
            </div>
          )}

          {/* ECRÃ 2: ESTADO DA FROTA */}
          {activeSection === 'frota' && (
            <div className="bg-neutral-900/30 border border-neutral-900 p-6 rounded-2xl shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">🚍 Monitorização de Desempenho Operacional</h2>
                  <p className="text-xs text-slate-500">Métricas analíticas consolidadas de pontualidade municipal.</p>
                </div>
                <input
                  type="text"
                  placeholder="Filtrar por linha..."
                  value={filtroPesquisa}
                  onChange={(e) => setFiltroPesquisa(e.target.value)}
                  className="bg-black border border-neutral-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-850 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3 pl-2">Linha</th>
                      <th className="pb-3">Itinerário</th>
                      <th className="pb-3 text-center">Pontualidade</th>
                      <th className="pb-3 text-center">Atraso Médio</th>
                      <th className="pb-3 text-right pr-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-xs">
                    {linhasFiltradas.map(linha => (
                      <tr key={linha.id} className="hover:bg-neutral-900/10">
                        <td className="py-3.5 pl-2 font-bold text-emerald-400">#{linha.id}</td>
                        <td>
                          <p className="font-semibold text-slate-200">{linha.nome}</p>
                          <p className="text-[10px] text-slate-500">{linha.placa}</p>
                        </td>
                        <td className="text-center font-bold text-slate-200">{linha.pontualidade}%</td>
                        <td className="text-center font-mono text-rose-400 font-bold">{linha.atrasoMedio} min</td>
                        <td className="text-right pr-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${linha.status === 'Crítico' ? 'bg-rose-950/40 text-rose-400' : 'bg-emerald-950/40 text-emerald-400'}`}>{linha.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ECRÃ 3: FAZER DENÚNCIAS & MURAL */}
          {activeSection === 'denuncias' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl shadow-xl">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">✍️ Criar Nova Denúncia</h3>
                
                <form onSubmit={lidarComEnvioRelato} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Selecione a Linha</label>
                    <select 
                      value={novaLinhaRelato}
                      onChange={(e) => setNovaLinhaRelato(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                    >
                      {linhas.map(l => (
                        <option key={l.id} value={l.id}>#{l.id} - {l.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Problema</label>
                      <select 
                        value={novoTipoRelato}
                        onChange={(e) => setNovoTipoRelato(e.target.value)}
                        className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="Atraso grave">Atraso grave</option>
                        <option value="Superlotação">Superlotação</option>
                        <option value="Condução perigosa">Condução perigosa</option>
                        <option value="Ar-Condicionado Desligado">Ar Desligado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Seu Nome</label>
                      <input 
                        type="text" 
                        placeholder="Anónimo"
                        value={novoAutorRelato}
                        onChange={(e) => setNovoAutorRelato(e.target.value)}
                        className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Detalhes da Ocorrência</label>
                    <textarea 
                      rows="3"
                      placeholder="Descreva o ocorrido de forma sucinta..."
                      value={novoTextoRelato}
                      onChange={(e) => setNovoTextoRelato(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none resize-none placeholder:text-slate-700"
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer">
                    Enviar Auditoria (+25 XP)
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl shadow-xl">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">🔔 Histórico do Mural Coletivo</h3>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {alertas.map(alerta => (
                    <div key={alerta.id} className="bg-black border border-neutral-850 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] bg-rose-950/40 text-rose-400 border border-rose-900/40 px-2 py-0.5 rounded font-bold uppercase">{alerta.tipo}</span>
                        <span className="text-[10px] text-slate-500">{alerta.hora} • Linha #{alerta.linha}</span>
                      </div>
                      <p className="text-xs text-slate-300 italic mt-2">"{alerta.texto}"</p>
                      <span className="text-[9px] text-slate-500 block text-right mt-2">— {alerta.autor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ECRÃ 4: TERMINAIS DE INTEGRAÇÃO (OITAVO BOTÃO!) */}
          {activeSection === 'terminais' && (
            <div className="bg-neutral-900/30 border border-neutral-900 p-6 rounded-2xl shadow-xl">
              <div className="mb-6">
                <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">🏫 Terminais de Integração de Campo Grande/MS</h2>
                <p className="text-xs text-slate-500">Consulte o estado operacional, localização e fluxo de passageiros em tempo real.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {terminaisIntegracao.map(terminal => (
                  <div key={terminal.id} className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-500/30 transition">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-3xl">{terminal.icone}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                          terminal.status === 'Sobrecarga' ? 'bg-rose-950 text-rose-400 border border-rose-900/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-900/30'
                        }`}>
                          {terminal.status}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-200 mt-4">{terminal.nome}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">{terminal.localizacao}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-900 flex justify-between text-[10px]">
                      <div>
                        <span className="text-slate-500 block font-bold">Fluxo</span>
                        <span className="font-semibold text-slate-300">{terminal.fluxo}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-bold">Linhas</span>
                        <span className="font-semibold text-slate-300">{terminal.linhasAtendidas} ativas</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ECRÃ 5: RECOMPENSAS INFO */}
          {activeSection === 'recompensas' && (
            <div className="bg-neutral-900/30 border border-neutral-900 p-8 rounded-2xl text-center max-w-2xl mx-auto shadow-xl">
              <span className="text-5xl">🏆</span>
              <h2 className="text-base font-bold text-emerald-400 uppercase tracking-wider mt-4">Sistema de Recompensas PIMAC</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Cada denúncia ou fiscalização que envia na nossa plataforma ajuda a sinalizar os maiores congestionamentos e atrasos na capital de Mato Grosso do Sul.
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Ao participar, acumula **Moedas de Mobilidade (Mob)** e ganha **XP** para subir de nível. Os créditos virtuais acumulados podem ser trocados por cupões de consumo reais em parceiros comerciais perto de terminais!
              </p>
            </div>
          )}

          {/* ECRÃ 6: LOJAS E CUPONS */}
          {activeSection === 'loja' && (
            <div className="space-y-6">
              <div className="bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl shadow-xl">
                <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider">🛍️ Central de Resgate de Cupões</h2>
                <p className="text-xs text-slate-400">Troque os seus pontos Mob obtidos por salgados, café ou vantagens locais.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cuponsParceiros.map(cupom => {
                  const jaResgatou = cuponsResgatados.some(c => c.id === cupom.id);
                  const saldoInsuficiente = userProfile.moedas < cupom.custo;
                  return (
                    <div key={cupom.id} className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex flex-col justify-between hover:border-blue-500/20 transition">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-3xl">{cupom.icone}</span>
                          <span className="bg-amber-500/10 text-amber-400 text-[9px] px-2 py-0.5 rounded-full font-bold">{cupom.categoria}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-100 mt-3">{cupom.titulo}</h4>
                        <p className="text-[10px] text-slate-500">{cupom.parceiro}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-850 flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-amber-400">{cupom.custo} Mob</span>
                        {jaResgatou ? (
                          <span className="text-[10px] text-slate-500 font-bold">Resgatado ✓</span>
                        ) : (
                          <button 
                            onClick={() => resgatarCupom(cupom)}
                            disabled={saldoInsuficiente}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer ${saldoInsuficiente ? 'bg-neutral-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                          >
                            Resgatar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {cuponsResgatados.length > 0 && (
                <div className="bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl shadow-xl">
                  <h3 className="text-xs font-bold text-slate-200 mb-3">🎫 Seus Cupões Ativos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cuponsResgatados.map((cupom, idx) => (
                      <div key={idx} className="bg-black border border-neutral-800 p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{cupom.titulo}</h4>
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded mt-2 inline-block font-bold">{cupom.codigo}</span>
                        </div>
                        <span className="text-2xl">🎟️</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ECRÃ 7: CONTATOS ÚTEIS */}
          {activeSection === 'contatos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contatosEmergencia.map(contato => (
                <div key={contato.id} className="bg-neutral-900/30 border border-neutral-900 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{contato.icone}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{contato.nome}</h4>
                      <p className="text-[10px] text-slate-500 leading-tight">{contato.desc}</p>
                      <span className="text-xs font-mono font-bold text-emerald-400 block mt-1">{contato.tel}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => simularLigacao(contato)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-black font-bold text-[10px] uppercase rounded-lg transition cursor-pointer border-none"
                  >
                    Ligar
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ECRÃ 8: IMPACTO CO2 */}
          {activeSection === 'ambiental' && (
            <div className="bg-neutral-900/30 border border-neutral-900 p-6 rounded-2xl max-w-2xl mx-auto text-center shadow-xl">
              <span className="text-4xl block mb-2">🍃</span>
              <h2 className="text-base font-bold text-blue-400 uppercase tracking-wider">Descarbonização & Mobilidade Limpa</h2>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                As nossas estimativas mostram que uma fiscalização cidadã em Campo Grande ajuda a reduzir gargalos de trânsito. Isso otimiza o fluxo dos autocarros e previne que as frotas fiquem paradas com o motor ligado no ralenti.
              </p>
              <div className="mt-6 p-4 bg-black border border-neutral-850 rounded-xl inline-block">
                <span className="text-2xl font-mono font-black text-emerald-400">-{totalCo2Evitado} kg CO₂</span>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Total Poupado nas Suas Auditorias</p>
              </div>
            </div>
          )}

        </main>
      )}

      {/* -------------------- SIMULADOR DE CLIMA INTEGRADO (RODAPÉ DOS ECRÃS INTERNOS) -------------------- */}
      {activeSection !== 'menu' && (
        <section className="bg-neutral-900/30 border border-neutral-900 p-4 rounded-2xl mt-8 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Cenário de Simulação Operacional</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Altere o clima para simular o comportamento de tráfego de Campo Grande.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => aplicarClima('sunny')} 
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${clima === 'sunny' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-transparent border-neutral-800 text-slate-500 hover:bg-neutral-900'}`}
            >
              ☀️ Dia Normal
            </button>
            <button 
              onClick={() => aplicarClima('rainy')} 
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${clima === 'rainy' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-transparent border-neutral-800 text-slate-500 hover:bg-neutral-900'}`}
            >
              🌧️ Temporal (MS)
            </button>
            <button 
              onClick={() => aplicarClima('pico')} 
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${clima === 'pico' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-transparent border-neutral-800 text-slate-500 hover:bg-neutral-900'}`}
            >
              🚗 Hora de Pico
            </button>
          </div>
        </section>
      )}

      {/* RODAPÉ */}
      <footer className="mt-12 text-center text-[10px] text-slate-600 border-t border-neutral-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <p>PIMAC • Plataforma de Auditoria Cidadã Integrada do Mato Grosso do Sul • Protótipo de Testes Locais.</p>
        <button onClick={limparBancoDeDados} className="text-slate-500 hover:text-slate-300 underline cursor-pointer bg-transparent border-none">
          🧹 Repor Base de Dados do Navegador
        </button>
      </footer>

    </div>
  );
}