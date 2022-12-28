import { Dayjs } from "dayjs";

export default class MovimentacoesCompartilhadasModel {
  Id?: number;
  UsuarioId?: number;
  MovimentacaoId?: number;

  constructor(_Id?: number, _MovimentacaoId?: number, _UsuarioId?: number) {
    this.Id = _Id || 0;
    this.UsuarioId = _UsuarioId || null;
    this.MovimentacaoId = _MovimentacaoId || null;
  }
}
