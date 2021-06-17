import React from "react";
import { Helmet } from "react-helmet";
import { Provider as ReduxProvider } from "react-redux";

import { withMessage } from "components/hoc";
import { AppProviders } from "./AppProviders";
import { Routes } from "./routes";
import store from "./redux";

const RoutesWithMessage = withMessage(Routes);

const App = () => {
  return (
    <ReduxProvider store={store}>
      <React.Fragment>
        <Helmet
          titleTemplate="%s | All Access Chess"
          defaultTitle="All Access Chess"
        />
        <AppProviders>
          <RoutesWithMessage />
        </AppProviders>
      </React.Fragment>
    </ReduxProvider>
  );
};

export default App;
