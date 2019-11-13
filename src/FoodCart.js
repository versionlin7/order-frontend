import React from 'react'
import api from './api'
import PropTypes from 'prop-types'
import {produce} from 'immer'
import io from 'socket.io-client'
import {Button,Icon,Row,Col,Modal} from 'antd'

let imgStyle = {
  float: 'left',
  width: '100px',
  height: '100px',
  border: '2px solid #ebedf0',
}
let MenuItemStyle ={
  border:'1px solid #ebedf0',
  padding:'5px',
  margin:'5px',

  backgroundColor:'#e9d7df',
  
}

function MenuItem({food, onUpdate, amount}) {


  function dec() {    

    if(amount === 0) {
      return
    }

    onUpdate(food,amount - 1)
  }
  function Inc() {


    onUpdate(food,amount + 1)
  }
  return (
    <div style={MenuItemStyle}>
      <h3>{food.name}</h3>
      <div>
        <img style={imgStyle} src={food.img} alt={food.name}/>
        <p>描述：{food.desc}</p>
        <p>价格：{food.price}</p>
      </div>
      <div>
        <Button type="primary" onClick={dec}>{<Icon type="minus" />}</Button>
        <span style={{margin:'1em',fontSize:'20px'}}>{amount}</span>
        <Button type="primary" onClick={Inc}><Icon type="plus" /></Button>
      </div>
    </div>
  )
}
MenuItem.propTypes = {
  food: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,

}
MenuItem.defaultProps = {
  onUpdate: () => {},
}

// let menuFetcher = createFetcher(() => {
//   return api.get('/menu/restaurant/1')
// })

export default class FoodCart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cart:[],
      deskInfo: {},
      foodMenu: [],
    }
  }

  componentDidMount() {
    let params = this.props.match.params
 
    api.get('/deskInfo?did='+ params.did).then(val => {
      this.setState(produce(draft => {
        draft.deskInfo = val.data
      }))
    })
    api.get(`/menu/restaurant/${params.rid}`).then(res =>{
      this.setState(produce(draft => {
        draft.foodMenu = res.data
      }))
    })

    this.socket = io({
      path: '/desk',
      query: {
        desk: 'desk:' + params.did,
      }
    })

    //后端发回此桌面已点菜单只触发一次
    this.socket.on('cart food', info => {
      console.log(info)
      this.setState(produce(draft => {
        draft.cart.push(...info)
      }))
    })


    //来自同桌用户的点单
    this.socket.on('new food', info => {
      console.log(info)
      this.foodChange(info.food, info.amount)
    })

    
    this.socket.on('placeorder success', order => {
      console.log(order)
      this.props.history.push({
        pathname: `/r/${params.rid}/d/${params.did}/order-success`,
        state: order,
      })
    })
  }
  componentWillUnmount() {
    this.socket.close()
  }

  cartChange = (food, amount) => {
   var params = this.props.match.params
   console.log(this.socket)
   this.socket.emit('new food', {desk: 'desk:' + params.did, food, amount})
  }

  foodChange = (food, amount) => {
    console.log(this.socket)
    let updated = produce(this.state.cart, draft => {
      let idx = draft.findIndex(it => it.food.id === food.id)
      if(idx >= 0) {
        if(amount === 0) {
          draft.splice(idx,1)
        }else {
          draft[idx].amount = amount
        }
      }else {
        draft.push({
          food,
          amount,
        })
      }
    })
    this.setState({cart: updated})
  }

  placeOrder = () => {
    let params = this.props.match.params
    if(this.state.cart.length === 0) {
      alert('请添加菜品')
      return
    }
    api.post(`/restaurant/${params.rid}/desk/${params.did}/order`, {
       deskName: this.state.deskInfo.name,
       customsCount: params.count,
       totalPrice: calcTotalPrice(this.state.cart),
       foods:this.state.cart,
    }).then(res => {
      console.log(res)
      if(res.data.code === 0) {
        this.props.history.push({
          pathname:`/r/${params.rid}/d/${params.did}/order-success`,
          state: res.data.order
        })
      }else {
        alert('下单失败')
      }
    })
  }


  render() { 
    return (
      <div style={{height:'100%', backgroundColor:'#93b5cf'}}>
        <div style={{paddingBottom:'75px',paddingTop:'1px'}}>
          {this.state.foodMenu.length > 0 ?
            this.state.foodMenu.map(food => {
              var currentAmount = 0
              var currFoodCartItem = this.state.cart.find(cartItem => cartItem.food.id === food.id)
              if (currFoodCartItem) {
                currentAmount = currFoodCartItem.amount
              }
              return <MenuItem food={food} key={food.id} amount={currentAmount} onUpdate={this.cartChange}/>
            })
            :
            '暂无菜单'
          }
        </div>
        <div>
          <CartStatus foods={this.state.cart} onUpdate={this.cartChange} onPlaceOrder={this.placeOrder}/>
        </div>
      </div>
    )
  } 

}

