import React, { useState, useEffect } from "react";
import { Switch, Link, Route, useHistory,useRouteMatch } from "react-router-dom";
import { Layout, Menu, Icon, Row, Col } from "antd";
import OrderManage from "./OrderManage";
import FoodManage from "./FoodManage";
import DeskManage from "./DeskManage";
import AddFood from "./AddFood";
import api from "./api";
import "./RM.css";
const { Header, Content, Footer, Sider } = Layout;

function RestaurantInfo(props) {
  let history = useHistory();
  let [info, setInfo] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        let res = await api.get("/userInfo");
        setInfo(res.data.info);
      } catch (e) {
        history.push("/");
      }
    })();
  }, [history]);

  return <h1>{info && info.title}</h1>;
}

export default function RM(props) {
  async function logout() {
    await api.get("/logout");
    props.history.push("/");
  }
  let { path, url } = useRouteMatch();
  console.log(path,url)
  return (
    <Layout style={{minHeight:"100vh"}} className="RM">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo">
          <Icon type="home" />
          <Link to={`${url}`}>首页</Link>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]} className="sidebar">
          <Menu.Item key="1">
           <Row>
              <Col span={4}>
                <Icon type="shop" />
              </Col>
              <Col span={20}>
                <Link to={`${url}/order`} className="a">订单管理</Link>
              </Col>
            </Row>
          </Menu.Item>
          <Menu.Item key="2">
          <Row>
              <Col span={4}>
                <Icon type="bars" />
              </Col>
              <Col span={20}>
                <Link to={`${url}/food`} className="a">菜品管理</Link>
              </Col>
            </Row>
          </Menu.Item>
          <Menu.Item key="3">
            <Row>
              <Col span={4}>
                <Icon type="container" />
              </Col>
              <Col span={20}>
                <Link to={`${url}/desk`} className="a">桌面管理</Link>
              </Col>
            </Row>
          </Menu.Item>
          <Menu.Item key="5">
            <Row>
              <Col span={4}>
                <Icon type="logout" />
              </Col>
              <Col span={20}>
                <Link to="/login" onClick={logout} className="a">退出</Link>
              </Col>
            </Row>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          <RestaurantInfo />
        </Header>
        
        <Content style={{ padding: "0 50px" }} className="content">
         
          <Switch>
          
            <Route
              path={`${path}/order`}
              component={OrderManage}
            />
            <Route path={`${path}/food`} component={FoodManage} />
            <Route path={`${path}/desk`} component={DeskManage} />
            <Route
              path={`${path}/add-food`}
              component={AddFood}
            />
            <Route path={`${path}`} ><h1>欢迎登录</h1></Route>
          </Switch>
        </Content>
       
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
//  export default function (props) {
//   async function logout() {
//     await api.get('/logout')
//     props.history.push('/')
//   }
//   return (
//     <div>
//         <RestaurantInfo />
//       <nav>
//         <ul>
//           <li>
//             <Link to="order">订单管理</Link>
//           </li>
//           <li>
//             <Link to="food">菜品管理</Link>
//           </li>
//           <li>
//             <Link to="desk">桌面管理</Link>
//           </li>
//           <li>
//             <button onClick={logout}>退出</button>
//           </li>
//         </ul>
//       </nav>
//       <Switch>
//         <Route path="/restaurant/:rid/manage/order"  component={OrderManage} />
//         <Route path="/restaurant/:rid/manage/food"  component={FoodManage} />
//         <Route path="/restaurant/:rid/manage/desk"  component={DeskManage} />
//         <Route path="/restaurant/:rid/manage/add-food"  component={AddFood} />
//       </Switch>
//     </div>
//   )
// }