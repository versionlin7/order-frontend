import React from "react";
import { Form, Icon, Input, Button, Row, Col, Radio } from "antd";
import api from "./api";
import"./Login.css";

class LandingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: "login"
    };
    

  }
  handleLogin = e => {
    e.preventDefault();
    console.log(this.props);
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (this.state.flag === "login") {
          let res = (await api.post('/login',values)).data
          if(res.code !== 0) {
            alert(res.msg)
            document.querySelector('img').click()
          }else {
            this.props.history.push(`/restaurant/${res.id}/manage`)
          }
        } else {
          let res = (await api.post('/register',values)).data
          if(res.code !== 0) {
            alert(res.msg)
          }else {
            alert(res.msg)
            document.querySelector('.log').click()
          }
        }
        console.log("Received values of form: ", values);
      }
    });
  };
  handleFormChange = e => {
    this.setState({ flag: e.target.value });
  };

  changeImg = e => {
    e.target.src = "/api/captcha?" + Date.now();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-container">
        <Form
          onSubmit={this.handleLogin}
          className="login-form"
          >
          <h1>餐厅管理员登录</h1>
          <Form.Item>
            <Radio.Group defaultValue="login" onChange={this.handleFormChange}>
              <Radio.Button value="login" className="log">登录</Radio.Button>
              <Radio.Button value="register" className="reg" >注册</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <hr />
          {this.state.flag === "login" ? (
            <div key="1">
              <Form.Item>
                <Col span={4}>用户名：</Col>
                <Col span={20}>
                  {getFieldDecorator("name", {
                    rules: [
                      { required: true, message: "请填写用户名" }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Username"
                    />
                  )}
                </Col>
              </Form.Item>

              <Form.Item>
                <Col span={4}>密码：</Col>
                <Col span={20}>
                  {getFieldDecorator("pwd", {
                    rules: [
                      { required: true, message: "请填写密码" }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="password"
                      placeholder="Password"
                    />
                  )}
                </Col>
              </Form.Item>
              <Form.Item>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={12}>
                    <img
                      alt="example"
                      src="/api/captcha"
                      onClick={this.changeImg}
                    />
                  </Col>
                  <Col span={12}>
                    {getFieldDecorator("captcha", {
                      rules: [
                        {
                          required: true,
                          message: "请填写验证码"
                        }
                      ]
                    })(<Input placeholder="验证码" />)}
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item>
                {/* <a className="login-form-forgot" href="/forgot">
                  忘记密码
                </a> */}
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  确认登录
                </Button>
              </Form.Item>
            </div>
          ) : (
            <div key="2">
               <Form.Item>
                <Col span={4}>餐厅名称：</Col>
                <Col span={20}>
                  {getFieldDecorator("title", {
                    rules: [
                      { required: true, message: "请填写餐厅名称" }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="menu"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="title"
                    />
                  )}
                </Col>
              </Form.Item>
              <Form.Item>
                <Col span={4}>用户名：</Col>
                <Col span={20}>
                  {getFieldDecorator("name", {
                    rules: [
                      { required: true, message: "请填写用户名" }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Username"
                    />
                  )}
                </Col>
              </Form.Item>
             

              <Form.Item>
                <Col span={4}>邮箱：</Col>
                <Col span={20}>
                  {getFieldDecorator("mail", {
                    rules: [
                      { required: true, message: "请填写邮箱用于找回密码" }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="mail"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Email"
                    />
                  )}
                </Col>
              </Form.Item>
              <Form.Item>
                <Col span={4}>密码：</Col>
                <Col span={20}>
                  {getFieldDecorator("pwd", {
                    rules: [
                      { required: true, message: "请填写密码" }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="password"
                      placeholder="Password"
                    />
                  )}
                </Col>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  确认注册
                </Button>
              </Form.Item>
            </div>
          )}
        </Form>
      </div>
    );
  }
}

const Landing = Form.create()(LandingForm);
export default Landing;

// function a (props) {
//   let nameRef = useRef()
//   let pwdRef = useRef()
//   let captchaRef = useRef()
//   let [captcha, setCaptcha] = useState(null)

// useEffect(() => {
//   api.get('/captcha').then(res =>  {
//     setCaptcha('data:image/svg+xml;base64,'+btoa(res.data))
//   })
// },[])

//   async function login() {
//     let name = nameRef.current.value
//     let pwd = pwdRef.current.value
//     let captcha = captchaRef.current.value

//     var res = (await api.post('/login',{name, pwd,captcha})).data
//     console.log(res)
//     if(res.code !== 0) {
//       alert(res.msg)
//       changeImg()
//     }else {
//       props.history.push(`/restaurant/${res.id}/manage/`)
//     }
//   }
// function changeImg (e) {
//   e.target.src = '/api/captcha?'  + Date.now()
// }
//   return (
//     <div>
//       <h2>餐厅管理员登录</h2>
//       <input type="text" ref={nameRef}/><br/>
//       <input type="password" ref={pwdRef} /><br/>
//       <img src="/api/captcha"  onClick={changeImg}alt="captcha"/>
//       <input placeholder={'验证码'} type="text" ref={captchaRef} /><br/>
//       {/* <img src={captcha} alt="captcha" /> */}
//       <button onClick={login}>登录</button>
//     </div>
//   )
// }