// function FoodCart(props) {
//   let history = useHistory()
//   let params = useParams()
//   let foods = menuFetcher.read().data
//   let [deskInfo, setDeskInfo] = useState(null)
//   let [cart, setCart] = useState([])

//   useEffect(() => {
//     api.get('/deskInfo?did='+ params.did).then(val => {
//       setDeskInfo(val.data)
//     })
//   }, [])

//   function foodChange(food, amount) {
//     let updated = produce(cart, draft => {
//       let idx = draft.findIndex(it => it.food.id === food.id)
//       if(idx >= 0) {
//         if(amount === 0) {
//           draft.splice(idx,1)
//         }else {
//           draft[idx].amount = amount
//         }
//       }else {
//         draft.push({
//           food,
//           amount,
//         })
//       }
//     })
//     setCart(updated)
//   }
//   function placeOrder () {
//     console.log('下单')
//     api.post(`/restaurant/${params.rid}/desk/${params.did}/order`, {
//        deskName: deskInfo.name,
//        customsCount: params.count,
//        totalPrice: calcTotalPrice(cart),
//        foods:cart,
//     }).then(res => {
//       if(res.data.code === 0) {
//         history.push({
//           pathname:`/r/${params.rid}/d/${params.did}/order-success`,
//           state: res.data.order
//         })
//       }else {
//         alert('下单失败')
//       }
//     })
//   }
//   return (
//     <div>
//       <div>
//         {
//           foods.map(food => {
//             return <MenuItem food={food} key={food.id} onUpdate={foodChange}/>
//           })
//         }
//       </div>
//         <div>
//           <CartStatus foods={cart} onUpdate={foodChange} onPlaceOrder={placeOrder} />
//         </div>
//     </div>
//   )
// }

function calcTotalPrice (foods) {
  return foods.reduce((total, item) =>{
    return total + item.amount * item.food.price
  },0)
}

function CartStatus(props) {

  const { confirm } = Modal;

  function showConfirm() {
    confirm({
      title: 'Do you Want to delete these items?',

      onOk() {
        props.onEmpty()
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  let totalPrice = calcTotalPrice(props.foods)
  return(
    <Row type="flex" justify="space-between" style={{
      position: 'fixed',
      height: '70px',
      bottom: '5px',
      borderRadius:'2%',
      left: '5px',
      right: '5px',
      backgroundColor: 'pink',
      fontSize:'20px',
      whiteSpace:'nowrap'
    }}>
      <Col span={6}>
      <strong>总价：{totalPrice}</strong>
      </Col>
      <Col span={14}></Col>
      <Col span={4} >
      <Button  onClick={() => props.onPlaceOrder()}>下单</Button>
      </Col>
    </Row>
  )
}



// export default () => {
//   return (
//     <Suspense fallback={<div>loading...</div>}>
//       <FoodCart />
//     </Suspense>
//   )
// }