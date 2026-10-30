// =====================================================
//  ATENDENTE AUTOMÁTICO (dentro do cardápio)
//  Responde com os dados que o dono cadastra no painel.
//  Sem servidor e sem custo.
// =====================================================
(function () {
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const tem = (t, ...ps) => ps.some((p) => (" " + t + " ").includes(" " + p) || t.includes(p));
  const hhmm = (h) => h;

  function horariosTxt(L) {
    const at = (L.horarios || []).filter((h) => h.ativo);
    if (!at.length) return "Ainda não cadastramos os horários.";
    const grupos = {};
    at.forEach((h) => { const k = h.abre + "–" + h.fecha; (grupos[k] = grupos[k] || []).push(DIAS[h.d].slice(0, 3).toLowerCase()); });
    const fech = (L.horarios || []).filter((h) => !h.ativo).map((h) => DIAS[h.d].toLowerCase());
    return Object.entries(grupos).map(([k, d]) => `${d.join(", ")}: ${k}`).join("\n") + (fech.length ? `\nFechado: ${fech.join(", ")}` : "");
  }
  function achaBairro(L, t) {
    const lista = L.taxas || [];
    return lista.find((x) => x.bairro && t.includes(norm(x.bairro)));
  }
  function produtosQue(D, t) {
    const pal = t.split(" ").filter((w) => w.length > 2 && !["quero", "tem", "voces", "vcs", "qual", "quanto", "custa", "preco", "valor", "uma", "uns", "com", "sem", "pra", "para", "por", "favor", "pedido", "pedir", "fazer", "gostaria", "manda", "me", "ver", "cardapio"].includes(w));
    if (!pal.length) return [];
    return D.produtos.filter((p) => { const n = norm(p.nome + " " + p.desc); return pal.some((w) => n.includes(w) || (w.endsWith("s") && n.includes(w.slice(0, -1)))); })
      .sort((a, b) => { const sa = pal.filter((w) => norm(a.nome).includes(w)).length, sb = pal.filter((w) => norm(b.nome).includes(w)).length; return sb - sa; });
  }

  // devolve { texto, botoes:[{t, acao}] }
  window.responderAtendente = function (pergunta, D) {
    const L = D.loja, t = norm(pergunta), st = statusLoja(L);
    const R = (texto, botoes = []) => ({ texto, botoes });
    const pags = [L.pix && "Pix", L.dinheiro && "dinheiro", L.cartao && "cartão na entrega"].filter(Boolean);

    if (!t) return R("Pode perguntar! 🙂");
    if (tem(t, "oi", "ola", "bom dia", "boa tarde", "boa noite", "eai", "opa", "salve") && t.split(" ").length <= 3)
      return R(`Olá! Bem-vindo(a) à ${L.nome} 👋\n${st.aberta ? "Estamos abertos agora!" : st.texto}.\nComo posso ajudar?`, sugestoes(D));
    if (tem(t, "aberto", "abre", "fecha", "horario", "funciona", "hoje", "que horas", "ate que horas"))
      return R(`${st.aberta ? "✅ Estamos abertos agora" : "⏰ " + st.texto}.\n\nNossos horários:\n${horariosTxt(L)}${!st.aberta && L.agendamento ? "\n\nVocê já pode deixar o pedido agendado pelo cardápio." : ""}`);

    const bairro = achaBairro(L, t);
    if (bairro || tem(t, "entrega", "entregam", "taxa", "frete", "bairro", "delivery", "motoboy", "tele")) {
      if (!L.entrega) return R(`No momento não fazemos entrega.${L.retirada ? ` Você pode retirar aqui: ${L.endereco || "na loja"} (${L.tempoRetirada}).` : ""}`);
      if (L.tipoTaxa === "fixa") return R(`Entregamos sim! 🛵 Taxa de entrega: ${Number(L.taxaFixa) ? brl(L.taxaFixa) : "grátis"}. Tempo médio: ${L.tempoEntrega}.${L.pedidoMinimo > 0 ? ` Pedido mínimo: ${brl(L.pedidoMinimo)}.` : ""}`);
      if (bairro) return R(`Entregamos no ${bairro.bairro} sim! 🛵 Taxa: ${Number(bairro.valor) ? brl(bairro.valor) : "grátis"}. Tempo médio: ${L.tempoEntrega}.`);
      const lista = (L.taxas || []).filter((x) => x.bairro).map((x) => `• ${x.bairro}: ${Number(x.valor) ? brl(x.valor) : "grátis"}`).join("\n");
      return R(`Entregamos nesses bairros 🛵\n${lista || "(lista em atualização)"}\n\nTempo médio: ${L.tempoEntrega}.${L.pedidoMinimo > 0 ? `\nPedido mínimo: ${brl(L.pedidoMinimo)}.` : ""}\nSeu bairro não está aí? Fale com a gente no WhatsApp.`, [{ t: "Falar no WhatsApp", acao: "whats" }]);
    }
    if (tem(t, "pix", "cartao", "credito", "debito", "dinheiro", "pagamento", "pagar", "troco", "maquininha"))
      return R(`Aceitamos: ${pags.join(", ")}.${L.pix && L.chavePix ? `\n\nChave Pix: ${L.chavePix}${L.nomePix ? ` (${L.nomePix})` : ""}` : ""}${L.dinheiro ? "\nSe for dinheiro, é só informar o troco ao finalizar." : ""}`);
    if (tem(t, "endereco", "onde fica", "localizacao", "retirar", "retirada", "buscar", "balcao"))
      return R(`${L.endereco ? `📍 ${L.endereco}${L.cidade ? " – " + L.cidade : ""}` : "Nosso endereço ainda não foi cadastrado."}${L.retirada ? `\nRetirada pronta em ${L.tempoRetirada}.` : ""}`, L.endereco ? [{ t: "Abrir no mapa", acao: "mapa" }] : []);
    if (tem(t, "minimo")) return R(L.pedidoMinimo > 0 ? `O pedido mínimo para entrega é ${brl(L.pedidoMinimo)}.` : "Não temos pedido mínimo! 🙌");
    if (tem(t, "demora", "tempo", "quanto tempo", "rapido", "prazo"))
      return R(`Tempo médio:${L.entrega ? `\n🛵 Entrega: ${L.tempoEntrega}` : ""}${L.retirada ? `\n🏪 Retirada: ${L.tempoRetirada}` : ""}`);
    if (tem(t, "cupom", "promocao", "desconto", "promo", "oferta")) {
      const cs = (D.cupons || []).filter((c) => c.ativo);
      const pr = L.banner && L.banner.ativo ? `🔥 ${L.banner.titulo}: ${L.banner.texto}\n` : "";
      const cp = cs.length ? cs.map((c) => `🎟️ ${c.codigo}: ${c.tipo === "pct" ? c.valor + "% off" : brl(c.valor) + " off"}${c.minimo ? ` (a partir de ${brl(c.minimo)})` : ""}`).join("\n") : "";
      return R(pr || cp ? `${pr}${cp}${cp ? "\n\nÉ só digitar o código na sacola." : ""}` : "Hoje não temos cupom ativo, mas fique de olho no nosso Instagram! 😉");
    }
    if (tem(t, "instagram", "insta")) return R(L.instagram ? `Nosso Instagram: ${L.instagram}` : "Ainda não cadastramos o Instagram.");
    if (tem(t, "whatsapp", "zap", "telefone", "falar com", "atendente", "humano", "pessoa", "ligar"))
      return R(`Claro! Nosso WhatsApp: ${fone(L.whats)}`, [{ t: "Abrir WhatsApp", acao: "whats" }]);
    if (tem(t, "meu pedido", "status", "cade", "chegando", "acompanhar"))
      return R("Você acompanha seu pedido em tempo real no botão 📦 Meus pedidos, no topo do cardápio.", [{ t: "Ver meus pedidos", acao: "meus" }]);
    if (tem(t, "sugere", "sugestao", "indica", "recomenda", "mais vendido", "melhor", "o que pedir", "carro chefe")) {
      const top = D.produtos.filter((p) => p.ativo && p.tag).slice(0, 3);
      const ps = top.length ? top : D.produtos.filter((p) => p.ativo).slice(0, 3);
      return R("Os queridinhos da casa 😋", ps.map((p) => ({ t: `${p.nome} · ${brl(p.preco)}`, acao: "p:" + p.id })));
    }
    if (tem(t, "cardapio", "menu", "o que tem", "opcoes"))
      return R("Nosso cardápio tem:\n" + D.categorias.map((c) => `• ${c.nome}`).join("\n") + "\n\nToque numa categoria lá em cima ou me diga o que procura.");
    if (tem(t, "obrigad", "valeu", "vlw", "brigad")) return R("Imagina! Qualquer coisa é só chamar 🙌");

    const ps = produtosQue(D, t);
    if (ps.length) {
      const disp = ps.filter((p) => p.ativo), esg = ps.filter((p) => !p.ativo);
      if (!disp.length) return R(`Poxa, ${esg[0].nome} está esgotado no momento 😕 Que tal ver outras opções?`, sugestoes(D));
      return R(disp.length === 1 ? `Temos sim! ${disp[0].nome} sai por ${brl(disp[0].preco)}. Quer ver?` : "Encontrei estas opções:", disp.slice(0, 4).map((p) => ({ t: `${p.nome} · ${brl(p.preco)}`, acao: "p:" + p.id })));
    }
    return R(`Não entendi bem 😅 Posso ajudar com horário, entrega e taxa, pagamento, promoções ou te indicar um prato.\nSe preferir, fale direto com a gente.`, [{ t: "Falar no WhatsApp", acao: "whats" }, ...sugestoes(D).slice(0, 2)]);
  };
  function sugestoes() {
    return [{ t: "🕒 Horário", acao: "q:Qual o horário?" }, { t: "🛵 Entrega e taxa", acao: "q:Vocês entregam no meu bairro?" }, { t: "💳 Pagamento", acao: "q:Quais formas de pagamento?" }, { t: "😋 O que pedir?", acao: "q:O que vocês recomendam?" }];
  }
  window.sugestoesAtendente = sugestoes;
})();
