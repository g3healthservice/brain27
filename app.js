/* ============================================================
   BRAIN27 — app.js
   Catálogo de serviços + configurador de unidades móveis
   Dados dimensionais fundamentados em Termos de Referência
   de editais públicos reais (áreas em m²).
   ============================================================ */

/* ---------- Fotos reais (arquivos locais em /assets) ----------
   Fotografias reais licenciadas (Wikimedia Commons / StockSnap, licença
   de uso comercial). Centralizadas para troca fácil; fallback elegante
   caso alguma falhe. Créditos completos em assets/CREDITOS.txt */
const IMAGES = {
  hero:     "assets/hero.jpg",
  van:      "assets/van.jpg",
  truck:    "assets/truck.jpg",
  carreta:  "assets/carreta.jpg",
  interior: "assets/interior.jpg",
  case1:    "assets/case1.jpg",
  case2:    "assets/case2.jpg",
  case3:    "assets/case3.jpg",
  case4:    "assets/case4.jpg",
  // módulos de serviço
  m_mamografia:  "assets/m_mamografia.jpg",
  m_preventivo:  "assets/m_preventivo.jpg",
  m_odonto:      "assets/m_odonto.jpg",
  m_oftalmo:     "assets/m_oftalmo.jpg",
  m_ultrassom:   "assets/m_ultrassom.jpg",
  m_consulta:    "assets/m_consulta.jpg",
  m_triagem:     "assets/m_triagem.jpg",
  m_coleta:      "assets/m_coleta.jpg"
};

/* ---------- Bases veiculares ---------- */
const BASES = {
  van:     { id:"van",     nome:"Van / Furgão",          area:12, maxMod:2,  elevador:false, label:"Ágil e econômica" },
  truck:   { id:"truck",   nome:"Caminhão Baú",          area:22, maxMod:4,  elevador:true,  label:"Equilíbrio ideal" },
  carreta: { id:"carreta", nome:"Carreta Semirreboque",  area:38, maxMod:10, elevador:true,  label:"Alta capacidade" }
};
const BASE_ICONS = {
  van:'<svg class="bo-icon" viewBox="0 0 60 40" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 28V12h30l10 8v8"/><path d="M4 28h52v-6"/><circle cx="16" cy="30" r="4"/><circle cx="44" cy="30" r="4"/><path d="M34 12v8h10"/></svg>',
  truck:'<svg class="bo-icon" viewBox="0 0 60 40" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="4" y="10" width="34" height="18"/><path d="M38 16h10l6 7v5H38"/><circle cx="16" cy="30" r="4"/><circle cx="46" cy="30" r="4"/></svg>',
  carreta:'<svg class="bo-icon" viewBox="0 0 60 40" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="2" y="9" width="42" height="19"/><path d="M44 28h14V21l-5-2h-9"/><circle cx="12" cy="31" r="3.4"/><circle cx="24" cy="31" r="3.4"/><circle cx="50" cy="31" r="3.4"/></svg>'
};

/* ---------- Módulos de serviço (área útil real em m²) ---------- */
const MODULES = [
  { id:"triagem",    nome:"Triagem e Sinais Vitais", area:2.55, minBase:"van",
    desc:"Aferição, classificação de risco e orientação.", img:"m_triagem",
    tags:["Enfermagem","Atenção básica"], team:{"Técnico(a) de enfermagem":1} },

  { id:"recepcao",   nome:"Recepção Pré-exame", area:3.90, minBase:"van",
    desc:"Acolhimento, cadastro e sala de espera.", img:"m_triagem",
    tags:["Acolhimento"], team:{"Recepcionista / atendente":1} },

  { id:"coleta",     nome:"Coleta Laboratorial", area:3.00, minBase:"van",
    desc:"Coleta de sangue e material para exames.", img:"m_coleta",
    tags:["Laboratório"], team:{"Técnico(a) de laboratório":1} },

  { id:"geral",      nome:"Consultório Médico Geral", area:4.65, minBase:"van",
    desc:"Consultas clínicas com prontuário eletrônico.", img:"m_consulta",
    tags:["Consulta","Clínica"], team:{"Médico(a) clínico":1} },

  { id:"preventivo", nome:"Preventivo / Coleta (Papanicolau)", area:4.05, minBase:"truck",
    desc:"Coleta citopatológica com cadeira ginecológica.", img:"m_preventivo",
    tags:["Saúde da mulher"], team:{"Enfermeiro(a)":1} },

  { id:"ginecologia",nome:"Consultório Ginecológico", area:4.65, minBase:"truck",
    desc:"Exame ginecológico completo e orientação.", img:"m_preventivo",
    tags:["Saúde da mulher"], team:{"Médico(a) ginecologista":1} },

  { id:"odontologia",nome:"Consultório Odontológico", area:6.00, minBase:"truck",
    desc:"Odonto completo com autoclave e RX portátil.", img:"m_odonto",
    tags:["Saúde bucal"], team:{"Cirurgião(ã)-dentista":1,"Aux. de saúde bucal (ASB)":1} },

  { id:"oftalmologia",nome:"Consultório Oftalmológico", area:4.50, minBase:"truck",
    desc:"Refração, acuidade visual e prescrição de óculos.", img:"m_oftalmo",
    tags:["Visão"], team:{"Médico(a) oftalmologista":1} },

  { id:"ultrassom",  nome:"Ultrassonografia", area:4.50, minBase:"truck",
    desc:"Exames de imagem por ultrassom com laudo.", img:"m_ultrassom",
    tags:["Diagnóstico","Imagem"], team:{"Médico(a) ultrassonografista":1} },

  { id:"testerapido",nome:"Sala de Testes Rápidos", area:2.55, minBase:"van",
    desc:"Testagem rápida (IST, glicemia) e aconselhamento.", img:"m_coleta",
    tags:["Diagnóstico"], team:{"Técnico(a) de enfermagem":1} },

  { id:"mamografia", nome:"Mamografia (sala blindada)", area:6.30, minBase:"carreta",
    desc:"Sala plumbífera com mamógrafo e proteção radiológica.", img:"m_mamografia",
    tags:["Imagem","Blindagem"], reqBlindagem:true,
    team:{"Técnico(a) de radiologia":2} },

  { id:"laudo",      nome:"Sala de Comando e Laudo", area:1.45, minBase:"carreta",
    desc:"Estação de laudo digital (CR) e telemedicina.", img:"m_consulta",
    tags:["Laudo","Telemedicina"], team:{"Médico(a) radiologista (laudista)":1} }
];

