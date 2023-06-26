export function dataProvider() {
  const dataAtual = new Date()
  const dataFormatada = `${formatarDigito(dataAtual.getDate())}/${formatarDigito(
    dataAtual.getMonth() + 1
  )}/${dataAtual.getFullYear()} ${formatarDigito(dataAtual.getHours())}:${formatarDigito(
    dataAtual.getMinutes()
  )}`;

  return dataFormatada
}

function formatarDigito(digito) {
    return digito < 10 ? `0${digito}` : digito;
  }
