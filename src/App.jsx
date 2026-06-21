import React, { useState, useEffect } from 'react';

// Dados iniciais mockados para o MVP das linhas de ônibus
const dadosIniciaisLinhas = [
  { id: "080", nome: "Terminal Bandeirantes / Aero Rancho", pontualidade: 62, atrasoMedio: 24, status: "Crítico", passageirosHora: 450 },
  { id: "070", nome: "Terminal Bandeirantes / General Osório", pontualidade: 88, atrasoMedio: 7, status: "Normal", passageirosHora: 310 },
  { id: "020", nome: "Terminal Central / Terminal Guaicurus", pontualidade: 71, atrasoMedio: 16, status: "Atenção", passageirosHora: 520 },
  { id: "051", nome: "Shopping / Bandeirantes", pontualidade: 94, atrasoMedio: 4, status: "Excelente", passageirosHora: 180 },
  { id: "081", nome: "Terminal Bandeirantes / Nova Bahia", pontualidade: 55, atrasoMedio: 29, status: "Crítico", passageirosHora: 380 },
  { id: "030", nome: "Terminal Hercules Maymone / Centro", pontualidade: 82, atrasoMedio: 9, status: "Normal", passageirosHora: 290 }
];

// Alertas iniciais da população
const alertasIniciais = [
  { id: 1, hora: "11:10", linha: "080", tipo: "Atraso grave", texto: "Ônibus que deveria passar às 11:00 não apareceu na Afonso Pena.", autor: "Usuário Anônimo" },
  { id: 2, hora: "10:55", linha: "020", tipo: "Superlotação", texto: "Linha 020 completamente cheia e ar-condicionado desligado.", autor: "Marcos S." },
  { id: 3, hora: "10:30", linha: "081", tipo: "Quebra de Veículo", texto: "Ônibus quebrado logo após a saída do terminal.", autor: "Ana Paula" }
];

