import React, { useState, useEffect } from 'react';

// Dados iniciais simulados para o MVP das linhas de autocarros
const dadosIniciaisLinhas = [
  { id: "080", nome: "Term. Bandeirantes / Aero Rancho", pontualidade: 62, atrasoMedio: 24, status: "Crítico", passageirosHora: 450, velocidade: 22, placa: "PIM-0801", rotaX: [20, 45, 70, 90], rotaY: [30, 40, 50, 75] },
  { id: "070", nome: "Term. Bandeirantes / Gen. Osório", pontualidade: 88, atrasoMedio: 7, status: "Normal", passageirosHora: 310, velocidade: 40, placa: "PIM-0702", rotaX: [15, 30, 55, 80], rotaY: [70, 60, 50, 20] },
  { id: "020", nome: "Term. Central / Term. Guaicurus", pontualidade: 71, atrasoMedio: 16, status: "Atenção", passageirosHora: 520, velocidade: 31, placa: "PIM-0203", rotaX: [10, 40, 60, 85], rotaY: [20, 45, 55, 80] },
  { id: "051", nome: "Shopping / Bandeirantes", pontualidade: 94, atrasoMedio: 4, status: "Excelente", passageirosHora: 180, velocidade: 45, placa: "PIM-0514", rotaX: [85, 65, 45, 20], rotaY: [15, 35, 45, 60] }
];

// Alertas iniciais da população
const alertasIniciais = [
  { id: 1, hora: "12:10", linha: "080", tipo: "Atraso grave", texto: "Afonso Pena congestionada. O autocarro demorou 25 minutos além do planeado.", autor: "Carlos M.", xpGanho: 15 },
  { id: 2, hora: "11:55", linha: "020", tipo: "Superlotação", texto: "Superlotado desde a saída do terminal Guaicurus.", autor: "Sandra R.", xpGanho: 15 }
];

// Cupões de parceiros para a gamificação
const cuponsParceiros = [
  { id: "cupom1", titulo: "Salgado + Sumo de 200ml", parceiro: "Lanchonete Term. Bandeirantes", custo: 100, icone: "🍔", categoria: "Alimentação", codigo: "PIMAC-LANCHE-98" },
  { id: "cupom2", titulo: "10% de Desconto na Cópia/Impressão", parceiro: "Copiadora Central UCDB/UFMS", custo: 150, icone: "📄", categoria: "Serviços", codigo: "PIMAC-COPIA-15" },
  { id: "cupom3", titulo: "Café Expresso de Cortesia", parceiro: "Ponto do Café Afonso Pena", custo: 200, icone: "☕", categoria: "Alimentação", codigo: "PIMAC-CAFE-FREE" },
  { id: "cupom4", titulo: "Bilhete de Integração de Viagem", parceiro: "Consórcio Local (Simulado)", custo: 400, icone: "🚌", categoria: "Transporte", codigo: "PIMAC-PASSE-LOCAL" }
];

