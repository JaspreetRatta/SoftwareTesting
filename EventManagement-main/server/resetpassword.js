import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import ResetPassword from "../client/src/pages/ResetPassword";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/reset-password" component={ResetPassword} />
        {/* Other routes */}
      </Switch>
    </Router>
  );
}

export default App;
