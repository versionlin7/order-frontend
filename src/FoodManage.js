import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { produce } from "immer";
import api from "./api";
import { Input, Modal, Button, Row, Col } from "antd";
import "./FoodManage.css";
var imgStyle = {
  float: "left",
  border: "1px solid #ebedf0",
  width: "120px",
  height: "120px",
  objectFit: "cover"
};
var foodCard = {
  overflow: "hidden"
};

function FoodItem({ food, onDelete }) {
  let [foodInfo, setFoodInfo] = useState(food);
  let [foodProps, setFoodProps] = useState({
    name: food.name,
    desc: food.desc,
    price: food.price,
    category: food.category,
    status: food.status,
    img: foodInfo.img
  });

  function save() {
    var fd = new FormData();
    for (var key in foodProps) {
      var val = foodProps[key];
      fd.append(key, val);
    }
    console.log(foodProps);
    api.put(`/restaurant/${food.rid}/food/` + food.id, fd).then(res => {
      if (res.data.code === 0) {
        setFoodInfo(res.data.food);
      }
    });
  }

  function change(e) {
    setFoodProps({
      ...foodProps,
      [e.target.name]: e.target.value
    });
    console.log(foodProps);
  }

  function imgChange(e) {
    setFoodProps({
      ...foodProps,
      img: e.target.files[0]
    });
  }

  function deleteFood() {
    api.delete(`/restaurant/${food.rid}/food/` + food.id).then(() => {
      onDelete(food.id);
    });
  }

  function setOnline() {
    api
      .put(`/restaurant/${food.rid}/food/` + food.id, {
        ...foodProps,
        status: "on"
      })
      .then(res => {
        if (res.data.code === 0) {
          setFoodInfo({
            ...res.data.food,
            status: "on"
          });
        }
      });
  }
  function setOffline() {
    api
      .put(`/restaurant/${food.rid}/food/` + food.id, {
        ...foodProps,
        status: "off"
      })
      .then(res => {
        if (res.data.code === 0) {
          setFoodInfo({
            ...res.data.food,
            status: "off"
          });
        }
      });
  }
  function getContent() {
    return (
      <div style={foodCard}>
        <img src={foodInfo.img} alt={foodInfo.name} style={imgStyle} />
        <p>描述：{foodInfo.desc}</p>
        <p>价格：{foodInfo.price}</p>
        <p>分类：{foodInfo.category ? foodInfo.category : "[暂未分类]"}</p>
      </div>
    );
  }
  return (
    <Col xs={24}sm={24} md={12} lg={8}>
      <li className="food-li">
        <div>
          <h3 style={{ display: "inline" }}>{food.name}</h3>
          <h3 style={{ margin: 0, float: "right" }}>
            状态：{foodInfo.status === "on" ? "已上架" : "已下架"}
          </h3>
          <div style={{ clear: "both" }}>
            {getContent()}
            <hr />
            <div style={{ display: "inline-flex" }}>
              <Mutation
                save={save}
                imgChange={imgChange}
                change={change}
                foodInfo={foodInfo}
              />

              {foodInfo.status === "on" && (
                <Button onClick={setOffline}>下架</Button>
              )}
              {foodInfo.status === "off" && (
                <Button onClick={setOnline}>上架</Button>
              )}
              <Button onClick={deleteFood}>删除</Button>
            </div>
          </div>
        </div>
      </li>
    </Col>
  );
}

function FoodManage() {
  let [foods, setFoods] = useState([]);
  const rid = useRouteMatch().params.rid;
  useEffect(() => {
    api.get(`/restaurant/${rid}/food`).then(res => {
      setFoods(res.data);
    });
  }, []);
  function onDelete(id) {
    setFoods(foods.filter(it => it.id !== id));
  }
  function setSave(food) {
    setFoods(
      produce(foods => {
        foods.push(food);
      })
    );
  }

  return (
    <div>
      <AddFood setSave={setSave} />
      <Row>
        <ul>
          {foods.map(food => {
            return <FoodItem onDelete={onDelete} key={food.id} food={food} />;
          })}
        </ul>
      </Row>
    </div>
  );
}

