import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

export default function(props) {
  console.log(props)
  const [a, seta]=useState(10)
  let history = useHistory()
  useEffect(() => {
    let timer = setTimeout(() => {
      seta(a-1)
    }, 1000)
    if(a === 0) {
       clearTimeout(timer)
      history.push('/')
      return
    }
  }, [a])
  return (
    <div>
      <h2>下单成功</h2>
      <p>总价：{props.location && props.location.state.totalPrice}</p>
      <p>{a}秒后跳回首页</p>
    </div>
  )
}