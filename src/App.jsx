import React, { useState, useEffect, useRef } from 'react';

// Dados baseados em linhas reais da URBS (Curitiba/PR) com coordenadas de Latitude e Longitude REAIS
const CIDADES_DATA = {
  "Curitiba/PR": {
    linhas: [
      { 
        id: "203", 
        nome: "Santa Cândida / Capão Raso", 
        pontualidade: 94, 
        atrasoMedio: 3, 
        status: "Excelente", 
        passageirosHora: 1100, 
        velocidade: 42, 
        placa: "PR-2030", 
        rota: [
          [-25.3789, -49.2224], // Terminal Santa Cândida
          [-25.4065, -49.2526], // Terminal Cabral
          [-25.4316, -49.2646], // Terminal Guadalupe
          [-25.4761, -49.2894], // Terminal Portão
          [-25.5133, -49.2974], // Terminal Capão Raso
          [-25.5312, -49.3087]  // Terminal Pinheirinho
        ] 
      },
      { 
        id: "304", 
        nome: "Centenário / Campo Comprido", 
        pontualidade: 88, 
        atrasoMedio: 6, 
        status: "Normal", 
        passageirosHora: 850, 
        velocidade: 36, 
        placa: "PR-3040", 
        rota: [
          [-25.4712, -49.2011], // Centenário
          [-25.4316, -49.2646], // Guadalupe
          [-25.4358, -49.3069], // Campina do Siqueira
          [-25.4419, -49.3444]  // Campo Comprido
        ] 
      },
      { 
        id: "502", 
        nome: "Circular Sul (Horário)", 
        pontualidade: 76, 
        atrasoMedio: 14, 
        status: "Atenção", 
        passageirosHora: 950, 
        velocidade: 28, 
        placa: "PR-5020", 
        rota: [
          [-25.4316, -49.2646], // Guadalupe
          [-25.4812, -49.2458], // Hauer
          [-25.5312, -49.3087], // Pinheirinho
          [-25.4761, -49.2894], // Portão
          [-25.4316, -49.2646]  // Volta ao Guadalupe
        ] 
      },
      { 
        id: "602", 
        nome: "Sítio Cercado (Expresso)", 
        pontualidade: 64, 
        atrasoMedio: 22, 
        status: "Crítico", 
        passageirosHora: 720, 
        velocidade: 24, 
        placa: "PR-6020", 
        rota: [
          [-25.5392, -49.2678], // Sítio Cercado
          [-25.4812, -49.2458], // Hauer
          [-25.4316, -49.2646]  // Guadalupe
        ] 
      }
    ],
    // Todos os 22 Terminais Urbanos Oficiais de Integração da URBS Curitiba
    terminais: [
      { id: "t1", nome: "Terminal Capão Raso", localizacao: "Av. Winston Churchill, s/n - Capão Raso, Curitiba - PR, 81130-000", fluxo: "Muito Alto", linhasAtendidas: 24, status: "Operacional", icone: "🏫", coordenadas: [-25.5133, -49.2974] },
      { id: "t2", nome: "Terminal Cabral", localizacao: "Av. Paraná, s/n - Cabral, Curitiba - PR, 80035-130", fluxo: "Alto", linhasAtendidas: 19, status: "Operacional", icone: "🏫", coordenadas: [-25.4065, -49.2526] },
      { id: "t3", nome: "Terminal Pinheirinho", localizacao: "Av. Winston Churchill, s/n - Pinheirinho, Curitiba - PR, 81150-050", fluxo: "Crítico", linhasAtendidas: 31, status: "Sobrecarga", icone: "🏫", coordenadas: [-25.5312, -49.3087] },
      { id: "t4", nome: "Terminal Portão", localizacao: "Rua João Bettega, s/n - Portão, Curitiba - PR, 81070-000", fluxo: "Muito Alto", linhasAtendidas: 22, status: "Operacional", icone: "🏫", coordenadas: [-25.4761, -49.2894] },
      { id: "t5", nome: "Terminal Santa Cândida", localizacao: "Av. Paraná, s/n - Santa Cândida, Curitiba - PR, 82640-000", fluxo: "Médio", linhasAtendidas: 15, status: "Operacional", icone: "🏫", coordenadas: [-25.3789, -49.2224] },
      { id: "t6", nome: "Terminal Campina do Siqueira", localizacao: "Rua Padre Anchieta, s/n - Campina do Siqueira, Curitiba - PR, 80730-000", fluxo: "Alto", linhasAtendidas: 17, status: "Operacional", icone: "🏫", coordenadas: [-25.4358, -49.3069] },
      { id: "t7", nome: "Terminal Hauer", localizacao: "Av. Marechal Floriano Peixoto, s/n - Hauer, Curitiba - PR, 81630-000", fluxo: "Alto", linhasAtendidas: 18, status: "Manutenção Parcial", icone: "🏫", coordenadas: [-25.4812, -49.2458] },
      { id: "t8", nome: "Terminal Guadalupe", localizacao: "Rua João Negrão, s/n - Centro, Curitiba - PR, 80010-200", fluxo: "Muito Alto", linhasAtendidas: 26, status: "Operacional", icone: "🏫", coordenadas: [-25.4316, -49.2646] },
      { id: "t9", nome: "Terminal Bairro Alto", localizacao: "Rua José de Oliveira Franco, 1699 - Bairro Alto, Curitiba - PR, 82820-290", fluxo: "Médio", linhasAtendidas: 12, status: "Operacional", icone: "🏫", coordenadas: [-25.4042, -49.2078] },
      { id: "t10", nome: "Terminal Barreirinha", localizacao: "Av. Anita Garibaldi, 5650 - Barreirinha, Curitiba - PR, 80540-180", fluxo: "Médio", linhasAtendidas: 10, status: "Operacional", icone: "🏫", coordenadas: [-25.3672, -49.2589] },
      { id: "t11", nome: "Terminal Boa Vista", localizacao: "Av. Paraná, 2817 - Boa Vista, Curitiba - PR, 82510-000", fluxo: "Alto", linhasAtendidas: 14, status: "Operacional", icone: "🏫", coordenadas: [-25.3908, -49.2415] },
      { id: "t12", nome: "Terminal Boqueirão", localizacao: "Av. Marechal Floriano Peixoto, 10200 - Boqueirão, Curitiba - PR, 81670-000", fluxo: "Crítico", linhasAtendidas: 25, status: "Sobrecarga", icone: "🏫", coordenadas: [-25.5065, -49.2312] },
      { id: "t13", nome: "Terminal Caiuá", localizacao: "Rua Elvira Cordeiro, 150 - Caiuá, Curitiba - PR, 81260-150", fluxo: "Médio", linhasAtendidas: 8, status: "Operacional", icone: "🏫", coordenadas: [-25.4965, -49.3490] },
      { id: "t14", nome: "Terminal Campo Comprido", localizacao: "Rua Prof. Pedro Viriato Parigot de Souza, 5100 - Campo Comprido, Curitiba - PR, 81280-330", fluxo: "Alto", linhasAtendidas: 16, status: "Operacional", icone: "🏫", coordenadas: [-25.4419, -49.3444] },
      { id: "t15", nome: "Terminal Capão da Imbuia", localizacao: "Av. Presidente Affonso Camargo, s/n - Capão da Imbuia, Curitiba - PR, 82810-080", fluxo: "Alto", linhasAtendidas: 15, status: "Operacional", icone: "🏫", coordenadas: [-25.4352, -49.2132] },
      { id: "t16", nome: "Terminal Carmo", localizacao: "Av. Marechal Floriano Peixoto, 8430 - Carmo, Curitiba - PR, 81650-000", fluxo: "Alto", linhasAtendidas: 13, status: "Operacional", icone: "🏫", coordenadas: [-25.4889, -49.2355] },
      { id: "t17", nome: "Terminal Centenário", localizacao: "Rua Filipinas, 1010 - Centenário, Curitiba - PR, 82950-150", fluxo: "Médio", linhasAtendidas: 9, status: "Operacional", icone: "🏫", coordenadas: [-25.4712, -49.2011] },
      { id: "t18", nome: "Terminal CIC", localizacao: "Rua Pedro Gusso, 2001 - Cidade Industrial, Curitiba - PR, 81310-000", fluxo: "Muito Alto", linhasAtendidas: 18, status: "Operacional", icone: "🏫", coordenadas: [-25.4878, -49.3245] },
      { id: "t19", nome: "Terminal Fazendinha", localizacao: "Rua Carlos Klemtz, 1600 - Fazendinha, Curitiba - PR, 81320-000", fluxo: "Muito Alto", linhasAtendidas: 20, status: "Operacional", icone: "🏫", coordenadas: [-25.4665, -49.3175] },
      { id: "t20", nome: "Terminal Santa Felicidade", localizacao: "Av. Manoel Ribas, 5600 - Santa Felicidade, Curitiba - PR, 82400-000", fluxo: "Médio", linhasAtendidas: 11, status: "Operacional", icone: "🏫", coordenadas: [-25.4005, -49.3298] },
      { id: "t21", nome: "Terminal Sítio Cercado", localizacao: "Rua dos Pioneiros, 1100 - Sítio Cercado, Curitiba - PR, 82590-300", fluxo: "Alto", linhasAtendidas: 15, status: "Operacional", icone: "🏫", coordenadas: [-25.5392, -49.2678] },
      { id: "t22", nome: "Terminal Tatuquara", localizacao: "Rua Olivardo Konoruski, 100 - Tatuquara, Curitiba - PR, 81470-432", fluxo: "Médio", linhasAtendidas: 12, status: "Operacional", icone: "🏫", coordenadas: [-25.5689, -49.3412] }
    ],
    contatos: [
      { id: "c1", name: "URBS Curitiba (Ouvidoria de Transportes)", tel: "156", desc: "Central de atendimento de trânsito e urbanização", icone: "🌲" },
      { id: "c2", name: "Guarda Municipal de Curitiba", tel: "153", desc: "Patrulhamento, rondas e apoio em terminais e tubos", icone: "🛡️" }
    ]
  }
};

