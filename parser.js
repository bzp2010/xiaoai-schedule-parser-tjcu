function scheduleHtmlParser(text) {
	const json = JSON.parse(text);

	// 生成时间表
	let timeData = json[1];
	let timeResult = [];
	timeData.sectionTime.map((item, index) = > {
		timeResult.push({
			"section": index + 1,
			"startTime": item.startTime.substr(0, 2) + ":" + item.startTime.substr(2, 2),
			"endTime": item.endTime.substr(0, 2) + ":" + item.endTime.substr(2, 2)
		});
	});

	// 生成课程表
	let courseData = json[0]['xkxx'][0];
	let courseDataValue = Object.values(courseData);
	let courseResult = [];

	let test = [];

	courseDataValue.map((item, index) = > {
		if (item.timeAndPlaceList.length === 0) { // 没有线下课
			return;
		}

		// 每一种不同的课程上法都要生成一个课程记录项
		item.timeAndPlaceList.map((tapItem) = > {
			let weekList = tapItem.classWeek.split('');
			let sectionList = [];

			// 生成每课程的节次列表
			for (let i = 0; i < tapItem.continuingSession; i++) {
				sectionList.push({
					section: tapItem.classSessions + i
				});
			}

			let data = {
				name: item.courseName,
				position: tapItem.teachingBuildingName + " " + tapItem.classroomName,
				teacher: item.attendClassTeacher,
				weeks: weekList.map((weekItem, index) = > {
					return weekItem === "1" ? index + 1 : false;
				}).filter((weekItem) = > {
					return !!weekItem
				}),
				day: tapItem.classDay + '',
				sections: sectionList
			};

			// 生成课程数据
			courseResult.push(data);
		});
	});

	return {
		courseInfos: courseResult,
		sectionTimes: timeResult
	}
}