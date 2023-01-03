import { getDateYYYYmmdd } from "../date/date";

export default class MovimentacoesModel {
  Id?: number;
  Descricao?: string;
  DataMovimentacao?: Date;
  MovimentacaoCompartilhada?: boolean;
  Valor?: number;
  TipoAcaoId?: number;
  UsuarioMovimentacaoCompartilhadaId?: number;
  UsuarioId?: number;

  constructor(
    _CompartilharSaida?: boolean,
    _Id?: number,
    _Descricao?: string,
    _DataMovimentacao?: Date,
    _Valor?: number,
    _TipoAcaoId?: number,
    _UsuarioMovimentacaoCompartilhadaId?: number,
    _MovimentacaoCompartilhada?: boolean,
    _UsuarioId?: number
  ) {
    this.DataMovimentacao = _DataMovimentacao || new Date();
    this.Descricao = _Descricao || "";
    this.Id = _Id || 0;
    this.TipoAcaoId = _TipoAcaoId || 0;
    this.UsuarioId = _UsuarioId || 0;
    this.MovimentacaoCompartilhada = _MovimentacaoCompartilhada || false;
    this.UsuarioMovimentacaoCompartilhadaId =
      _UsuarioMovimentacaoCompartilhadaId || null;
    this.Valor = _Valor || 0;
  }
}
