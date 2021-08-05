import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { green, red } from "@material-ui/core/colors";
import { useTheme } from "@material-ui/core/styles";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  OfflineBoltOutlined as BlitzIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  TimerOutlined as RapidIcon,
} from "@material-ui/icons";

import { SortableTableHead } from "components/common";
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "components/material-ui";
import { getUserList, updateUser } from "redux/reducers/userReducer";
import { UserService } from "services";
import { stableSort, tableComparator, validateUSCFID } from "utils/common";

const YesIcon = () => <CheckIcon style={{ color: green[500] }} />;
const NoIcon = () => <CloseIcon style={{ color: red[500] }} />;

export const AdminUsers = () => {
  const dispatch = useDispatch();
  const mountedRef = useRef(null);
  const searchTermRef = useRef("");
  const uscfIDRef = useRef(null);
  const user = useSelector((state) => state.userReducer);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("name");
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [uscfData, setUscfData] = useState();
  const [uscfSubmitting, setUscfSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();

  const sortableCells = useMemo(
    () => [
      {
        id: "username",
        label: "User Name",
      },
      {
        id: "name",
        label: "Name",
      },
    ],
    []
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const validateUSCF = async (uscf) => {
      try {
        const response = await UserService.getUSCFData(uscf);
        if (mountedRef.current) {
          if (response.status === "ok" && uscfIDRef.current === uscf) {
            setUscfData(response.ratings);
          } else {
            setUscfData(null);
          }
        }
      } catch (err) {
        if (mountedRef.current) {
          setUscfData(null);
        }
      }
      if (mountedRef.current) {
        setUscfSubmitting(false);
      }
    };

    if (
      currentPlayer &&
      currentPlayer.ratings &&
      currentPlayer.ratings.uscf &&
      currentPlayer.ratings.uscf.id &&
      validateUSCFID(currentPlayer.ratings.uscf.id)
    ) {
      uscfIDRef.current = currentPlayer.ratings.uscf.id;
      if (!uscfSubmitting) {
        setUscfSubmitting(true);
        validateUSCF(currentPlayer.ratings.uscf.id);
      }
    } else {
      uscfIDRef.current = currentPlayer?.ratings?.uscf?.id;
      setUscfData(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer]);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    let currentTerm = searchTerm;

    setTimeout(() => {
      if (currentTerm !== searchTermRef.current) {
        return;
      }

      dispatch(getUserList(currentTerm));
    }, 1000);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClickEdit = (player) => {
    setCurrentPlayer(player);
  };

  const handleClickCancel = () => {
    setCurrentPlayer(null);
    setUscfData(null);
  };

  const handleClickSave = () => {
    const player = { ...currentPlayer };

    if (uscfData) {
      player.ratings.uscf = {
        ...uscfData,
        verified: player.ratings.uscf.verified || uscfData.verified,
      };
    } else {
      if (player && player.ratings && player.ratings.uscf) {
        delete player.ratings.uscf;
      }
    }

    dispatch(updateUser(player));
    setCurrentPlayer(null);
  };

  const handleUserNameChange = (e) => {
    setCurrentPlayer((currentPlayer) => ({
      ...currentPlayer,
      username: e.target.value,
    }));
  };

  const handleNameChange = (e) => {
    setCurrentPlayer((currentPlayer) => ({
      ...currentPlayer,
      name: e.target.value,
    }));
  };

  const handleUSCFIDChange = (e) => {
    setCurrentPlayer((currentPlayer) => ({
      ...currentPlayer,
      ratings: {
        ...(currentPlayer.ratings || {}),
        uscf: {
          ...((currentPlayer.ratings && currentPlayer.ratings.uscf) || {}),
          id: e.target.value,
        },
      },
    }));
  };

  const handleUSCFVerifiedChange = (e) => {
    setCurrentPlayer((currentPlayer) => ({
      ...currentPlayer,
      ratings: {
        ...(currentPlayer.ratings || {}),
        uscf: {
          ...((currentPlayer.ratings && currentPlayer.ratings.uscf) || {}),
          verified: e.target.checked,
        },
      },
    }));
  };

  const handleChangeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box
      width="100%"
      position="relative"
      display="flex"
      flexDirection="column"
      borderRadius={10}
      p={5}
      bgcolor={theme.palette.background.paper}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h3">Players</Typography>
        <TextField
          value={searchTerm}
          onChange={handleChangeSearchTerm}
          label="Search Player"
          color="secondary"
          variant="filled"
          placeholder="Enter player name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {user.loading ? (
        <Box
          flexGrow={1}
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress color="secondary" />
        </Box>
      ) : !!user.list.length ? (
        <React.Fragment>
          <TableContainer>
            <Table stickyHeader aria-label="players table">
              <TableHead>
                <TableRow>
                  <TableCell width={100}>
                    <Typography variant="body1" color="textSecondary">
                      S.No
                    </Typography>
                  </TableCell>
                  {sortableCells.map((cell) => (
                    <SortableTableHead
                      key={cell.id}
                      order={order}
                      orderBy={orderBy}
                      headCell={cell}
                      onRequestSort={handleRequestSort}
                    />
                  ))}
                  <TableCell align="center">
                    <Typography variant="body1" color="textSecondary">
                      Country
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" color="textSecondary">
                      USCF ID
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" color="textSecondary">
                      Verified
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" color="textSecondary">
                      Rating
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" color="textSecondary">
                      FIDE ID
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" color="textSecondary">
                      Verified
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" color="textSecondary">
                      Rating
                    </Typography>
                  </TableCell>
                  <TableCell width={100} align="center">
                    <Typography variant="body1" color="textSecondary">
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(user.list, tableComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((player, index) => (
                    <TableRow tabIndex={-1} key={index}>
                      <TableCell>
                        <Typography variant="body1">
                          {page * rowsPerPage + index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {currentPlayer?.id === player.id ? (
                          <TextField
                            value={currentPlayer.username}
                            onChange={handleUserNameChange}
                          />
                        ) : (
                          <Typography variant="body1">
                            {player.username}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {currentPlayer?.id === player.id ? (
                          <TextField
                            value={currentPlayer.name}
                            onChange={handleNameChange}
                          />
                        ) : (
                          <Typography variant="body1">{player.name}</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {player.location && player.location.country
                            ? player.location.country.toUpperCase()
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {currentPlayer?.id === player.id ? (
                          <React.Fragment>
                            <TextField
                              value={
                                (currentPlayer.ratings &&
                                  currentPlayer.ratings.uscf &&
                                  currentPlayer.ratings.uscf.id) ||
                                ""
                              }
                              onChange={handleUSCFIDChange}
                            />
                            {uscfSubmitting && (
                              <CircularProgress size="1.5rem" />
                            )}
                          </React.Fragment>
                        ) : (
                          <Typography variant="body1">
                            {(player.ratings &&
                              player.ratings.uscf &&
                              player.ratings.uscf.id) ||
                              "-"}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {currentPlayer?.id === player.id ? (
                          <Checkbox
                            checked={
                              currentPlayer.ratings &&
                              currentPlayer.ratings.uscf &&
                              currentPlayer.ratings.uscf.verified
                            }
                            onChange={handleUSCFVerifiedChange}
                          />
                        ) : player.ratings &&
                          player.ratings.uscf &&
                          player.ratings.uscf.verified ? (
                          <YesIcon />
                        ) : (
                          <NoIcon />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {player.ratings && player.ratings.uscf ? (
                          <React.Fragment>
                            <Chip
                              icon={<BlitzIcon />}
                              label={
                                (player.ratings.uscf.ratings &&
                                  player.ratings.uscf.ratings.blitz &&
                                  player.ratings.uscf.ratings.blitz.rating) ||
                                "-"
                              }
                              mx={1}
                              color="primary"
                            />
                            <Chip
                              icon={<RapidIcon />}
                              label={
                                (player.ratings.uscf.ratings &&
                                  player.ratings.uscf.ratings.rapid &&
                                  player.ratings.uscf.ratings.rapid.rating) ||
                                "-"
                              }
                              mx={1}
                              color="primary"
                            />
                          </React.Fragment>
                        ) : (
                          <Typography variant="body1">-</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {(player.ratings &&
                            player.ratings.fide &&
                            player.ratings.fide.id) ||
                            "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {player.ratings &&
                        player.ratings.fide &&
                        player.ratings.fide.verified ? (
                          <YesIcon />
                        ) : (
                          <NoIcon />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {player.ratings && player.ratings.fide ? (
                          <React.Fragment>
                            <Chip
                              icon={<BlitzIcon />}
                              label={
                                (player.ratings.fide.ratings &&
                                  player.ratings.fide.ratings.blitz &&
                                  player.ratings.fide.ratings.blitz.rating) ||
                                "-"
                              }
                              mx={1}
                              color="primary"
                            />
                            <Chip
                              icon={<RapidIcon />}
                              label={
                                (player.ratings.fide.ratings &&
                                  player.ratings.fide.ratings.rapid &&
                                  player.ratings.fide.ratings.rapid.rating) ||
                                "-"
                              }
                              mx={1}
                              color="primary"
                            />
                          </React.Fragment>
                        ) : (
                          <Typography variant="body1">-</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {currentPlayer && currentPlayer.id === player.id ? (
                            <React.Fragment>
                              <Box mx={1}>
                                <IconButton
                                  color="secondary"
                                  disabled={uscfSubmitting}
                                  onClick={() => handleClickSave()}
                                >
                                  <SaveIcon />
                                </IconButton>
                              </Box>
                              <Box mx={1}>
                                <IconButton onClick={() => handleClickCancel()}>
                                  <CloseIcon />
                                </IconButton>
                              </Box>
                            </React.Fragment>
                          ) : (
                            <IconButton
                              color="secondary"
                              onClick={() => handleClickEdit(player)}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 30]}
            component="div"
            count={user.list.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </React.Fragment>
      ) : (
        <Box
          flexGrow={1}
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body1">No Players</Typography>
        </Box>
      )}
    </Box>
  );
};