/* ---------- Infraestrutura ---------- */
const INFRA = [
  { id:"climatizacao", nome:"Climatização central",   desc:"Ar-condicionado em todos os ambientes.", base:true },
  { id:"gerador",      nome:"Gerador independente",    desc:"Autonomia elétrica total em campo." },
  { id:"satelite",     nome:"Internet via satélite",   desc:"Telemedicina e envio de laudos." },
  { id:"agua",         nome:"Tratamento de água",      desc:"Reservatório, bomba e descarte." },
  { id:"elevador",     nome:"Elevador PCD",            desc:"Acessibilidade sem degraus.", needsBase:["truck","carreta"] },
  { id:"suspensao",    nome:"Suspensão pneumática",    desc:"Nivelamento e proteção de equipamentos." },
  { id:"blindagem",    nome:"Blindagem radiológica",   desc:"Manta plumbífera (exigida para RX).", autoBy:"mamografia" }
];

/* ---------- Estado ---------- */
const state = { base:"truck", modules:new Set(), infra:new Set(["climatizacao"]) };

/* ===========================================================
   Carregamento de imagens com fallback
   =========================================================== */
function loadImages(){
  document.querySelectorAll("img.ph[data-key]").forEach(img=>{
    const key = img.dataset.key;
    applyImage(img, IMAGES[key], img.alt || key);
  });
  document.querySelectorAll("img.ph[data-src]").forEach(img=>{
    if(img.dataset.loaded) return;
    img.dataset.loaded = "1";
    applyImage(img, img.dataset.src, img.alt || "");
  });
}
function applyImage(img, url, label){
  if(!url){ markBroken(img,label); return; }
  img.src = url;
  img.loading = "lazy";
  img.onerror = ()=> markBroken(img,label);
}
function markBroken(img,label){
  img.removeAttribute("src");
  img.classList.add("is-broken");
  img.textContent = label;
}

/* ===========================================================
   Render — catálogo de serviços (seção Serviços)
   =========================================================== */
function renderServices(){
  const grid = document.getElementById("svcGrid");
  const feat = ["mamografia","odontologia","oftalmologia","ultrassom","preventivo","geral","triagem","coleta"];
  grid.innerHTML = feat.map(id=>{
    const m = MODULES.find(x=>x.id===id);
    return `<article class="svc-card">
      <div class="svc-media"><img class="ph" data-key="${m.img}" alt="${m.nome}"><span class="svc-area">${fmt(m.area)} m²</span></div>
      <div class="svc-body">
        <h3>${m.nome}</h3>
        <p>${m.desc}</p>
        <div class="svc-tags">${m.tags.map(t=>`<span>${t}</span>`).join("")}</div>
      </div>
    </article>`;
  }).join("");
}

/* ===========================================================
   Render — configurador
   =========================================================== */
