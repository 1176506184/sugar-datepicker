const monthMap = {
    '正月': '01',
    '二月': '02',
    '三月': '03',
    '四月': '04',
    '五月': '05',
    '六月': '06',
    '七月': '07',
    '八月': '08',
    '九月': '09',
    '十月': '10',
    '十一月': '11',
    '十二月': '12',
    '闰正月': '-1',
    '闰二月': '-2',
    '闰三月': '-3',
    '闰四月': '-4',
    '闰五月': '-5',
    '闰六月': '-6',
    '闰七月': '-7',
    '闰八月': '-8',
    '闰九月': '-9',
    '闰十月': '-10',
    '闰十一月': '-11',
    '闰十二月': '-12',
}

const dayMap = {
    '初一': '01',
    '初二': '02',
    '初三': '03',
    '初四': '04',
    '初五': '05',
    '初六': '06',
    '初七': '07',
    '初八': '08',
    '初九': '09',
    '初十': '10',
    '十一': '11',
    '十二': '12',
    '十三': '13',
    '十四': '14',
    '十五': '15',
    '十六': '16',
    '十七': '17',
    '十八': '18',
    '十九': '19',
    '二十': '20',
    '廿一': '21',
    '廿二': '22',
    '廿三': '23',
    '廿四': '24',
    '廿五': '25',
    '廿六': '26',
    '廿七': '27',
    '廿八': '28',
    '廿九': '29',
    '三十': '30',
    '三十一': '31'
}

function dayName(lunar) {
    switch (lunar) {
        case 10:
            return '初十';
        case 20:
            return '二十';
        case 30:
            return '三十';
        default:
            return ("初十廿卅".split("")[Math.floor(lunar / 10)] +
                "一二三四五六七八九十".split("")[(lunar - 1) % 10]) || lunar;
    }
}

function monthName(month) {
    var monthName = "正,二,三,四,五,六,七,八,九,十,十一,十二".split(",");
    return (month < 0 ? "闰" : "") + monthName[Math.abs(month) - 1] + "月";
}


function calculateFixedPosition(el) {
    const rect = el.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const fixedNodeWidth = 414;
    const fixedNodeHeight = 406;

    let left;

    // 尝试左侧对齐
    if (rect.left >= 0 && rect.left + fixedNodeWidth <= viewportWidth) {
        left = rect.left;
    }
    // 尝试右侧对齐
    else if (rect.right - fixedNodeWidth >= 0) {
        left = rect.right - fixedNodeWidth;
    }
    // 默认居中
    else {
        left = (viewportWidth - fixedNodeWidth) / 2;
    }

    // 计算 top 值，保持垂直方向不变
    let top = rect.top - fixedNodeHeight - 20;
    if (top < 0) {
        top = rect.bottom + 20;
    }
    if (top + fixedNodeHeight > window.innerHeight) {
        top = (window.innerHeight - fixedNodeHeight) / 2;
    }

    return {top, left};
}

function isPC() {
    const userAgent = navigator.userAgent;
    // 排除移动端设备的关键字
    const mobileKeywords = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;

    return !mobileKeywords.test(userAgent);
}


function generateRange(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
        throw new Error('Both min and max should be numbers.');
    }
    if (min > max) {
        throw new Error('Min should not be greater than max.');
    }

    const rangeArray = [];
    for (let i = min; i <= max; i++) {
        if (i < 10) {
            rangeArray.push(`0${i}`);
        } else {
            rangeArray.push(i);
        }
    }
    return rangeArray;
}

export {dayMap, monthMap, dayName, monthName, calculateFixedPosition, isPC, generateRange}