const cuponsParceiros = [
  { id: "cupom1", titulo: "Café + Pão de Queijo", parceiro: "Rede Estação Café (Tubo Estação)", custo: 100, icone: "☕", categoria: "Alimentação", codigo: "PIMAC-CAFE-CWB" },
  { id: "cupom2", titulo: "Salgado Integral + Suco Nat.", parceiro: "Lanchonete Integração Capão Raso", custo: 180, icone: "🍔", categoria: "Alimentação", codigo: "PIMAC-LANCHE-CWB" },
  { id: "cupom3", titulo: "15% Desconto em Copiadora", parceiro: "Livraria & Copiadora Portão", custo: 250, icone: "📄", categoria: "Serviços", codigo: "PIMAC-COPIA-CWB" },
  { id: "cupom4", titulo: "Passe Unitário de Integração", parceiro: "URBS Conveniada (Simulado)", custo: 500, icone: "🚌", categoria: "Transporte", codigo: "PIMAC-PASSE-CWB" }
];

export default function App() {
  const [selectedCity] = useState("Curitiba/PR");

  // Estado de Autenticação Ativa (Sessão do Usuário)
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const salvo = localStorage.getItem('pimac_user_session_cwb');
    if (salvo) {
      try { return JSON.parse(salvo); } catch (e) { console.error(e); }
    }
    return null; // Força login de entrada
  });

  // Troca de tela do formulário de acesso
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Campos de entrada do Login/Registro
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSenha, setRegSenha] = useState('');
  const [regCartao, setRegCartao] = useState('');

  // Estados com persistência local
  const [linhas, setLinhas] = useState(() => {
    const salvas = localStorage.getItem('pimac_linhas_cwb');
    if (salvas) {
      try {
        const parseadas = JSON.parse(salvas);
        if (Array.isArray(parseadas) && parseadas.length > 0 && parseadas[0].rota) return parseadas;
      } catch (e) { console.error(e); }
    }
    return CIDADES_DATA["Curitiba/PR"].linhas;
  });

  const [alertas, setAlertas] = useState(() => {
    const salvos = localStorage.getItem('pimac_alertas_cwb');
    if (salvos) {
      try {
        const parseados = JSON.parse(salvos);
        if (Array.isArray(parseados)) return parseados;
      } catch (e) { console.error(e); }
    }
    return [
      { id: 1, hora: "12:10", linha: "502", tipo: "Atraso grave", texto: "Canaleta da Avenida Sete de Setembro congestionada. Ligeirão preso no fluxo de canaleta.", autor: "Matheus K.", votos: 5 },
      { id: 2, hora: "11:55", linha: "203", tipo: "Superlotação", texto: "Biarticulado superlotado saindo do Terminal Cabral no horário de pico.", autor: "Fernanda M.", votos: 3 }
    ];
  });

  const [userProfile, setUserProfile] = useState(() => {
    const salvo = localStorage.getItem('pimac_profile_cwb');
    if (salvo) {
      try { return JSON.parse(salvo); } catch (e) { console.error(e); }
    }
    return { nivel: 1, xp: 20, moedas: 120, medalhas: [] };
  });

  const [cuponsResgatados, setCuponsResgatados] = useState(() => {
    const salvos = localStorage.getItem('pimac_cupons_cwb');
    if (salvos) {
      try { return JSON.parse(salvos); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [activeSection, setActiveSection] = useState('menu'); 
  const [clima, setClima] = useState('sunny'); 
  const [filtroPesquisa, setFiltroPesquisa] = useState('');
  const [linhaSelecionada, setLinhaSelecionada] = useState(linhas[0] || CIDADES_DATA["Curitiba/PR"].linhas[0]);
  const [mapTicks, setMapTicks] = useState(0); 
  const [selectedBus, setSelectedBus] = useState(null);
  const [chamandoContato, setChamandoContato] = useState(null);
  const [cupomParaResgate, setCupomParaResgate] = useState(null);

  // Estados do Formulário de Denúncias
  const [novaLinhaRelato, setNovaLinhaRelato] = useState('203');
  const [novoTipoRelato, setNovoTipoRelato] = useState('Atraso grave');
  const [novoTextoRelato, setNovoTextoRelato] = useState('');
  const [novoAutorRelato, setNovoAutorRelato] = useState('');
  const [pcdAcessivel, setPcdAcessivel] = useState(false);
  const [toast, setToast] = useState(null);

  // Controle de camadas do Google Maps no Leaflet
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' ou 'satellite'

  // Referências para o mapa Leaflet
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const busMarkersRef = useRef({});
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Estados da PIMAC IA
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Olá, sou a PIMAC Curitiba IA! 🤖 Sou sua assistente virtual de mobilidade urbana da Grande Curitiba. Como posso te orientar sobre o sistema de canaletas, biarticulados, tubos e seus direitos hoje?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Carregamento assíncrono e dinâmico da biblioteca do Google Maps via Leaflet CDN
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.head.appendChild(script);
    } else {
      setLeafletLoaded(true);
    }
  }, []);

  // Inicialização e gerenciamento do mapa real Leaflet
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || activeSection !== 'mapa') return;

    const L = window.L;
    if (!L) return;

    // Se já houver um mapa instanciado, vamos destruí-lo antes de recriar
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Instancia o mapa centrado em Curitiba
    const curitibaCenter = [-25.4419, -49.2733];
    const map = L.map(mapContainerRef.current, {
      center: curitibaCenter,
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Configura a camada oficial do Google Maps de forma direta
    const googleRoadmapUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    const googleSatelliteUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    
    const tileLayer = L.tileLayer(mapType === 'roadmap' ? googleRoadmapUrl : googleSatelliteUrl, {
      maxZoom: 20
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Adiciona marcadores para os 22 terminais reais de Curitiba
    CIDADES_DATA["Curitiba/PR"].terminais.forEach(t => {
      const terminalIcon = L.divIcon({
        html: `<div class="bg-blue-600 border-2 border-white rounded-lg p-1.5 shadow-lg flex items-center justify-center text-xs w-6 h-6 transform hover:scale-115 transition-all">🏫</div>`,
        className: 'custom-terminal-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker(t.coordenadas, { icon: terminalIcon })
        .addTo(map)
        .bindPopup(`<strong class="text-slate-900">${t.nome}</strong><br/><span class="text-xs text-slate-500">${t.localizacao}</span>`);
    });

    // Inicializa os marcadores dos autocarros em tempo real
    const markers = {};
    linhas.forEach(linha => {
      const pos = calcularPosicaoOnibus(linha.rota, mapTicks);
      const colorClass = linha.status === 'Crítico' ? 'bg-rose-500' : (linha.status === 'Atenção' ? 'bg-amber-500' : 'bg-emerald-500');
      
      const busIcon = L.divIcon({
        html: `<div class="w-8 h-8 rounded-full border-2 border-slate-950 flex items-center justify-center text-[10px] font-black text-black shadow-lg cursor-pointer ${colorClass}">${linha.id}</div>`,
        className: 'custom-bus-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(pos, { icon: busIcon })
        .addTo(map)
        .bindPopup(`<strong>Linha #${linha.id}</strong><br/>${linha.nome}`);
      
      marker.on('click', () => {
        const etaSimulada = Math.max(1, Math.round((100 - (mapTicks % 25)) / 4));
        setSelectedBus({ ...linha, eta: etaSimulada });
      });

      markers[linha.id] = marker;
    });

    busMarkersRef.current = markers;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, activeSection]);

  // Atualização das camadas do Google Maps de forma reativa
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const googleRoadmapUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    const googleSatelliteUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    tileLayerRef.current.setUrl(mapType === 'roadmap' ? googleRoadmapUrl : googleSatelliteUrl);
  }, [mapType]);

  // Movimento síncrono dos marcadores de autocarro com o mapTicks
  useEffect(() => {
    if (activeSection !== 'mapa') return;
    linhas.forEach(linha => {
      const marker = busMarkersRef.current[linha.id];
      if (marker) {
        const pos = calcularPosicaoOnibus(linha.rota, mapTicks);
        marker.setLatLng(pos);
      }
    });
  }, [mapTicks, activeSection]);

  // Ciclo para rodar a simulação do mapa em tempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setMapTicks((prev) => (prev >= 100 ? 0 : prev + 0.4));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('pimac_linhas_cwb', JSON.stringify(linhas));
    localStorage.setItem('pimac_alertas_cwb', JSON.stringify(alertas));
    localStorage.setItem('pimac_profile_cwb', JSON.stringify(userProfile));
    localStorage.setItem('pimac_cupons_cwb', JSON.stringify(cuponsResgatados));
  }, [linhas, alertas, userProfile, cuponsResgatados]);

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 4000);
  };

  const upvotarAlerta = (alertaId) => {
    setAlertas(prev => prev.map(a => {
      if (a.id === alertaId) {
        setUserProfile(prof => ({ ...prof, moedas: prof.moedas + 2 }));
        mostrarToast("👍 Relato validado! Ganhou +2 Moedas (Mob).");
        return { ...a, votos: (a.votos || 0) + 1 };
      }
      return a;
    }));
  };

  // Enviar relato: +5 Moedas e +25 XP
  const lidarComEnvioRelato = (e) => {
    e.preventDefault();
    if (!novoTextoRelato.trim()) {
      mostrarToast("⚠️ Descreva o ocorrido para enviar a sua auditoria.", "warning");
      return;
    }

    const agora = new Date();
    const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const novoAlerta = {
      id: Date.now(),
      hora: horaFormatada,
      linha: novaLinhaRelato,
      tipo: pcdAcessivel ? `♿ PCD: ${novoTipoRelato}` : novoTipoRelato,
      texto: novoTextoRelato,
      autor: usuarioLogado?.nome || "Cidadão Curitibano",
      votos: 1
    };

    setAlertas([novoAlerta, ...alertas]);

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

    setUserProfile(prev => {
      let novoXp = prev.xp + 25;
      let novoNivel = prev.nivel;
      let medalhasAtualizadas = [...(prev.medalhas || [])];

      if (novoXp >= 100) {
        novoXp -= 100;
        novoNivel += 1;
        mostrarToast(`🎉 ESPETACULAR! Subiu para o Nível ${novoNivel}!`, 'level');
      }

      if (alertas.length >= 4 && !medalhasAtualizadas.includes("Fiscal Curitibano")) {
        medalhasAtualizadas.push("Fiscal Curitibano");
        mostrarToast("🏅 Medalha Desbloqueada: 'Fiscal Curitibano' por auditar ativamente!");
      }
      if (pcdAcessivel && !medalhasAtualizadas.includes("Guardião da Acessibilidade")) {
        medalhasAtualizadas.push("Guardião da Acessibilidade");
        mostrarToast("♿ Medalha Desbloqueada: 'Guardião da Acessibilidade' por auditar tubos e rampas!");
      }

      return {
        nivel: novoNivel,
        xp: novoXp,
        moedas: prev.moedas + 5,
        medalhas: medalhasAtualizadas
      };
    });

    setNovoTextoRelato('');
    setNovoAutorRelato('');
    setPcdAcessivel(false);
    mostrarToast("✅ Denúncia registrada! Ganhou +25 XP e +5 Moedas!");
  };

  const aplicarClima = (novoClima) => {
    setClima(novoClima);
    if (novoClima === 'rainy') {
      setLinhas(prev => prev.map(l => ({
        ...l,
        atrasoMedio: l.atrasoMedio + 10,
        pontualidade: Math.max(35, l.pontualidade - 15),
        velocidade: Math.max(12, l.velocidade - 8),
        status: "Crítico"
      })));
      mostrarToast("🌧️ Clima Curitibano (Chuva/Cerveja): Vias lentas e alertas de geada operacionais!", "info");
    } else if (novoClima === 'pico') {
      setLinhas(prev => prev.map(l => ({
        ...l,
        passageirosHora: Math.round(l.passageirosHora * 1.4),
        atrasoMedio: l.atrasoMedio + 7,
        pontualidade: Math.max(40, l.pontualidade - 8),
        status: l.atrasoMedio > 20 ? "Crítico" : "Atenção"
      })));
      mostrarToast("🚗 Horário de Pico: Alta demanda de embarque nos tubos centrais!", "info");
    } else {
      setLinhas(CIDADES_DATA["Curitiba/PR"].linhas);
      mostrarToast("☀️ Dia Normal: Condições operacionais restauradas na URBS.");
    }
  };

  const confirmarResgatarCupom = (cupom) => {
    if (userProfile.moedas < cupom.custo) {
      mostrarToast("❌ Saldo de moedas insuficiente. Fiscalize mais frotas!", "warning");
      return;
    }
    setCupomParaResgate(cupom);
  };

  const executarResgate = () => {
    if (!cupomParaResgate) return;
    setUserProfile(prev => ({ ...prev, moedas: prev.moedas - cupomParaResgate.custo }));
    setCuponsResgatados([ { ...cupomParaResgate, resgatadoEm: new Date().toLocaleDateString('pt-BR') }, ...cuponsResgatados ]);
    mostrarToast(`🎁 Cupom resgatado! Utilize o código: ${cupomParaResgate.codigo}`);
    setCupomParaResgate(null);
  };

  const simularLigacao = (contato) => {
    setChamandoContato(contato);
    mostrarToast(`📞 Conectando chamada segura à central ${contato.name}...`);
  };

  // Lógica de Login e Criação de Contas Virtuais
  const lidarComLogin = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginSenha.trim()) {
      mostrarToast("⚠️ Preencha todos os campos para autenticar.", "warning");
      return;
    }

    // Procura na lista local de usuários salvos no localStorage
    const usuariosSalvos = JSON.parse(localStorage.getItem('pimac_registered_users') || '[]');
    const userExistente = usuariosSalvos.find(u => u.email === loginEmail.trim() && u.senha === loginSenha);

    if (userExistente) {
      setUsuarioLogado(userExistente);
      localStorage.setItem('pimac_user_session_cwb', JSON.stringify(userExistente));
      mostrarToast(`🔑 Bem-vindo de volta, Auditor ${userExistente.nome}!`);
    } else if (loginEmail === "sprint@urbs.pr.gov.br" && loginSenha === "cwb123") {
      // Login estático administrativo para pitches diretos
      const adminUser = { nome: "Apresentador URBS", email: "sprint@urbs.pr.gov.br", cartao: "URBS-8822" };
      setUsuarioLogado(adminUser);
      localStorage.setItem('pimac_user_session_cwb', JSON.stringify(adminUser));
      mostrarToast("🚀 Modo Apresentador ativado de forma segura!");
    } else {
      mostrarToast("❌ Credenciais incorretas ou conta inexistente.", "warning");
    }
  };

  const lidarComCadastro = (e) => {
    e.preventDefault();
    if (!regNome.trim() || !regEmail.trim() || !regSenha.trim()) {
      mostrarToast("⚠️ Todos os campos obrigatórios devem ser preenchidos.", "warning");
      return;
    }

    const novosUsuarios = JSON.parse(localStorage.getItem('pimac_registered_users') || '[]');
    if (novosUsuarios.some(u => u.email === regEmail.trim())) {
      mostrarToast("❌ Este e-mail já está cadastrado em nossa central cívica.", "warning");
      return;
    }

    const novoUser = {
      nome: regNome.trim(),
      email: regEmail.trim(),
      senha: regSenha,
      cartao: regCartao.trim() || "Isento/Não Cadastrado"
    };

    novosUsuarios.push(novoUser);
    localStorage.setItem('pimac_registered_users', JSON.stringify(novosUsuarios));
    
    // Login automático pós cadastro
    setUsuarioLogado(novoUser);
    localStorage.setItem('pimac_user_session_cwb', JSON.stringify(novoUser));
    
    mostrarToast("🎉 Cadastro realizado com sucesso! Auditoria ativa.");
    setRegNome('');
    setRegEmail('');
    setRegSenha('');
    setRegCartao('');
  };

  const fazerLogout = () => {
    localStorage.removeItem('pimac_user_session_cwb');
    setUsuarioLogado(null);
    setActiveSection('menu');
    mostrarToast("🚪 Sessão de auditoria encerrada com segurança.");
  };

  // Login de Demonstração Rápida (Para o seu pitch de vendas!)
  const ativarModoApresentador = () => {
    const defaultUser = {
      nome: "Demonstração URBS",
      email: "pitch@curitiba.pr.gov.br",
      cartao: "URBS-9911-CWB"
    };
    setUsuarioLogado(defaultUser);
    localStorage.setItem('pimac_user_session_cwb', JSON.stringify(defaultUser));
    mostrarToast("🚀 Login Rápido efetuado! Pronto para a apresentação.");
  };

  const limparBancoDeDados = () => {
    localStorage.clear();
    setLinhas(CIDADES_DATA["Curitiba/PR"].linhas);
    setAlertas([
      { id: 1, hora: "12:10", linha: "502", tipo: "Atraso grave", texto: "Canaleta da Avenida Sete de Setembro congestionada. Ligeirão preso no fluxo de canaleta.", autor: "Matheus K.", votos: 5 },
      { id: 2, hora: "11:55", linha: "203", tipo: "Superlotação", texto: "Biarticulado superlotado saindo do Terminal Cabral no horário de pico.", autor: "Fernanda M.", votos: 3 }
    ]);
    setUserProfile({ nivel: 1, xp: 20, moedas: 120, medalhas: [] });
    setCuponsResgatados([]);
    setUsuarioLogado(null);
    setActiveSection('menu');
    mostrarToast("🧹 Base de dados local completamente restaurada.");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      let botResponse = "Interessante sua dúvida! Em Curitiba, a URBS é responsável por gerenciar as linhas de transporte público. Posso ajudar você a detalhar uma reclamação oficial para o 156.";
      const inputLower = chatInput.toLowerCase();

      if (inputLower.includes('espera') || inputLower.includes('atraso') || inputLower.includes('tempo')) {
        botResponse = "De acordo com o manual operacional da URBS, a tolerância de atraso para os Ligeirões e Biarticulados é de até 5 minutos em relação ao horário de tabela planejado para as canaletas.";
      } else if (inputLower.includes('tubo') || inputLower.includes('estacao') || inputLower.includes('embarque')) {
        botResponse = "As estações-tubo de Curitiba oferecem embarque em nível. Se houver falha de rampa ou no validador do cartão, o cobrador deve abrir a porta de apoio para garantir o acesso universal.";
      } else if (inputLower.includes('integração') || inputLower.includes('terminal') || inputLower.includes('cartao')) {
        botResponse = "A integração temporal em Curitiba é feita fisicamente dentro dos terminais ou de forma virtual ao usar o Cartão Transporte da URBS nas linhas integradas homologadas.";
      }

      setChatMessages(prev => [...prev, { role: 'assistant', text: botResponse }]);
    }, 1000);
  };

  const calcularPosicaoOnibus = (rota, ticks) => {
    if (!rota || rota.length === 0) return [-25.4419, -49.2733];
    const index = Math.floor((ticks / 100) * (rota.length - 1));
    const nextIndex = (index + 1) % rota.length;
    const interpolado = (mapTicks / 100) * (rota.length - 1) - index;

    const lat = rota[index][0] + (rota[nextIndex][0] - rota[index][0]) * interpolado;
    const lng = rota[index][1] + (rota[nextIndex][1] - rota[index][1]) * interpolado;
    return [lat, lng];
  };

  const linhasFiltradas = lines => lines.filter(l => 
    l.id.includes(filtroPesquisa) || l.nome.toLowerCase().includes(filtroPesquisa.toLowerCase())
  );

  const totalCo2Evitado = (alertas.length * 5.2) + (userProfile.nivel * 15);
  const arvoresEquivalentes = Math.floor(totalCo2Evitado / 14);

  // Se o usuário NÃO estiver autenticado, mostramos a belíssima tela de Login/Cadastro
  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-black text-slate-100 font-sans p-4 md:p-6 flex flex-col justify-center items-center select-none">
        <div className="max-w-md w-full bg-neutral-950 border border-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,135,81,0.15)] relative overflow-hidden">
          
          {/* Luzes neon de ambientação */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

          {/* Cabeçalho da Identidade Visual */}
          <div className="text-center mb-8 relative z-10">
            <svg viewBox="0 0 1000 700" className="w-24 h-auto mx-auto rounded-lg shadow-md border border-neutral-900 mb-4">
              <rect width="1000" height="700" fill="#008751" />
              <polygon points="0,580 1000,120 1000,0 0,460" fill="#FFFFFF" />
              <circle cx="500" cy="350" r="150" fill="#002A8F" />
              <polygon points="500,270 507,290 528,290 511,303 518,323 500,310 482,323 489,303 472,290 493,290" fill="#FFFFFF" />
              <circle cx="440" cy="350" r="7" fill="#FFFFFF" />
              <circle cx="560" cy="350" r="7" fill="#FFFFFF" />
              <circle cx="500" cy="420" r="7" fill="#FFFFFF" />
              <circle cx="500" cy="380" r="5" fill="#FFFFFF" />
              <path d="M 330 350 C 330 450, 430 500, 500 500" stroke="#FFCD00" strokeWidth="6" fill="none" />
              <path d="M 670 350 C 670 450, 570 500, 500 500" stroke="#FFCD00" strokeWidth="6" fill="none" />
            </svg>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 glow-text-emerald">PIMAC</h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-1">Plataforma Cívica de Auditoria • URBS Curitiba</p>
          </div>

          {/* Troca de abas internas */}
          <div className="flex bg-neutral-900/50 p-1 rounded-xl mb-6 relative z-10 border border-neutral-800">
            <button 
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${authMode === 'login' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Entrar
            </button>
            <button 
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${authMode === 'register' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Registrar-se
            </button>
          </div>

          {/* FORMULÁRIO DE LOGIN */}
          {authMode === 'login' && (
            <form onSubmit={lidarComLogin} className="space-y-4 relative z-10 animate-fadeIn">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">E-mail Cadastrado</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="exemplo@urbs.pr.gov.br"
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Senha de Acesso</label>
                <input 
                  type="password" 
                  value={loginSenha}
                  onChange={(e) => setLoginSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Entrar no Painel Cívico
              </button>
            </form>
          )}

          {/* FORMULÁRIO DE CADASTRO */}
          {authMode === 'register' && (
            <form onSubmit={lidarComCadastro} className="space-y-4 relative z-10 animate-fadeIn">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  value={regNome}
                  onChange={(e) => setRegNome(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">E-mail Oficial</label>
                <input 
                  type="email" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Senha</label>
                  <input 
                    type="password" 
                    value={regSenha}
                    onChange={(e) => setRegSenha(e.target.value)}
                    placeholder="Mín. 6 dígitos"
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Cartão URBS (Opcional)</label>
                  <input 
                    type="text" 
                    value={regCartao}
                    onChange={(e) => setRegCartao(e.target.value)}
                    placeholder="Ex: CWB-123"
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Criar Conta de Auditor
              </button>
            </form>
          )}

          {/* BOTÃO EXCLUSIVO: MODO APRESENTADOR (PULAR LOGIN NA APRESENTAÇÃO) */}
          <div className="mt-8 pt-6 border-t border-neutral-900 relative z-10">
            <button 
              onClick={ativarModoApresentador}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-emerald-400 hover:text-emerald-300 border border-neutral-800 text-[10px] font-bold uppercase tracking-widest rounded-xl transition cursor-pointer"
            >
              🚀 Modo Apresentação Rápida (Pular Login)
            </button>
          </div>

        </div>
        <button onClick={limparBancoDeDados} className="mt-6 text-[9px] text-slate-600 hover:text-slate-400 underline cursor-pointer">
          Repor base de dados de demonstração
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans p-4 md:p-6 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* OVERLAY DE SIMULAÇÃO DE LIGAÇÃO */}
      {chamandoContato && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-neutral-900 border border-emerald-500/30 p-8 rounded-3xl text-center max-w-sm w-full animate-pulse shadow-[0_0_50px_rgba(16,185,129,0.15)]">
            <span className="text-5xl block mb-4">📞</span>
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-bold">Conexão Integrada de Ouvidoria</p>
            <h3 className="text-xl font-black text-slate-100 mt-2">{chamandoContato.name}</h3>
            <p className="text-lg font-mono text-emerald-400 mt-2">{chamandoContato.tel}</p>
            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">Encaminhando chamada de voz integrada aos canais centrais da URBS Paraná...</p>
            <button 
              onClick={() => setChamandoContato(null)} 
              className="mt-6 px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Desconectar Chamada
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE RESGATE DE CUPOM COM CÓDIGO DE BARRAS */}
      {cupomParaResgate && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-neutral-950 border border-amber-500/30 p-6 rounded-3xl text-center max-w-sm w-full shadow-2xl">
            <span className="text-4xl">🎟️</span>
            <h3 className="text-md font-bold text-slate-100 mt-2">{cupomParaResgate.titulo}</h3>
            <p className="text-xs text-slate-400">{cupomParaResgate.parceiro}</p>
            
            <div className="bg-white p-4 rounded-xl my-6 flex flex-col items-center justify-center mx-auto w-48">
              <div className="flex space-x-1.5 h-16 w-full items-center justify-center">
                <div className="w-1 bg-black h-full"></div>
                <div className="w-2 bg-black h-full"></div>
                <div className="w-0.5 bg-black h-full"></div>
                <div className="w-3 bg-black h-full"></div>
                <div className="w-1 bg-black h-full"></div>
                <div className="w-0.5 bg-black h-full"></div>
                <div className="w-2 bg-black h-full"></div>
                <div className="w-1.5 bg-black h-full"></div>
                <div className="w-3 bg-black h-full"></div>
              </div>
              <span className="text-[9px] font-mono text-black mt-2 font-bold">{cupomParaResgate.codigo}</span>
            </div>

            <p className="text-[10px] text-slate-500 mb-6">Ao confirmar, o valor de <strong className="text-amber-400">{cupomParaResgate.custo} Mob</strong> será deduzido da sua conta de auditor cívico.</p>

            <div className="flex gap-3">
              <button 
                onClick={() => setCupomParaResgate(null)}
                className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-850 text-slate-400 text-xs font-bold rounded-lg transition"
              >
                Cancelar
              </button>
              <button 
                onClick={executarResgate}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SISTEMA DE NOTIFICAÇÕES (TOAST) */}
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

      {/* -------------------- CABEÇALHO GERAL (TELA DE SEÇÃO INTERNA) -------------------- */}
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
              <rect width="1000" height="700" fill="#008751" />
              <polygon points="0,700 1000,0 1000,150 0,700" fill="#FFFFFF" />
              <polygon points="0,550 1000,0 0,0" fill="#008751" />
              <polygon points="0,550 1000,0 1000,150" fill="#FFFFFF" />
              <circle cx="500" cy="350" r="150" fill="#002A8F" />
              <polygon points="500,280 507,300 528,300 511,313 518,333 500,320 482,333 489,313 472,300 493,300" fill="#FFFFFF" />
              <circle cx="450" cy="350" r="6" fill="#FFFFFF" />
              <circle cx="550" cy="350" r="6" fill="#FFFFFF" />
              <circle cx="500" cy="410" r="6" fill="#FFFFFF" />
              <circle cx="500" cy="380" r="4" fill="#FFFFFF" />
            </svg>
            <div>
              <span className="text-xs font-black tracking-wider text-emerald-400 block">PIMAC • {selectedCity}</span>
              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold font-mono">Edição Paraná</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-slate-300">
              Nível {userProfile.nivel} • {userProfile.moedas} Mob
            </div>
            <button 
              onClick={fazerLogout}
              className="text-xs font-bold text-rose-500 hover:text-rose-400 transition"
            >
              Logout 🚪
            </button>
          </div>
        </header>
      )}

      {/* -------------------- TELA INICIAL: MENU PRINCIPAL DE 8 BOTÕES -------------------- */}
      {activeSection === 'menu' && (
        <div className="animate-fadeIn max-w-7xl mx-auto">
          
          <div className="text-center pt-4 mb-6">
            <svg viewBox="0 0 1000 700" className="w-32 md:w-40 h-auto mx-auto rounded-lg shadow-[0_0_25px_rgba(0,135,81,0.25)] border border-neutral-900 mb-4">
              <rect width="1000" height="700" fill="#008751" />
              <polygon points="0,580 1000,120 1000,0 0,460" fill="#FFFFFF" />
              <circle cx="500" cy="350" r="150" fill="#002A8F" />
              <polygon points="500,270 507,290 528,290 511,303 518,323 500,310 482,323 489,303 472,290 493,290" fill="#FFFFFF" />
              <circle cx="440" cy="350" r="7" fill="#FFFFFF" />
              <circle cx="560" cy="350" r="7" fill="#FFFFFF" />
              <circle cx="500" cy="420" r="7" fill="#FFFFFF" />
              <circle cx="500" cy="380" r="5" fill="#FFFFFF" />
              <path d="M 330 350 C 330 450, 430 500, 500 500" stroke="#FFCD00" strokeWidth="6" fill="none" />
              <path d="M 670 350 C 670 450, 570 500, 500 500" stroke="#FFCD00" strokeWidth="6" fill="none" />
            </svg>

            <div className="inline-block bg-neutral-950 border border-neutral-900 rounded-full px-4 py-1.5 mb-4">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mr-2">Localização Ativa:</label>
              <span className="text-xs font-bold text-emerald-400">Curitiba / PR (URBS)</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 glow-text-emerald">
              PIMAC
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] mt-2 font-semibold">
              Plataforma Integrada de Mobilidade e Auditoria Cidadã
            </p>
          </div>

          <section className="max-w-4xl mx-auto mb-8 bg-neutral-900/30 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center font-black text-black shadow-md">
                <span className="text-[8px] absolute -top-1.5 -right-1.5 bg-fuchsia-600 text-white rounded-full px-1.5 py-0.5 font-bold">LVL</span>
                {userProfile.nivel}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Auditor: {usuarioLogado.nome}</p>
                  {usuarioLogado.cartao !== "Isento/Não Cadastrado" && (
                    <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 py-0.2 rounded font-mono font-bold">{usuarioLogado.cartao}</span>
                  )}
                </div>
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

          {/* GRELHA HARMÓNICA DE 8 BOTÕES (2 LINHAS DE 4 EM DESKTOP) */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            
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
                <p className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">Acompanhe biarticulados e previsões de tempo ao vivo.</p>
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
                <p className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">Pontualidade e frotas de Ligeirões da URBS.</p>
              </div>
            </button>

            {/* BOTÃO 3 - AZUL */}
            <button 
              onClick={() => setActiveSection('denuncias')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-blue-900 bg-blue-950/10 hover:bg-blue-950/30 hover:border-blue-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">✍️</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Denúncias & Mural</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">Relate problemas (+5 Mob) ou valide relatos (+2 Mob).</p>
              </div>
            </button>

            {/* BOTÃO 4 - VERDE */}
            <button 
              onClick={() => setActiveSection('terminais')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-emerald-900 bg-emerald-950/10 hover:bg-emerald-950/30 hover:border-emerald-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">🏫</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Terminais da URBS</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">Endereços completos e fluxos de todos os 22 terminais.</p>
              </div>
            </button>

            {/* BOTÃO 5 - AZUL */}
            <button 
              onClick={() => setActiveSection('ia_chat')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-blue-900 bg-blue-950/10 hover:bg-blue-950/30 hover:border-blue-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg animate-float"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">🤖</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">PIMAC IA Chat</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">Consulte seus direitos nos tubos e formule queixas oficiais.</p>
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
                <p className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">Troque créditos por vantagens e QR codes.</p>
              </div>
            </button>

            {/* BOTÃO 7 - AZUL */}
            <button 
              onClick={() => setActiveSection('contatos')}
              className="flex flex-col justify-between p-5 rounded-2xl border border-blue-900 bg-blue-950/10 hover:bg-blue-950/30 hover:border-blue-500 transition-all duration-300 h-36 cursor-pointer text-left group shadow-lg animate-float"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">📞</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Contactos Úteis</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">Telefones da URBS, 156 e ouvidorias.</p>
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
                <p className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">Resultados ecológicos e árvores preservadas.</p>
              </div>
            </button>

          </section>

          {/* Botão administrativo visível no rodapé do menu principal */}
          <div className="text-center mt-12 relative z-10">
            <button 
              onClick={fazerLogout}
              className="px-6 py-2.5 bg-neutral-950 border border-neutral-900 text-rose-500 hover:text-rose-400 font-extrabold text-xs uppercase tracking-widest rounded-xl transition duration-300 cursor-pointer"
            >
              Sair da Conta de Auditor 🚪
            </button>
          </div>
        </div>
      )}

      {/* -------------------- ECRÃS DINÂMICOS (NAVEGAÇÃO TOTAL DE ECRÃ INTEIRO) -------------------- */}
      {activeSection !== 'menu' && (
        <main className="max-w-7xl mx-auto animate-fadeIn mb-12">
          
          {/* ECRÃ 1: MAPA INTERATIVO REAL (GOOGLE MAPS LAYER) */}
          {activeSection === 'mapa' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider">📍 Monitor do Google Maps (Telemetria URBS Curitiba)</h2>
                  
                  {/* Alternador de Modo do Google Maps */}
                  <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 text-[10px] font-bold">
                    <button 
                      onClick={() => setMapType('roadmap')}
                      className={`px-3 py-1 rounded ${mapType === 'roadmap' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                    >
                      Google Mapa
                    </button>
                    <button 
                      onClick={() => setMapType('satellite')}
                      className={`px-3 py-1 rounded ${mapType === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                    >
                      Google Satélite
                    </button>
                  </div>
                </div>
                
                {/* CONTAINER DO MAPA DO LEAFLET */}
                <div 
                  ref={mapContainerRef} 
                  className="aspect-video bg-black rounded-xl border border-neutral-800 relative overflow-hidden flex items-center justify-center z-10"
                  style={{ minHeight: '400px' }}
                >
                  {!leafletLoaded && (
                    <div className="text-slate-500 text-xs animate-pulse">A carregar o Google Maps do Paraná...</div>
                  )}
                </div>
              </div>

              {/* DETALHES DO MAPA REAL */}
              <div className="bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Auditoria de Telemetria</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Você está visualizando o mapa real do **Google Maps** centrado em Curitiba. 
                    As posições dos autocarros e terminais correspondem à rede de canaletas integradas da URBS.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    Faça zoom no mapa para acompanhar os autocarros percorrendo as avenidas em tempo real. Clique em qualquer marcador para inspecionar a matrícula do veículo e a velocidade!
                  </p>
                </div>
                
                {selectedBus && (
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 mt-4 animate-fadeIn">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">Biarticulado Selecionado</span>
                    <h4 className="text-xs font-bold text-slate-200 mt-1">#{selectedBus.id} - {selectedBus.nome}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] font-mono text-slate-400">
                      <span>Placa: {selectedBus.placa}</span>
                      <span>Velocidade: {selectedBus.velocidade} km/h</span>
                      <span>Pontualidade: {selectedBus.pontualidade}%</span>
                      <span className="text-amber-400 font-bold">ETA: {selectedBus.eta} min</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-850 text-xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Metodologia Realtime</span>
                  <span className="text-emerald-400 font-extrabold text-sm">Integração Síncrona Leaflet & Google Map Layers</span>
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
                  <p className="text-xs text-slate-500">Métricas analíticas consolidadas de pontualidade de Curitiba.</p>
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
                    {linhasFiltradas(linhas).map(linha => (
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
                        placeholder="Anônimo"
                        value={novoAutorRelato}
                        onChange={(e) => setNovoAutorRelato(e.target.value)}
                        className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700"
                        disabled={true} // Forçado para manter o nome de auditor cadastrado no login!
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-black border border-neutral-800 px-3 py-2 rounded-xl">
                    <input 
                      type="checkbox" 
                      id="pcd" 
                      checked={pcdAcessivel} 
                      onChange={(e) => setPcdAcessivel(e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                    <label htmlFor="pcd" className="text-[10px] font-bold text-slate-300 cursor-pointer">♿ Fiscalizar Acessibilidade / Rampas (PCD)</label>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Detalhes da Ocorrência</label>
                    <textarea 
                      rows="3"
                      placeholder="Descreva detalhes como estação-tubo, número do carro ou sentido..."
                      value={novoTextoRelato}
                      onChange={(e) => setNovoTextoRelato(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none resize-none placeholder:text-slate-700"
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer">
                    Enviar Auditoria (+5 Mob)
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl shadow-xl">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">🔔 Mural Cívico de Apoio Coletivo</h3>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {alertas.map(alerta => (
                    <div key={alerta.id} className="bg-black border border-neutral-850 p-4 rounded-xl flex flex-col justify-between hover:border-neutral-800 transition">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] bg-rose-950/40 text-rose-400 border border-rose-900/40 px-2 py-0.5 rounded font-bold uppercase">{alerta.tipo}</span>
                          <span className="text-[10px] text-slate-500">{alerta.hora} • Linha #{alerta.linha}</span>
                        </div>
                        <p className="text-xs text-slate-300 italic mt-2">"{alerta.texto}"</p>
                        <span className="text-[9px] text-slate-500 block text-right mt-2">— {alerta.autor}</span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-neutral-900 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Validado por {alerta.votos || 1} pessoas</span>
                        <button 
                          onClick={() => upvotarAlerta(alerta.id)}
                          className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-850 hover:text-emerald-400 text-slate-400 font-bold text-[9px] uppercase rounded-lg border border-neutral-800 flex items-center gap-1.5 transition cursor-pointer"
                        >
                          👍 Validar (+2 Mob)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ECRÃ 4: TERMINAIS DE INTEGRAÇÃO (TODOS OS 22!) */}
          {activeSection === 'terminais' && (
            <div className="bg-neutral-900/30 border border-neutral-900 p-6 rounded-2xl shadow-xl">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">🏫 Terminais de Integração Ativos (Curitiba)</h2>
                  <p className="text-xs text-slate-500">Exibindo os 22 terminais urbanos reais com fluxo, linhas e localizações.</p>
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar terminal..."
                  value={filtroPesquisa}
                  onChange={(e) => setFiltroPesquisa(e.target.value)}
                  className="bg-black border border-neutral-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {CIDADES_DATA["Curitiba/PR"].terminais
                  .filter(t => t.nome.toLowerCase().includes(filtroPesquisa.toLowerCase()))
                  .map(terminal => (
                    <div key={terminal.id} className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-500/30 transition">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-3xl">{terminal.icone}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                            terminal.status === 'Sobrecarga' ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
                          }`}>
                            {terminal.status}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-200 mt-4">{terminal.nome}</h3>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">{terminal.localizacao}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-900 flex justify-between text-[10px]">
                        <div>
                          <span className="text-slate-500 block font-bold">Fluxo Estimado</span>
                          <span className="font-semibold text-slate-300">{terminal.fluxo}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block font-bold">Linhas Ativas</span>
                          <span className="font-semibold text-slate-300">{terminal.linhasAtendidas} rotas</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ECRÃ 5: CHAT DE IA CÍVICA */}
          {activeSection === 'ia_chat' && (
            <div className="bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl shadow-xl max-w-3xl mx-auto animate-fadeIn">
              <div className="border-b border-neutral-850 pb-4 mb-4 flex items-center space-x-3">
                <span className="text-3xl">🤖</span>
                <div>
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">PIMAC IA - Ouvidoria de Curitiba</h3>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Consultoria Legal de Direitos do Passageiro URBS</p>
                </div>
              </div>

              {/* Box de Mensagens */}
              <div className="bg-black/80 rounded-xl border border-neutral-850 p-4 h-80 overflow-y-auto space-y-3 flex flex-col">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white self-end rounded-tr-none' 
                        : 'bg-neutral-900 text-slate-100 self-start rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Opções Rápidas de Pergunta */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button 
                  onClick={() => setChatInput("Qual é o tempo máximo permitido de atraso pela URBS?")}
                  className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-900 hover:border-blue-500 text-slate-400 hover:text-blue-400 text-[10px] font-bold rounded-lg transition"
                >
                  🕒 Tolerância de Atraso URBS
                </button>
                <button 
                  onClick={() => setChatInput("O que fazer se a rampa de acessibilidade do tubo estiver estragada?")}
                  className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-900 hover:border-blue-500 text-slate-400 hover:text-blue-400 text-[10px] font-bold rounded-lg transition"
                >
                  ♿ Defeito em Estações-Tubo
                </button>
                <button 
                  onClick={() => setChatInput("Como funciona a integração temporal em Curitiba?")}
                  className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-900 hover:border-blue-500 text-slate-400 hover:text-blue-400 text-[10px] font-bold rounded-lg transition"
                >
                  💳 Integração do Cartão Transporte
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Escreva sua dúvida jurídica ou operacional..."
                  className="flex-1 bg-black border border-neutral-800 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase rounded-lg transition"
                >
                  Enviar
                </button>
              </form>
            </div>
          )}

          {/* ECRÃ 6: LOJAS E CUPONS */}
          {activeSection === 'loja' && (
            <div className="space-y-6">
              <div className="bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl shadow-xl">
                <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider">🛍️ Central Conveniada de Cupões de Curitiba</h2>
                <p className="text-xs text-slate-400">Troque as moedas Mob obtidas em auditorias por vantagens reais em lanchonetes e papelarias conveniadas.</p>
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
                          <span className="bg-amber-500/10 text-amber-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">{cupom.categoria}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-100 mt-4">{cupom.titulo}</h4>
                        <p className="text-[10px] text-slate-500">{cupom.parceiro}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-850 flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-amber-400">{cupom.custo} Mob</span>
                        {jaResgatou ? (
                          <span className="text-[10px] text-slate-500 font-bold">Resgatado ✓</span>
                        ) : (
                          <button 
                            onClick={() => confirmarResgatarCupom(cupom)}
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
                <div className="bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl shadow-xl animate-fadeIn">
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
              {(CIDADES_DATA[selectedCity]?.contatos || []).map(contato => (
                <div key={contato.id} className="bg-neutral-900/30 border border-neutral-900 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{contato.icone}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{contato.name}</h4>
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
              <h2 className="text-base font-bold text-blue-400 uppercase tracking-wider">Descarbonização de Curitiba</h2>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Curitiba possui um dos sistemas de transporte mais eficientes do mundo. Com a PIMAC, ajudamos a evitar congestionamentos nas canaletas, prevenindo que frotas de biarticulados fiquem paradas com motores ligados em marcha lenta, poupando combustível e poupando árvores.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-black border border-neutral-850 p-4 rounded-xl">
                  <span className="text-2xl font-mono font-black text-emerald-400 block">-{totalCo2Evitado} kg CO₂</span>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Carbono Evitado</p>
                </div>
                <div className="bg-black border border-neutral-850 p-4 rounded-xl">
                  <span className="text-2xl font-mono font-black text-emerald-400 block">🌳 {arvoresEquivalentes}</span>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Árvores Preservadas</p>
                </div>
              </div>
            </div>
          )}

        </main>
      )}

      {/* -------------------- SIMULADOR DE CLIMA INTEGRADO (RODAPÉ DOS ECRÃS INTERNOS) -------------------- */}
      {activeSection !== 'menu' && (
        <section className="bg-neutral-900/30 border border-neutral-900 p-4 rounded-2xl mt-8 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Cenário de Simulação de Trânsito</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Altere o clima para simular o comportamento de tráfego de Curitiba.</p>
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
              🌧️ Clima Curitibano
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
        <p>PIMAC • Plataforma de Auditoria Cidadã Integrada • Curitiba/PR • Protótipo de Testes e Demonstrações de Escala.</p>
        <button onClick={limparBancoDeDados} className="text-slate-500 hover:text-slate-300 underline cursor-pointer bg-transparent border-none">
          🧹 Repor Base de Dados do Navegador
        </button>
      </footer>

    </div>
  );
}