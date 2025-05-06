# 快速开始

### 引入样式和脚本
    <link rel="stylesheet" href="/datePicker.css"></link>
    <script src="/dist/datePicker.js"></script>
    //不在需要sugar-js依赖了，内置

### 使用
    <input id="init"/>
    <input id="init" fixed="true"/> // pc模式自动定位
    <script>
        const date = datePicker(document.querySelector('#init'), (value) => {
                console.log(value);//包含农历和公历
        })
    </script>