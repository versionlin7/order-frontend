import React, {useState, Suspense} from 'react'
import { InputNumber,Card ,Button} from 'antd';
// import {withRouter} from 'react-router-dom'
import createFetcher from './create-fetcher'
import api from './api'
import './LandingPage.css'


let fetcher = createFetcher((did) => {
  return api.get('/deskInfo?did='+did)
})
function DeskInfo({did}) {
  let info = fetcher.read(did).data

  return (
    <div>
      <h1><span>{info.title}-</span>
      <span>{info.name}</span></h1>
    </div>
  )
}


export default function (props) {
  
  let [custom, setCustom] = useState(0)
  let rid = props.match.params.rid
  let did = props.match.params.did
  function startOrder() {
    props.history.push(`/r/${rid}/d/${did}/c/${custom}`)
  }
  function onChange (value) {
    setCustom(value)
  }
  return (
    <div className="Landing-container">
    <div className="LandingPage" style={{ background: '#ECECEC', padding: '30px' }}>
      <Suspense fallback={<div>loading...</div>} >
        <DeskInfo did={did} />
      </Suspense>
      <ul className="custom-count">
        <Card title="请选择入座人数：" bordered={false} style={{ width: 300 }} className="custom-Card">
          <div className="custom-li">
        <li className={custom === 1 ? 'active': null} onClick={() => setCustom(1)}>1</li>
        <li className={custom === 2 ? 'active': null} onClick={() => setCustom(2)}>2</li>
        <li className={custom === 3 ? 'active': null} onClick={() => setCustom(3)}>3</li>
        <li className={custom === 4 ? 'active': null} onClick={() => setCustom(4)}>4</li>
        <li className={custom > 4 ? 'active': null} onClick={() => setCustom(5)} >5+</li> 
        
        {
          custom > 4 &&
          <InputNumber min={5} max={16} defaultValue={5} onChange={onChange} className="inputNumber" />
        }
        </div>
        <hr/>
        <Button onClick={startOrder}>开始点餐</Button>
        </Card>
      </ul>
    </div>
    </div>
  )
}