export default FoodManage;

function AddFood(props) {
  const rid = useRouteMatch().params.rid;
  const [state, setState] = useState({
    ModalText: "Content of the modal",
    visible: false,
    confirmLoading: false
  });
  let [foodInfo, setFoodInfo] = useState({
    name: "",
    desc: "",
    price: 0,
    category: "",
    status: "on",
    img: null
  });

  function showModal() {
    setState({
      visible: true
    });
  }

  function handleCancel() {
    console.log("Clicked cancel button");
    setState({
      visible: false
    });
  }
  function change(e) {
    setFoodInfo({
      ...foodInfo,
      [e.target.name]: e.target.value.trim()
    });
  }
  function imgChange(e) {
    setFoodInfo({
      ...foodInfo,
      img: e.target.files[0]
    });
  }

  function submit(e) {
    e.preventDefault();
    var fd = new FormData();
    for (var key in foodInfo) {
      var val = foodInfo[key];
      fd.append(key, val);
    }
    api.post(`/restaurant/${rid}/food`, fd).then(res => {
      if (res.data.code === 0) {
        console.log(res.data.food);
        setState({
          visible: false,
          confirmLoading: false
        });
        props.setSave(res.data.food);
      } else {
        alert(res.data.msg);
      }
    });
  }

  const { visible, confirmLoading } = state;
  return (
    <div>
      <Button
        type="primary"
        style={{ fontSize: "16px", margin: "20px 0 8px -40px" }}
        onClick={showModal}
      >
        添加菜品
      </Button>
      <Modal
        title="添加菜品"
        visible={visible}
        onOk={submit}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="添加"
        cancelText="取消"
      >
        <form className="AddFood-form">
          <div>
            名称：
            <Input
              type="text"
              required
              onChange={change}
              defaultValue={foodInfo.name}
              name="name"
            />
          </div>
          <br />
          <div>
            描述：
            <Input
              type="text"
              onChange={change}
              defaultValue={foodInfo.desc}
              name="desc"
            />
          </div>
          <br />
          <div>
            价格：
            <Input
              type="text"
              required
              onChange={change}
              defaultValue={foodInfo.price}
              name="price"
            />
          </div>
          <br />
          <div>
            分类：
            <Input
              type="text"
              onChange={change}
              defaultValue={foodInfo.category}
              name="category"
            />
          </div>
          <div>
            图片：
            <input type="file" onChange={imgChange} name="img" />
          </div>
        </form>
      </Modal>
    </div>
  );
}

class Mutation extends React.Component {
  state = {
    visible: false,
    confirmLoading: false
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    setTimeout(async () => {
      await this.props.save();
      this.setState({
        visible: false,
        confirmLoading: false
      });
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          修改
        </Button>
        <Modal
          title="修改菜品"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <form className="Mutation-form">
            <div>
              名称：
              <Input
                type="text"
                onChange={this.props.change}
                defaultValue={this.props.foodInfo.name}
                name="name"
              />
            </div>
            <br />
            <div>
              描述：
              <Input
                type="text"
                onChange={this.props.change}
                defaultValue={this.props.foodInfo.desc}
                name="desc"
              />
            </div>
            <br />
            <div>
              价格：
              <Input
                type="text"
                onChange={this.props.change}
                defaultValue={this.props.foodInfo.price}
                name="price"
              />
            </div>
            <br />
            <div>
              分类：
              <Input
                type="text"
                onChange={this.props.change}
                defaultValue={this.props.foodInfo.category}
                name="category"
              />
            </div>
            <br />
            <div>
              图片：
              <input type="file" onChange={this.props.imgChange} name="img" />
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}
