export function maskCurrency(valorParam: string) {
  valorParam = valorParam + "";
  let valorNumber = parseInt(valorParam.replace(/[\D]+/g, ""));
  let valor = valorNumber + "";
  valor = valor.replace(/([0-9]{2})$/g, ",$1");
  if (valor.length > 6) {
    valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
  }
  return valor;
}
