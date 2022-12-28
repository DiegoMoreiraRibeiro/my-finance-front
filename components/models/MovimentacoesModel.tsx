import { Dayjs } from "dayjs";
import { getDateYYYYmmdd } from "../date/date";

export default class MovimentacoesModel {
  Id?: number;
  Descricao?: string;
  DataMovimentacao?: string;
  MovimentacaoCompartilhada?: boolean;
  Valor?: string;
  TipoAcaoId?: number;
  UsuarioId?: number;

  constructor(
    _CompartilharSaida?: boolean,
    _Id?: number,
    _Descricao?: string,
    _DataMovimentacao?: string,
    _Valor?: string,
    _TipoAcaoId?: number,
    _MovimentacaoCompartilhada?: boolean,
    _UsuarioId?: number
  ) {
    this.DataMovimentacao = _DataMovimentacao || getDateYYYYmmdd();
    this.Descricao = _Descricao || "";
    this.Id = _Id || 0;
    this.TipoAcaoId = _TipoAcaoId || 0;
    this.UsuarioId = _UsuarioId || 0;
    this.MovimentacaoCompartilhada = _MovimentacaoCompartilhada || false;
    this.Valor = _Valor || "";
  }
}