function renderBasePicker(){
  const el = document.getElementById("basePicker");
  el.innerHTML = Object.values(BASES).map(b=>`
    <button class="base-opt ${state.base===b.id?"sel":""}" data-base="${b.id}" type="button">
      <span class="bo-check">✓</span>
      ${BASE_ICONS[b.id]}
      <h4>${b.nome}</h4>
      <span class="bo-area">${b.area} m² · até ${b.maxMod} ambientes</span>
    </button>`).join("");
  el.querySelectorAll(".base-opt").forEach(btn=>{
    btn.onclick = ()=>{ state.base = btn.dataset.base; syncModulesToBase(); update(); };
  });
}

function renderModulePicker(){
  const el = document.getElementById("modPicker");
  const base = BASES[state.base];
  el.innerHTML = MODULES.map(m=>{
    const okBase = BASES[m.minBase].area <= base.area && (base.maxMod >= BASES[m.minBase].maxMod || true);
    const allowed = baseRank(state.base) >= baseRank(m.minBase);
    const sel = state.modules.has(m.id);
    const req = !allowed ? `<span class="mod-req">requer ${BASES[m.minBase].nome}</span>` : "";
    return `<button class="mod-opt ${sel?"sel":""} ${allowed?"":"disabled"}" data-mod="${m.id}" type="button" ${allowed?"":"disabled"}>
      <span class="mod-check"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M2 6.5l2.5 2.5L10 3"/></svg></span>
      <span class="mod-info"><h4>${m.nome}</h4><p>${m.desc}</p></span>
      <span class="mod-area">${fmt(m.area)} m²</span>
      ${req}
    </button>`;
  }).join("");
  el.querySelectorAll(".mod-opt:not(.disabled)").forEach(btn=>{
    btn.onclick = ()=>{ toggleModule(btn.dataset.mod); };
  });
}

function renderInfraPicker(){
  const el = document.getElementById("infraPicker");
  el.innerHTML = INFRA.map(i=>{
    const locked = i.base || (i.autoBy && state.modules.has(i.autoBy)) ||
                   (i.needsBase && !i.needsBase.includes(state.base));
    const on = state.infra.has(i.id);
    const note = (i.needsBase && !i.needsBase.includes(state.base)) ? " (indisponível nesta base)"
               : (i.autoBy && state.modules.has(i.autoBy)) ? " (incluída pela mamografia)"
               : i.base ? " (padrão)" : "";
    return `<button class="infra-opt ${on?"sel":""} ${locked?"locked":""}" data-infra="${i.id}" type="button" ${locked?"disabled":""}>
      <span class="infra-check"></span>
      <span><h4>${i.nome}</h4><p>${i.desc}${note}</p></span>
    </button>`;
  }).join("");
  el.querySelectorAll(".infra-opt:not(.locked)").forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.dataset.infra;
      state.infra.has(id) ? state.infra.delete(id) : state.infra.add(id);
      update();
    };
  });
}

/* ===========================================================
   Lógica de estado
   =========================================================== */
function baseRank(id){ return {van:0,truck:1,carreta:2}[id]; }

function toggleModule(id){
  if(state.modules.has(id)) state.modules.delete(id);
  else state.modules.add(id);
  update();
}

function syncModulesToBase(){
  // remove módulos incompatíveis ao trocar de base
  [...state.modules].forEach(id=>{
    const m = MODULES.find(x=>x.id===id);
    if(baseRank(state.base) < baseRank(m.minBase)) state.modules.delete(id);
  });
}

function usedArea(){
  return [...state.modules].reduce((s,id)=> s + MODULES.find(m=>m.id===id).area, 0);
}

function computeTeam(){
  const team = { "Motorista":1, "Montador":1, "Auxiliar de limpeza":1 };
  state.modules.forEach(id=>{
    const m = MODULES.find(x=>x.id===id);
    if(m.team) for(const role in m.team) team[role] = (team[role]||0) + m.team[role];
  });
  if([...state.modules].some(id=>["mamografia","laudo","ultrassom","preventivo"].includes(id)))
    team["Técnico(a) de TI / administrativo"] = 1;
  return team;
}

/* ===========================================================
   Update (recalcula tudo)
   =========================================================== */
function update(){
  // auto-blindagem quando mamografia
  if(state.modules.has("mamografia")) state.infra.add("blindagem");
  else state.infra.delete("blindagem");
  // elevador some se base não suporta
  if(!BASES[state.base].elevador) state.infra.delete("elevador");

  renderBasePicker();
  renderModulePicker();
  renderInfraPicker();
  loadImages();
  renderSummary();
}

