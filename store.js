// =====================================================
//  DADOS + ARMAZENAMENTO
//  Um único app serve qualquer loja. Cada cliente recebe
//  sua cópia e configura tudo pelo painel.
//  Demo: dados ficam no aparelho (localStorage).
//  Produção: este arquivo passa a usar o plano grátis do
//  Firebase, sem mudar as telas.
// =====================================================
(function () {
  let LOJA_ID = "demo";
  const K = (k) => `cardapio_${LOJA_ID}_${k}`;
  const uid = () => Math.random().toString(36).slice(2, 9);

  // ---------- modelos por segmento ----------
  const G = (nome, min, max, opcoes, regra = "soma") => ({ id: uid(), nome, min, max, regra, opcoes: opcoes.map(([n, p = 0]) => ({ nome: n, preco: p })) });
  const P = (cat, nome, desc, preco, art, extra = {}) => ({ id: uid(), cat, nome, desc, preco, art, foto: null, tag: "", ativo: true, grupos: [], ...extra });
  const LATA = () => G("Escolha a bebida", 1, 1, [["Coca-Cola lata"], ["Coca-Cola Zero lata"], ["Guaraná lata"], ["Fanta Laranja lata"]]);

  const MODELOS = {
    hamburgueria: {
      nome: "Hamburgueria", cor: "#ff5a1f", art: "burger",
      cats: ["Burgers", "Combos", "Porções", "Bebidas", "Sobremesas"],
      prods: (c) => {
        const ponto = () => G("Ponto da carne", 1, 1, [["Mal passado"], ["Ao ponto"], ["Bem passado"]]);
        const adic = () => G("Adicionais", 0, 4, [["Bacon extra", 5], ["Cheddar extra", 4], ["Ovo", 3], ["Blend extra 150g", 12], ["Cebola caramelizada", 4]]);
        const tirar = (l) => G("Retirar ingredientes", 0, l.length, l.map((n) => ["Sem " + n]));
        return [
          P(c[0], "Clássico da Casa", "Pão brioche, blend 150g, queijo prato, alface, tomate e molho da casa.", 29.9, "burger", { tag: "Mais vendido", grupos: [ponto(), adic(), tirar(["alface", "tomate", "molho"])] }),
          P(c[0], "Bacon Supremo", "Blend 180g, cheddar, bacon crocante, cebola caramelizada e maionese defumada.", 36.9, "burger", { tag: "Favorito", grupos: [ponto(), adic(), tirar(["cebola", "maionese"])] }),
          P(c[0], "Duplo Cheddar", "Dois blends de 120g, muito cheddar cremoso e picles.", 39.9, "burger", { grupos: [ponto(), adic(), tirar(["picles"])] }),
          P(c[0], "Chicken Crispy", "Frango empanado, queijo, alface americana e maionese de ervas.", 31.9, "burger", { grupos: [adic(), tirar(["alface", "maionese"])] }),
          P(c[0], "Smash Simples", "Dois smash de 80g, queijo americano e cebola na chapa.", 24.9, "burger", { grupos: [adic()] }),
          P(c[1], "Combo Clássico", "Clássico da Casa + batata média + bebida lata.", 44.9, "combo", { tag: "Economize R$ 9", grupos: [ponto(), LATA()] }),
          P(c[1], "Combo Casal", "2 Clássicos + batata grande + 2 bebidas lata.", 84.9, "combo", { grupos: [{ ...LATA(), id: uid(), nome: "Bebida 1" }, { ...LATA(), id: uid(), nome: "Bebida 2" }] }),
          P(c[2], "Batata Rústica", "Com casca, alecrim e sal grosso. Serve 2.", 19.9, "batata", { grupos: [G("Molhos", 0, 2, [["Cheddar", 4], ["Maionese verde", 3], ["Barbecue", 3]])] }),
          P(c[2], "Batata Cheddar e Bacon", "Batata frita coberta com cheddar e bacon.", 27.9, "batata"),
          P(c[2], "Onion Rings", "Anéis de cebola crocantes com barbecue.", 22.9, "batata"),
          P(c[3], "Refrigerante lata", "350ml gelado.", 6.5, "bebida", { grupos: [G("Sabor", 1, 1, [["Coca-Cola"], ["Coca-Cola Zero"], ["Guaraná"], ["Fanta Laranja"]])] }),
          P(c[3], "Refrigerante 2 litros", "Coca-Cola ou Guaraná.", 14, "bebida", { grupos: [G("Sabor", 1, 1, [["Coca-Cola"], ["Guaraná"]])] }),
          P(c[3], "Suco natural 500ml", "Laranja, limão ou maracujá.", 10, "bebida"),
          P(c[4], "Brownie com sorvete", "Brownie quente, sorvete de creme e calda.", 18.9, "doce"),
          P(c[4], "Milkshake 400ml", "Chocolate, morango ou ovomaltine.", 17.9, "doce")
        ];
      }
    },
    pizzaria: {
      nome: "Pizzaria", cor: "#d62828", art: "pizza",
      cats: ["Pizzas salgadas", "Pizzas doces", "Bebidas"],
      prods: (c) => {
        const tam = () => G("Tamanho", 1, 1, [["Broto (4 fatias)", 0], ["Média (6 fatias)", 14], ["Grande (8 fatias)", 24], ["Família (12 fatias)", 38]]);
        const sab = (extra) => G("Segundo sabor (meio a meio, cobra o maior)", 0, 1, [["Calabresa", 0], ["Mussarela", 0], ["Frango com catupiry", 4], ["Portuguesa", 4], ["Quatro queijos", 6], ...(extra || [])], "maior");
        const borda = () => G("Borda", 0, 1, [["Catupiry", 9], ["Cheddar", 9], ["Chocolate", 10]]);
        return [
          P(c[0], "Calabresa", "Mussarela, calabresa fatiada, cebola e orégano.", 39.9, "pizza", { tag: "Mais pedida", grupos: [tam(), sab(), borda()] }),
          P(c[0], "Mussarela", "Molho de tomate, mussarela e orégano.", 37.9, "pizza", { grupos: [tam(), sab(), borda()] }),
          P(c[0], "Frango com Catupiry", "Frango desfiado temperado e catupiry original.", 43.9, "pizza", { grupos: [tam(), sab(), borda()] }),
          P(c[0], "Portuguesa", "Presunto, ovo, cebola, ervilha, azeitona e mussarela.", 43.9, "pizza", { grupos: [tam(), sab(), borda()] }),
          P(c[0], "Quatro Queijos", "Mussarela, provolone, parmesão e catupiry.", 45.9, "pizza", { tag: "Favorita", grupos: [tam(), sab(), borda()] }),
          P(c[1], "Chocolate com Morango", "Chocolate ao leite e morangos frescos.", 44.9, "pizza", { grupos: [tam(), borda()] }),
          P(c[1], "Romeu e Julieta", "Goiabada cremosa com mussarela.", 41.9, "pizza", { grupos: [tam(), borda()] }),
          P(c[2], "Refrigerante 2 litros", "Bem gelado.", 14, "bebida", { grupos: [G("Sabor", 1, 1, [["Coca-Cola"], ["Guaraná"], ["Fanta"]])] }),
          P(c[2], "Refrigerante lata", "350ml.", 6.5, "bebida", { grupos: [G("Sabor", 1, 1, [["Coca-Cola"], ["Guaraná"]])] })
        ];
      }
    },
    acai: {
      nome: "Açaiteria", cor: "#7b2cbf", art: "acai",
      cats: ["Açaí no copo", "Barcas e especiais", "Bebidas"],
      prods: (c) => {
        const cob = () => G("Complementos grátis (até 5)", 0, 5, [["Leite em pó"], ["Granola"], ["Banana"], ["Paçoca"], ["Leite condensado"], ["Morango"], ["Confete"], ["Sucrilhos"]]);
        const extra = () => G("Adicionais pagos", 0, 6, [["Nutella", 6], ["Kiwi", 4], ["Ovomaltine", 4], ["Bis", 4], ["Creme de ninho", 5]]);
        return [
          P(c[0], "Açaí 300ml", "Açaí puro batido na hora.", 14, "acai", { grupos: [cob(), extra()] }),
          P(c[0], "Açaí 500ml", "Açaí puro batido na hora.", 19, "acai", { tag: "Mais pedido", grupos: [cob(), extra()] }),
          P(c[0], "Açaí 700ml", "Açaí puro batido na hora.", 25, "acai", { grupos: [cob(), extra()] }),
          P(c[1], "Barca 1kg", "Barca montada com 6 complementos à escolha.", 49.9, "acai", { grupos: [cob(), extra()] }),
          P(c[2], "Água mineral", "500ml.", 4, "bebida")
        ];
      }
    },
    lanchonete: {
      nome: "Lanchonete / Pastelaria", cor: "#e09f00", art: "pastel",
      cats: ["Pastéis", "Salgados", "Lanches", "Bebidas"],
      prods: (c) => [
        P(c[0], "Pastel de carne", "Carne moída temperada.", 9, "pastel", { tag: "Mais pedido" }),
        P(c[0], "Pastel de queijo", "Mussarela derretida.", 8, "pastel"),
        P(c[0], "Pastel de frango com catupiry", "Frango desfiado e catupiry.", 10, "pastel"),
        P(c[1], "Coxinha", "Frango com catupiry.", 6, "pastel"),
        P(c[1], "Kibe", "Recheado com queijo.", 6, "pastel"),
        P(c[2], "X-Tudo", "Hambúrguer, ovo, bacon, presunto, queijo, salada.", 24, "burger"),
        P(c[3], "Caldo de cana 500ml", "Com limão opcional.", 8, "bebida"),
        P(c[3], "Refrigerante lata", "350ml.", 6, "bebida")
      ]
    },
    marmitaria: {
      nome: "Marmitaria / Restaurante", cor: "#2d9b4a", art: "marmita",
      cats: ["Marmitas do dia", "Bebidas"],
      prods: (c) => [
        P(c[0], "Marmita P", "Arroz, feijão, 1 carne, salada e acompanhamento do dia.", 16, "marmita", { grupos: [G("Carne", 1, 1, [["Frango grelhado"], ["Bife acebolado", 3], ["Costela", 5], ["Linguiça"]]), G("Retirar", 0, 3, [["Sem salada"], ["Sem feijão"], ["Sem farofa"]])] }),
        P(c[0], "Marmita G", "Porção maior com 2 carnes.", 22, "marmita", { tag: "Mais vendida", grupos: [G("Carnes (escolha 2)", 2, 2, [["Frango grelhado"], ["Bife acebolado", 3], ["Costela", 5], ["Linguiça"]]), G("Retirar", 0, 3, [["Sem salada"], ["Sem feijão"], ["Sem farofa"]])] }),
        P(c[1], "Suco natural 500ml", "Sabor do dia.", 7, "bebida"),
        P(c[1], "Refrigerante lata", "350ml.", 6, "bebida")
      ]
    },
    outro: {
      nome: "Outro tipo de loja", cor: "#1d7fd6", art: "caixa",
      cats: ["Produtos"],
      prods: (c) => [P(c[0], "Produto de exemplo", "Edite ou apague no painel.", 10, "caixa")]
    }
  };

  // fotos reais de exemplo (Unsplash, uso livre)
  const FOTO = (id, w = 600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${w}&q=72`;
  const FOTOS = {
    "Clássico da Casa": "1568901346375-23c9450c58cd", "Bacon Supremo": "1586190848861-99aa4a171e90",
    "Duplo Cheddar": "1607013251379-e6eecfffe234", "Chicken Crispy": "1610440042657-612c34d95e9f",
    "Smash Simples": "1571091718767-18b5b1457add", "Combo Clássico": "1561758033-d89a9ad46330",
    "Combo Casal": "1594212699903-ec8a3eca50f5", "Batata Rústica": "1630384060421-cb20d0e0649d",
    "Batata Cheddar e Bacon": "1518013431117-eb1465fa5752", "Onion Rings": "1639024471283-03518883512d",
    "Refrigerante lata": "1581636625402-29b2a704ef13", "Refrigerante 2 litros": "1629186235045-80d4147d90dc",
    "Suco natural 500ml": "1600271886742-f049cd451bba", "Brownie com sorvete": "1515037893149-de7f840978e2",
    "Milkshake 400ml": "1572490122747-3968b75cc699", "X-Tudo": "1572802419224-296b0aeee0d9",
    "Calabresa": "1628840042765-356cda07504e", "Mussarela": "1513104890138-7c749659a591",
    "Frango com Catupiry": "1565299624946-b28f40a0ae38", "Portuguesa": "1604382354936-07c5d9983bd3",
    "Quatro Queijos": "1593504049359-74330189a345",
    "Açaí 300ml": "1771371000586-33abd2ce9e23", "Açaí 500ml": "1771371000586-33abd2ce9e23", "Açaí 700ml": "1771371000586-33abd2ce9e23", "Barca 1kg": "1771371000586-33abd2ce9e23"
  };
  window.FOTO_UNSPLASH = FOTO;

  function criarLoja({ nome, segmento, whats, cor }) {
    const m = MODELOS[segmento] || MODELOS.outro;
    const categorias = m.cats.map((n) => ({ id: uid(), nome: n }));
    const produtos = m.prods(categorias.map((c) => c.id));
    produtos.forEach((p) => { if (FOTOS[p.nome]) p.foto = FOTO(FOTOS[p.nome]); });
    const dia = (d, a, f, at = true) => ({ d, abre: a, fecha: f, ativo: at });
    return {
      versao: 1,
      loja: {
        nome: nome || "Minha Loja", slogan: "", segmento, logo: null, cor: cor || m.cor,
        whats: whats || "", endereco: "", cidade: "", instagram: "",
        modo: "auto",
        horarios: [dia(0, "18:00", "23:30"), dia(1, "18:00", "23:00", false), dia(2, "18:00", "23:00"), dia(3, "18:00", "23:00"), dia(4, "18:00", "23:00"), dia(5, "18:00", "23:59"), dia(6, "18:00", "23:59")],
        entrega: true, retirada: true, consumoLocal: false,
        tempoEntrega: "40–60 min", tempoRetirada: "20–30 min", pedidoMinimo: 0,
        tipoTaxa: "bairro", taxaFixa: 5,
        taxas: [{ bairro: "Centro", valor: 5 }],
        pix: true, dinheiro: true, cartao: true, chavePix: "", nomePix: "",
        aviso: "", capa: null, atendente: true,
        banner: { ativo: false, titulo: "", texto: "" },
        slides: [],
        agendamento: true,
        msgCabecalho: "Olá! Quero fazer um pedido 😋",
        msgRodape: "Obrigado! Aguardo a confirmação.",
        msgStatus: {
          preparo: "Oi {nome}! Seu pedido #{numero} foi aceito e já está sendo preparado 🔥",
          saiu: "Oi {nome}! Seu pedido #{numero} saiu para entrega 🛵 Já já chega aí!",
          pronto: "Oi {nome}! Seu pedido #{numero} está pronto pra retirada ✅",
          entregue: "Pedido #{numero} entregue! Obrigado pela preferência, {nome} 🙌 Volte sempre!",
          cancelado: "Oi {nome}, infelizmente precisamos cancelar o pedido #{numero}. Me chama aqui que te explico."
        },
        pin: "1234"
      },
      categorias, produtos,
      cupons: [{ codigo: "BEMVINDO10", tipo: "pct", valor: 10, minimo: 30, ativo: true }]
    };
  }

  // ======================================================
  //  MODO DEMO (aparelho) x MODO NUVEM (Firebase grátis)
  //  Demo: cardápio sem ?l= e painel com ?demo
  // ======================================================
  const CFG = window.APP_CONFIG || {};
  const Q = new URLSearchParams(location.search);
  const PAGINA = window.APP_PAGE || "cardapio";
  const QUER_DEMO = PAGINA === "cardapio" ? !Q.get("l") : PAGINA === "painel" ? Q.has("demo") : false;
  const NUVEM = !QUER_DEMO && !!(CFG.firebase && CFG.firebase.apiKey && window.firebase);
  const MASTERS = (CFG.masters || []).map((e) => e.toLowerCase());
  const DIA = 864e5;

  function read(k, def) { try { const v = localStorage.getItem(K(k)); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function write(k, v) {
    try { localStorage.setItem(K(k), JSON.stringify(v)); return true; }
    catch (e) { erro("O espaço do aparelho acabou. Use fotos menores ou apague algumas."); return false; }
  }
  const listeners = [], erroL = [];
  const emit = () => listeners.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
  const erro = (m) => { console.warn(m); erroL.forEach((f) => { try { f(m); } catch (e) {} }); };
  window.addEventListener("storage", (e) => { if (!NUVEM && e.key && e.key.startsWith(K(""))) emit(); });

  // ---------- imagens ficam em documentos separados na nuvem ----------
  const C = { dados: null, assinatura: null, owner: null, existe: false, pedidos: [], imgs: {}, user: null, minhaLoja: undefined, vistos: {} };
  const hash = (str) => { let h = 5381; for (let i = 0; i < str.length; i += 7) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return (h >>> 0).toString(36) + str.length.toString(36); };
  function extrairImgs(d) {
    const novas = {};
    const tira = (v) => { if (typeof v === "string" && v.startsWith("data:")) { const id = hash(v); novas[id] = v; C.imgs[id] = v; return "img:" + id; } return v; };
    const o = JSON.parse(JSON.stringify(d));
    o.loja.logo = tira(o.loja.logo); o.loja.capa = tira(o.loja.capa);
    (o.loja.slides || []).forEach((s) => s.img = tira(s.img));
    o.produtos.forEach((p) => p.foto = tira(p.foto));
    return [o, novas];
  }

  let db = null, auth = null, lojaRef = null, pronto = false;
  const prontoCbs = [];
  function marcarPronto() { if (pronto) return; pronto = true; prontoCbs.splice(0).forEach((f) => f()); }
  let subs = [], unsubPed = null;
  const limparSubs = () => { subs.forEach((u) => { try { u(); } catch (e) {} }); subs = []; if (unsubPed) { unsubPed(); unsubPed = null; } };

  function usarLoja(id, cb) {
    limparSubs(); LOJA_ID = id; C.dados = null; C.assinatura = null; C.owner = null; C.existe = false; C.pedidos = []; C.imgs = {};
    lojaRef = db.collection("lojas").doc(id);
    let a = false, b = false; const fim = () => { if (a && b) { cb && cb(); cb = null; } };
    subs.push(lojaRef.onSnapshot((snap) => {
      const d = snap.exists ? snap.data() : null;
      C.existe = !!d; C.dados = d ? d.dados : null; C.owner = d ? d.ownerUid : null; C.assinatura = d ? d.assinatura || null : null;
      a = true; fim(); emit();
    }, () => { erro("Sem conexão com o servidor."); a = true; fim(); }));
    subs.push(lojaRef.collection("imagens").onSnapshot((qs) => { qs.forEach((doc) => C.imgs[doc.id] = doc.data().d); b = true; fim(); emit(); }, () => { b = true; fim(); }));
  }

  if (NUVEM) {
    try {
      firebase.initializeApp(CFG.firebase);
      db = firebase.firestore(); auth = firebase.auth();
      if (PAGINA === "cardapio") {
        usarLoja(String(Q.get("l")).toLowerCase().replace(/[^a-z0-9-]/g, ""), marcarPronto);
        auth.onAuthStateChanged((u) => { C.user = u; });
      } else {
        auth.onAuthStateChanged(async (u) => {
          C.user = u; limparSubs(); C.minhaLoja = undefined; C.dados = null;
          if (u && PAGINA === "painel") {
            try { const doc = await db.collection("usuarios").doc(u.uid).get(); C.minhaLoja = doc.exists ? doc.data().loja : null; }
            catch (e) { C.minhaLoja = null; erro("Não consegui carregar sua conta."); }
            if (C.minhaLoja) return usarLoja(C.minhaLoja, () => { marcarPronto(); emit(); });
          }
          marcarPronto(); emit();
        });
      }
    } catch (e) { console.error(e); erro("Não consegui ligar no servidor."); marcarPronto(); }
  } else {
    pronto = true;
  }

  function salvarNuvem(d) {
    const [limpo, novas] = extrairImgs(d);
    C.dados = limpo; emit();
    const lote = db.batch();
    Object.entries(novas).forEach(([id, v]) => lote.set(lojaRef.collection("imagens").doc(id), { d: v }));
    lote.update(lojaRef, { dados: limpo, atualizado: Date.now() });
    return lote.commit().catch((e) => { console.error(e); erro(/permission/i.test(e.message) ? "Você não tem permissão pra mudar esta loja." : /exceeds|too large|size/i.test(e.message) ? "Imagem grande demais. Use uma foto menor." : "Não salvou. Verifique a internet."); });
  }
  const numPedido = () => Math.floor(Date.now() / 1000) % 100000;

  // situação da assinatura: { plano: 'teste'|'essencial'|'pro', ate: ms }
  function situacao(a) {
    if (!NUVEM) return { ativa: true, plano: (CFG.plano || "pro"), dias: 99, teste: false };
    if (!a) return { ativa: false, plano: "nenhum", dias: 0, teste: false };
    const dias = Math.ceil((a.ate - Date.now()) / DIA);
    return { ativa: !a.bloqueada && a.ate > Date.now(), plano: a.plano, dias, teste: a.plano === "teste", bloqueada: !!a.bloqueada, ate: a.ate };
  }

  window.Store = {
    get id() { return LOJA_ID; }, uid, MODELOS, nuvem: NUVEM, pagina: PAGINA, DIA,
    onChange(fn) { listeners.push(fn); },
    onErro(fn) { erroL.push(fn); },
    ready(cb) { if (pronto) cb(); else prontoCbs.push(cb); },
    configurada() { return !!this.get(); },
    get() { return NUVEM ? (C.dados ? JSON.parse(JSON.stringify(C.dados)) : null) : read("dados", null); },
    img(v) { if (!v) return null; if (typeof v === "string" && v.startsWith("img:")) return C.imgs[v.slice(4)] || null; return v; },
    save(d) { if (NUVEM) { salvarNuvem(d); return true; } const ok = write("dados", d); if (ok) emit(); return ok; },
    criar(opts) { const d = criarLoja(opts); write("dados", d); write("seq", 1000); emit(); return d; },

    // ----- assinatura -----
    situacao() { return situacao(C.assinatura); },
    plano() { const s = this.situacao(); return s.plano === "essencial" ? "essencial" : "pro"; },
    lojaExiste() { return C.existe; },

    // ----- contas (nuvem) -----
    usuario() { return C.user; },
    minhaLoja() { return C.minhaLoja; },
    souMaster() { const u = C.user; return !!(u && u.emailVerified && MASTERS.includes((u.email || "").toLowerCase())); },
    emailMaster() { const u = C.user; return !!(u && MASTERS.includes((u.email || "").toLowerCase())); },
    entrar(email, senha) { return auth.signInWithEmailAndPassword(email, senha); },
    criarConta(email, senha) { return auth.createUserWithEmailAndPassword(email, senha); },
    sair() { return NUVEM ? auth.signOut() : Promise.resolve(); },
    trocarSenha(nova) { return auth.currentUser.updatePassword(nova); },
    resetSenha(email) { return auth.sendPasswordResetEmail(email); },
    verificarEmail() { return auth.currentUser.sendEmailVerification(); },
    recarregarUsuario() { return auth.currentUser.reload().then(() => auth.currentUser.getIdToken(true)).then(() => { C.user = auth.currentUser; emit(); }); },
    async linkLivre(slug) { const d = await db.collection("lojas").doc(slug).get(); return !d.exists; },
    // cria a loja do dono: 3 dias de teste
    async criarLojaNuvem(slug, opts) {
      const u = C.user; const d = criarLoja(opts);
      const lote = db.batch();
      lote.set(db.collection("lojas").doc(slug), { dados: d, ownerUid: u.uid, assinatura: { plano: "teste", ate: Date.now() + 3 * DIA }, criado: Date.now(), atualizado: Date.now() });
      lote.set(db.collection("usuarios").doc(u.uid), { loja: slug, email: u.email, criado: Date.now() });
      await lote.commit();
      C.minhaLoja = slug;
      await new Promise((r) => usarLoja(slug, r));
      emit();
    },
    ouvirPedidos() {
      if (!NUVEM || unsubPed || !C.user || !lojaRef) return;
      unsubPed = lojaRef.collection("pedidos").orderBy("criado", "desc").limit(300).onSnapshot((qs) => {
        C.pedidos = qs.docs.map((d) => ({ ...d.data(), id: d.id })); emit();
      }, (e) => erro(/permission/i.test(e.message) ? "Esta conta não é dona desta loja." : "Erro ao carregar pedidos."));
    },

    // ----- painel mestre -----
    async todasLojas() {
      const [ls, us] = await Promise.all([db.collection("lojas").get(), db.collection("usuarios").get()]);
      const donos = {}; us.forEach((u) => { donos[u.id] = u.data(); });
      return ls.docs.map((l) => { const v = l.data(); return { id: l.id, nome: v.dados && v.dados.loja && v.dados.loja.nome, whats: v.dados && v.dados.loja && v.dados.loja.whats, ownerUid: v.ownerUid, email: (donos[v.ownerUid] || {}).email || "", assinatura: v.assinatura || null, criado: v.criado || 0, situacao: situacao(v.assinatura) }; });
    },
    mudarAssinatura(id, assinatura) { return db.collection("lojas").doc(id).update({ assinatura }); },

    // ----- pedidos -----
    pedidos() { return NUVEM ? C.pedidos.slice() : read("pedidos", []).sort((a, b) => b.criado - a.criado); },
    pedido(id) { return this.pedidos().find((p) => p.id === id) || C.vistos[id] || null; },
    addPedido(p) {
      if (NUVEM) {
        const ref = lojaRef.collection("pedidos").doc();
        const ped = { ...p, num: numPedido(), criado: Date.now(), status: "novo" };
        ref.set(ped).catch((e) => { console.error(e); erro("O pedido não foi registrado no sistema, mas a mensagem do WhatsApp funciona."); });
        return { ...ped, id: ref.id };
      }
      const list = read("pedidos", []); const num = read("seq", 1000) + 1; write("seq", num);
      const ped = { ...p, id: uid(), num, criado: Date.now(), status: "novo" };
      list.push(ped); write("pedidos", list); emit(); return ped;
    },
    updPedido(id, patch) {
      if (NUVEM) { const i = C.pedidos.findIndex((p) => p.id === id); if (i >= 0) { C.pedidos[i] = { ...C.pedidos[i], ...patch }; emit(); }
        return lojaRef.collection("pedidos").doc(id).update(patch).catch(() => erro("Não consegui atualizar o pedido.")); }
      const list = read("pedidos", []); const i = list.findIndex((p) => p.id === id); if (i < 0) return;
      list[i] = { ...list[i], ...patch }; write("pedidos", list); emit();
    },
    seguirPedido(id, cb) {
      if (NUVEM) return lojaRef.collection("pedidos").doc(id).onSnapshot((d) => { if (d.exists) { C.vistos[id] = { ...d.data(), id }; cb(C.vistos[id]); } }, () => {});
      const f = () => { const p = read("pedidos", []).find((x) => x.id === id); if (p) cb(p); };
      f(); listeners.push(f); return () => { const i = listeners.indexOf(f); if (i >= 0) listeners.splice(i, 1); };
    },
    limparPedidos() {
      if (NUVEM) { C.pedidos.forEach((p) => lojaRef.collection("pedidos").doc(p.id).delete()); C.pedidos = []; emit(); return; }
      write("pedidos", []); emit();
    },

    // ----- dados do freguês, só no aparelho dele -----
    cliente() { return read("cliente", null); },
    setCliente(c) { write("cliente", c); },
    meusPedidos() { return read("meus", []); },
    addMeuPedido(id) { const m = read("meus", []); m.unshift(id); write("meus", m.slice(0, 15)); },

    exportar() {
      const d = this.get(); if (d) { const r = (v) => this.img(v); d.loja.logo = r(d.loja.logo); d.loja.capa = r(d.loja.capa); (d.loja.slides || []).forEach((s) => s.img = r(s.img)); d.produtos.forEach((p) => p.foto = r(p.foto)); }
      return JSON.stringify({ dados: d, pedidos: this.pedidos() });
    },
    importar(txt) {
      const o = JSON.parse(txt); if (!o.dados || !o.dados.loja) throw new Error("Arquivo inválido");
      if (NUVEM) { salvarNuvem(o.dados); return; }
      write("dados", o.dados); write("pedidos", o.pedidos || []); write("seq", 1000 + (o.pedidos || []).length); emit();
    },
    apagarTudo() {
      if (NUVEM) return;
      Object.keys(localStorage).filter((k) => k.startsWith(K(""))).forEach((k) => localStorage.removeItem(k)); emit();
    }
  };
})();

// ---------- utilidades compartilhadas ----------
window.brl = (v) => "R$ " + Number(v || 0).toFixed(2).replace(".", ",");
window.esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
window.soDig = (t) => String(t || "").replace(/\D/g, "");
window.waNum = (t) => { let d = soDig(t); if (d.length === 10 || d.length === 11) d = "55" + d; return d; };
window.fone = (t) => { const d = soDig(t).replace(/^55(?=\d{10,11}$)/, ""); return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length === 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : d; };
window.num = (s) => { const v = parseFloat(String(s ?? "").replace(/\s/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".")); return isNaN(v) ? 0 : v; };
window.DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const toMin = (h) => { const [a, b] = (h || "0:0").split(":").map(Number); return a * 60 + b; };
const hhmm = (m) => { m = ((m % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };

window.statusLoja = function (loja, quando = new Date()) {
  if (loja.modo === "aberta") return { aberta: true, texto: "Aberto agora" };
  const agora = quando.getDay() * 1440 + quando.getHours() * 60 + quando.getMinutes();
  const jan = [];
  (loja.horarios || []).filter((h) => h.ativo).forEach((h) => {
    const a = h.d * 1440 + toMin(h.abre); let f = h.d * 1440 + toMin(h.fecha); if (f <= a) f += 1440;
    [-10080, 0, 10080].forEach((o) => jan.push([a + o, f + o]));
  });
  if (loja.modo !== "fechada") {
    const at = jan.find(([a, f]) => agora >= a && agora < f);
    if (at) return { aberta: true, texto: `Aberto até ${hhmm(at[1])}` };
  }
  if (loja.modo === "fechada") return { aberta: false, texto: "Fechado no momento" };
  const prox = jan.filter(([a]) => a > agora).sort((x, y) => x[0] - y[0])[0];
  if (!prox) return { aberta: false, texto: "Fechado no momento" };
  const diff = prox[0] - agora, dAbre = ((Math.floor(prox[0] / 1440) % 7) + 7) % 7;
  const quandoTxt = dAbre === quando.getDay() && diff < 1440 ? `hoje às ${hhmm(prox[0])}` : dAbre === (quando.getDay() + 1) % 7 && diff < 2880 ? `amanhã às ${hhmm(prox[0])}` : `${DIAS[dAbre].toLowerCase()} às ${hhmm(prox[0])}`;
  return { aberta: false, texto: `Fechado · abre ${quandoTxt}` };
};

window.horariosAgendar = function (loja) {
  const out = []; const ini = new Date(); ini.setSeconds(0, 0); ini.setMinutes(Math.ceil((ini.getMinutes() + 30) / 30) * 30);
  for (let i = 0; i < 7 * 48 && out.length < 20; i++) {
    const t = new Date(ini.getTime() + i * 30 * 60000);
    if (statusLoja({ ...loja, modo: "auto" }, t).aberta) out.push(t);
  }
  return out;
};

// preço de um item com as opções escolhidas
window.precoItem = function (prod, escolhas) {
  let v = Number(prod.preco) || 0;
  (prod.grupos || []).forEach((g) => {
    const sel = (escolhas[g.id] || []).map((i) => g.opcoes[i]).filter(Boolean);
    if (!sel.length) return;
    v += g.regra === "maior" ? Math.max(...sel.map((o) => Number(o.preco) || 0)) : sel.reduce((s, o) => s + (Number(o.preco) || 0), 0);
  });
  return v;
};

window.aplicarCor = function (cor) {
  const c = cor || "#ff5a1f";
  document.documentElement.style.setProperty("--brand", c);
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = "#0f0d0c";
};

window.preencher = (tpl, o) => String(tpl || "").replace(/\{nome\}/g, (o.nome || "").split(" ")[0]).replace(/\{numero\}/g, o.num || "").replace(/\{total\}/g, brl(o.total)).replace(/\{loja\}/g, o.loja || "");

// Loja de exemplo (só quando APP_CONFIG.demo = true e ainda não há cardápio)
window.montarDemo = function() {
  if (Store.nuvem) return;
  let v = null; try { v = localStorage.getItem("cardapio_demo_versao"); } catch (e) {}
  if (Store.get() && v === "4") return;
  if (Store.get()) Store.apagarTudo();
  try { localStorage.setItem("cardapio_demo_versao", "4"); } catch (e) {}
  const d = Store.criar({ nome: "Burger do Zé", segmento: "hamburgueria", whats: "5533998628718" });
  const x = Store.get();
  Object.assign(x.loja, { modo: "aberta", slogan: "Smash e artesanal na chapa", endereco: "Rua das Flores, 120 - Centro", cidade: "Mantena",
    taxas: [{ bairro: "Centro", valor: 5 }, { bairro: "Vila Nova", valor: 6 }, { bairro: "São José", valor: 7 }],
    chavePix: "pedidos@burgerdoze.com", aviso: "Esta é uma loja de demonstração. Os pedidos chegam no WhatsApp do desenvolvedor.",
    banner: { ativo: true, titulo: "Terça do Smash", texto: "Use o cupom BEMVINDO10 e ganhe 10% off" },
    capa: window.FOTO_UNSPLASH("1466978913421-dad2ebd01d17", 1200).replace("&h=1200", "&h=600"),
    logo: window.FOTO_UNSPLASH("1568901346375-23c9450c58cd", 200),
    slides: [{ img: window.FOTO_UNSPLASH("1551782450-a2132b4ba21d", 1000).replace("&h=1000", "&h=500"), titulo: "Combo Clássico por R$ 44,90", texto: "Burger + batata + refri. Toque pra pedir", pid: (x.produtos.find((p) => p.nome === "Combo Clássico") || {}).id || "" },
             { img: window.FOTO_UNSPLASH("1607013251379-e6eecfffe234", 1000).replace("&h=1000", "&h=500"), titulo: "Terça do Smash", texto: "Duplo Cheddar com 10% off no cupom BEMVINDO10", pid: (x.produtos.find((p) => p.nome === "Duplo Cheddar") || {}).id || "" },
             { img: window.FOTO_UNSPLASH("1565299507177-b0ac66763828", 1000).replace("&h=1000", "&h=500"), titulo: "Peça sem sair de casa", texto: "Entregamos no Centro, Vila Nova e São José", pid: "" }] });
  Store.save(x);
};
