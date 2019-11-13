import React from 'react';
import { HashRouter, Route, Switch} from 'react-router-dom'
import LandingPage from './LandingPage'
import FoodCart from './FoodCart'
import RestaurantManage from './RestaurantManage'
import Login from './Login'
import home from './home'
import OrderSuccess from './OrderSuccess'
import Forgot from './Forgot.js'
import ChangePass from './ChangePass.js'

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={home} />
        <Route path="/landing/r/:rid/d/:did" component={LandingPage} />
        <Route path="/r/:rid/d/:did/c/:count" component={FoodCart} />
        <Route path="/r/:rid/d/:did/order-success" component={OrderSuccess} />

        <Route path="/restaurant/:rid/manage" component={RestaurantManage} />
        {/* <Route path="/forgot" component={Forgot} /> */}
        {/* <Route path= "/changePass/:token" component={ChangePass} /> */}
        <Route path="/login" component={Login} />
        <Route path="*" component={Status} />
      </Switch>
    </HashRouter>
  );
  
}
function Status() {
  return(
    <div>404 NotFound</div>
  )
}
export default App;