function renderSummary(){
  const base = BASES[state.base];
  const area = usedArea();
  const pct = Math.round((area/base.area)*100);
  const count = state.modules.size;

  document.getElementById("sumBase").textContent = `${base.nome} · ${base.label}`;
  document.getElementById("sumArea").textContent = `${fmt(area)} m²`;
  document.getElementById("sumCap").textContent = `de ${base.area} m²`;
  document.getElementById("gaugePct").textContent = `${pct}%`;

  const fill = document.getElementById("gaugeFill");
  fill.style.width = Math.min(pct,100) + "%";
  fill.className = "gauge-fill" + (pct>100?" over":pct>85?" warn":"");

  // alerta
  const alert = document.getElementById("sumAlert");
  const overArea = area > base.area;
  const overCount = count > base.maxMod;
  if(count===0){
    alert.hidden = true;
  } else if(overArea || overCount){
    alert.hidden = false;
    alert.className = "summary-alert over";
    const next = state.base==="van"?"o Caminhão Baú":"a Carreta Semirreboque";
    alert.innerHTML = overCount
      ? `A base comporta até <b>${base.maxMod}</b> ambientes. Você selecionou <b>${count}</b>. Considere ${next}.`
      : `A área excede a capacidade da base em <b>${fmt(area-base.area)} m²</b>. Considere ${next}.`;
  } else if(pct>85){
    alert.hidden = false;
    alert.className = "summary-alert warn";
    alert.innerHTML = `Configuração próxima do limite (<b>${pct}%</b>). Bem otimizada, mas com pouca folga de circulação.`;
  } else {
    alert.hidden = false;
    alert.className = "summary-alert ok";
    alert.innerHTML = `Configuração viável nesta base, com folga adequada de circulação. ✓`;
  }

  // lista de módulos
  const mods = document.getElementById("sumModules");
  mods.innerHTML = count===0
    ? `<li class="empty">Nenhum módulo ainda.</li>`
    : [...state.modules].map(id=>{
        const m = MODULES.find(x=>x.id===id);
        return `<li><span>${m.nome}</span><span class="m-area">${fmt(m.area)} m²</span></li>`;
      }).join("");

  // infraestrutura
  const infra = document.getElementById("sumInfra");
  const activeInfra = INFRA.filter(i=> state.infra.has(i.id));
  infra.innerHTML = activeInfra.length===0
    ? `<li class="empty">Padrão da base.</li>`
    : activeInfra.map(i=>`<li><span>${i.nome}</span></li>`).join("");

  // equipe
  const teamEl = document.getElementById("sumTeam");
  const team = computeTeam();
  teamEl.innerHTML = count===0
    ? `<li class="empty">Selecione módulos para ver a equipe.</li>`
    : Object.entries(team).map(([role,n])=>`<li>${n}× ${role}</li>`).join("");

  // preenche campo de contato
  const cfgField = document.getElementById("configField");
  if(cfgField){
    const modNames = [...state.modules].map(id=>MODULES.find(m=>m.id===id).nome);
    cfgField.value = `${base.nome}` + (modNames.length? ` — ${modNames.join(" + ")}` : "");
  }
}

/* ===========================================================
   Utilidades e eventos globais
   =========================================================== */
function fmt(n){ return n.toLocaleString("pt-BR",{minimumFractionDigits:n%1?2:1,maximumFractionDigits:2}); }

function initPresets(){
  document.querySelectorAll("[data-preset]").forEach(el=>{
    el.addEventListener("click", ()=>{
      state.base = el.dataset.preset;
      syncModulesToBase();
      update();
    });
  });
}

function initNav(){
  const toggle = document.getElementById("navToggle");
  const nav = document.querySelector(".main-nav");
  if(toggle) toggle.onclick = ()=> nav.classList.toggle("open");
  document.querySelectorAll(".main-nav a").forEach(a=> a.onclick=()=>nav.classList.remove("open"));
}

/* Destino das propostas: FormSubmit.co (sem necessidade de conta).
   Endpoint montado em partes para dificultar scraping do e-mail.
   Troque LEAD_MAIL pelo alias FormSubmit após ativar (1º envio), se quiser
   ocultar totalmente o e-mail. */
const LEAD_MAIL = ["gersongomes","brain27.com.br"];
const LEAD_ENDPOINT = "https://formsubmit.co/ajax/" + LEAD_MAIL[0] + "@" + LEAD_MAIL[1];

function showNote(note, ok, msg){
  note.hidden = false;
  note.style.background = ok ? "" : "#fdf1f1";
  note.style.color      = ok ? "" : "#b3403c";
  note.style.borderColor= ok ? "" : "#f3c9c7";
  note.textContent = msg;
}

const MAX_TOTAL_ANEXOS = 10 * 1024 * 1024; // 10 MB (limite pratico do FormSubmit)

function humanSize(b){
  if(b < 1024) return b + " B";
  if(b < 1048576) return (b/1024).toFixed(0) + " KB";
  return (b/1048576).toFixed(1) + " MB";
}

function totalAnexos(input){
  return Array.from(input.files || []).reduce((s,f)=>s+f.size, 0);
}

