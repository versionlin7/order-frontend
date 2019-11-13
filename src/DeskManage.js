import React, { useEffect, useState } from "react";
import api from "./api";
import { useRouteMatch } from "react-router-dom";
import { produce } from "immer";
import { List, Button, Modal, Input } from "antd";

const { confirm } = Modal;
export default function OrderManage() {
  const [desks, setDesks] = useState([]);
  const rid = useRouteMatch().params.rid;

  useEffect(() => {
    api.get(`/restaurant/${rid}/desk`).then(res => {
      console.log(res.data);
      setDesks(res.data);
    });
  }, []);

  function onDelete(did) {
    api.delete(`/restaurant/${rid}/desk/${did}`).then(res => {
      if (res.data.code === -1) {
        alert(res.data.msg);
      } else {
        setDesks(desks.filter(it => it.id !== did));
      }
    });
  }
  function setSave(desk) {
    setDesks(
      produce(desks => {
        desks.push(desk);
      })
    );
    alert('添加成功')
  }
  function showConfirm(did) {
    confirm({
      title: "你要删除此桌面么?",
      onOk() {
        onDelete(did);
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  return (
    <div>
      <AddDesk setSave={setSave} />

      <List
        size="large"
        bordered
        dataSource={desks}
        renderItem={item => (
          <List.Item
            actions={[
              <Button
                onClick={() => {
                  showConfirm(item.id);
                }}
              >
                删除
              </Button>
            ]}
          >
            <div style={{ width: "100%" }}>
              {"桌面：" + item.name}
              <br />
              {"人数：" + item.capacity}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

function AddDesk(props) {
  const rid = useRouteMatch().params.rid;
  const [state, setState] = useState({
    ModalText: "Content of the modal",
    visible: false,
    confirmLoading: false
  });
  let [deskInfo, setDeskInfo] = useState({
    name: "",
    capacity: 4
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
    setDeskInfo({
      ...deskInfo,
      [e.target.name]: e.target.value.trim()
    });
  }
  function submit(e) {
    e.preventDefault();

    api.post(`/restaurant/${rid}/desk`, deskInfo).then(res => {
      if (res.data.code === 0) {
        console.log(res.data.desk);
        setState({
          visible: false,
          confirmLoading: false
        });
        props.setSave(res.data.desk);

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
        添加桌子
      </Button>
      <Modal
        title="添加桌子"
        visible={visible}
        onOk={submit}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="添加"
        cancelText="取消"
      >
        <form className="AddDesk-form">
          <div>
            桌面名称：
            <Input
              type="text"
              required
              onChange={change}
              defaultValue={deskInfo.name}
              name="name"
            />
          </div>
          <br />
          <div>
            人数：
            <Input
              type="text"
              onChange={change}
              required
              min={4}
              defaultValue={deskInfo.capacity}
              name="capacity"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