export default function App() {
  // Estados para gerenciar a aplicação
  const [linhas, setLinhas] = useState(dadosIniciaisLinhas);
  const [alertas, setAlertas] = useState(alertasIniciais);
  const [filtroPesquisa, setFiltroPesquisa] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [linhaSelecionada, setLinhaSelecionada] = useState(dadosIniciaisLinhas[0]);
  
  // Estado para o formulário de novos alertas de auditoria
  const [novaLinhaRelato, setNovaLinhaRelato] = useState('080');
  const [novoTipoRelato, setNovoTipoRelato] = useState('Atraso grave');
  const [novoTextoRelato, setNovoTextoRelato] = useState('');
  const [novoAutorRelato, setNovoAutorRelato] = useState('');
  const [toastMensagem, setToastMensagem] = useState(null);

  // Simulador de hora e atualizações "Live"
  const [horaAtual, setHoraAtual] = useState('');
  useEffect(() => {
    const atualizarRelogio = () => {
      const agora = new Date();
      setHoraAtual(agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    atualizarRelogio();
    const interval = setInterval(atualizarRelogio, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mostrar aviso de sucesso (Toast personalizado - evita usar alert)
  const mostrarToast = (mensagem) => {
    setToastMensagem(mensagem);
    setTimeout(() => {
      setToastMensagem(null);
    }, 4000);
  };

  // Função para enviar o relato de auditoria
  const lidarComEnvioRelato = (e) => {
    e.preventDefault();
    if (!novoTextoRelato.trim()) {
      mostrarToast("⚠️ Por favor, descreva o problema detectado.");
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
      autor: novoAutorRelato.trim() || "Cidadão Anônimo"
    };

    // Adiciona o novo alerta no topo da lista
    setAlertas([novoAlerta, ...alertas]);

    // Simula impacto nos dados da linha por receber reclamação (aumenta o tempo de atraso)
    setLinhas(linhas.map(l => {
      if (l.id === novaLinhaRelato) {
        const novoAtraso = l.atrasoMedio + 3;
        const novaPontualidade = Math.max(30, l.pontualidade - 4);
        const novoStatus = novoAtraso > 20 ? "Crítico" : (novoAtraso > 10 ? "Atenção" : "Normal");
        
        // Se a linha editada for a que está selecionada no painel de detalhes, atualiza ela também
        const linhaAtualizada = { ...l, atrasoMedio: novoAtraso, pontualidade: novaPontualidade, status: novoStatus };
        if (linhaSelecionada.id === l.id) {
          setLinhaSelecionada(linhaAtualizada);
        }
        return linhaAtualizada;
      }
      return l;
    }));

    // Reseta os campos do formulário
    setNovoTextoRelato('');
    setNovoAutorRelato('');
    mostrarToast("✅ Relatório de auditoria enviado e processado pelo sistema!");
  };

  // Filtra as linhas conforme busca e status selecionado
  const linhasFiltradas = linhas.filter(linha => {
    const batePesquisa = linha.id.includes(filtroPesquisa) || linha.nome.toLowerCase().includes(filtroPesquisa.toLowerCase());
    const bateStatus = filtroStatus === 'Todos' || linha.status === filtroStatus;
    return batePesquisa && bateStatus;
  });

  // Métricas calculadas dinamicamente com base no estado atual das linhas
  const pontualidadeMedia = Math.round(linhas.reduce((acc, l) => acc + l.pontualidade, 0) / linhas.length);
  const tempoEsperaMedio = (linhas.reduce((acc, l) => acc + l.atrasoMedio, 0) / linhas.length).toFixed(1);
  const totalAlertasAtivos = alertas.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* TOAST NOTIFICATION */}
      {toastMensagem && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500 text-emerald-400 px-5 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce">
          <span className="text-xl">📊</span>
          <span className="font-semibold text-sm">{toastMensagem}</span>
        </div>
      )}

      {/* HEADER DA PLATAFORMA */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 text-slate-950 p-2 rounded-lg font-black text-xl tracking-tighter">P</div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-wider text-emerald-400 flex items-center gap-2">
                PIMAC <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">MVP v1.0</span>
              </h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Plataforma Integrada de Mobilidade e Auditoria Cidadã</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 self-stretch md:self-auto justify-between md:justify-end bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">HORA DO SISTEMA</span>
            <span className="font-mono text-sm font-bold text-slate-300">{horaAtual || "Carregando..."}</span>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>MONITOR LIVE</span>
          </div>
        </div>
      </header>

      {/* METRIC CARDS GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 shadow-lg group">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pontualidade Média</p>
            <span className="text-lg group-hover:scale-125 transition-transform duration-300">⏱️</span>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <p className="text-3xl font-extrabold text-emerald-400">{pontualidadeMedia}%</p>
            <span className="text-xs text-emerald-500/80 font-medium">Meta: 85%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${pontualidadeMedia}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 shadow-lg group">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atraso Médio Global</p>
            <span className="text-lg group-hover:scale-125 transition-transform duration-300">⏳</span>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <p className="text-3xl font-extrabold text-amber-400">{tempoEsperaMedio} min</p>
            <span className="text-xs text-slate-500">por viagem</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-amber-400 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (parseFloat(tempoEsperaMedio) / 30) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 hover:border-rose-500/40 transition-all duration-300 shadow-lg group sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alertas Coletivos Hoje</p>
            <span className="text-lg group-hover:scale-125 transition-transform duration-300">📢</span>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <p className="text-3xl font-extrabold text-rose-400">{totalAlertasAtivos}</p>
            <span className="text-xs text-rose-500/80 font-medium">Auditorias ativas</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-rose-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (totalAlertasAtivos / 10) * 100)}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL (Grid de 3 Colunas no Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA 1 & 2: MONITORAMENTO DAS LINHAS E GRÁFICOS (Esquerda) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TABELA DE LINHAS */}
          <div className="bg-slate-900/45 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>🚍 Linhas sob Auditoria</span>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{linhasFiltradas.length} ativas</span>
                </h2>
                <p className="text-xs text-slate-400">Clique em uma linha para ver detalhes e análises</p>
              </div>

              {/* FILTROS */}
              <div className="flex flex-wrap items-center gap-2">
                {['Todos', 'Crítico', 'Atenção', 'Normal'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFiltroStatus(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      filtroStatus === status 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* BARRA DE PESQUISA */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Buscar linha pelo número ou nome..."
                value={filtroPesquisa}
                onChange={(e) => setFiltroPesquisa(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 placeholder:text-slate-600 transition"
              />
              <span className="absolute right-4 top-3 text-slate-600 text-sm">🔍</span>
            </div>

            {/* TABELA REAL */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Linha</th>
                    <th className="pb-3 font-semibold">Itinerário</th>
                    <th className="pb-3 font-semibold text-center">Pontualidade</th>
                    <th className="pb-3 font-semibold text-center">Atraso Médio</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {linhasFiltradas.length > 0 ? (
                    linhasFiltradas.map((linha) => (
                      <tr 
                        key={linha.id} 
                        onClick={() => setLinhaSelecionada(linha)}
                        className={`hover:bg-slate-900/60 transition-all cursor-pointer ${
                          linhaSelecionada.id === Math.round(linha.id) || linhaSelecionada.id === linha.id ? 'bg-slate-900/80 border-l-2 border-emerald-400 pl-2' : ''
                        }`}
                      >
                        <td className="py-3.5 font-bold text-emerald-400">#{linha.id}</td>
                        <td className="py-3.5">
                          <p className="text-slate-200 font-medium">{linha.nome}</p>
                          <p className="text-xs text-slate-500">{linha.passageirosHora} pas./hora pico</p>
                        </td>
                        <td className="py-3.5 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-semibold text-slate-200">{linha.pontualidade}%</span>
                            <div className="w-12 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                              <div 
                                className={`h-1 rounded-full ${linha.pontualidade > 80 ? 'bg-emerald-400' : (linha.pontualidade > 60 ? 'bg-amber-400' : 'bg-rose-500')}`} 
                                style={{ width: `${linha.pontualidade}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`font-mono font-semibold ${linha.atrasoMedio > 20 ? 'text-rose-400' : (linha.atrasoMedio > 10 ? 'text-amber-400' : 'text-emerald-400')}`}>
                            {linha.atrasoMedio} min
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border
                            ${linha.status === 'Crítico' ? 'bg-rose-950/30 text-rose-400 border-rose-900/40' : ''}
                            ${linha.status === 'Atenção' ? 'bg-amber-950/30 text-amber-400 border-amber-900/40' : ''}
                            ${linha.status === 'Normal' ? 'bg-slate-800 text-slate-300 border-slate-700/50' : ''}
                            ${linha.status === 'Excelente' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40' : ''}
                          `}>
                            {linha.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-slate-500">
                        Nenhuma linha encontrada com os filtros atuais.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* DETALHES ANALÍTICOS DA LINHA SELECIONADA */}
          <div className="bg-slate-900/45 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span>📊 Análise Profunda: Linha #{linhaSelecionada.id}</span>
              <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-lg border border-slate-700">{linhaSelecionada.nome}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Grafico de Barras Customizado em CSS/SVG */}
              <div className="md:col-span-2 space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Atraso Médio por Período do Dia (Minutos)</p>
                <div className="h-32 flex items-end justify-between pt-4 pb-2 px-4 bg-slate-950/60 rounded-xl border border-slate-850">
                  
                  {/* Manhã (6h - 9h) */}
                  <div className="flex flex-col items-center flex-1 group">
                    <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">{Math.round(linhaSelecionada.atrasoMedio * 1.2)}m</span>
                    <div 
                      className="w-10 bg-gradient-to-t from-slate-800 to-rose-500/80 rounded-t-md transition-all duration-500"
                      style={{ height: `${Math.min(100, Math.round(linhaSelecionada.atrasoMedio * 1.2 * 3))}px` }}
                    ></div>
                    <span className="text-[10px] text-slate-500 mt-2 font-semibold">Pico Manhã</span>
                  </div>

                  {/* Almoço (11h - 13h) */}
                  <div className="flex flex-col items-center flex-1 group">
                    <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">{Math.round(linhaSelecionada.atrasoMedio * 0.8)}m</span>
                    <div 
                      className="w-10 bg-gradient-to-t from-slate-800 to-amber-500/80 rounded-t-md transition-all duration-500"
                      style={{ height: `${Math.min(100, Math.round(linhaSelecionada.atrasoMedio * 0.8 * 3))}px` }}
                    ></div>
                    <span className="text-[10px] text-slate-500 mt-2 font-semibold">Almoço</span>
                  </div>

                  {/* Tarde (17h - 19h) */}
                  <div className="flex flex-col items-center flex-1 group">
                    <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">{Math.round(linhaSelecionada.atrasoMedio * 1.5)}m</span>
                    <div 
                      className="w-10 bg-gradient-to-t from-slate-800 to-rose-600 rounded-t-md transition-all duration-500"
                      style={{ height: `${Math.min(100, Math.round(linhaSelecionada.atrasoMedio * 1.5 * 3))}px` }}
                    ></div>
                    <span className="text-[10px] text-slate-500 mt-2 font-semibold">Pico Tarde</span>
                  </div>

                  {/* Noite (20h - 23h) */}
                  <div className="flex flex-col items-center flex-1 group">
                    <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">{Math.round(linhaSelecionada.atrasoMedio * 0.5)}m</span>
                    <div 
                      className="w-10 bg-gradient-to-t from-slate-800 to-emerald-500/80 rounded-t-md transition-all duration-500"
                      style={{ height: `${Math.min(100, Math.round(linhaSelecionada.atrasoMedio * 0.5 * 3))}px` }}
                    ></div>
                    <span className="text-[10px] text-slate-500 mt-2 font-semibold">Noite</span>
                  </div>

                </div>
              </div>

              {/* Insights Rápidos */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Diagnóstico PIMAC</h4>
                  {linhaSelecionada.status === 'Crítico' ? (
                    <p className="text-xs text-rose-400">Esta linha apresenta gargalos severos nos horários de pico da tarde. Recomendado auditar cumprimento de quadro de horários na garagem.</p>
                  ) : linhaSelecionada.status === 'Atenção' ? (
                    <p className="text-xs text-amber-400">Sinais de retenção moderada durante o almoço. Passageiros relatam superlotação frequente nesta rota.</p>
                  ) : (
                    <p className="text-xs text-emerald-400">Operação saudável. Pontualidade dentro das margens exigidas pelo plano de mobilidade municipal.</p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">MÉTRICA AMBIENTAL</span>
                  <span className="text-xs font-semibold text-emerald-400">-{Math.round(linhaSelecionada.passageirosHora * 0.4)}kg CO₂/dia</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* COLUNA 3: FEED DE AUDITORIA E FORMULÁRIO DE ENVIO (Direita) */}
        <div className="space-y-6">
          
          {/* MAPA DE CALOR VECTORIAL SIMULADO */}
          <div className="bg-slate-900/45 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h2 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Visualização Espacial de Rotas</span>
            </h2>
            <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-850 aspect-video relative flex items-center justify-center">
              
              {/* SVG de um pseudo-mapa de ruas de Campo Grande/MS */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0V100M40 0V100M70 0V100M90 0V100" stroke="#475569" strokeWidth="0.5"/>
                <path d="M0 20H100M0 50H100M0 80H100" stroke="#475569" strokeWidth="0.5"/>
                {/* Linha ativa 080 */}
                <path d="M10 20H70V80H90" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3"/>
              </svg>

              {/* Indicadores dinâmicos no mapa */}
              <div className="absolute top-1/4 left-1/3 flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-slate-950 animate-pulse"></span>
                <span className="bg-slate-900 text-[8px] text-rose-400 font-bold px-1 py-0.5 rounded border border-rose-900 mt-1">#080 Crítico</span>
              </div>

              <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse"></span>
                <span className="bg-slate-900 text-[8px] text-emerald-400 font-bold px-1 py-0.5 rounded border border-emerald-900 mt-1">#051 Bom</span>
              </div>

              <p className="text-[10px] text-slate-500 absolute bottom-2 left-3 font-mono">MAPA MULTIMODAL SIMULADO</p>
            </div>
          </div>

          {/* FORMULÁRIO DE NOVA AUDITORIA (Cidadão reportando) */}
          <div className="bg-slate-900/45 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-1.5">
              <span>✍️ Nova Denúncia / Auditoria</span>
            </h3>
            
            <form onSubmit={lidarComEnvioRelato} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Linha afetada</label>
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
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tipo do problema</label>
                  <select 
                    value={novoTipoRelato}
                    onChange={(e) => setNovoTipoRelato(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Atraso grave">Atraso grave</option>
                    <option value="Superlotação">Superlotação</option>
                    <option value="Direção perigosa">Direção perigosa</option>
                    <option value="Ponto danificado">Ponto danificado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Seu nome (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Anônimo"
                    value={novoAutorRelato}
                    onChange={(e) => setNovoAutorRelato(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">O que aconteceu?</label>
                <textarea 
                  rows="2"
                  placeholder="Descreva brevemente o problema para a auditoria cidadã..."
                  value={novoTextoRelato}
                  onChange={(e) => setNovoTextoRelato(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-700 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25"
              >
                Registrar na Central
              </button>
            </form>
          </div>

          {/* FEED DE ALERTAS ATIVOS */}
          <div className="bg-slate-900/45 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span>🔔 Mural de Relatos Recentes</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            </h3>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {alertas.map((alerta) => (
                <div key={alerta.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 hover:border-slate-800 transition">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="bg-rose-950/40 text-rose-400 border border-rose-900/40 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      {alerta.tipo}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{alerta.hora} • Linha #{alerta.linha}</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{alerta.texto}"</p>
                  <span className="text-[10px] text-slate-500 block mt-2 text-right">— {alerta.autor}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="mt-12 text-center text-[10px] text-slate-600 border-t border-slate-900 pt-6">
        <p>PIMAC - Plataforma Integrada de Mobilidade e Auditoria Cidadã • Feito para o MVP de Validação</p>
        <p className="mt-1">Todos os dados exibidos são simulados para fins de demonstração de interface de usuário.</p>
      </footer>

    </div>
  );
}