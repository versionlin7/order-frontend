import React from 'react'
import {Link} from 'react-router-dom'
import './home.css'
export default function() {
 
  return (
    <div style={{width:'fit-content',margin:'30px auto'}}>
      <h1><Link to="/login">点餐后台(账户：a;密码：123)</Link></h1>
      <br/>
      <h1><Link to="/landing/r/1/d/2">点餐入口</Link></h1>
	  <img style={{width:'200px',height:'200px'}} src="./order.png" />
    </div>
  )
}