/* Lista de anexos + remocao individual (via DataTransfer) + drag-and-drop. */
function initAnexos(){
  const input = document.getElementById("anexos");
  const drop  = document.getElementById("fileDrop");
  const list  = document.getElementById("fileList");
  const hint  = document.getElementById("fileHint");
  if(!input || !drop || !list) return;
  const hintBase = hint ? hint.textContent : "";

  function render(){
    const files = Array.from(input.files || []);
    if(!files.length){ list.hidden = true; list.innerHTML = ""; if(hint){ hint.textContent = hintBase; hint.style.color = ""; } return; }
    list.hidden = false;
    list.innerHTML = files.map((f,i)=>
      `<li><span class="fl-ico">📎</span>`+
      `<span class="fl-name" title="${f.name.replace(/"/g,'&quot;')}">${f.name}</span>`+
      `<span class="fl-size">${humanSize(f.size)}</span>`+
      `<button type="button" class="fl-x" data-i="${i}" aria-label="Remover ${f.name}">×</button></li>`
    ).join("");
    const total = totalAnexos(input);
    const over = total > MAX_TOTAL_ANEXOS;
    if(hint){
      hint.textContent = `${files.length} arquivo(s) · ${humanSize(total)}` +
        (over ? " — acima de 10 MB. Remova alguns ou envie um link (Drive/WeTransfer) na mensagem." : " no total (limite 10 MB).");
      hint.style.color = over ? "#b3403c" : "";
    }
    list.querySelectorAll(".fl-x").forEach(b=> b.onclick = ()=> removeAt(parseInt(b.dataset.i,10)));
  }

  function removeAt(idx){
    const dt = new DataTransfer();
    Array.from(input.files).forEach((f,i)=>{ if(i !== idx) dt.items.add(f); });
    input.files = dt.files;
    render();
  }

  input.addEventListener("change", render);

  ["dragenter","dragover"].forEach(ev => drop.addEventListener(ev, e=>{ e.preventDefault(); drop.classList.add("is-drag"); }));
  ["dragleave","dragend"].forEach(ev => drop.addEventListener(ev, e=>{ e.preventDefault(); drop.classList.remove("is-drag"); }));
  drop.addEventListener("drop", e=>{
    e.preventDefault(); drop.classList.remove("is-drag");
    const dt = new DataTransfer();
    Array.from(input.files).forEach(f=> dt.items.add(f));
    Array.from(e.dataTransfer.files).forEach(f=> dt.items.add(f));
    input.files = dt.files;
    render();
  });
}

function initForm(){
  const form = document.getElementById("contatoForm");
  const note = document.getElementById("formNote");
  if(!form) return;
  const btn = form.querySelector('button[type="submit"]');
  const input = document.getElementById("anexos");

  initAnexos();

  // Mensagem de sucesso ao retornar do FormSubmit (?enviado=1).
  if(/[?&]enviado=1/.test(location.search)){
    showNote(note, true, "Obrigado! Recebemos sua solicitação e os anexos. Um analista Brain27 retornará com a ficha técnica e a proposta da sua unidade.");
    const alvo = document.getElementById("contato");
    if(alvo) setTimeout(()=> alvo.scrollIntoView({behavior:"smooth"}), 200);
    history.replaceState(null, "", location.pathname + location.hash);
  }

  // Envio NATIVO multipart (necessario para anexos no FormSubmit); so validamos.
  form.addEventListener("submit", e=>{
    if(form._honey && form._honey.value){ e.preventDefault(); return; } // honeypot: bot
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    if(!nome || !email){
      e.preventDefault();
      showNote(note, false, "Por favor, preencha nome e e-mail para enviarmos sua proposta.");
      return;
    }
    if(input && totalAnexos(input) > MAX_TOTAL_ANEXOS){
      e.preventDefault();
      showNote(note, false, "Os anexos somam mais de 10 MB. Remova alguns arquivos ou envie um link (Drive/WeTransfer) na mensagem.");
      return;
    }
    const subj = form.querySelector('input[name="_subject"]');
    if(subj) subj.value = `Brain27 — nova solicitação de proposta (${nome})`;
    btn.disabled = true; btn.textContent = "Enviando…";
    // sem preventDefault: o navegador faz o POST multipart para o FormSubmit.
  });
}

function initReset(){
  const btn = document.getElementById("btnReset");
  if(btn) btn.onclick = ()=>{
    state.base="truck"; state.modules.clear(); state.infra=new Set(["climatizacao"]);
    update();
    document.getElementById("configurador").scrollIntoView({behavior:"smooth"});
  };
}

/* ===========================================================
   PORTFÓLIO & PROPOSTA TÉCNICA  (dados: catalogo.js -> CATALOGO_G3)
   =========================================================== */
