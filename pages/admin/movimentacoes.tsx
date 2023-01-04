import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { parseCookies } from "nookies";
import { ReactElement } from "react";
import Theme from "../../components/views/theme";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Delete";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAlt from "@mui/icons-material/ThumbUpOffAlt";
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Get, Post, Put } from "../../services/api";
import {
  DateToISO,
  DateToString,
  NumberToCurrecy,
} from "../../components/utils/Format";
import Msg from "../../components/utils/Msg";
import { useForm } from "react-hook-form";
import MovimentacoesModel from "../../components/models/MovimentacoesModel";
import {
  maskDate,
  getDateYYYYmmdd,
  covertDateYYYYmmdd,
  convertDateYYYYmmdd,
} from "../../components/date/date";
import TextInput from "../../components/inputs/text-input";
import SelectInput from "../../components/inputs/select-input";
import { maskCurrency } from "../../components/utils/mask";
import AlertDialog from "../../components/utils/Dialog";
import dynamic from "next/dynamic";

function Movimentacoes() {
  const { "nextauth.id": id } = parseCookies();
  const { "nextauth.token": token } = parseCookies();

  const { handleSubmit } = useForm();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogRemoveId, setDialogRemoveId] = useState(0);

  const [addMovimentacao, setAddMovimentacao] = useState(false);

  const [listUsuarios, setListUsuarios] = useState([]);

  const [movimentacoesModel, setMovimentacoesModel] =
    useState<MovimentacoesModel>(new MovimentacoesModel());

  const [valorMask, setValorMask] = useState("0");
  const [rowsMovimentacoes, setRowsMovimentacoes] = useState([]);
  const [valorEntrada, setValorEntrada] = useState(0);
  const [valorSaida, setValorSaida] = useState(0);
  const [ano, setAno] = React.useState("2023");
  const [listAnos, setListAnos] = useState([{ Ano: 2023 }]);
  const [mes, setMes] = React.useState("");
  const [msgShowSuccess, setMsgShowSuccess] = React.useState("");
  const [msgShowError, setMsgShowError] = React.useState("");
  const [activeShowError, setActiveShowError] = useState(false);
  const [activeShowSuccess, setActiveShowSuccess] = useState(false);

  //#region Modal
  const [open, setOpen] = useState(false);

  const handleOpenAdd = () => {
    setAddMovimentacao(true);
    const obj = new MovimentacoesModel();
    setMovimentacoesModel({
      ...obj,
      UsuarioId: parseInt(id),
    });
    setValorMask("0");
    setOpen(true);
  };

  const handleOpenEdit = (row) => {
    setAddMovimentacao(false);
    setMovimentacoesModel({
      UsuarioId: parseInt(id),
      DataMovimentacao: new Date(row.DataMovimentacao),
      Descricao: row.Descricao,
      TipoAcaoId: row.TipoAcaoId,
      Id: row.Id,
      MovimentacaoCompartilhada: row.MovimentacaoCompartilhada,
      UsuarioMovimentacaoCompartilhadaId:
        row.UsuarioMovimentacaoCompartilhada.Id,
      Valor: row.Valor,
    });
    setValorMask(maskCurrency(parseFloat(row.Valor).toFixed(2)));
    setOpen(true);
  };

  const handleOpenRemove = (row) => {
    setDialogOpen(true);
    setDialogRemoveId(row.Id);
  };

  async function trataRetornoDialogRemove(tipo) {
    if (tipo) {
      await removeMovimentacao(dialogRemoveId);
    } else {
      setDialogOpen(false);
      setDialogRemoveId(0);
    }
  }

  async function removeMovimentacao(id) {
    const ret = await Delete("movimentacao/" + id);
    showMsgSuccess("Movimentação removida com sucesso!");
    listarMovimentacoes(null, null);
    setDialogOpen(false);
    setDialogRemoveId(0);
    return ret;
  }

  const handleClose = () => setOpen(false);
  //#endregion

  useEffect(() => {
    listarMovimentacoes(null, null);
    listarUsuarios();
    salvarMesAnoAtual();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function salvarMesAnoAtual() {
    const mesAtual = new Date().getMonth() + 1;
    const mesAtualText = mesAtual <= 9 ? "0" + mesAtual : mesAtual.toString();
    setMes(mesAtualText);
  }

  async function listarMovimentacoes(
    mes: string | null,
    ano: string | null
  ): Promise<void> {
    let dateFinal;
    if (mes == null && ano == null) {
      dateFinal = DateToISO(new Date());
    } else {
      dateFinal = DateToISO(new Date(Number(ano), Number(mes) - 1, 1));
    }

    const ret = await Get(
      "movimentacao/usuario-data/",
      id.toString() + "/" + dateFinal.toString()
    );

    if (ret.status == 200) {
      setValorEntrada(ret.data.Entrada);
      setValorSaida(ret.data.Saida);
      setRowsMovimentacoes(ret.data.Movimentacao);
    }
  }

  async function listarUsuarios() {
    const ret = await Get("usuario");
    if (ret.status == 200) {
      setListUsuarios(ret.data);
    }
  }

  const handleChangeMes = (value: string) => {
    setMes(value);
  };

  function closeMsgSucces() {
    setMsgShowSuccess("");
    setActiveShowSuccess(false);
  }

  function closeMsgError() {
    setMsgShowError("");
    setActiveShowSuccess(false);
  }

  async function buscarMovimentacoes() {
    if (ano == "" || mes == "") {
      setMsgShowError("Selecione um ano e mês");
      setActiveShowError(true);
    } else {
      await listarMovimentacoes(mes, ano);
    }
  }

  async function alterarMovimentacao() {
    let obj = movimentacoesModel;
    obj.Valor = parseFloat(valorMask.replace(".", "").replace(",", "."));

    if (
      obj.MovimentacaoCompartilhada &&
      obj.MovimentacaoCompartilhada != undefined
    ) {
      const valor = obj.Valor ?? 0;
      obj.Valor = valor / 2;
    }
    const ret = await Put("movimentacao", obj);

    if (ret.status == 200) {
      showMsgSuccess("Movimentação cadastrada com sucesso!");

      if (obj.MovimentacaoCompartilhada) {
        await Delete("movimentacao/" + obj.UsuarioMovimentacaoCompartilhadaId);

        obj.UsuarioId = obj.UsuarioMovimentacaoCompartilhadaId;
        obj.UsuarioMovimentacaoCompartilhadaId = parseInt(id);
        obj.TipoAcaoId = 2;
        const retM = await Post("movimentacao", obj);

        if (retM.status == 201) {
          showMsgSuccess("Movimentação cadastrada com sucesso!");
          setOpen(false);
        }
      } else {
        setOpen(false);
      }

      setOpen(false);
      listarMovimentacoes(null, null);
    }
  }

  async function cadastrarMovimentacao() {
    let obj = movimentacoesModel;
    obj.Valor = parseFloat(valorMask.replace(".", "").replace(",", "."));
    if (obj.MovimentacaoCompartilhada) {
      const valor = obj.Valor ?? 0;
      obj.Valor = valor / 2;
    }
    const ret = await Post("movimentacao", obj);

    if (ret.status == 201) {
      showMsgSuccess("Movimentação cadastrada com sucesso!");

      if (obj.MovimentacaoCompartilhada) {
        obj.UsuarioId = obj.UsuarioMovimentacaoCompartilhadaId;
        obj.UsuarioMovimentacaoCompartilhadaId = parseInt(id);
        obj.TipoAcaoId = 2;
        const retM = await Post("movimentacao", obj);

        if (retM.status == 201) {
          showMsgSuccess("Movimentação cadastrada com sucesso!");
          setOpen(false);
        }
      } else {
        setOpen(false);
      }

      listarMovimentacoes(null, null);
    }
  }

  function showMsgSuccess(msg: string) {
    setMsgShowSuccess(msg);
    setActiveShowSuccess(true);
  }
  const handleChangeAno = (value: string) => {
    setAno(value);
  };

  const handleSetInputText_Descricao = (value: string) => {
    setMovimentacoesModel({
      ...movimentacoesModel,
      Descricao: value,
    });
  };

  const handleSetInputText_TipoAcao = (value: string) => {
    const target = parseInt(value);
    setMovimentacoesModel({
      ...movimentacoesModel,
      TipoAcaoId: target,
    });
  };

  const handleSetInputText_Valor = (value: string) => {
    const val = maskCurrency(value == "" ? "0" : value);
    setValorMask(maskCurrency(val));
    setMovimentacoesModel({
      ...movimentacoesModel,
      Valor: parseFloat(val.replace(",", "").replace(",", ".")),
    });
  };

  const handleSetInputText_UsuarioId = (value: string) => {
    setMovimentacoesModel({
      ...movimentacoesModel,
      UsuarioMovimentacaoCompartilhadaId: parseInt(value),
    });
  };

  const handleSetInputText_DataMovimentacao = (value: string) => {
    setMovimentacoesModel({
      ...movimentacoesModel,
      DataMovimentacao: new Date(covertDateYYYYmmdd(value)),
    });
  };

  return (
    <>
      <Grid container spacing={1}>
        <AlertDialog
          text={"Tem certeza que deseja remover este item?"}
          returnDialog={trataRetornoDialogRemove}
          open={dialogOpen}
        />

        <Msg
          desc={msgShowSuccess}
          active={activeShowSuccess}
          handleClose={closeMsgSucces}
          type="success"
        />
        <Msg
          desc={msgShowError}
          active={activeShowError}
          handleClose={closeMsgError}
          type="error"
        />
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            sx={{
              p: 1,
              display: "flex",
              flexDirection: "column",
              height: "auto",
              width: "100%",
            }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/admin/dashboard">
                Admin
              </Link>
              <Typography color="text.primary">Movimentações</Typography>
            </Breadcrumbs>

            <div className={"gridContainer"}>
              <Grid item xs={6} md={6} lg={6} className={"gridEntrada"}>
                <div className={"lbValor"}>
                  {valorEntrada == 0
                    ? "R$ 0,00"
                    : NumberToCurrecy(valorEntrada)}
                </div>
                <span>Entrada / Mês</span>
              </Grid>
              <Grid item xs={6} md={6} lg={6} className={"gridSaida"}>
                <div className={"lbValor"}>
                  {valorSaida == 0 ? "R$ 0,00" : NumberToCurrecy(valorSaida)}
                </div>
                <span>Saída / Mês</span>
              </Grid>
            </div>

            <div className={"divBtnPesquisa"}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <SelectInput
                  id={"Ano"}
                  type={"text"}
                  placeholder={"Ano"}
                  keyDesc={"Ano"}
                  keyValue={"Ano"}
                  value={ano ?? ""}
                  handleChangeTextInput={handleChangeAno}
                  listOpts={listAnos}
                />
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <SelectInput
                  id={"mes"}
                  type={"text"}
                  placeholder={"Mês"}
                  keyDesc={"Desc"}
                  keyValue={"Value"}
                  value={mes ?? ""}
                  handleChangeTextInput={handleChangeMes}
                  listOpts={[
                    { Value: "01", Desc: "Janeiro" },
                    { Value: "02", Desc: "Fevereiro" },
                    { Value: "03", Desc: "Março" },
                    { Value: "04", Desc: "Abril" },
                    { Value: "05", Desc: "Maio" },
                    { Value: "06", Desc: "Junho" },
                    { Value: "07", Desc: "Julho" },
                    { Value: "08", Desc: "Agosto" },
                    { Value: "09", Desc: "Setembro" },
                    { Value: "10", Desc: "Outrubro" },
                    { Value: "11", Desc: "Novembro" },
                    { Value: "12", Desc: "Dezembro" },
                  ]}
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                className={"btnPesquisar"}
                onClick={() => buscarMovimentacoes()}
              >
                Pesquisar
              </Button>
            </div>

            <Grid item xs={12} md={12} lg={12} className={"gridTableMovi"}>
              <TableContainer component={Paper} className={"tableMovi"}>
                <Table
                  sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead className={"tableHead"}>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell align="right">Valor</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rowsMovimentacoes.length > 0 ? (
                      rowsMovimentacoes.map((row: any) => (
                        <TableRow
                          key={`table-row-${row.Id}`}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            key={`th-Descricao-${row.Id}`}
                            component="th"
                            scope="row"
                          >
                            {row.Descricao}
                          </TableCell>
                          <TableCell key={`th-DataMovimentacao-${row.Id}`}>
                            {DateToString(row.DataMovimentacao)}
                          </TableCell>
                          <TableCell key={`th-TipoAcao-${row.Id}`}>
                            {row.TipoAcao.Codigo == 1 ? (
                              <Stack
                                className={"moneyAdd"}
                                direction="row"
                                alignItems="center"
                                gap={1}
                              >
                                <ThumbUpOffAlt />
                                <Typography variant="body1">
                                  {row.TipoAcao.Descricao}
                                </Typography>
                              </Stack>
                            ) : (
                              <Stack
                                className={"moneyRem"}
                                direction="row"
                                alignItems="center"
                                gap={1}
                              >
                                <ThumbDownOffAltIcon />
                                <Typography variant="body1">
                                  {row.TipoAcao.Descricao}
                                </Typography>
                              </Stack>
                            )}
                          </TableCell>
                          <TableCell key={`th-Valor-${row.Id}`} align="right">
                            {NumberToCurrecy(parseFloat(row.Valor))}
                          </TableCell>
                          <TableCell key={`th-acao-${row.Id}`} align="right">
                            {!row.MovimentacaoCompartilhada ? (
                              <Button
                                variant="contained"
                                color="info"
                                onClick={() => handleOpenEdit(row)}
                                className={"btnCircleEdit"}
                              >
                                <EditIcon />
                              </Button>
                            ) : (
                              <></>
                              // <Button
                              //   variant="contained"
                              //   color="info"
                              //   disabled
                              //   title="Não é possível editar uma movimentação compartilhada, remova e adicione novamente"
                              //   onClick={() => handleOpenEdit(row)}
                              //   className={"btnCircleEdit"}
                              // >
                              //   <EditIcon />
                              // </Button>
                            )}

                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleOpenRemove(row)}
                              className={"btnCircleRemove"}
                            >
                              <RemoveIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          key={`th-vazio`}
                          component="th"
                          scope="row"
                          className={"vazio"}
                        >
                          Nenhum dado encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <div>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className="modalCustom">
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Movimentação
                    </Typography>

                    <form
                      className="mt-8 space-y-6 form-modal"
                      onSubmit={handleSubmit(
                        addMovimentacao
                          ? cadastrarMovimentacao
                          : alterarMovimentacao
                      )}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={6} md={6} lg={6}>
                          <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                              <TextInput
                                id={"descricao"}
                                type={"text"}
                                required={true}
                                placeholder={"Descrição"}
                                value={movimentacoesModel?.Descricao}
                                handleChangeTextInput={
                                  handleSetInputText_Descricao
                                }
                              />
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                          <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                              <TextInput
                                id={"valor"}
                                type={"text"}
                                required={true}
                                placeholder={"Valor"}
                                value={valorMask}
                                handleChangeTextInput={(e) => {
                                  handleSetInputText_Valor(e);
                                }}
                              />
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                          <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                              <TextInput
                                id={"dataMovimetacao"}
                                type={"date"}
                                required={true}
                                autoFocus
                                placeholder={"Data Movimentação"}
                                value={covertDateYYYYmmdd(
                                  movimentacoesModel?.DataMovimentacao == null
                                    ? getDateYYYYmmdd()
                                    : movimentacoesModel.DataMovimentacao
                                )}
                                handleChangeTextInput={
                                  handleSetInputText_DataMovimentacao
                                }
                              />
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                          <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                              <SelectInput
                                id={"tipoAcao"}
                                placeholder={"Tipo"}
                                keyDesc={"Desc"}
                                keyValue={"Value"}
                                required={true}
                                value={movimentacoesModel?.TipoAcaoId}
                                handleChangeTextInput={
                                  handleSetInputText_TipoAcao
                                }
                                listOpts={[
                                  { Value: 1, Desc: "Entrada" },
                                  { Value: 2, Desc: "Saída" },
                                ]}
                              />
                            </div>
                          </div>
                        </Grid>
                        {(() => {
                          if (
                            addMovimentacao &&
                            movimentacoesModel.TipoAcaoId == 2
                          ) {
                            return (
                              <>
                                <Grid item xs={6} md={6} lg={6}>
                                  <div className="rounded-md shadow-sm -space-y-px">
                                    <div>
                                      <label>Compartilhar Saida</label>
                                      <Switch
                                        checked={
                                          movimentacoesModel.MovimentacaoCompartilhada
                                        }
                                        onChange={(e) => {
                                          setMovimentacoesModel({
                                            ...movimentacoesModel,
                                            MovimentacaoCompartilhada:
                                              e.target.checked,
                                          });
                                        }}
                                      />
                                    </div>
                                  </div>
                                </Grid>
                                {movimentacoesModel.MovimentacaoCompartilhada ? (
                                  <Grid item xs={6} md={6} lg={6}>
                                    <div className="rounded-md shadow-sm -space-y-px">
                                      <div>
                                        <SelectInput
                                          id={
                                            "movimentacoesCompartilhadaUsuarioId"
                                          }
                                          type={"text"}
                                          placeholder={
                                            "Movimentações Compartilhadas"
                                          }
                                          keyDesc={"Nome"}
                                          required={true}
                                          keyValue={"Id"}
                                          value={
                                            movimentacoesModel.UsuarioMovimentacaoCompartilhadaId ??
                                            ""
                                          }
                                          handleChangeTextInput={
                                            handleSetInputText_UsuarioId
                                          }
                                          listOpts={listUsuarios}
                                        />
                                      </div>
                                    </div>
                                  </Grid>
                                ) : (
                                  <></>
                                )}
                              </>
                            );
                          }
                        })()}
                      </Grid>

                      <div className="flex items-right justify-between div-modal-btns">
                        <Button
                          type="button"
                          variant="outlined"
                          onClick={(e) => setOpen(false)}
                          className={"btnModal"}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          className={"btnModal"}
                        >
                          Cadastrar
                        </Button>
                      </div>
                    </form>
                  </Box>
                </Modal>
              </div>
              <div className={"divBottom"}>
                <div className={"divBottomHolder"}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleOpenAdd}
                    className={"btnCircle"}
                  >
                    <AddIcon />
                  </Button>
                </div>
              </div>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Movimentacoes;
