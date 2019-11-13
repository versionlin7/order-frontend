import React, {useState} from 'react'
import api from './api.js'

export default function AddFood (props) {
  let [foodInfo, setFoodInfo] = useState({
    name: '',
    desc: '',
    price: 0,
    category: '',
    status:'on',
    img:null
  })
  function change (e) {
    setFoodInfo({
      ...foodInfo,
      [e.target.name]: e.target.value.trim()
    })
  }
  function imgChange(e) {
    setFoodInfo({
      ...foodInfo,
      img: e.target.files[0]
    })
  }

  function submit(e) {
    e.preventDefault(); 
    var fd = new FormData()
    for(var key in foodInfo) {
      var val = foodInfo[key]
      fd.append(key, val)
    }
    api.post('/restaurant/1/food', fd).then(res => {
      if(res.data.code === 0) {
        props.history.goBack()
      }else {
        alert(res.data.msg)
      }
    })
  }
  return (
    <div style={{height:'128px'}}>
      <form>
      名称：<input type="text" required onChange={change} defaultValue={foodInfo.name} name="name"/><br/>
      描述：<input type="text" onChange={change} defaultValue={foodInfo.desc} name="desc"/><br/>
      价格：<input type="text" required onChange={change} defaultValue={foodInfo.price} name="price"/><br/>
      分类：<input type="text" onChange={change} defaultValue={foodInfo.category} name="category"/><br/>
      图片：<input type="file" onChange={imgChange} name="img" />
      <button onClick={submit}>添加</button>
      </form>
    </div>
  )
}