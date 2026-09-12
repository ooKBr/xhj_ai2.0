// 现代前端开发框架
// .vue->tsx 组件化  tsx  typescript + jsx 
// 响应式 
// 数据绑定
// 函数封装特性 组件的html，css，js 封装成一个组件
import { useState } from 'react'

function App() {
  // count 数据状态
  // 修改count  setCount
  const [count,setCount] = useState(0);  // useState 响应式  相当于vue 里的ref
  return (
  //  返回html jsx  react的UI表现格式
  <div className="flex justify-center">
    Hello World!  {count}
    <h1 className="text-3xl font-bold underline">你好世界</h1>
  </div>
  )
}

export default App