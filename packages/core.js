import {Solar, LunarMonth, Lunar, LunarYear} from 'lunar-javascript'
import template from './template.html'
import {dayMap, monthMap, dayName, monthName, calculateFixedPosition, isPC, generateRange} from "./map.js";
import {makeSugar, useState, useEffect, instance, onMounted, nextTick} from 'sugar-reactive-js';

export default function createElement(inputEl, callback, fixed = false) {
    const node = document.createElement('div');
    node.innerHTML = template;
    document.body.append(node);
    const sugarApp = makeSugar({
        bulk() {
            const [isFixed, setIsFixed] = useState(fixed && isPC());
            const [type, setType] = useState(0);
            let years = generateRange(1800, 2100);
            const hours = ['未知', ...generateRange(0, 23)];
            const minutes = ['未知', ...generateRange(0, 59)];
            const [months, setMonths] = useState(generateRange(1, 12));
            const [days, setDays] = useState([]);
            const [activeYear, setActiveYear] = useState(new Date().getFullYear());
            const [activeMonth, setActiveMonth] = useState((new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1));
            const [activeDay, setActiveDay] = useState((new Date().getDate()) < 10 ? '0' + new Date().getDate() : new Date().getDate());
            const [activeHours, setActiveHours] = useState((new Date().getHours()) < 10 ? '0' + new Date().getHours() : new Date().getHours());
            const [activeMinutes, setActiveMinutes] = useState((new Date().getMinutes()) < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes());
            const [isToday, setIsToday] = useState(true);
            const ev = calculateFixedPosition(inputEl);
            const [style, setStyle] = useState(`;top:${ev.top}px;left:${ev.left}px`);
            if (fixed) {
                document.body.addEventListener('click', () => {
                    if (isFixed.value) {
                        setShow(false);
                    }
                })

                window.addEventListener('scroll', () => {
                    if (isFixed.value) {
                        setShow(false);
                    }
                })
            }

            window.addEventListener('resize', () => {
                if (isPC() && fixed) {
                    const ev = calculateFixedPosition(inputEl);
                    setStyle(`;top:${ev.top}px;left:${ev.left}px`);
                    setIsFixed(true);
                } else if (fixed) {
                    setIsFixed(false);
                }
            })

            useEffect(() => {
                if (type.value === 0) {
                    const yearToday = new Date().getFullYear();
                    const monthToday = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
                    const dayToday = (new Date().getDate()) < 10 ? '0' + new Date().getDate() : new Date().getDate();
                    setIsToday(yearToday.toString() === activeYear.value.toString() && monthToday.toString() === activeMonth.value.toString() && dayToday.toString() === activeDay.value.toString());
                } else {
                    const yearToday = new Date().getFullYear();
                    const monthToday = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
                    const dayToday = (new Date().getDate()) < 10 ? '0' + new Date().getDate() : new Date().getDate();
                    const lunar = Solar.fromYmd(yearToday, monthToday, dayToday).getLunar();
                    setIsToday(lunar.getYear().toString() === activeYear.value.toString() && lunar.getMonth() === Number(monthMap[activeMonth.value]) && lunar.getDay() === Number(dayMap[activeDay.value]))
                }
            }, [activeYear, activeMonth, activeDay, type]);

            function goToday() {
                if (type.value === 0) {
                    const yearToday = new Date().getFullYear();
                    const monthToday = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
                    const dayToday = (new Date().getDate()) < 10 ? '0' + new Date().getDate() : new Date().getDate();
                    setActiveYear(yearToday);
                    setActiveMonth(monthToday);
                    setActiveDay(dayToday);
                    transformDayNum = goActive(days.value, activeDay.value, dayRef.value, transformDayNum);
                    transformYearNum = goActive(years, activeYear.value, yearRef.value, transformYearNum);
                    transformMonthNum = goActive(months.value, activeMonth.value, monthRef.value, transformMonthNum);
                } else {
                    const yearToday = new Date().getFullYear();
                    const monthToday = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
                    const dayToday = (new Date().getDate()) < 10 ? '0' + new Date().getDate() : new Date().getDate();
                    const lunar = Solar.fromYmd(yearToday, monthToday, dayToday).getLunar();
                    setActiveYear(lunar.getYear());
                    setActiveMonth(monthName(lunar.getMonth()));
                    setActiveDay(dayName(lunar.getDay()));
                    transformDayNum = goActive(days.value, activeDay.value, dayRef.value, transformDayNum);
                    transformYearNum = goActive(years, activeYear.value, yearRef.value, transformYearNum);
                    transformMonthNum = goActive(months.value, activeMonth.value, monthRef.value, transformMonthNum);

                }
            }

            useEffect(() => {
                if (type.value === 0) {
                    setDays(generateRange(1, new Date(activeYear.value, activeMonth.value, 0).getDate()))
                    if (activeDay.value > days.value.length) {
                        setActiveDay(days.value[days.value.length - 1]);
                        transformDayNum = goActive(days.value, activeDay.value, dayRef.value, transformDayNum);
                    }
                } else {
                    const monthNum = monthMap[activeMonth.value];
                    setDays(generateRange(1, LunarMonth.fromYm(activeYear.value, monthNum)._p.dayCount).map((r) => {
                        return dayName(r);
                    }))
                    if (dayMap[activeDay.value] > days.value.length) {
                        setActiveDay(days.value[days.value.length - 1]);
                        transformDayNum = goActive(days.value, activeDay.value, dayRef.value, transformDayNum);
                    } else {
                        transformDayNum = goActive(days.value, activeDay.value, dayRef.value, transformDayNum);
                    }
                }
            }, [activeMonth], true);

            useEffect(() => {
                if (type.value === 1) {
                    setMonths(LunarYear.fromYear(activeYear.value).getMonthsInYear().map((r) => {
                        return monthName(r.getMonth());
                    }));
                    const monthNum = monthMap[activeMonth.value];
                    if (Number(monthNum < 0)) {
                        setActiveMonth(monthName(Math.abs(Number(monthNum)) - 1));
                        transformMonthNum = goActive(months.value, activeMonth.value, monthRef.value, transformMonthNum);
                    }
                }
            }, [activeYear]);

            useEffect(() => {
                if (type.value === 1) {
                    const lunar = Solar.fromYmd(activeYear.value, Number(activeMonth.value), Number(activeDay.value)).getLunar();
                    setMonths(LunarYear.fromYear(lunar.getYear()).getMonthsInYear().map((r) => {
                        return monthName(r.getMonth());
                    }));
                    setActiveDay(dayName(lunar.getDay()));
                    setActiveYear(lunar.getYear());
                    setActiveMonth(monthName(lunar.getMonth()));
                    nextTick(() => {
                        transformYearNum = goActive(years, activeYear.value, yearRef.value, transformYearNum);
                        transformMonthNum = goActive(months.value, activeMonth.value, monthRef.value, transformMonthNum);
                    })
                } else {

                    const solar = Lunar.fromYmd(activeYear.value, monthMap[activeMonth.value], dayMap[activeDay.value]).getSolar();
                    setActiveYear(solar.getYear());
                    setActiveMonth(solar.getMonth() < 10 ? '0' + solar.getMonth() : solar.getMonth());
                    setActiveDay(solar.getDay() < 10 ? '0' + solar.getDay() : solar.getDay());
                    setMonths(generateRange(1, 12));
                    setDays(generateRange(1, new Date(activeYear.value, activeMonth.value, 0).getDate()))

                    nextTick(() => {
                        transformYearNum = goActive(years, activeYear.value, yearRef.value, transformYearNum);
                        transformMonthNum = goActive(months.value, activeMonth.value, monthRef.value, transformMonthNum);
                        transformDayNum = goActive(days.value, activeDay.value, dayRef.value, transformDayNum);
                    })

                }
            }, [type])

            //年picker
            let transformYearNum = 0;
            let yearTransform = 0;
            const hairline = instance();
            const yearRef = instance();
            let lastSpeed = 0;

            function touchstartYear(e) {
                lastSpeed = 0;
                yearTransform = e.touches[0].screenY;
                yearRef.value.style.transitionDuration = '0ms';
                yearRef.value.style.transitionProperty = 'none';
            }

            function touchmoveYear(e) {
                if ((transformYearNum + e.touches[0].screenY - yearTransform) > 130 || (transformYearNum + e.touches[0].screenY - yearTransform) < -(yearRef.value.children.length * 43)) {
                    return
                }
                if (Math.abs(e.touches[0].screenY - yearTransform) > 0) {
                    lastSpeed = e.touches[0].screenY - yearTransform;
                }
                transformYearNum = transformYearNum + e.touches[0].screenY - yearTransform;
                yearTransform = e.touches[0].screenY;
                yearRef.value.style.transform = `translateY(${transformYearNum}px)`
                e.preventDefault();
            }

            function touchendYear(e) {
                yearRef.value.style.transitionDuration = '300ms';
                yearRef.value.style.transitionProperty = 'transform';
                let [index, offset] = getOffsetWithIndex(transformYearNum, yearRef.value);
                if (lastSpeed > 3 || lastSpeed < -3) {
                    index = parseInt(index) - parseInt(lastSpeed);
                    if (index < 0) {
                        index = 0;
                    } else if (index > years.length - 1) {
                        index = years.length - 1;
                    }

                    offset = getOffsetWidthOnceIndex(index, yearRef.value)
                }
                setActiveYear(years[index]);
                transformYearNum = -offset;
                yearRef.value.style.transform = `translateY(${-offset}px)`
            }

            //月picker
            let transformMonthNum = 0;
            let monthTransform = 0;
            const monthRef = instance();

            function touchstartMonth(e) {
                lastSpeed = 0;
                monthTransform = e.touches[0].screenY;
                monthRef.value.style.transitionDuration = '0ms';
                monthRef.value.style.transitionProperty = 'none';
            }

            function touchmoveMonth(e) {
                if ((transformMonthNum + e.touches[0].screenY - monthTransform) > 130 || (transformMonthNum + e.touches[0].screenY - monthTransform) < (-(12 * 43) + 86)) {
                    return
                }
                if (Math.abs(e.touches[0].screenY - monthTransform) > 0) {
                    lastSpeed = e.touches[0].screenY - monthTransform;
                }
                transformMonthNum = transformMonthNum + e.touches[0].screenY - monthTransform;
                monthTransform = e.touches[0].screenY;
                monthRef.value.style.transform = `translateY(${transformMonthNum}px)`
                e.preventDefault();
            }

            function touchendMonth(e) {
                let [index, offset] = getOffsetWithIndex(transformMonthNum, monthRef.value);

                if (lastSpeed > 3 || lastSpeed < -3) {
                    index = parseInt(index) - parseInt(lastSpeed);
                    if (index < 0) {
                        index = 0;
                    } else if (index > months.value.length - 1) {
                        index = months.value.length - 1;
                    }

                    offset = getOffsetWidthOnceIndex(index, monthRef.value)
                }

                setActiveMonth(months.value[index]);
                transformMonthNum = -offset;
                monthRef.value.style.transitionDuration = '300ms';
                monthRef.value.style.transform = `translateY(${-offset}px)`
                monthRef.value.style.transitionProperty = 'transform';
            }

            //天picker
            let transformDayNum = 0;
            let dayTransform = 0;
            const dayRef = instance();

            function touchstartDay(e) {
                lastSpeed = 0;
                dayTransform = e.touches[0].screenY;
                dayRef.value.style.transitionDuration = '0ms';
                dayRef.value.style.transitionProperty = 'none';
            }

            function touchmoveDay(e) {
                if ((transformDayNum + e.touches[0].screenY - dayTransform) > 130 || (transformDayNum + e.touches[0].screenY - dayTransform) < (-(dayRef.value.children.length * 43) + 86)) {
                    return
                }
                if (Math.abs(e.touches[0].screenY - dayTransform) > 0) {
                    lastSpeed = e.touches[0].screenY - dayTransform;
                }
                transformDayNum = transformDayNum + e.touches[0].screenY - dayTransform;
                dayTransform = e.touches[0].screenY;
                dayRef.value.style.transform = `translateY(${transformDayNum}px)`
                e.preventDefault();
            }

            function touchendDay(e) {
                let [index, offset] = getOffsetWithIndex(transformDayNum, dayRef.value);
                if (lastSpeed > 3 || lastSpeed < -3) {
                    index = parseInt(index) - parseInt(lastSpeed);
                    if (index < 0) {
                        index = 0;
                    } else if (index > days.value.length - 1) {
                        index = days.value.length - 1;
                    }

                    offset = getOffsetWidthOnceIndex(index, dayRef.value)
                }
                setActiveDay(days.value[index]);
                transformDayNum = -offset;
                dayRef.value.style.transitionDuration = '300ms';
                dayRef.value.style.transform = `translateY(${-offset}px)`
                dayRef.value.style.transitionProperty = 'transform';
            }

            //时picker
            let transformHoursNum = 0;
            let hoursTransform = 0;
            const hoursRef = instance();

            function touchstartHours(e) {
                lastSpeed = 0;
                hoursTransform = e.touches[0].screenY;
                hoursRef.value.style.transitionDuration = '0ms';
                hoursRef.value.style.transitionProperty = 'none';
            }

            function touchmoveHours(e) {
                if ((transformHoursNum + e.touches[0].screenY - hoursTransform) > 130 || (transformHoursNum + e.touches[0].screenY - hoursTransform) < (-(25 * 43) + 86)) {
                    return
                }
                if (Math.abs(e.touches[0].screenY - hoursTransform) > 0) {
                    lastSpeed = e.touches[0].screenY - hoursTransform;
                }
                transformHoursNum = transformHoursNum + e.touches[0].screenY - hoursTransform;
                hoursTransform = e.touches[0].screenY;
                hoursRef.value.style.transform = `translateY(${transformHoursNum}px)`
                e.preventDefault();
            }

            function touchendHours(e) {
                let [index, offset] = getOffsetWithIndex(transformHoursNum, hoursRef.value);
                if (lastSpeed > 3 || lastSpeed < -3) {
                    index = parseInt(index) - parseInt(lastSpeed);
                    if (index < 0) {
                        index = 0;
                    } else if (index > hours.length - 1) {
                        index = hours.length - 1;
                    }

                    offset = getOffsetWidthOnceIndex(index, hoursRef.value)
                }
                setActiveHours(hours[index]);
                transformHoursNum = -offset;
                hoursRef.value.style.transitionDuration = '300ms';
                hoursRef.value.style.transform = `translateY(${-offset}px)`
                hoursRef.value.style.transitionProperty = 'transform';
            }

            //分picker
            let transformMinuteNum = 0;
            let minuteTransform = 0;
            const minuteRef = instance();

            function touchstartMinute(e) {
                lastSpeed = 0;
                minuteTransform = e.touches[0].screenY;
                minuteRef.value.style.transitionDuration = '0ms';
                minuteRef.value.style.transitionProperty = 'none';
            }

            function touchmoveMinute(e) {
                if ((transformMinuteNum + e.touches[0].screenY - minuteTransform) > 130 || (transformMinuteNum + e.touches[0].screenY - minuteTransform) < (-(61 * 43) + 86)) {
                    return
                }
                if (Math.abs(e.touches[0].screenY - minuteTransform) > 0) {
                    lastSpeed = e.touches[0].screenY - minuteTransform;
                }
                transformMinuteNum = transformMinuteNum + e.touches[0].screenY - minuteTransform;
                minuteTransform = e.touches[0].screenY;
                minuteRef.value.style.transform = `translateY(${transformMinuteNum}px)`
                e.preventDefault();
            }

            function touchendMinute(e) {
                let [index, offset] = getOffsetWithIndex(transformMinuteNum, minuteRef.value);
                if (lastSpeed > 3 || lastSpeed < -3) {
                    index = parseInt(index) - parseInt(lastSpeed);
                    if (index < 0) {
                        index = 0;
                    } else if (index > minutes.length - 1) {
                        index = minutes.length - 1;
                    }

                    offset = getOffsetWidthOnceIndex(index, minuteRef.value)
                }
                setActiveMinutes(minutes[index]);
                transformMinuteNum = -offset;
                minuteRef.value.style.transitionDuration = '300ms';
                minuteRef.value.style.transform = `translateY(${-offset}px)`
                minuteRef.value.style.transitionProperty = 'transform';
            }

            function getOffsetWithIndex(offsetParent, ref) {
                let min = 9999999;
                for (let i = 0; i < ref.children.length; i++) {
                    const offset = Math.abs((hairline.value.getClientRects()[0].top - ref.children[i].getClientRects()[0].top));
                    if (offset < min && i < ref.children.length - 1) {
                        min = offset;
                    } else {
                        if (((i - 1 >= 0) && i < ref.children.length - 1) || (i === ref.children.length - 1 && offset > min)) {
                            return [i - 1, ref.children[i - 1].offsetTop - 86];
                        }
                        return [i, ref.children[i].offsetTop - 86];
                    }
                }
            }

            function getOffsetWidthOnceIndex(index, ref) {
                return ref.children[index].offsetTop - 86;
            }

            onMounted(() => {
                console.log(fixed)

            })

            //鼠标
            function wheelYear(e) {
                if (e.deltaY > 0 && activeYear.value < years[years.length - 1]) {
                    setActiveYear(activeYear.value + 1);
                    transformYearNum = goActive(years, activeYear.value, yearRef.value, transformYearNum);
                } else if (e.deltaY < 0 && activeYear.value > years[0]) {
                    setActiveYear(activeYear.value - 1);
                    transformYearNum = goActive(years, activeYear.value, yearRef.value, transformYearNum);
                }
                e.preventDefault();
            }

            function wheelMonth(e) {
                const index = months.value.indexOf(activeMonth.value)
                if (e.deltaY > 2 && index < (months.value.length - 1)) {
                    setActiveMonth(months.value[index + 1]);
                    transformMonthNum = goActive(months.value, activeMonth.value, monthRef.value, transformMonthNum);
                } else if (e.deltaY < -2 && index > 0) {
                    setActiveMonth(months.value[index - 1]);
                    transformMonthNum = goActive(months.value, activeMonth.value, monthRef.value, transformMonthNum);
                }
                e.preventDefault();

            }

            function wheelDay(e) {
                const index = days.value.indexOf(activeDay.value)
                if (e.deltaY > 2 && index < (days.value.length - 1)) {
                    setActiveDay(days.value[index + 1]);
                    transformDayNum = goActive(days.value, activeDay.value, dayRef.value, transformDayNum);
                } else if (e.deltaY < -2 && index > 0) {
                    setActiveDay(days.value[index - 1]);
                    transformDayNum = goActive(days.value, activeDay.value, dayRef.value, transformDayNum);
                }
                e.preventDefault();
            }

            function wheelHour(e) {
                const index = hours.indexOf(activeHours.value)
                if (e.deltaY > 2 && index < (hours.length - 1)) {
                    setActiveHours(hours[index + 1]);
                    transformHoursNum = goActive(hours, activeHours.value, hoursRef.value, transformHoursNum);
                } else if (e.deltaY < -2 && index > 0) {
                    setActiveHours(hours[index - 1]);
                    transformHoursNum = goActive(hours, activeHours.value, hoursRef.value, transformHoursNum);
                }
                e.preventDefault();
            }

            function wheelMinute(e) {
                const index = minutes.indexOf(activeMinutes.value)
                if (e.deltaY > 2 && index < (minutes.length - 1)) {
                    setActiveMinutes(minutes[index + 1]);
                    transformMinuteNum = goActive(minutes, activeMinutes.value, minuteRef.value, transformMinuteNum);
                } else if (e.deltaY < -2 && index > 0) {
                    setActiveMinutes(minutes[index - 1]);
                    transformMinuteNum = goActive(minutes, activeMinutes.value, minuteRef.value, transformMinuteNum);
                }
                e.preventDefault();
            }

            function init() {
                transformYearNum = goActive(years, activeYear.value, yearRef.value, transformYearNum);
                transformMonthNum = goActive(months.value, activeMonth.value, monthRef.value, transformMonthNum);
                transformDayNum = goActive(days.value, activeDay.value, dayRef.value, transformDayNum);
                transformHoursNum = goActive(hours, activeHours.value, hoursRef.value, transformHoursNum);
                transformMinuteNum = goActive(minutes, activeMinutes.value, minuteRef.value, transformMinuteNum);
                addMouseListeners(yearRef.value, touchstartYear, touchmoveYear, touchendYear)
                addMouseListeners(monthRef.value, touchstartMonth, touchmoveMonth, touchendMonth)
                addMouseListeners(dayRef.value, touchstartDay, touchmoveDay, touchendDay)
                addMouseListeners(hoursRef.value, touchstartHours, touchmoveHours, touchendHours)
                addMouseListeners(minuteRef.value, touchstartMinute, touchmoveMinute, touchendMinute)
            }

            const [show, setShow] = useState(false);
            const [opacity, setOpacity] = useState(0);
            const [top, setTop] = useState(-100);

            function open() {
                setShow(true);
                setTimeout(() => {
                    setOpacity(1);
                    setTop(0)
                }, 50)
            }

            function close() {
                setOpacity(0);
                setTop(-100);
                setTimeout(() => {
                    setShow(false);
                }, 300)
            }

            useEffect(() => {
                if (show.value) {
                    nextTick(() => {
                        init();
                    })
                }
            }, [show]);

            const [inputValue, setInputValue] = useState('');

            function goDate() {
                const year = inputValue.value.substring(0, 4);
                const month = inputValue.value.substring(4, 6);
                let day = inputValue.value.substring(6, 8);
                let hour = '00';
                let minute = '00';

                if (inputValue.value.toString().length > 8) {
                    hour = inputValue.value.substring(8, 10);
                    minute = inputValue.value.substring(10, 12);
                }
                if (year >= 1800 && year <= 2100) {
                    setActiveYear(Number(year));
                    transformYearNum = goActive(years, activeYear.value, yearRef.value, transformYearNum);
                }

                if (month >= 1 && month <= 12) {
                    setActiveMonth(month);
                    transformMonthNum = goActive(months.value, activeMonth.value, monthRef.value, transformMonthNum);
                }


                nextTick(() => {
                    if (day > days.value.length) {
                        day = days.value[days.value.length - 1];
                    }
                    setActiveDay(day);
                    transformDayNum = goActive(days.value, activeDay.value, dayRef.value, transformDayNum);
                })


                if (hour >= 0 && hour <= 23) {
                    setActiveHours(hour);
                    transformHoursNum = goActive(hours, activeHours.value, hoursRef.value, transformHoursNum);
                } else {
                    hour = '00';
                    minute = '00';
                    setActiveHours(hour);
                    transformHoursNum = goActive(hours, activeHours.value, hoursRef.value, transformHoursNum);
                }


                if (minute >= 0 && minute <= 59 && minute !== "") {
                    setActiveMinutes(minute);
                    transformMinuteNum = goActive(minutes, activeMinutes.value, minuteRef.value, transformMinuteNum);
                } else {
                    minute = '00';
                    setActiveMinutes(minute);
                    transformMinuteNum = goActive(minutes, activeMinutes.value, minuteRef.value, transformMinuteNum);
                }

            }

            function goActive(list, value, ref, transform) {
                if (value.toString().length < 2) {
                    value = '0' + value;
                }
                ref.style.transitionDuration = '0ms';
                ref.style.transitionProperty = 'none';
                const active = list.findIndex(item => item.toString() === value.toString());
                if (active !== -1) {
                    ref.style.transform = `translateY(${-ref.children[active].offsetTop + 86}px)`;
                    return -ref.children[active].offsetTop + 86;
                }

                return 0
            }

            function addMouseListeners(ref, touchStart, touchMove, touchEnd) {
                let isDragging = false;
                let startX = 0;
                let startY = 0;

                function mouseDown(e) {
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;

                    // 创建并触发 touchstart 事件
                    const touchEvent = new TouchEvent('touchstart', {
                        touches: [new Touch({
                            identifier: Date.now(),
                            target: e.target,
                            clientX: e.clientX,
                            clientY: e.clientY,
                            pageX: e.pageX,
                            pageY: e.pageY,
                            screenX: e.screenX,
                            screenY: e.screenY
                        })],
                        bubbles: true,
                        cancelable: true
                    });
                    e.target.dispatchEvent(touchEvent);

                    touchStart(touchEvent);
                }

                function mouseMove(e) {
                    if (!isDragging) return;

                    // 创建并触发 touchmove 事件
                    const touchEvent = new TouchEvent('touchmove', {
                        touches: [new Touch({
                            identifier: Date.now(),
                            target: e.target,
                            clientX: e.clientX,
                            clientY: e.clientY,
                            pageX: e.pageX,
                            pageY: e.pageY,
                            screenX: e.screenX,
                            screenY: e.screenY
                        })],
                        bubbles: true,
                        cancelable: true
                    });
                    e.target.dispatchEvent(touchEvent);

                    touchMove(touchEvent);
                }

                function mouseUp(e) {
                    if (!isDragging) return;
                    isDragging = false;

                    // 创建并触发 touchend 事件
                    const touchEvent = new TouchEvent('touchend', {
                        touches: [],
                        changedTouches: [new Touch({
                            identifier: Date.now(),
                            target: e.target,
                            clientX: e.clientX,
                            clientY: e.clientY,
                            pageX: e.pageX,
                            pageY: e.pageY,
                            screenX: e.screenX,
                            screenY: e.screenY
                        })],
                        bubbles: true,
                        cancelable: true
                    });
                    e.target.dispatchEvent(touchEvent);

                    touchEnd(touchEvent);
                }


                ref.addEventListener('mousedown', mouseDown);
                ref.addEventListener('mousemove', mouseMove);
                ref.addEventListener('mouseup', mouseUp);
                ref.addEventListener('mouseleave', mouseUp);
            }

            function confirm() {
                close();
                if (type.value === 0) {
                    inputEl.value = '公曆:' + getValue().solar;
                } else {
                    inputEl.value = '農曆:' + getValue().lunar;
                }
                callback(getValue());
            }

            function getValue() {
                const value = {
                    lunar: '',
                    solar: '',
                    lunarObj: null,
                    solarObj: null
                }
                const time = activeHours.value === '未知' ? '未知時辰' : `${activeHours.value}:${activeMinutes.value === '未知' ? '00' : activeMinutes.value}`

                if (type.value === 0) {
                    value.solar = `${activeYear.value}-${activeMonth.value}-${activeDay.value} ${time}`
                    const lunar = Solar.fromYmd(activeYear.value, activeMonth.value, activeDay.value).getLunar();
                    value.lunarObj = lunar;
                    value.solarObj = Solar.fromYmd(activeYear.value, activeMonth.value, activeDay.value)
                    value.lunar = `${lunar.getYear()}年${monthName(lunar.getMonth())}${dayName(lunar.getDay())} ${time}`
                } else {
                    value.lunar = `${activeYear.value}年${activeMonth.value}${activeDay.value} ${time}`;
                    const solar = Lunar.fromYmd(activeYear.value, monthMap[activeMonth.value], dayMap[activeDay.value]).getSolar();
                    value.lunarObj = Lunar.fromYmd(activeYear.value, monthMap[activeMonth.value], dayMap[activeDay.value]);
                    value.solarObj = solar
                    value.solar = `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()} ${time}`
                }

                return value

            }

            function noAction(e) {
                e.preventDefault();
            }

            function stop() {

            }

            return {
                stop,
                type,
                setType,
                years,
                hours,
                minutes,
                months,
                activeYear,
                activeDay,
                activeMonth,
                activeHours,
                activeMinutes,
                days,
                touchstartYear,
                touchmoveYear,
                touchendYear,
                yearRef,
                monthRef,
                touchstartMonth,
                touchmoveMonth,
                touchendMonth,
                hoursRef,
                touchstartHours,
                touchmoveHours,
                touchendHours,
                minuteRef,
                touchstartMinute,
                touchmoveMinute,
                touchendMinute,
                dayRef,
                touchstartDay,
                touchmoveDay,
                touchendDay,
                hairline,
                goDate,
                inputValue,
                setInputValue,
                confirm,
                show,
                setShow,
                open,
                close,
                top,
                opacity,
                getValue,
                noAction,
                isToday,
                goToday,
                wheelYear,
                wheelMonth,
                wheelDay,
                wheelHour,
                wheelMinute,
                fixed,
                style,
                isFixed,
                setIsFixed
            }
        }
    })
    sugarApp.mount(node);
    return sugarApp;
}
