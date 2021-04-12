function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
	// 发起课表请求
	let courseXHR = new XMLHttpRequest();
	courseXHR.withCredentials = true;
	courseXHR.open('GET', 'http://stu.j.tjcu.edu.cn/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/curr/callback', false);
	courseXHR.send();

	// 发起时间表请求
	let timeXHR = new XMLHttpRequest();
	timeXHR.withCredentials = true;
	timeXHR.open('GET', 'http://stu.j.tjcu.edu.cn/ajax/getSectionAndTime?ff=f', false);
	timeXHR.send();

	return JSON.stringify([JSON.parse(courseXHR.responseText), JSON.parse(timeXHR.responseText)]);
}