import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { withAuthGuard } from "components/hoc";
import { AuthLayout, DetailLayout, GameLayout, MainLayout } from "layouts";
import { Page404 } from "pages/error";
import { authLayoutRoutes } from "./authLayoutRoutes";
import { detailLayoutRoutes } from "./detailLayoutRoutes";
import { gameLayoutRoutes } from "./gameLayoutRoutes";
import { mainLayoutRoutes } from "./mainLayoutRoutes";

const renderChildRoutes = (Layout, routes) =>
  routes.map(({ component: Component, guarded, children, path }, index) => {
    const ComponentLayout = guarded ? withAuthGuard(Layout) : Layout;

    return children ? (
      renderChildRoutes(Layout, children)
    ) : Component ? (
      <Route
        key={index}
        path={path}
        exact
        render={(props) => (
          <ComponentLayout>
            <Component {...props} />
          </ComponentLayout>
        )}
      />
    ) : null;
  });

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
