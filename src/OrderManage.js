import React, {useState} from 'react'
import io from 'socket.io-client'
import {produce} from 'immer'
import {Row,Col, Button} from 'antd'
import api from './api'
import './OM.css'



function OrderItem({order, onDelete}) {

  let [orderInfo, setOrder] = useState(order)

  function setConfirm() {
    api.put(`/restaurant/${order.rid}/order/${order.id}/status`, {
      status:'confirmed'
    }).then(() =>{
      setOrder(produce(orderInfo,draft => {
        draft.status = 'confirmed'
      }))
    })
  }
  function setComplete() {
    api.put(`/restaurant/${order.rid}/order/${order.id}/status`, {
      status:'completed'
    }).then(() =>{
      setOrder(produce(orderInfo,draft => {
        draft.status = 'completed'
      }))
    })
  }
  function setDelete() {
    console.log(`/restaurant/${order.rid}/order/${order.id}`)
    api.delete(`/restaurant/${order.rid}/order/${order.id}`).then(() => {
      console.log('delete')
      onDelete(order)
    })
  }
  function print(e) {
    var iframe = e.target.parentNode.lastChild
    let table = `<table style='border:1px solid #ebedf0'>
        <thead>
          <tr>
            <th>名称</th>
            <th>数量</th>
            <th>价格</th>
          </tr>
        </thead>
        <tbody>
          ${orderInfo.details.map(val => {
            return (`<tr>
              <td>${val.food.name}</td>
              <td>${val.amount}</td>
              <td>${val.food.price}</td>
            </tr>`)
          })}
        </tbody>
      </table>`
    let content = `
      <h2>${orderInfo.deskname}</h2>
      <h3>总人数：${orderInfo.customCount}</h3>
      <p>时间：${Date(orderInfo.timestamp).slice(11,24)}</p>
      ${table}
      <p>总价格：${orderInfo.totalPrice}</p>
      <p>订单状态：${orderInfo.status}</p>
    `
    console.log(content)
    iframe.contentWindow.document.body.innerHTML = content
    iframe.contentWindow.print();
    // iframe.contentDocument.close();
    // iframe.contentWindow.document.body.innerHTML = ''
  }
  return (
    <Col className='orderItemStyle' sm={24} md={11} >

    <h2>{orderInfo.deskname}</h2>
    <h3>总人数：{orderInfo.customCount}</h3>
    <h3>总价格：{orderInfo.totalPrice}</h3>
    <h3>订单状态：{orderInfo.status}</h3>
    
    <div>
      <Button onClick={print}>打印</Button>
      {
        orderInfo.status === 'pending' &&
        <Button onClick={setConfirm}>确认</Button>
      }
      {
        orderInfo.status === 'confirmed' &&
        <Button onClick={setComplete}>完成</Button>
      }
      <Button onClick={setDelete}>删除</Button>
      <iframe style={{display:'none'}} ></iframe>
    </div>
  </Col>
  )
}


export default class OrderManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orders:[]
    }
  }
   componentDidMount() {

    let params = this.props.match.params

      this.socket = io({
        path: '/restaurant',
        query: {
          restaurant: 'restaurant:' + params.rid
        }
      })
      this.socket.on('connect', () => {
        this.socket.emit('join restaurant', 'restaurant:' + params.rid)
      })
  
      this.socket.on('new order', order => {
        this.setState(produce(state => {
          state.orders.unshift(order)
        }))
      })
  
      api.get('/restaurant/1/order').then(res => {
        this.setState(produce(state => {
          state.orders = res.data
        }))
      })
  }

  componentWillUnmount() {
    this.socket.close()
  }

  onDelete = (order) => {
    
    let idx = this.state.orders.findIndex(it => it.id === order.id)

    this.setState(produce(draft => {
      draft.orders.splice(idx, 1)
    }))
  }

  render() {
    return (
      <div >
        <h2>订单管理</h2>
        <Row >
          {this.state.orders.length > 0 ?
            this.state.orders.map(it => {
              return <OrderItem key={it.id} order={it} onDelete={this.onDelete}/>
            })
            :
            <div className="loading"></div>
          }
        </Row>
      </div>
    )
  }
}