// =====================================================
//  CONFIGURAÇÃO GERAL DO SISTEMA
//  Cada loja é criada pelo próprio dono no painel.
//  Cardápio de uma loja:  index.html?l=link-da-loja
//  Demonstração (sem ?l=): loja de exemplo salva no aparelho
// =====================================================
window.APP_CONFIG = {
  // Plano usado na demonstração
  plano: "pro",

  // E-mails que podem abrir o painel mestre (master.html).
  // Precisam estar verificados.
  masters: ["samuelijoi42@gmail.com", "samujo2pi@gmail.com"],

  // Banco de dados (Firebase, plano grátis Spark)
  firebase: {
    apiKey: "AIzaSyDk6mMm2asGo69CS57yodav45_oXL_NimQ",
    authDomain: "cardapio-direto.firebaseapp.com",
    projectId: "cardapio-direto",
    appId: "1:139945601542:web:d61ff70a2a039543f87187"
  }
};
