// =====================================================
//  CONFIGURAÇÃO DESTA CÓPIA DO APP (uma por cliente)
// =====================================================
window.APP_CONFIG = {
  // Identificador da loja (sem espaço). Ex.: "burgerdoze"
  lojaId: "teste",

  // Plano contratado: "essencial" ou "pro"
  plano: "pro",

  // true = mostra uma loja de exemplo quando ainda não tem cardápio (só pra demonstração)
  demo: false,

  // Cole aqui a configuração do Firebase do projeto.
  // Deixe null para usar o modo demonstração (salva só no aparelho).
  firebase: {
    apiKey: "AIzaSyDk6mMm2asGo69CS57yodav45_oXL_NimQ",
    authDomain: "cardapio-direto.firebaseapp.com",
    projectId: "cardapio-direto",
    appId: "1:139945601542:web:d61ff70a2a039543f87187"
  }
  // firebase: {
  //   apiKey: "...",
  //   authDomain: "...",
  //   projectId: "...",
  //   appId: "..."
  // }
};

// Carrega o Firebase só quando estiver configurado.
(function () {
  var c = window.APP_CONFIG;
  if (c.firebase && c.firebase.apiKey && !window.firebase) {
    ["app", "auth", "firestore"].forEach(function (m) {
      document.write('<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-' + m + '-compat.js"><\/script>');
    });
  }
})();
