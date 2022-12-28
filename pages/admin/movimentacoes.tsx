import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { parseCookies } from "nookies";
import { ReactElement } from "react";
import Theme from "../../components/views/theme";
import AddIcon from "@mui/icons-material/Add";
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
import { Get, Post } from "../../services/api";
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
} from "../../components/date/date";
import MovimentacoesCompartilhadasModel from "../../components/models/MovimentacoesCompartilhadasModel";
import TextInput from "../../components/inputs/text-input";
import SelectInput from "../../components/inputs/select-input";
import { maskCurrency } from "../../components/utils/mask";

function Movimentacoes() {
  const { "nextauth.id": id } = parseCookies();
  const { handleSubmit } = useForm();

  const [compartilharSaida, setCompartilharSaida] = useState(false);
  const [listUsuarios, setListUsuarios] = useState([]);

  const [movimentacoesModel, setMovimentacoesModel] =
    useState<MovimentacoesModel>(new MovimentacoesModel());

  const [
    movimentacoesCompartilhadasModel,
    setMovimentacoesCompartilhadasModel,
  ] = useState<MovimentacoesCompartilhadasModel>(
    new MovimentacoesCompartilhadasModel()
  );

  const [rowsMovimentacoes, setRowsMovimentacoes] = useState([]);
  const [valorEntrada, setValorEntrada] = useState(0);
  const [valorSaida, setValorSaida] = useState(0);
  const [ano, setAno] = React.useState("");
  const [listAnos, setListAnos] = useState([{ Ano: 2022 }]);
  const [mes, setMes] = React.useState("");
  const [msgShowSuccess, setMsgShowSuccess] = React.useState("");
  const [msgShowError, setMsgShowError] = React.useState("");
  const [active, setActive] = useState(false);

  //#region Modal
  const [open, setOpen] = useState(false);
  const handleOpenAdd = () => {
    const obj = new MovimentacoesModel();
    setMovimentacoesModel(obj);
    setMovimentacoesModel({
      ...obj,
      UsuarioId: parseInt(id),
    });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  //#endregion

  useEffect(() => {
    listarMovimentacoes(null, null);
    listarUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setValorEntrada(ret.data.Entrada.toString());
      setValorSaida(ret.data.Saida.toString());
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
    setActive(false);
  }

  function closeMsgError() {
    setMsgShowError("");
    setActive(false);
  }

  async function buscarMovimentacoes() {
    if (ano == "" || mes == "") {
      setActive(true);
      setMsgShowError("Selecione um ano e mês");
    } else {
      debugger;
      await listarMovimentacoes(mes, ano);
    }
  }

  async function cadastrarMovimentacao() {
    debugger;
    let obj = movimentacoesModel;
    if (compartilharSaida) {
      obj.MovimentacaoCompartilhada = compartilharSaida;
      const valor = parseFloat(obj.Valor ?? "0");
      obj.Valor = (valor / 2).toString();
    }
    const ret = await Post("movimentacao", obj);

    if (ret.status == 201) {
      if (compartilharSaida) {
        obj.UsuarioId = movimentacoesCompartilhadasModel.UsuarioId;
        const ret = await Post("movimentacao", obj);
      }
    }
  }

  const handleChangeAno = (value: string) => {
    setAno(value);
  };

  const handleSetInputText_Descricao = (value: string) => {
    let model = new MovimentacoesModel();
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
    setMovimentacoesModel({
      ...movimentacoesModel,
      Valor: val,
    });
  };

  const handleSetInputText_UsuarioId = (value: string) => {
    setMovimentacoesCompartilhadasModel({
      ...movimentacoesCompartilhadasModel,
      UsuarioId: parseInt(value),
    });
  };

  const handleSetInputText_DataMovimentacao = (value: string) => {
    setMovimentacoesModel({
      ...movimentacoesModel,
      DataMovimentacao: covertDateYYYYmmdd(value),
    });
  };

  return (
    <Grid container spacing={1}>
      <Msg
        desc={msgShowSuccess}
        active={active}
        handleClose={closeMsgSucces}
        type="success"
      />
      <Msg
        desc={msgShowError}
        active={active}
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
              <div className={"lbValor"}>{NumberToCurrecy(valorEntrada)}</div>
              <span>Entrada / Mês</span>
            </Grid>
            <Grid item xs={6} md={6} lg={6} className={"gridSaida"}>
              <div className={"lbValor"}>{NumberToCurrecy(valorSaida)}</div>
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
              {/* <InputLabel id="demo-simple-select-helper-label">Ano</InputLabel>
              <select id="ano" value={ano} onChange={handleChangeAno}>
                <option value={""}>Selecione um ano</option>
                {listAnos.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select> */}
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
              {/* <InputLabel id="demo-simple-select-helper-label">Mês</InputLabel>
              <select
                value={mes}
                id="mes"
                onChange={(e) => {
                  handleChangeMes(e);
                }}
              >
                <option value=""></option>
                <option value={"01"}>Janeiro</option>
                <option value={"02"}>Fevereiro</option>
                <option value={"03"}>Março</option>
                <option value={"04"}>Abril</option>
                <option value={"05"}>Maio</option>
                <option value={"06"}>Junho</option>
                <option value={"07"}>Julho</option>
                <option value={"08"}>Agosto</option>
                <option value={"09"}>Setembro</option>
                <option value={"10"}>Outrubro</option>
                <option value={"11"}>Novembro</option>
                <option value={"12"}>Dezembro</option>
              </select> */}
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
                        <TableCell
                          key={`th-acao-${row.Id}`}
                          align="right"
                        ></TableCell>
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
                    onSubmit={handleSubmit(cadastrarMovimentacao)}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={6} md={6} lg={6}>
                        <div className="rounded-md shadow-sm -space-y-px">
                          <div>
                            <TextInput
                              id={"descricao"}
                              type={"text"}
                              placeholder={"Descrição"}
                              value={movimentacoesModel?.Descricao}
                              handleChangeTextInput={
                                handleSetInputText_Descricao
                              }
                            />
                            {/* <TextField
                              id="descricao"
                              label="Descrição"
                              variant="outlined"
                              type="text"
                              className={styles.input12}
                              value={movimentacoesModel?.Descricao}
                              required
                              onChange={(e) => {
                                let model = new MovimentacoesModel();
                                setMovimentacoesModel({
                                  ...movimentacoesModel,
                                  Descricao: e.target.value,
                                });
                              }}
                            /> */}
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={6} md={6} lg={6}>
                        <div className="rounded-md shadow-sm -space-y-px">
                          <div>
                            <TextInput
                              id={"valor"}
                              type={"text"}
                              placeholder={"Valor"}
                              value={movimentacoesModel?.Valor}
                              handleChangeTextInput={handleSetInputText_Valor}
                            />
                            {/* <TextField
                              id="valor"
                              label="Valor"
                              variant="outlined"
                              type="number"
                              autoComplete="current-password"
                              className={styles.input12}
                              value={movimentacoesModel?.Valor}
                              required
                              onChange={(e) => {
                                setMovimentacoesModel({
                                  ...movimentacoesModel,
                                  Valor: e.target.value,
                                });
                              }}
                            /> */}
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={6} md={6} lg={6}>
                        <div className="rounded-md shadow-sm -space-y-px">
                          <div>
                            <TextInput
                              id={"dataMovimetacao"}
                              type={"date"}
                              placeholder={"Data Movimentação"}
                              value={
                                movimentacoesModel?.DataMovimentacao == ""
                                  ? getDateYYYYmmdd()
                                  : movimentacoesModel.DataMovimentacao
                              }
                              handleChangeTextInput={
                                handleSetInputText_DataMovimentacao
                              }
                            />
                            {/* <TextField
                              id="dataMovimetacao"
                              label="Data Movimentação"
                              variant="outlined"
                              type="date"
                              value={
                                movimentacoesModel?.DataMovimentacao == ""
                                  ? getDateYYYYmmdd()
                                  : movimentacoesModel.DataMovimentacao
                              }
                              required
                              onChange={(e) => {
                                setMovimentacoesModel({
                                  ...movimentacoesModel,
                                  DataMovimentacao: covertDateYYYYmmdd(
                                    e.target.value
                                  ),
                                });
                              }}
                            /> */}
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={6} md={6} lg={6}>
                        <div className="rounded-md shadow-sm -space-y-px">
                          <div>
                            <SelectInput
                              id={"tipoAcao"}
                              type={"text"}
                              placeholder={"Tipo"}
                              keyDesc={"Desc"}
                              keyValue={"Value"}
                              value={movimentacoesModel?.TipoAcaoId}
                              handleChangeTextInput={
                                handleSetInputText_TipoAcao
                              }
                              listOpts={[
                                { Value: 1, Desc: "Entrada" },
                                { Value: 2, Desc: "Saída" },
                              ]}
                            />
                            {/* <select
                              id="tipoAcao"
                              className={styles.input12}
                              value={movimentacoesModel?.TipoAcaoId}
                              required
                              onChange={(e) => {
                                debugger;
                                const target = parseInt(
                                  e.target.value.toString()
                                );
                                setMovimentacoesModel({
                                  ...movimentacoesModel,
                                  TipoAcaoId: target,
                                });
                              }}
                            >
                              <option defaultChecked value={0}>
                                Selecione uma opção
                              </option>
                              <option value={1}>Entrada</option>
                              <option value={2}>Saída</option>
                            </select> */}
                          </div>
                        </div>
                      </Grid>
                      {(() => {
                        if (movimentacoesModel.TipoAcaoId == 2) {
                          return (
                            <>
                              <Grid item xs={6} md={6} lg={6}>
                                <div className="rounded-md shadow-sm -space-y-px">
                                  <div>
                                    <label>Compartilhar Saida</label>
                                    <Switch
                                      checked={compartilharSaida}
                                      onChange={(e) => {
                                        setCompartilharSaida(e.target.checked);
                                      }}
                                    />
                                  </div>
                                </div>
                              </Grid>
                              <Grid item xs={6} md={6} lg={6}>
                                <div className="rounded-md shadow-sm -space-y-px">
                                  <div>
                                    <SelectInput
                                      id={"movimentacoesCompartilhadaUsuarioId"}
                                      type={"text"}
                                      placeholder={
                                        "Movimentações Compartilhadas"
                                      }
                                      keyDesc={"Nome"}
                                      keyValue={"Id"}
                                      value={
                                        movimentacoesCompartilhadasModel.UsuarioId ??
                                        ""
                                      }
                                      handleChangeTextInput={
                                        handleSetInputText_UsuarioId
                                      }
                                      listOpts={listUsuarios}
                                    />
                                    {/* <select
                                      value={
                                        movimentacoesCompartilhadasModel.UsuarioId ??
                                        0
                                      }
                                      id="movimentacoesCompartilhadaUsuarioId"
                                      className={styles.input12}
                                      onChange={(e) => {
                                        setMovimentacoesCompartilhadasModel({
                                          ...movimentacoesCompartilhadasModel,
                                          UsuarioId: parseInt(
                                            e.target.value.toString()
                                          ),
                                        });
                                      }}
                                    >
                                      <option key={0} value={0}>
                                        Selecione uma opção
                                      </option>
                                      {listUsuarios.map((item) => (
                                        <option
                                          key={item.Id}
                                          value={parseInt(item.Id)}
                                        >
                                          {item.Nome}
                                        </option>
                                      ))}
                                    </select> */}
                                  </div>
                                </div>
                              </Grid>
                            </>
                          );
                        }
                      })()}
                    </Grid>

                    <div className="flex items-right justify-between div-modal-btns">
                      <br />
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
  );
}

Movimentacoes.getLayout = function getLayout(page: ReactElement) {
  return <Theme>{page}</Theme>;
};

export default Movimentacoes;
