# 快速开始

### 引入样式和脚本
    <link rel="stylesheet" href="/datePicker.css"></link>
    <script src="/sugar.js"></script>
    <script src="/dist/datePicker.js"></script>
    sugar-js从 https://github.com/1176506184/sugar-js/tree/main/dist 这里下载

### 使用
    <input id="init"/>
    <script>
        const date = datePicker(document.querySelector('#init'), (value) => {
                console.log(value);//包含农历和公历
        })
    </script>