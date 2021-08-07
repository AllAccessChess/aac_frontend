import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { withAuthGuard } from "components/hoc";
import { config } from "config";
import { AuthLayout, DetailLayout, GameLayout, MainLayout } from "layouts";
import { JitsiProvider } from "lib/jitsi";
import { StockFishProvider } from "lib/stock-fish";
import { ZoomProvider } from "lib/zoom";
import { Page404 } from "pages/error";
import { authLayoutRoutes } from "./authLayoutRoutes";
import { detailLayoutRoutes } from "./detailLayoutRoutes";
import { gameLayoutRoutes } from "./gameLayoutRoutes";
import { mainLayoutRoutes } from "./mainLayoutRoutes";

const renderChildRoutes = (Layout, routes) =>
  routes.map(
    (
      {
        path,
        component: Component,
        children,
        guarded,
        redirectToSignIn,
        adminAccess,
      },
      index
    ) => {
      const ComponentLayout = withAuthGuard(
        Layout,
        guarded,
        redirectToSignIn,
        adminAccess
      );

      const Provider = (props) =>
        path.indexOf("/analysis") > -1 ? (
          <StockFishProvider>{props.children}</StockFishProvider>
        ) : path.indexOf("/match") > -1 ? (
          config.meeting === "jitsi" ? (
            <JitsiProvider>{props.children}</JitsiProvider>
          ) : (
            <ZoomProvider apiKey={config.zoom.apiKey}>
              {props.children}
            </ZoomProvider>
          )
        ) : (
          <React.Fragment>{props.children}</React.Fragment>
        );

      return children ? (
        renderChildRoutes(Layout, children)
      ) : Component ? (
        <Route
          key={index}
          path={path}
          exact
          render={(props) => (
            <Provider>
              <ComponentLayout>
                <Component {...props} />
              </ComponentLayout>
            </Provider>
          )}
        />
      ) : null;
    }
  );

export const Routes = () => (
  <Router>
    <Switch>
      {renderChildRoutes(MainLayout, mainLayoutRoutes)}
      {renderChildRoutes(AuthLayout, authLayoutRoutes)}
      {renderChildRoutes(GameLayout, gameLayoutRoutes)}
      {renderChildRoutes(DetailLayout, detailLayoutRoutes)}
      <Route
        render={() => (
          <AuthLayout>
            <Page404 />
          </AuthLayout>
        )}
      />
    </Switch>
  </Router>
);