const G3 = window.CATALOGO_G3 || {catalogo:[],veiculos:[],premissas:{},ancoras:[]};
const BRL  = n => (n==null||isNaN(n)) ? "—" : "R$ " + Number(n).toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:0});
const BRL2 = n => (n==null||isNaN(n)) ? "—" : "R$ " + Number(n).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const PCT  = n => (n==null?"—":(n*100).toLocaleString("pt-BR",{maximumFractionDigits:2})+"%");

const pfState = { cat:"Todos", plat:"Todas", q:"" };

function svcImage(s){
  const t = (s.servico||"").toLowerCase();
  if(t.includes("mulher")||t.includes("mamografia")) return "assets/case1.jpg";
  if(t.includes("catarata")||t.includes("oftalmo"))  return "assets/case4.jpg";
  if(t.includes("cirúrg")||t.includes("cirurgia"))   return "assets/case4.jpg";
  if(t.includes("odonto"))                            return "assets/m_odonto.jpg";
  if(t.includes("tomografia")||t.includes("ressonância")||t.includes("imagem")||t.includes("raio")||t.includes("radiologia")) return "assets/case3.jpg";
  if(t.includes("ultrassom")||t.includes("ultrassonografia")) return "assets/m_ultrassom.jpg";
  if(t.includes("sangue")||t.includes("análises")||t.includes("coleta")||t.includes("laborat")) return "assets/m_coleta.jpg";
  if(t.includes("vacina")||t.includes("primária")||t.includes("triagem")) return "assets/m_triagem.jpg";
  return "assets/m_consulta.jpg";
}
function platBadge(p){ return p||"—"; }

function renderPortfolioFilters(){
  const cats = ["Todos", ...Array.from(new Set(G3.catalogo.map(s=>s.categoria).filter(Boolean)))];
  const plats = ["Todas","Van","Caminhão","Carreta"];
  const catEl = document.getElementById("pfCat");
  const platEl = document.getElementById("pfPlat");
  if(catEl) catEl.innerHTML = cats.map(c=>`<button class="pf-chip ${pfState.cat===c?"on":""}" data-cat="${c}" type="button">${c}</button>`).join("");
  if(platEl) platEl.innerHTML = plats.map(p=>`<button class="pf-chip ${pfState.plat===p?"on":""}" data-plat="${p}" type="button">${p}</button>`).join("");
  catEl && catEl.querySelectorAll("[data-cat]").forEach(b=> b.onclick=()=>{ pfState.cat=b.dataset.cat; renderPortfolio(); });
  platEl && platEl.querySelectorAll("[data-plat]").forEach(b=> b.onclick=()=>{ pfState.plat=b.dataset.plat; renderPortfolio(); });
}

function renderPortfolio(){
  renderPortfolioFilters();
  const grid = document.getElementById("pfGrid");
  if(!grid) return;
  const q = pfState.q.trim().toLowerCase();
  const list = G3.catalogo.filter(s=>{
    if(pfState.cat!=="Todos" && s.categoria!==pfState.cat) return false;
    if(pfState.plat!=="Todas" && s.plataforma!==pfState.plat) return false;
    if(q && !(`${s.servico} ${s.obs} ${s.plataforma}`.toLowerCase().includes(q))) return false;
    return true;
  });
  if(list.length===0){ grid.innerHTML = `<p class="pf-empty">Nenhum serviço encontrado para esse filtro.</p>`; return; }
  grid.innerHTML = list.map(s=>{
    const idx = G3.catalogo.indexOf(s);
    return `<article class="pf-card">
      <div class="pf-media"><img class="ph" data-src="${svcImage(s)}" alt="${s.servico}"><span class="pf-plat">${platBadge(s.plataforma)}</span></div>
      <div class="pf-body">
        <span class="pf-cat">${s.categoria||""}</span>
        <h3>${s.servico}</h3>
        <p class="pf-obs">${s.obs||""}</p>
        <div class="pf-vals">
          <div><span>Locação seca</span><strong>${BRL(s.seca)}<i>/mês</i></strong></div>
          <div class="pf-val-main"><span>Turnkey</span><strong>${BRL(s.turnkey)}<i>/mês</i></strong></div>
        </div>
        <button class="btn btn-accent btn-block btn-sm" data-prop="${idx}" type="button">Gerar proposta</button>
      </div>
    </article>`;
  }).join("");
  grid.querySelectorAll("[data-prop]").forEach(b=> b.onclick=()=> openProposal(parseInt(b.dataset.prop)));
  loadImages();
}

/* ---------- cálculo da proposta ---------- */
function proposalValues(s, o){
  const meses = Math.min(120, Math.max(1, parseInt(o.prazo)||12));
  const qtd   = Math.min(99, Math.max(1, parseInt(o.qtd)||1));
  let mensalUnit;
  if(o.modalidade==="seca") mensalUnit = s.seca;
  else mensalUnit = (o.regiao==="amazonia") ? s.turnkeyAmazonia : s.turnkey;
  const mensalTotal = (mensalUnit||0)*qtd;
  return { meses, qtd, mensalUnit, mensalTotal, global: mensalTotal*meses };
}

