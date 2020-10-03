//课程时间段
let sectionTimes = [
    {
        "section": 1,
        "startTime": "08:00",
        "endTime": "08:45"
    },
    {
        "section": 2,
        "startTime": "08:50",
        "endTime": "09:35"
    },
    {
        "section": 3,
        "startTime": "10:05",
        "endTime": "10:50"
    },
    {
        "section": 4,
        "startTime": "10:55",
        "endTime": "11:40"
    },
    {
        "section": 5,
        "startTime": "13:30",
        "endTime": "14:15"
    },
    {
        "section": 6,
        "startTime": "14:20",
        "endTime": "15:05"
    },
    {
        "section": 7,
        "startTime": "15:35",
        "endTime": "16:20"
    },
    {
        "section": 8,
        "startTime": "16:25",
        "endTime": "17:10"
    },
    {
        "section": 9,
        "startTime": "18:00",
        "endTime": "18:45"
    },
    {
        "section": 10,
        "startTime": "18:50",
        "endTime": "19:35"
    },
    {
        "section": 11,
        "startTime": "19:40",
        "endTime": "20:25"
    },
    {
        "section": 12,
        "startTime": "20:30",
        "endTime": "21:15"
    },
];
function scheduleHtmlParser(html) {
    //解析课程HTML
    let table = $('table.displayTag')[1].children[3].children;
    table = table.filter((item) => {
        return 'name' in item && item.name === 'tr';
    });
    
	//课程数据
    let courses = table.map((item, index) => {
        let dataColumn = filterTd(item.children);

        //是否为课表主条目
        let isMainItem = dataColumn.length === 18;

        //处理课程周次
        let weekList = removeNbsp(dataColumn[isMainItem ? 11 : 0].children[0].data).trim();
        if (weekList) {
            if (weekList.indexOf("-") !== -1) {
                let weekListSE = weekList.replace('周上', '').split("-").map((item) => {
                    return parseInt(item);
                });

                weekList = [];
                for (let i = 0; i <= weekListSE[1] - weekListSE[0]; i++) {
                    weekList.push(weekListSE[0] + i);
                }
            } else if (weekList.indexOf(",") !== -1) {
                weekList = weekList.replace('周上', '').split(",").map((item) => {
                    return parseInt(item);
                });
            } else {
                weekList = [parseInt(weekList.replace('周上', ''))]
            }
        }

        //生成课程数据
        //为分支条目获取其对应的主条目
        let lastMainItem = getLastMainItem(table, index);

        //课程起止时间参数
        let section = parseInt(removeNbsp(dataColumn[isMainItem ? 13 : 2].children[0].data).trim());
        let sectionLong = parseInt(removeNbsp(dataColumn[isMainItem ? 14 : 3].children[0].data).trim());
        let sectionArray = [];

        //课程时段数组生成
        for(let i = 0; i < sectionLong; i++){
            sectionArray.push({
                section: section + i
            });
        }

        //课程数据
        let data = {
            name: removeNbsp((isMainItem ? dataColumn[2] : lastMainItem[2]).children[0].data).trim(),
            position: removeNbsp(dataColumn[isMainItem ? 17 : 6].children[0].data).trim(),
            teacher: removeNbsp((isMainItem ? dataColumn[7] : lastMainItem[7]).children[0].data).replace('*', '').trim(),
            weeks: weekList,
            day: parseInt(removeNbsp(dataColumn[isMainItem ? 12 : 1].children[0].data).trim()),
            sections: sectionArray
        };

        return data;
    });

    return { courseInfos: courses, sectionTimes }
}

//移除&nbsp;
function removeNbsp(str) {
    return str.replace('&nbsp;', '');
}

//过滤table-td
function filterTd(arr) {
    return arr.filter((item) => {
        return 'name' in item && item.name === 'td';
    });
}

//获取上一个主课程条目(上一个children为18个的课程条目)
function getLastMainItem(arr, currentIndex) {
    let tempArr = arr.slice(0, currentIndex).reverse();
    for (let i = 0; i < tempArr.length; i++) {
        let tempItem = filterTd(tempArr[i].children);
        if (tempItem.length === 18) return tempItem;
    }
    return false;
}