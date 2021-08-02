import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";

import { LoadingScreen } from "components/common";
import { Box, Grid, Typography } from "components/material-ui";
import { Info } from "./components";
import { Block, TextHelper, TextLabel } from "./styles";

import { authSelector } from "redux/reducers";

export const Dashboard = () => {
  const { user } = useSelector(authSelector);

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      {user ? (
        <Grid container>
          <Grid item md={8} sm={6}>
            <Box display="flex" flexDirection="column">
              <Block>
                <Box mb={3}>
                  <Typography variant="h3" component="h3">
                    General Information
                  </Typography>
                </Box>

                <Grid container>
                  <Info label="Name" value={user.name} />
                  <Info label="Username" value={user.username} />
                  <Info
                    label="Country"
                    value={
                      user.location && user.location.country
                        ? user.location.country.toUpperCase()
                        : "-"
                    }
                  />

                  <Info
                    label="USCF ID"
                    value={
                      (user.ratings &&
                        user.ratings.uscf &&
                        user.ratings.uscf.id) ||
                      "-"
                    }
                  />

                  <Info
                    label="FIDE ID/Country"
                    value={
                      (user.ratings &&
                        user.ratings.fide &&
                        user.ratings.fide.id) ||
                      "-"
                    }
                  />
                </Grid>
              </Block>
              {user.ratings && (user.ratings.uscf || user.ratings.fide) ? (
                <Block>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    mb={3}
                  >
                    <Typography variant="h3" component="h3">
                      Ratings
                    </Typography>
                    <Box ml={3}>
                      <TextHelper>
                        as on {moment().format("DD MMM YYYY")}
                      </TextHelper>
                    </Box>
                  </Box>
                  {user.ratings.uscf && user.ratings.uscf.ratings ? (
                    <Box display="flex" flexDirection="column">
                      <Box mb={3}>
                        <Typography variant="h5" component="h5">
                          USCF
                        </Typography>
                      </Box>
                      <Grid container>
                        <Info
                          label="Blitz"
                          value={
                            user.ratings.uscf.ratings.blitz
                              ? user.ratings.uscf.ratings.blitz.rating
                              : "-"
                          }
                        />
                        <Info
                          label="Rapid"
                          value={
                            user.ratings.uscf.ratings.rapid
                              ? user.ratings.uscf.ratings.rapid.rating
                              : "-"
                          }
                        />
                        <Info
                          label="Classic"
                          value={
                            user.ratings.uscf.ratings.classical
                              ? user.ratings.uscf.ratings.classical.rating
                              : "-"
                          }
                        />
                      </Grid>
                    </Box>
                  ) : (
                    <></>
                  )}
                  {user.ratings.fide && user.ratings.fide.ratings ? (
                    <Box display="flex" flexDirection="column">
                      <Box mb={3}>
                        <Typography variant="h5" component="h5">
                          FIDE
                        </Typography>
                      </Box>
                      <Grid container>
                        <Info
                          label="Blitz"
                          value={
                            user.ratings.fide.ratings.blitz
                              ? user.ratings.fide.ratings.blitz.rating
                              : "-"
                          }
                        />
                        <Info
                          label="Rapid"
                          value={
                            user.ratings.fide.ratings.rapid
                              ? user.ratings.fide.ratings.rapid.rating
                              : "-"
                          }
                        />
                        <Info
                          label="Classic"
                          value={
                            user.ratings.fide.ratings.classical
                              ? user.ratings.fide.ratings.classical.rating
                              : "-"
                          }
                        />
                      </Grid>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Block>
              ) : (
                <></>
              )}
            </Box>
          </Grid>
          <Grid item md={4} sm={6}>
            <Block>
              <Box mb={3}>
                <Typography variant="h3" component="h3">
                  Prize balance
                </Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="h1" component="p">
                  $0.00
                </Typography>
              </Box>
              <TextLabel>Available prizes</TextLabel>
            </Block>
          </Grid>
        </Grid>
      ) : (
        <LoadingScreen />
      )}
    </Box>
  );
};