function currentOpts(){
  return {
    modalidade: document.getElementById("ppModalidade").value,
    regiao:     document.getElementById("ppRegiao").value,
    prazo:      document.getElementById("ppPrazo").value,
    qtd:        document.getElementById("ppQtd").value
  };
}

let proposalCtx = { idx:null };

function propNumber(){
  const d = new Date();
  const p = n => String(n).padStart(2,"0");
  return `BRN27-${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${String(Math.floor(Math.random()*9000)+1000)}`;
}
function fmtDate(d){ return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"}); }

function renderProposalSheet(){
  const s = G3.catalogo[proposalCtx.idx];
  if(!s) return;
  const o = currentOpts();
  const v = proposalValues(s, o);
  const pr = G3.premissas || {};
  const veic = (G3.veiculos||[]).find(x=>x.plataforma===s.plataforma) || {};
  const modLabel = o.modalidade==="seca" ? "Locação seca (somente a unidade equipada)" : "Turnkey (operação completa com equipe e insumos)";
  const regLabel = o.regiao==="amazonia" ? "Amazônia Legal (adicional logístico de "+PCT(pr.amazonia)+")" : "Nacional";
  const hoje = new Date();
  const val = new Date(hoje.getTime()+30*864e5);
  if(!proposalCtx.num) proposalCtx.num = propNumber();

  const ancoras = (G3.ancoras||[]).slice(0,5).map(a=>
    `<tr><td>${a.referencia}</td><td class="num">${BRL(a.valor)}/mês</td><td>${a.escopo||""}</td></tr>`).join("");

  document.getElementById("proposalSheet").innerHTML = `
    <header class="ps-head">
      <div class="ps-logo"><img src="assets/logo.png" alt="Brain27 Group"></div>
      <div class="ps-meta">
        <div><span>Proposta nº</span><b>${proposalCtx.num}</b></div>
        <div><span>Data</span><b>${fmtDate(hoje)}</b></div>
        <div><span>Validade</span><b>${fmtDate(val)}</b></div>
      </div>
    </header>
    <h1 class="ps-title">Proposta Técnica — Unidade Móvel de Saúde</h1>
    <p class="ps-obj"><b>Objeto:</b> Fornecimento/locação de unidade móvel para o serviço de
       <b>${s.servico}</b>, na plataforma <b>${s.plataforma}</b>, incluindo estrutura, equipamentos${o.modalidade==="turnkey"?", equipe técnica e insumos":""} conforme especificação abaixo.</p>

    <section class="ps-sec">
      <h2>1. Especificação da unidade</h2>
      <table class="ps-kv">
        <tr><th>Serviço / finalidade</th><td>${s.servico}</td></tr>
        <tr><th>Plataforma veicular</th><td>${s.plataforma} — ${veic.obs||""}</td></tr>
        <tr><th>Capacidade estimada</th><td>${s.atendMes?("~"+s.atendMes+" atendimentos/mês"):"sob demanda"}</td></tr>
        <tr><th>Configuração / equipamentos</th><td>${s.obs||"Conforme termo de referência do serviço."}</td></tr>
        <tr><th>Categoria</th><td>${s.categoria||"—"}</td></tr>
      </table>
    </section>

    <section class="ps-sec">
      <h2>2. Composição do investimento (referência mensal)</h2>
      <table class="ps-comp">
        <tr><td>Ativo — veículo base</td><td class="num">${BRL(s.veiculoBase)}</td></tr>
        <tr><td>Ativo — kit de equipamentos</td><td class="num">${BRL(s.kitEquip)}</td></tr>
        <tr class="ps-sub"><td>Ativo total imobilizado</td><td class="num">${BRL(s.ativoTotal)}</td></tr>
        <tr><td>Locação seca da unidade (R$/mês)</td><td class="num">${BRL(s.seca)}</td></tr>
        <tr><td>Operação — motorista, deslocamento, manutenção (R$/mês)</td><td class="num">${BRL(s.operacao)}</td></tr>
        <tr><td>Equipe clínica + insumos (R$/mês)</td><td class="num">${BRL(s.equipeInsumos)}</td></tr>
        <tr class="ps-sub"><td>Custo direto (R$/mês)</td><td class="num">${BRL(s.custoDireto)}</td></tr>
        <tr class="ps-total"><td>Turnkey — operação completa (R$/mês)</td><td class="num">${BRL(s.turnkey)}</td></tr>
      </table>
    </section>

    <section class="ps-sec ps-highlight">
      <h2>3. Modalidade e valores contratados</h2>
      <table class="ps-kv">
        <tr><th>Modalidade</th><td>${modLabel}</td></tr>
        <tr><th>Abrangência</th><td>${regLabel}</td></tr>
        <tr><th>Quantidade de unidades</th><td>${v.qtd}</td></tr>
        <tr><th>Prazo do contrato</th><td>${v.meses} meses</td></tr>
        <tr><th>Valor mensal por unidade</th><td>${BRL2(v.mensalUnit)}</td></tr>
        <tr><th>Valor mensal total (${v.qtd} un.)</th><td>${BRL2(v.mensalTotal)}</td></tr>
      </table>
      <div class="ps-global"><span>Valor global do contrato (${v.qtd} un. × ${v.meses} meses)</span><strong>${BRL2(v.global)}</strong></div>
    </section>

    <section class="ps-sec">
      <h2>4. Premissas de precificação</h2>
      <ul class="ps-prem">
        <li>Taxa de locação mensal sobre o ativo: <b>${PCT(pr.taxaLocacao)}</b></li>
        <li>Overhead administrativo: <b>${PCT(pr.overhead)}</b></li>
        <li>Tributos sobre o preço (Lucro Presumido — serviços): <b>${PCT(pr.tributos)}</b></li>
        <li>Margem operacional: <b>${PCT(pr.margem)}</b></li>
        <li>Adicional Amazônia Legal (quando aplicável): <b>${PCT(pr.amazonia)}</b></li>
      </ul>
    </section>

    <section class="ps-sec">
      <h2>5. Referências de mercado (justificativa de preço)</h2>
      <table class="ps-anc">
        <thead><tr><th>Referência</th><th class="num">Valor</th><th>Escopo</th></tr></thead>
        <tbody>${ancoras}</tbody>
      </table>
    </section>

    <section class="ps-sec">
      <h2>6. Condições gerais</h2>
      <ul class="ps-cond">
        <li>Valores <b>estimativos de referência</b>, elaborados a partir do Prospecto G3 e ancorados em editais públicos (AgSUS 2025). Não constituem proposta comercial vinculante.</li>
        <li>Proposta válida por 30 dias. Reajuste anual por índice setorial. Impostos conforme legislação vigente.</li>
        <li>Locação seca não inclui equipe clínica, insumos e consumíveis; o turnkey contempla a operação completa.</li>
        <li>Escopo detalhado, cronograma de montagem e adequações regulatórias (ANVISA, PNQM, proteção radiológica) definidos no Termo de Referência.</li>
      </ul>
    </section>

    <footer class="ps-foot">
      <div><b>Brain27 Group</b> — Unidades Móveis de Saúde · gersongomes@brain27.com.br</div>
      <div>Documento gerado pela plataforma Brain27 em ${fmtDate(hoje)}.</div>
    </footer>`;
}

function openProposal(idx){
  proposalCtx = { idx, num:null };
  const modal = document.getElementById("proposalModal");
  renderProposalSheet();
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeProposal(){
  document.getElementById("proposalModal").hidden = true;
  document.body.style.overflow = "";
}

function initPortfolio(){
  if(!document.getElementById("pfGrid")) return;
  renderPortfolio();
  const search = document.getElementById("pfSearch");
  if(search) search.addEventListener("input", ()=>{ pfState.q = search.value; renderPortfolio(); });
}

function initProposalModal(){
  const modal = document.getElementById("proposalModal");
  if(!modal) return;
  modal.querySelectorAll("[data-close]").forEach(el=> el.onclick = closeProposal);
  document.addEventListener("keydown", e=>{ if(e.key==="Escape" && !modal.hidden) closeProposal(); });
  ["ppModalidade","ppRegiao","ppPrazo","ppQtd"].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener("input", renderProposalSheet);
  });
  const printBtn = document.getElementById("ppPrint");
  if(printBtn) printBtn.onclick = ()=> window.print();
  const sendBtn = document.getElementById("ppSend");
  if(sendBtn) sendBtn.onclick = ()=>{
    const s = G3.catalogo[proposalCtx.idx];
    const o = currentOpts();
    const v = proposalValues(s, o);
    const field = document.getElementById("configField");
    if(field) field.value = `Proposta ${proposalCtx.num||""} — ${s.servico} (${s.plataforma}) · ${o.modalidade==="seca"?"Locação seca":"Turnkey"}/${o.regiao} · ${v.qtd} un × ${v.meses} m · global ${BRL(v.global)}`;
    const msg = document.querySelector('#contatoForm [name="msg"]');
    if(msg && !msg.value) msg.value = `Tenho interesse na proposta ${proposalCtx.num||""} para ${s.servico}. Favor detalhar escopo e condições.`;
    closeProposal();
    document.getElementById("contato").scrollIntoView({behavior:"smooth"});
  };
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  loadImages();
  renderServices();
  update();
  initPresets();
  initNav();
  initForm();
  initReset();
  initPortfolio();
  initProposalModal();
});