export default function App() {
  // Estados para gerir a aplicação com validação inteligente de dados antigos
  const [linhas, setLinhas] = useState(() => {
    const salvas = localStorage.getItem('pimac_linhas');
    if (salvas) {
      try {
        const dadosParseados = JSON.parse(salvas);
        // Se os dados salvos forem da versão antiga (sem rotaX), rejeitamos para evitar erros
        if (Array.isArray(dadosParseados) && dadosParseados.length > 0 && dadosParseados[0].rotaX) {
          return dadosParseados;
        }
      } catch (e) {
        console.error("Erro ao carregar linhas do localStorage:", e);
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
        console.error("Erro ao carregar alertas do localStorage:", e);
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
        console.error("Erro ao carregar perfil do localStorage:", e);
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
        console.error("Erro ao carregar cupões do localStorage:", e);
      }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'rewards' | 'analytics'
  const [clima, setClima] = useState('sunny'); // 'sunny' | 'rainy' | 'pico'
  const [filtroPesquisa, setFiltroPesquisa] = useState('');
  const [linhaSelecionada, setLinhaSelecionada] = useState(linhas[0] || dadosIniciaisLinhas[0]);
  const [mapTicks, setMapTicks] = useState(0); // Controla a posição dos autocarros na animação do mapa
  const [selectedBus, setSelectedBus] = useState(null);

  // Estados do Formulário de Denúncias
  const [novaLinhaRelato, setNovaLinhaRelato] = useState('080');
  const [novoTipoRelato, setNovoTipoRelato] = useState('Atraso grave');
  const [novoTextoRelato, setNovoTextoRelato] = useState('');
  const [novoAutorRelato, setNovoAutorRelato] = useState('');
  const [toast, setToast] = useState(null);

  // Ciclo de animação para mover os autocarros no mapa
  useEffect(() => {
    const timer = setInterval(() => {
      setMapTicks((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Sincronização automática com a Base de Dados Local (localStorage)
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
      autor: novoAutorRelato.trim() || "Anónimo",
      xpGanho: 15
    };

    setAlertas([novoAlerta, ...alertas]);

    // Atualiza o estado da linha impactada pelo relato
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

    // Sistema de Gamificação (XP e Moedas de Mobilidade)
    setUserProfile(prev => {
      let novoXp = prev.xp + 15;
      let novoNivel = prev.nivel;
      if (novoXp >= 100) {
        novoXp -= 100;
        novoNivel += 1;
        mostrarToast(`🎉 EXCELENTE! Subiu para o Nível ${novoNivel}!`, 'level');
      }
      return {
        nivel: novoNivel,
        xp: novoXp,
        moedas: prev.moedas + 40
      };
    });

    setNovoTextoRelato('');
    setNovoAutorRelato('');
    mostrarToast("✅ Auditoria enviada! Ganhou +15 XP e +40 Moedas!");
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
      mostrarToast("🌧️ Temporal Ativado: Tráfego lento e atrasos graves nas vias principais!", "info");
    } else if (novoClima === 'pico') {
      setLinhas(prev => prev.map(l => ({
        ...l,
        passageirosHora: Math.round(l.passageirosHora * 1.5),
        atrasoMedio: l.atrasoMedio + 6,
        pontualidade: Math.max(40, l.pontualidade - 10),
        status: l.atrasoMedio > 20 ? "Crítico" : "Atenção"
      })));
      mostrarToast("🚗 Hora de Ponta Ativada: Lotações máximas registadas!", "info");
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
    mostrarToast(`🎁 Cupão resgatado com sucesso! Código: ${cupom.codigo}`);
  };

  const limparBancoDeDados = () => {
    localStorage.removeItem('pimac_linhas');
    localStorage.removeItem('pimac_alertas');
    localStorage.removeItem('pimac_profile');
    localStorage.removeItem('pimac_cupons');
    setLinhas(dadosIniciaisLinhas);
    setAlertas(alertasIniciais);
    setUserProfile({ nivel: 1, xp: 20, moedas: 120 });
    setCuponsResgatados([]);
    mostrarToast("🧹 Todos os dados guardados no navegador foram repostos.");
  };

  // Filtragem das linhas na pesquisa
  const linhasFiltradas = linhas.filter(l => 
    l.id.includes(filtroPesquisa) || l.nome.toLowerCase().includes(filtroPesquisa.toLowerCase())
  );

  const calcularPosicaoOnibus = (rotaX, rotaY) => {
    if (!rotaX || !rotaY || rotaX.length === 0) return { x: 0, y: 0 };
    const index = Math.floor((mapTicks / 100) * (rotaX.length - 1));
    const nextIndex = (index + 1) % rotaX.length;
    const interpolado = (mapTicks / 100) * (rotaX.length - 1) - index;

    const x = rotaX[index] + (rotaX[nextIndex] - rotaX[index]) * interpolado;
    const y = rotaY[index] + (rotaY[nextIndex] - rotaY[index]) * interpolado;
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* SISTEMA DE NOTIFICAÇÕES (TOAST) */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-5 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border animate-bounce ${
          toast.tipo === 'warning' ? 'bg-amber-950/90 border-amber-500 text-amber-300' : 
          toast.tipo === 'info' ? 'bg-sky-950/90 border-sky-500 text-sky-300' : 
          toast.tipo === 'level' ? 'bg-fuchsia-950/90 border-fuchsia-500 text-fuchsia-300' :
          'bg-slate-900/90 border-emerald-500 text-emerald-400'
        }`}>
          <span className="text-xl">📢</span>
          <span className="font-semibold text-sm">{toast.msg}</span>
        </div>
      )}

      {/* CABEÇALHO */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 border-b border-slate-800 pb-6 gap-6">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-xl font-black text-2xl tracking-tighter shadow-lg shadow-emerald-500/20">P</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wider text-emerald-400 flex items-center gap-2">
              PIMAC <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">GAMIFIED v2.1</span>
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest">Plataforma Integrada de Mobilidade e Auditoria Cidadã</p>
          </div>
        </div>

        {/* PERFIL DO AUDITOR */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/50 px-5 py-3 rounded-2xl border border-slate-800 w-full xl:w-auto">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 font-extrabold text-slate-950 shadow-md">
              <span className="text-xs absolute -top-1.5 -right-1.5 bg-fuchsia-500 text-white rounded-full px-1.5 py-0.5 font-bold text-[8px]">LVL</span>
              {userProfile.nivel}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Auditor de Mobilidade</p>
              <div className="flex items-center space-x-2 w-28 mt-1">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${userProfile.xp}%` }}></div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{userProfile.xp}/100</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-800"></div>
          <div className="flex items-center space-x-2 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20">
            <span className="text-lg">🪙</span>
            <div>
              <span className="text-[10px] text-amber-500/80 block font-bold tracking-widest">CRÉDITOS</span>
              <span className="font-mono text-sm font-bold text-amber-400">{userProfile.moedas} Mob</span>
            </div>
          </div>
        </div>
      </header>

      {/* PAINEL DE CONTROLO DO SIMULADOR */}
      <section className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700/60 px-2 py-0.5 rounded uppercase tracking-wider font-bold">Simulador PIMAC</span>
          <p className="text-sm text-slate-300 mt-1">Simule cenários urbanos para analisar o impacto na pontualidade do transporte público municipal.</p>
        </div>
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button 
            onClick={() => aplicarClima('sunny')} 
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${clima === 'sunny' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'}`}
          >
            ☀️ Dia Normal
          </button>
          <button 
            onClick={() => aplicarClima('rainy')} 
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${clima === 'rainy' ? 'bg-rose-500/10 text-rose-400 border-rose-500/40' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'}`}
          >
            🌧️ Temporal (Chuva)
          </button>
          <button 
            onClick={() => aplicarClima('pico')} 
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${clima === 'pico' ? 'bg-amber-500/10 text-amber-400 border-amber-500/40' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'}`}
          >
            🚗 Hora de Ponta
          </button>
        </div>
      </section>

      {/* SELEÇÃO DE ABAS */}
      <nav className="flex space-x-2 border-b border-slate-800 mb-8 pb-px">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`pb-4 px-4 text-sm font-bold tracking-wider relative transition-colors ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          🖥️ Painel em Direto
          {activeTab === 'dashboard' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('rewards')}
          className={`pb-4 px-4 text-sm font-bold tracking-wider relative transition-colors ${activeTab === 'rewards' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          🎁 Recompensas do Cidadão
          {activeTab === 'rewards' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 px-4 text-sm font-bold tracking-wider relative transition-colors ${activeTab === 'analytics' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          📊 Estatísticas do Consórcio
          {activeTab === 'analytics' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"></span>}
        </button>
      </nav>

      {/* ABA 1: PAINEL EM DIRETO */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* TABELA DE FROTAS E MAPA ANIMA */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-slate-900/45 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span>🚍 Estado Operacional da Frota</span>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{linhasFiltradas.length} linhas</span>
                  </h2>
                  <p className="text-xs text-slate-400">Dados baseados nos relatos coletivos dos utilizadores</p>
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar número ou itinerário..."
                  value={filtroPesquisa}
                  onChange={(e) => setFiltroPesquisa(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 transition w-full sm:w-60"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                      <th className="pb-3">Linha</th>
                      <th className="pb-3">Itinerário</th>
                      <th className="pb-3 text-center">Pontualidade</th>
                      <th className="pb-3 text-center">Atraso</th>
                      <th className="pb-3 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-xs">
                    {linhasFiltradas.map((linha) => (
                      <tr 
                        key={linha.id}
                        onClick={() => setLinhaSelecionada(linha)}
                        className={`hover:bg-slate-900/40 cursor-pointer transition-all ${linhaSelecionada.id === linha.id ? 'bg-slate-900/60 border-l-2 border-emerald-400' : ''}`}
                      >
                        <td className="py-3.5 pl-2 font-bold text-emerald-400">#{linha.id}</td>
                        <td className="py-3.5">
                          <p className="font-semibold text-slate-200">{linha.nome}</p>
                          <p className="text-[10px] text-slate-500">{linha.placa} • {linha.passageirosHora} pas./hora ponta</p>
                        </td>
                        <td className="py-3.5 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-semibold text-slate-200">{linha.pontualidade}%</span>
                            <div className="w-12 bg-slate-850 h-1 rounded-full overflow-hidden mt-1">
                              <div className={`h-1 rounded-full ${linha.pontualidade > 80 ? 'bg-emerald-400' : (linha.pontualidade > 60 ? 'bg-amber-400' : 'bg-rose-500')}`} style={{ width: `${linha.pontualidade}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`font-mono font-semibold ${linha.atrasoMedio > 20 ? 'text-rose-400' : (linha.atrasoMedio > 10 ? 'text-amber-400' : 'text-emerald-400')}`}>
                            {linha.atrasoMedio} min
                          </span>
                        </td>
                        <td className="py-3.5 text-right pr-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border
                            ${linha.status === 'Crítico' ? 'bg-rose-950/30 text-rose-400 border-rose-900/40' : ''}
                            ${linha.status === 'Atenção' ? 'bg-amber-950/30 text-amber-400 border-amber-900/40' : ''}
                            ${linha.status === 'Normal' ? 'bg-slate-800 text-slate-300 border-slate-700/50' : ''}
                            ${linha.status === 'Excelente' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40' : ''}
                          `}>
                            {linha.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MAPA DINÂMICO VETORIAL */}
            <div className="bg-slate-900/45 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Visualizador de Frota em Direto (Clique no autocarro para inspecionar)</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-950 rounded-xl overflow-hidden border border-slate-850 aspect-video relative flex items-center justify-center">
                  
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0V100M40 0V100M70 0V100M90 0V100" stroke="#475569" strokeWidth="0.5"/>
                    <path d="M0 20H100M0 50H100M0 80H100" stroke="#475569" strokeWidth="0.5"/>
                    
                    {linhas.map(linha => {
                      if (!linha.rotaX || !linha.rotaY) return null;
                      const dPath = `M ${linha.rotaX.map((x, i) => `${x} ${linha.rotaY[i]}`).join(' L ')}`;
                      return (
                        <path 
                          key={linha.id} 
                          d={dPath} 
                          stroke={linha.id === "080" ? "#f43f5e" : linha.id === "020" ? "#f59e0b" : "#10b981"} 
                          strokeWidth="0.8" 
                          strokeDasharray="2 3" 
                        />
                      );
                    })}
                  </svg>

                  {/* Renderização dos Autocarros Móveis */}
                  {linhas.map(linha => {
                    if (!linha.rotaX || !linha.rotaY) return null;
                    const pos = calcularPosicaoOnibus(linha.rotaX, linha.rotaY);
                    const colorClass = linha.status === 'Crítico' ? 'bg-rose-500 shadow-rose-500/50' : linha.status === 'Atenção' ? 'bg-amber-500 shadow-amber-500/50' : 'bg-emerald-500 shadow-emerald-500/50';
                    return (
                      <button
                        key={linha.id}
                        onClick={() => setSelectedBus(linha)}
                        className={`absolute w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center text-[7px] font-bold text-slate-950 shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all ${colorClass}`}
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        title={`Linha ${linha.id}`}
                      >
                        {linha.id.slice(1)}
                      </button>
                    );
                  })}

                  {/* Detalhes do Autocarro Selecionado */}
                  {selectedBus && (
                    <div className="absolute bottom-3 right-3 bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl max-w-xs text-xs">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-extrabold text-emerald-400">#Bus {selectedBus.id}</span>
                        <button onClick={() => setSelectedBus(null)} className="text-slate-500 hover:text-slate-300 text-sm">×</button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{selectedBus.nome}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[10px] font-mono text-slate-300">
                        <span>Matrícula: {selectedBus.placa}</span>
                        <span>Velocidade: {selectedBus.velocidade} km/h</span>
                        <span>Pontualidade: {selectedBus.pontualidade}%</span>
                        <span>Atraso: {selectedBus.atrasoMedio}m</span>
                      </div>
                    </div>
                  )}

                  <p className="text-[9px] text-slate-500 absolute bottom-2 left-3 font-mono">MAPA MULTIMODAL SIMULADO</p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Metas de Consumo</span>
                    <h3 className="text-sm font-extrabold mt-2 text-slate-200">Redução de CO₂</h3>
                    <p className="text-xs text-slate-400 mt-1">Cada auditoria cidadã acelera decisões públicas para alocação de frotas ecológicas de forma eficiente.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-slate-500 block">DESCARBONIZAÇÃO</span>
                      <span className="text-sm font-bold text-emerald-400">-{Math.round(linhaSelecionada.passageirosHora * 0.42)} kg CO₂/dia</span>
                    </div>
                    <span className="text-lg">🍃</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* COLUNA DO FORMULÁRIO E FEED */}
          <div className="space-y-6">
            
            {/* FORMULÁRIO DE REGISTO */}
            <div className="bg-slate-900/45 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-1.5">
                <span>✍️ Registar Denúncia do Cidadão</span>
              </h3>
              
              <form onSubmit={lidarComEnvioRelato} className="space-y-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Linha afetada</label>
                  <select 
                    value={novaLinhaRelato}
                    onChange={(e) => setNovaLinhaRelato(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
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
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Atraso grave">Atraso grave</option>
                      <option value="Superlotação">Superlotação</option>
                      <option value="Condução perigosa">Condução perigosa</option>
                      <option value="Ar-Condicionado Desligado">Ar Desligado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">O seu nome</label>
                    <input 
                      type="text" 
                      placeholder="Anónimo"
                      value={novoAutorRelato}
                      onChange={(e) => setNovoAutorRelato(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Descrição do ocorrido</label>
                  <textarea 
                    rows="2"
                    placeholder="Especifique a localização ou detalhes..."
                    value={novoTextoRelato}
                    onChange={(e) => setNovoTextoRelato(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-700 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25"
                >
                  Registar e Ganhar XP + Pontos
                </button>
              </form>
            </div>

            {/* FEED DE ALERTAS RECENTES */}
            <div className="bg-slate-900/45 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                <span>🔔 Mural de Relatos Recentes</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              </h3>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {alertas.map((alerta) => (
                  <div key={alerta.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 hover:border-slate-800 transition">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="bg-rose-950/40 text-rose-400 border border-rose-900/40 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                        {alerta.tipo}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{alerta.hora} • Linha #{alerta.linha}</span>
                    </div>
                    <p className="text-xs text-slate-300 italic">"{alerta.texto}"</p>
                    <span className="text-[9px] text-slate-500 block mt-2 text-right">— {alerta.autor}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ABA 2: PAINEL DE RECOMPENSAS */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="bg-slate-900/45 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-2">
              <span>🎁 Gamificação: Moedas de Mobilidade</span>
            </h2>
            <p className="text-sm text-slate-400">A sua participação ativa ajuda a fiscalizar e a auditar o transporte municipal. Acumule moedas de mobilidade virtuais ao enviar denúncias e troque-as por cupões reais em comércio local parceiro!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {cuponsParceiros.map(cupom => {
              const jaResgatou = cuponsResgatados.some(c => c.id === cupom.id);
              const saldoInsuficiente = userProfile.moedas < cupom.custo;

              return (
                <div key={cupom.id} className={`bg-slate-900/40 p-5 rounded-2xl border transition-all flex flex-col justify-between ${jaResgatou ? 'border-slate-800 opacity-60' : 'border-slate-800 hover:border-amber-500/40'}`}>
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-3xl">{cupom.icone}</span>
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                        {cupom.categoria}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-200 mt-4">{cupom.titulo}</h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">{cupom.parceiro}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Custo</span>
                      <span className="text-sm font-mono font-bold text-amber-400">{cupom.custo} Mob</span>
                    </div>

                    {jaResgatou ? (
                      <span className="text-xs text-slate-400 font-bold">Resgatado ✓</span>
                    ) : (
                      <button
                        onClick={() => resgatarCupom(cupom)}
                        disabled={saldoInsuficiente}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${saldoInsuficiente ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer'}`}
                      >
                        Resgatar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* HISTÓRICO DE RESGATES */}
          {cuponsResgatados.length > 0 && (
            <div className="bg-slate-900/45 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <h3 className="text-sm font-bold text-slate-200 mb-4">🎫 Os seus Cupões Disponíveis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cuponsResgatados.map((cupom, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{cupom.titulo}</h4>
                      <p className="text-[10px] text-slate-500">{cupom.parceiro}</p>
                      <p className="text-[10px] text-amber-400 mt-2 font-mono tracking-widest font-bold bg-amber-500/10 px-2 py-0.5 rounded inline-block">
                        Código: {cupom.codigo}
                      </p>
                    </div>
                    <span className="text-2xl opacity-45">🎟️</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ABA 3: ESTATÍSTICAS E AUDITORIA COMPLETA */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-slate-900/45 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span>📊 Histórico de Demanda por Período: Linha #{linhaSelecionada.id}</span>
            </h3>

            {/* Gráfico customizado de fluxo de passageiros */}
            <div className="h-44 flex items-end justify-between pt-6 pb-2 px-6 bg-slate-950/60 rounded-xl border border-slate-850">
              
              <div className="flex flex-col items-center flex-1 group">
                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">{Math.round(linhaSelecionada.passageirosHora * 0.7)}</span>
                <div className="w-12 bg-gradient-to-t from-slate-900 to-emerald-500/60 rounded-t-lg transition-all duration-500" style={{ height: `${Math.min(100, Math.round(linhaSelecionada.passageirosHora * 0.7 * 0.2))}px` }}></div>
                <span className="text-[9px] text-slate-500 mt-2 font-semibold">Madrugada</span>
              </div>

              <div className="flex flex-col items-center flex-1 group">
                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">{Math.round(linhaSelecionada.passageirosHora * 1.3)}</span>
                <div className="w-12 bg-gradient-to-t from-slate-900 to-rose-500/80 rounded-t-lg transition-all duration-500" style={{ height: `${Math.min(100, Math.round(linhaSelecionada.passageirosHora * 1.3 * 0.2))}px` }}></div>
                <span className="text-[9px] text-slate-500 mt-2 font-semibold">Pico Manhã</span>
              </div>

              <div className="flex flex-col items-center flex-1 group">
                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">{Math.round(linhaSelecionada.passageirosHora * 0.9)}</span>
                <div className="w-12 bg-gradient-to-t from-slate-900 to-amber-500/60 rounded-t-lg transition-all duration-500" style={{ height: `${Math.min(100, Math.round(linhaSelecionada.passageirosHora * 0.9 * 0.2))}px` }}></div>
                <span className="text-[9px] text-slate-500 mt-2 font-semibold">Almoço</span>
              </div>

              <div className="flex flex-col items-center flex-1 group">
                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">{Math.round(linhaSelecionada.passageirosHora * 1.5)}</span>
                <div className="w-12 bg-gradient-to-t from-slate-900 to-rose-600 rounded-t-lg transition-all duration-500" style={{ height: `${Math.min(100, Math.round(linhaSelecionada.passageirosHora * 1.5 * 0.2))}px` }}></div>
                <span className="text-[9px] text-slate-500 mt-2 font-semibold">Pico Tarde</span>
              </div>

              <div className="flex flex-col items-center flex-1 group">
                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">{Math.round(linhaSelecionada.passageirosHora * 0.4)}</span>
                <div className="w-12 bg-gradient-to-t from-slate-900 to-emerald-500/80 rounded-t-lg transition-all duration-500" style={{ height: `${Math.min(100, Math.round(linhaSelecionada.passageirosHora * 0.4 * 0.2))}px` }}></div>
                <span className="text-[9px] text-slate-500 mt-2 font-semibold">Noite</span>
              </div>

            </div>
          </div>

          <div className="bg-slate-900/45 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-3">📋 Diagnóstico de Qualidade</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                As métricas indicam atrasos pontuais e de sobrecarga centralizados nos terminais Bandeirantes e Aero Rancho durante os horários comerciais de maior fluxo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-850 text-xs">
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Acurácia Coletiva</span>
              <span className="text-emerald-400 font-extrabold text-sm">94.8% das denúncias validadas</span>
            </div>
          </div>

        </div>
      )}

      {/* RODAPÉ */}
      <footer className="mt-12 text-center text-[10px] text-slate-600 border-t border-slate-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>PIMAC - Plataforma Integrada de Mobilidade e Auditoria Cidadã • Protótipo gamificado de testes locais.</p>
        <button 
          onClick={limparBancoDeDados}
          className="text-slate-500 hover:text-slate-300 transition-colors underline cursor-pointer bg-transparent border-none"
        >
          🧹 Repor Base de Dados (Navegador)
        </button>
      </footer>

    </div>
  );
}