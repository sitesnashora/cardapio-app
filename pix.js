// Gera o "Pix copia e cola" (BR Code estático) com valor.
window.pixCode = function ({ chave, nome, cidade, valor, txid = "***", descricao = "" }) {
  const tira = (s, n) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9 .\-@]/g, "").toUpperCase().slice(0, n);
  const f = (id, v) => id + String(v.length).padStart(2, "0") + v;
  const gui = f("00", "br.gov.bcb.pix") + f("01", chave) + (descricao ? f("02", tira(descricao, 40)) : "");
  let p = f("00", "01") + f("26", gui) + f("52", "0000") + f("53", "986") +
    (valor ? f("54", Number(valor).toFixed(2)) : "") + f("58", "BR") +
    f("59", tira(nome, 25)) + f("60", tira(cidade, 15)) + f("62", f("05", txid)) + "6304";
  let crc = 0xffff;
  for (let i = 0; i < p.length; i++) {
    crc ^= p.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    crc &= 0xffff;
  }
  return p + crc.toString(16).toUpperCase().padStart(4, "0");
};
